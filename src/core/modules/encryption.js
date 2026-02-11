export default {
  aes_encrypt: {
    id: "aes_encrypt",
    name: "AES Encrypt (GCM)",
    category: "Encryption",
    description:
      "Encrypts data using AES-GCM. Output = salt + iv + ciphertext.",
    inputType: "byteArray",
    outputType: "byteArray",

    strictType: true, // strict input type

    options: {
      password: { type: "text", label: "Password", required: true }
    },

    async run(input, { password }) {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

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
        ["encrypt"]
      );

      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        input
      );

      return new Uint8Array([...salt, ...iv, ...new Uint8Array(encrypted)]);
    }
  },
  caesar_encrypt: {
    id: "caesar_encrypt",
    name: "Caesar Cipher",
    category: "Encryption",
    description: "Shifts ASCII letters by N positions.",
    inputType: "byteArray",
    outputType: "byteArray",

    options: {
      shift: { type: "number", label: "Shift", required: true }
    },

    async run(input, { shift }) {
      const output = new Uint8Array(input.length);

      for (let i = 0; i < input.length; i++) {
        let c = input[i];

        // A-Z
        if (c >= 65 && c <= 90) {
          c = ((c - 65 + shift) % 26) + 65;
        }
        // a-z
        else if (c >= 97 && c <= 122) {
          c = ((c - 97 + shift) % 26) + 97;
        }

        output[i] = c;
      }

      return output;
    }
  },
  rot13_encrypt: {
    id: "rot13_encrypt",
    name: "ROT13 Encrypt",
    category: "Encryption",
    inputType: "byteArray",
    outputType: "byteArray",

    async run(input) {
      const output = new Uint8Array(input.length);

      for (let i = 0; i < input.length; i++) {
        let c = input[i];

        if (c >= 65 && c <= 90) c = ((c - 65 + 13) % 26) + 65;
        else if (c >= 97 && c <= 122) c = ((c - 97 + 13) % 26) + 97;

        output[i] = c;
      }

      return output;
    }
  },
  xor_encrypt: {
    id: "xor_encrypt",
    name: "XOR Cipher",
    category: "Encryption",
    inputType: "byteArray",
    outputType: "byteArray",

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
