import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { palette } from "../../src/theme/tokens";

/*
 * Register CTA background: slow Ken Burns crossfades through four resort photos with a
 * soft brand-green light sweep. Everything is a function of (frame mod length), so the
 * video loops seamlessly.
 */
const PHOTOS = ["foosball-kids-pool.png", "master-bedroom-pool-view.png", "quad-bike-royal-clubhouse.png", "twin-bedroom-pool-view.png"];
const SHOT = 120; // frames each photo leads (4s @ 30fps)
const FADE = 36; // crossfade length
export const CTA_FRAMES = SHOT * PHOTOS.length;
const LIFE = SHOT + FADE; // frames a photo is on screen

export const CtaLoop = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: palette.secondary }}>
      {PHOTOS.map((src, i) => {
        // Frames since this photo started fading in, wrapped around the loop.
        const local = (((frame - i * SHOT + FADE) % CTA_FRAMES) + CTA_FRAMES) % CTA_FRAMES;
        if (local > LIFE) return null;
        const opacity = interpolate(local, [0, FADE], [0, 1], { extrapolateRight: "clamp" });
        const scale = interpolate(local, [0, LIFE], [1.05, 1.13]);
        const pan = (i % 2 === 0 ? 1 : -1) * interpolate(local, [0, LIFE], [-1.5, 1.5]);
        return (
          // Newest photo (smallest `local`) sits on top.
          <AbsoluteFill key={src} style={{ opacity, zIndex: LIFE - local }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translateX(${pan}%)` }} />
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill
        style={{
          zIndex: 1000,
          background: `linear-gradient(105deg, transparent 38%, ${palette.primary}66 50%, transparent 62%)`,
          transform: `translateX(${interpolate(((frame / CTA_FRAMES) * 2) % 1, [0, 1], [-100, 100])}%)`,
          mixBlendMode: "soft-light",
        }}
      />
    </AbsoluteFill>
  );
};
