
export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 310000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return {
    passwordSalt: Array.from(salt, (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join(""),
    passwordHash: Array.from(new Uint8Array(hash), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join(""),
  };
}


export async function verifyPassword(
  password: string,
  savedSalt: string,
  savedHash: string
) {
  const salt = new Uint8Array(
    savedSalt.match(/.{2}/g)!.map((byte) => parseInt(byte, 16))
  );

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 310000,
      hash: "SHA-256",
    },
    key,
    256
  );

  const enteredHash = Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  return enteredHash === savedHash;
}
