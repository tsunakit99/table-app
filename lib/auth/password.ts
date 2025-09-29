const PBKDF2_ITERATIONS = 210_000;
const KEY_LENGTH = 32; // bytes => 256 bits
const HASH_ALGORITHM = "SHA-256";
const SALT_LENGTH = 16; // bytes
const encoder = new TextEncoder();

type ByteArray = Uint8Array<ArrayBuffer>;

function getCrypto() {
  const { crypto } = globalThis;
  if (crypto?.subtle && typeof crypto.getRandomValues === "function") {
    return crypto;
  }
  throw new Error("Web Crypto API is not available in this environment");
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (const byte of bytes) {
    const value = byte.toString(16).padStart(2, "0");
    hex += value;
  }
  return hex;
}

function hexToUint8Array(hex: string): ByteArray {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }
  const output = new Uint8Array(hex.length / 2);
  for (let i = 0; i < output.length; i += 1) {
    const byte = hex.slice(i * 2, i * 2 + 2);
    output[i] = Number.parseInt(byte, 16);
  }
  return output;
}

async function deriveKey(
  password: string,
  salt: ByteArray
): Promise<ByteArray> {
  const crypto = getCrypto();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  return new Uint8Array<ArrayBuffer>(derivedBits);
}

export async function hashPassword(password: string): Promise<string> {
  const crypto = getCrypto();
  const salt = new Uint8Array(SALT_LENGTH);
  crypto.getRandomValues(salt);
  const derivedKey = await deriveKey(password, salt);
  return `${bufferToHex(salt.buffer)}:${bufferToHex(derivedKey.buffer)}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string | null | undefined
): Promise<boolean> {
  if (!storedHash) {
    return false;
  }

  const [saltHex, hashHex] = storedHash.split(":");
  if (!(saltHex && hashHex)) {
    return false;
  }

  const salt = hexToUint8Array(saltHex);
  const expected = hexToUint8Array(hashHex);
  const derived = await deriveKey(password, salt);

  if (expected.length !== derived.length) {
    return false;
  }

  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= expected[i] ^ derived[i];
  }

  return diff === 0;
}
