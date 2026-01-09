export default {
  aes_decrypt: {
    id: "aes_decrypt",
    name: "AES Decrypt",
    category: "Decryption",
    description: "Decrypt AES-GCM encrypted data.",
    inputType: "byteArray",
    outputType: "byteArray",

    options: {
      password: { type: "text", label: "Password", required: true }
    },

    async run(input, { password }) {
      const iv = input.slice(0, 12);
      const data = input.slice(12);

      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: new Uint8Array(16),
          iterations: 100000,
          hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data
      );

      return new Uint8Array(decrypted);
    }
  }
};
