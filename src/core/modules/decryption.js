export default {
  aes_decrypt: {
    id: "aes_decrypt",
    name: "AES Decrypt (GCM)",
    category: "Decryption",
    description:
      "Decrypts AES-GCM encrypted data. Input = salt + iv + ciphertext.",
    inputType: "byteArray",
    outputType: "byteArray",

    strictType: true, // strict input type

    options: {
      password: { type: "text", label: "Password", required: true }
    },

    async run(input, { password }) {
      // Layout:
      // [0..15]   = salt (16 bytes)
      // [16..27]  = iv   (12 bytes)
      // [28..end] = ciphertext

      const salt = input.slice(0, 16);
      const iv = input.slice(16, 28);
      const data = input.slice(28);

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
          salt,
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
  },
  caesar_decrypt: {
    id: "caesar_decrypt",
    name: "Caesar Decrypt",
    category: "Decryption",
    description: "Reverses Caesar shift on ASCII letters.",
    inputType: "byteArray",
    outputType: "byteArray",

    strictType: true, // strict input type

    options: {
      shift: { type: "number", label: "Shift", required: true }
    },

    async run(input, { shift }) {
      const output = new Uint8Array(input.length);

      for (let i = 0; i < input.length; i++) {
        let c = input[i];

        // A-Z
        if (c >= 65 && c <= 90) {
          c = ((c - 65 - shift + 26 * 1000) % 26) + 65;
        }
        // a-z
        else if (c >= 97 && c <= 122) {
          c = ((c - 97 - shift + 26 * 1000) % 26) + 97;
        }

        output[i] = c;
      }

      return output;
    }
  },
  rot13_decrypt: {
    id: "rot13_decrypt",
    name: "ROT13 Decrypt",
    category: "Decryption",
    inputType: "byteArray",
    outputType: "byteArray",

    strictType: true,

    async run(input) {
      const output = new Uint8Array(input.length);

      for (let i = 0; i < input.length; i++) {
        let c = input[i];

        // A–Z
        if (c >= 65 && c <= 90) {
          c = ((c - 65 + 13) % 26) + 65;
        }
        // a–z
        else if (c >= 97 && c <= 122) {
          c = ((c - 97 + 13) % 26) + 97;
        }

        output[i] = c;
      }

      return output;
    }
  },
  xor_decrypt: {
    id: "xor_decrypt",
    name: "XOR Decrypt",
    category: "Decryption",
    inputType: "byteArray",
    outputType: "byteArray",

    strictType: true,

    options: {
      key: { type: "number", label: "Key (0–255)", required: true }
    },

    async run(input, { key }) {
      const output = new Uint8Array(input.length);

      for (let i = 0; i < input.length; i++) {
        output[i] = input[i] ^ key;
      }

      return output;
    }
  }
};
