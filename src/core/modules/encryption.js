export default {
  aes_encrypt: {
    id: "aes_encrypt",
    name: "AES Encrypt",
    category: "Encryption",
    description: "Encrypts data using AES-GCM.",
    inputType: "byteArray",
    outputType: "byteArray",

    options: {
      password: { type: "text", label: "Password", required: true }
    },

    async run(input, { password }) {
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
        ["encrypt"]
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        input
      );

      return new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
    }
  }
};
