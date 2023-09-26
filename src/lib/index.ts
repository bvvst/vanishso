export function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes));
}

// note that encrypt/decrypt includes the iv lol
export async function encrypt(key: CryptoKey, text: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedString = await encryptWithIV(key, text, iv);
  const ivString = arrayBufferToBase64(iv.buffer as ArrayBuffer);

  return ivString + encryptedString;
}

export async function decrypt(key: CryptoKey, text: string) {
  const ivString = text.slice(0, 16);
  const encryptedString = text.slice(16);
  const iv = base64ToArrayBuffer(ivString);
  const decryptedString = await decryptWithIV(key, encryptedString, iv);
  return decryptedString;
}

export async function encryptWithIV(
  key: CryptoKey,
  text: string,
  iv: Uint8Array
) {
  // Convert the string to an ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Encrypt the data
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );

  // Convert encrypted data to Base64 so it's easier to work with
  return arrayBufferToBase64(encrypted);
}
export async function decryptWithIV(
  key: CryptoKey,
  encryptedText: string,
  iv: Uint8Array
): Promise<string> {
  // Convert the Base64 encrypted string to ArrayBuffer
  const encryptedData = base64ToArrayBuffer(encryptedText);

  // Decrypt the data
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedData
  );

  // Convert the decrypted ArrayBuffer back to string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export async function generateAESKey() {
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256, // AES-256
    },
    true, // Whether the key is extractable
    ["encrypt", "decrypt"]
  );
  return key;
}

export async function keyToString(key: CryptoKey) {
  const raw = await crypto.subtle.exportKey("jwk", key);
  return raw.k;
}

export async function stringToKey(k: string) {
  const jwk = {
    kty: "oct",
    alg: "A256GCM",
    ext: true,
    k: k,
    key_ops: ["encrypt", "decrypt"],
  };

  return await crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function deriveKey(
  password: string,
  salt: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = base64ToArrayBuffer(salt);

  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  // Derive the key directly for AES-256
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    importedKey,
    { name: "AES-GCM", length: 256 },
    true, // extractable
    ["encrypt", "decrypt"]
  );

  return derivedKey;
}

export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashKey(key: CryptoKey): Promise<string> {
  // Export the key to raw format and then hash it
  const rawKey = await crypto.subtle.exportKey("raw", key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", rawKey);
  return bufferToHex(hashBuffer);
}

export async function generateSalt(): Promise<string> {
  // Generate 16 bytes (128 bits) of random data
  const saltBuffer = new Uint8Array(16);
  crypto.getRandomValues(saltBuffer);

  // Convert the Uint8Array to a string
  let binaryString = "";
  for (let i = 0; i < saltBuffer.length; i++) {
    binaryString += String.fromCharCode(saltBuffer[i]);
  }

  // Convert the string to base64 for easier storage
  const base64Salt = btoa(binaryString);

  return base64Salt;
}

export async function hash(data: string, salt: string) {
  // Step 1: Concatenate string and salt
  const inputData = data + salt;

  // Step 2: Convert string to ArrayBuffer
  const encoder = new TextEncoder();
  const buffer = encoder.encode(inputData);

  // Step 3: Hash the ArrayBuffer
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

  return bufferToHex(hashBuffer);
}
