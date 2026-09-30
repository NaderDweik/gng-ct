"""
Cuts the "Giving Royal" scene (hero slide 1) into its objects with SAM 2
(Segment Anything), for the home "piece by piece" section (SceneExplode).

    python scripts/segment-scene.py            # public/scene/royal/*.webp + geometry + debug sheets
    python scripts/segment-scene.py --debug    # debug sheets only (nothing in public/)

Needs a Python env with `ultralytics` + `torch` (not a project dependency):
    python -m venv .seg && .seg/bin/pip install torch torchvision ultralytics

Per piece (listed FRONT to BACK — a pixel belongs to the first piece that claims it):
  1. SAM runs on a close-up crop around the prompt box, so small objects get
     full model resolution instead of a sliver of the 1024px whole-photo pass.
  2. Mask clean-up: keep the main component(s), fill enclosed holes, optional
     convex hull for boxy objects SAM hollows out (the cabana), smooth jaggies.
  3. Edge refinement: a guided filter snaps the soft edge to real image edges;
     the edge is pulled in ~1px so no background halo survives.
Each piece's bounding box (source px) goes to `src/content/scene-royal.geometry.json`.
"""

import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from ultralytics import SAM

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/gallery/Gemini_Generated_Image_8og1am8og1am8og1.jpg"
OUT = ROOT / "public/scene/royal"
GEOMETRY = ROOT / "src/content/scene-royal.geometry.json"
DEBUG = ROOT / "scripts/.scene-debug.png"  # coloured mask overlay on the photo
SHEET = ROOT / "scripts/.scene-sheet.png"  # every cut-out on magenta, to check edges

# Coordinates were read off a 2000px-wide preview; scale to the source.
K = 2730 / 2000


def box(x1, y1, x2, y2):
    return [round(v * K) for v in (x1, y1, x2, y2)]


def pt(x, y):
    return [round(x * K), round(y * K)]


# id, box, positive points, negative points, options — front to back.
PIECES = [
    ("sofa-left", box(0, 790, 625, 1125),
     [pt(120, 1050), pt(420, 1080), pt(500, 990), pt(60, 900)], [pt(560, 850)],
     # The knitted pillow and the throw come back as their own objects — union them in.
     {"extra": [(box(120, 800, 395, 1035), [pt(255, 915)], []), (box(260, 930, 625, 1060), [pt(450, 1000)], [])],
      "min_share": 0.15}),
    ("sofa-right", box(1470, 820, 2000, 1125),
     [pt(1800, 960), pt(1640, 1050), pt(1940, 930), pt(1680, 900)], [pt(1530, 860)], {}),
    ("lounge", box(1250, 655, 1705, 765),
     [pt(1480, 690), pt(1560, 740), pt(1650, 720), pt(1330, 690)], [pt(1100, 700), pt(1545, 745)], {}),
    ("pool", box(725, 630, 1400, 930),
     [pt(1050, 700), pt(900, 690), pt(1080, 850), pt(830, 740), pt(1260, 760)], [pt(1480, 690), pt(850, 830), pt(760, 690)], {}),
    ("cabana", box(1335, 488, 1585, 615),
     [pt(1460, 500), pt(1360, 560), pt(1470, 580), pt(1560, 560), pt(1480, 540)], [], {"hull": True}),
    ("firepit", box(1745, 595, 1870, 650), [pt(1800, 630), pt(1840, 612)], [], {}),
    ("canopy", box(990, 305, 1690, 648), [pt(1300, 360), pt(1640, 450), pt(1650, 600), pt(1010, 500)], [pt(1450, 450)], {}),
    ("pavilion", box(40, 90, 1285, 700),
     [pt(700, 300), pt(250, 450), pt(600, 400), pt(1150, 500), pt(500, 560)], [pt(700, 150)], {"min_share": 0.15}),
]

COLORS = [
    (255, 80, 80), (80, 200, 255), (255, 200, 60), (80, 255, 140), (200, 120, 255),
    (255, 140, 40), (40, 120, 255), (255, 60, 200),
]


def sam_crop(model, rgb, b, pos, neg):
    """Run SAM on a margin crop around the box, upscaled so its long side is 1024."""
    H, W = rgb.shape[:2]
    bw, bh = b[2] - b[0], b[3] - b[1]
    m = int(max(bw, bh) * 0.08) + 8
    x0, y0 = max(0, b[0] - m), max(0, b[1] - m)
    x1, y1 = min(W, b[2] + m), min(H, b[3] + m)
    crop = rgb[y0:y1, x0:x1]
    k = 1024 / max(crop.shape[:2])
    up = cv2.resize(crop, None, fx=k, fy=k, interpolation=cv2.INTER_CUBIC if k > 1 else cv2.INTER_AREA)
    tr = lambda p: [(p[0] - x0) * k, (p[1] - y0) * k]
    bb = [(b[0] - x0) * k, (b[1] - y0) * k, (b[2] - x0) * k, (b[3] - y0) * k]
    points = [tr(p) for p in pos + neg]
    labels = [1] * len(pos) + [0] * len(neg)
    res = model(up, bboxes=[bb], points=[points], labels=[labels], verbose=False)[0]
    soft = res.masks.data.cpu().numpy().max(0).astype(np.float32)
    soft = cv2.resize(soft, (x1 - x0, y1 - y0), interpolation=cv2.INTER_LINEAR)
    full = np.zeros((H, W), np.float32)
    full[y0:y1, x0:x1] = soft
    return full > 0.5


