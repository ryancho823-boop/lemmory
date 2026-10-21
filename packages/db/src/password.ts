import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEYLEN = 64;

interface Cost {
  N: number;
  r: number;
  p: number;
}

/**
 * OWASP's current scrypt recommendation (N=2^16, r=8, p=2): about 200 ms and 64 MB per hash.
 * That memory matters on a serverless host, which is why this isn't the other listed option
 * (N=2^17, 128 MB). Hashes keep their own settings, so these can be raised later: an account
 * made with weaker ones is upgraded the next time its owner logs in.
 */
const COST: Cost = { N: 65536, r: 8, p: 2 };
/** What hashes made before the settings were stored used. */
const LEGACY_COST: Cost = { N: 16384, r: 8, p: 1 };

function derive(password: string, salt: Buffer, { N, r, p }: Cost) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEYLEN, { N, r, p, maxmem: 256 * 1024 * 1024 }, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

/** "scrypt$<N>,<r>,<p>$<salt>$<key>" (salt and key base64url). Older hashes are "scrypt$<salt>$<key>". */
function parse(stored: string): { cost: Cost; salt: string; key: string } | null {
  const parts = stored.split("$");
  if (parts[0] !== "scrypt") return null;
  if (parts.length === 3 && parts[1] && parts[2]) return { cost: LEGACY_COST, salt: parts[1], key: parts[2] };
  if (parts.length === 4 && parts[2] && parts[3]) {
    const [N, r, p] = parts[1].split(",").map(Number);
    if (N > 0 && r > 0 && p > 0) return { cost: { N, r, p }, salt: parts[2], key: parts[3] };
  }
  return null;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const { N, r, p } = COST;
  return `scrypt$${N},${r},${p}$${salt.toString("base64url")}$${(await derive(password, salt, COST)).toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const h = parse(stored);
  if (!h) return false;
  const want = Buffer.from(h.key, "base64url");
  const got = await derive(password, Buffer.from(h.salt, "base64url"), h.cost);
  return want.length === got.length && timingSafeEqual(want, got);
}

/** Was this hash made with weaker settings than today's? Rehash it after a successful login. */
export function needsRehash(stored: string) {
  const h = parse(stored);
  return !h || h.cost.N < COST.N || h.cost.r < COST.r || h.cost.p < COST.p;
}

export const newId = () => randomBytes(12).toString("base64url");
export const sha256 = (s: string) => createHash("sha256").update(s).digest("base64url");

/** Six characters without look-alikes (no 0/O, 1/I/L), easy to read off a whiteboard. */
export function newJoinCode() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export const PASSWORD_MIN = 8;
