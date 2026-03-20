// Decryption

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
  },
  vigenere_decrypt: {
    id: "vigenere_decrypt",
    name: "Vigenère Decrypt",
    category: "Decryption",
    description: "Decrypts Vigenère cipher using a keyword.",
    inputType: "byteArray",
    outputType: "byteArray",

    options: {
      key: { type: "text", label: "Key", required: true }
    },

    async run(input, { key }) {
      const output = new Uint8Array(input.length);
      const keyBytes = new TextEncoder().encode(key);

      let j = 0;

      for (let i = 0; i < input.length; i++) {
        let c = input[i];
        const k = keyBytes[j % keyBytes.length];

        let shift;

        // Normalize key char to 0–25
        if (k >= 65 && k <= 90) shift = k - 65;
        else if (k >= 97 && k <= 122) shift = k - 97;
        else shift = 0;

        if (c >= 65 && c <= 90) {
          c = ((c - 65 - shift + 26) % 26) + 65;
          j++;
        } else if (c >= 97 && c <= 122) {
          c = ((c - 97 - shift + 26) % 26) + 97;
          j++;
        }

        output[i] = c;
      }

      return output;
    }
  },
  aes_ctr_decrypt: {
    id: "aes_ctr_decrypt",
    name: "AES Decrypt (CTR)",
    category: "Decryption",
    description: "Decrypts AES-CTR. Input = salt + counter + ciphertext.",
    inputType: "byteArray",
    outputType: "byteArray",

    strictType: true,

    options: {
      password: { type: "text", label: "Password", required: true }
    },

    async run(input, { password }) {
      const salt = input.slice(0, 16);
      const counter = input.slice(16, 32);
      const data = input.slice(32);

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
        { name: "AES-CTR", length: 256 },
        false,
        ["decrypt"]
      );

      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-CTR",
          counter,
          length: 64
        },
        key,
        data
      );

      return new Uint8Array(decrypted);
    }
  }
};