def keep_main(m, min_share=0.04):
    """Drop islands: keep components with at least `min_share` of the largest's area."""
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m.astype(np.uint8), 8)
    if n <= 2:
        return m
    areas = stats[1:, cv2.CC_STAT_AREA]
    keep = [i + 1 for i, a in enumerate(areas) if a >= areas.max() * min_share]
    return np.isin(lab, keep)


def fill_holes(m):
    u8 = m.astype(np.uint8) * 255
    pad = np.pad(u8, 1)
    flood = pad.copy()
    cv2.floodFill(flood, None, (0, 0), 255)
    return ((pad | ~flood)[1:-1, 1:-1]) > 0


def hull(m):
    cnts, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    out = np.zeros(m.shape, np.uint8)
    cv2.fillPoly(out, [cv2.convexHull(np.vstack(cnts))], 1)
    return out > 0


def smooth(m, r=3):
    """Open then close with a small disc: shaves hairline spurs, seals nicks."""
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    u8 = m.astype(np.uint8)
    u8 = cv2.morphologyEx(u8, cv2.MORPH_OPEN, k)
    u8 = cv2.morphologyEx(u8, cv2.MORPH_CLOSE, k)
    return u8 > 0


def guided(I, p, r=6, eps=1e-3):
    """Grey guided filter (He et al.): edge-aware smoothing of p guided by I."""
    f = lambda x: cv2.boxFilter(x, -1, (2 * r + 1, 2 * r + 1))
    mI, mp = f(I), f(p)
    a = (f(I * p) - mI * mp) / (f(I * I) - mI * mI + eps)
    b = mp - a * mI
    return f(a) * I + f(b)


def refine_alpha(rgb, m):
    """Soft alpha that follows the photo's edges, pulled in ~1px (no halo)."""
    grey = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255
    inner = cv2.erode(m.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(np.float32)
    a = np.clip(guided(grey, inner), 0, 1)
    # Only the band around the edge may change: solid inside, clear outside.
    band = cv2.dilate(m.astype(np.uint8), np.ones((9, 9), np.uint8)) - cv2.erode(m.astype(np.uint8), np.ones((9, 9), np.uint8))
    a = np.where(band > 0, a, inner)
    a = np.clip((a - 0.15) / 0.7, 0, 1)  # firm up the ramp
    return a


def main():
    debug_only = "--debug" in sys.argv
    img = Image.open(SRC).convert("RGB")
    W, H = img.size
    rgb = np.asarray(img)
    model = SAM("sam2.1_l.pt")

    claimed = np.zeros((H, W), bool)
    overlay = rgb.astype(np.float32) * 0.35
    meta, cuts = {}, []

    for n, (pid, b, pos, neg, opt) in enumerate(PIECES):
        m = sam_crop(model, rgb, b, pos, neg)
        for eb, epos, eneg in opt.get("extra", []):
            m |= sam_crop(model, rgb, eb, epos, eneg)
        clip = np.zeros_like(m)
        clip[b[1] : b[3], b[0] : b[2]] = True
        m &= clip & ~claimed
        share = opt.get("min_share", 0.04)
        m = keep_main(m, share)
        m = fill_holes(m)
        if opt.get("hull"):
            m = hull(m)
        m = smooth(m) & ~claimed
        m = keep_main(m, share)
        claimed |= m

        ys, xs = np.nonzero(m)
        if not len(xs):
            print(f"!! {pid}: empty mask")
            continue
        pad = 2
        x0, y0 = max(0, xs.min() - pad), max(0, ys.min() - pad)
        x1, y1 = min(W, xs.max() + 1 + pad), min(H, ys.max() + 1 + pad)
        meta[pid] = {"x": int(x0), "y": int(y0), "w": int(x1 - x0), "h": int(y1 - y0)}
        overlay[m] = rgb[m] * 0.45 + np.array(COLORS[n % len(COLORS)]) * 0.55

        alpha = refine_alpha(rgb[y0:y1, x0:x1], m[y0:y1, x0:x1])
        rgba = np.dstack([rgb[y0:y1, x0:x1], (alpha * 255).round().astype(np.uint8)])
        cut = Image.fromarray(rgba, "RGBA")
        cuts.append(cut)
        if not debug_only:
            OUT.mkdir(parents=True, exist_ok=True)
            cut.save(OUT / f"{pid}.webp", "WEBP", quality=90, alpha_quality=100, method=6)

    Image.fromarray(overlay.clip(0, 255).astype(np.uint8)).save(DEBUG)
    # Contact sheet on magenta — any leftover background or halo shows at once.
    cw, ch = 700, 420
    sheet = Image.new("RGB", (cw * 2, ch * ((len(cuts) + 1) // 2)), (255, 0, 255))
    for i, c in enumerate(cuts):
        t = c.copy()
        t.thumbnail((cw - 20, ch - 20), Image.LANCZOS)
        sheet.paste(t, ((i % 2) * cw + 10, (i // 2) * ch + 10), t)
    sheet.save(SHEET)
    if not debug_only:
        GEOMETRY.write_text(json.dumps({"width": W, "height": H, "pieces": meta}, indent=2) + "\n")
    print(json.dumps(meta, indent=2))


if __name__ == "__main__":
    main()
