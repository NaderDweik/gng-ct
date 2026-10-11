/*
 * The visitor's IP, for the register form's rate limit and Turnstile check.
 *
 * The host (Vercel) sets x-forwarded-for itself, so its last entry is the address that
 * actually connected. Behind Cloudflare's proxy that address is a Cloudflare edge server
 * and the visitor is in cf-connecting-ip. That header is only trusted when the connection
 * really came from Cloudflare: anyone calling the origin directly could otherwise send a
 * new fake value on every request and never hit the limit.
 *
 * Ranges: https://www.cloudflare.com/ips/ (checked 2026-10-12; they change rarely).
 */

const CLOUDFLARE_V4 = [
  "173.245.48.0/20",
  "103.21.244.0/22",
  "103.22.200.0/22",
  "103.31.4.0/22",
  "141.101.64.0/18",
  "108.162.192.0/18",
  "190.93.240.0/20",
  "188.114.96.0/20",
  "197.234.240.0/22",
  "198.41.128.0/17",
  "162.158.0.0/15",
  "104.16.0.0/13",
  "104.24.0.0/14",
  "172.64.0.0/13",
  "131.0.72.0/22",
];

const CLOUDFLARE_V6 = [
  "2400:cb00::/32",
  "2606:4700::/32",
  "2803:f800::/32",
  "2405:b500::/32",
  "2405:8100::/32",
  "2a06:98c0::/29",
  "2c0f:f248::/32",
];

function parseV4(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p) || Number(p) > 255) return null;
    n = n * 256 + Number(p);
  }
  return n;
}

function parseV6(ip: string): bigint | null {
  const halves = ip.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const gap = 8 - head.length - tail.length;
  if (halves.length === 2 ? gap < 1 : gap !== 0) return null;
  const groups = [...head, ...Array<string>(halves.length === 2 ? gap : 0).fill("0"), ...tail];
  let n = BigInt(0);
  for (const g of groups) {
    if (!/^[0-9a-f]{1,4}$/i.test(g)) return null;
    n = (n << BigInt(16)) + BigInt(parseInt(g, 16));
  }
  return n;
}

const v4Ranges = CLOUDFLARE_V4.map((cidr) => {
  const [base, bits] = cidr.split("/");
  const shift = 32 - Number(bits);
  return { prefix: Math.floor(parseV4(base!)! / 2 ** shift), shift };
});

const v6Ranges = CLOUDFLARE_V6.map((cidr) => {
  const [base, bits] = cidr.split("/");
  const shift = BigInt(128 - Number(bits));
  return { prefix: parseV6(base!)! >> shift, shift };
});

export function isCloudflareIp(ip: string) {
  // IPv4 written as IPv6 (::ffff:1.2.3.4) is still IPv4.
  const plain = ip.replace(/^::ffff:(?=\d+\.\d+\.\d+\.\d+$)/i, "");
  const v4 = parseV4(plain);
  if (v4 !== null) return v4Ranges.some((r) => Math.floor(v4 / 2 ** r.shift) === r.prefix);
  const v6 = parseV6(plain);
  if (v6 !== null) return v6Ranges.some((r) => v6 >> r.shift === r.prefix);
  return false;
}

export function clientIp(headers: Headers) {
  const peer =
    headers.get("x-forwarded-for")?.split(",").pop()?.trim() || headers.get("x-real-ip")?.trim() || "";
  const visitor = headers.get("cf-connecting-ip")?.trim();
  if (visitor && peer && isCloudflareIp(peer)) return visitor;
  return peer || "unknown";
}
