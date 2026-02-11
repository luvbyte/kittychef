// Hashing

export default {
  sha256: {
    id: "sha256",
    name: "SHA-256",
    category: "Hashing",

    description: "Generates a SHA-256 cryptographic hash of the input data.",

    inputType: "byteArray",
    outputType: "string",

    options: {
      uppercase: {
        type: "checkbox",
        label: "Uppercase Output",
        default: false
      }
    },

    async run(input, options) {
      const hashBuffer = await crypto.subtle.digest("SHA-256", input);

      let hex = [...new Uint8Array(hashBuffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      return options?.uppercase ? hex.toUpperCase() : hex;
    }
  },

  sha1: {
    id: "sha1",
    name: "SHA-1",
    category: "Hashing",

    description:
      "Generates a SHA-1 hash. Not recommended for security-sensitive use.",

    inputType: "byteArray",
    outputType: "string",

    options: {
      uppercase: {
        type: "checkbox",
        label: "Uppercase Output",
        default: false
      }
    },

    async run(input, options) {
      const hashBuffer = await crypto.subtle.digest("SHA-1", input);

      let hex = [...new Uint8Array(hashBuffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      return options.uppercase ? hex.toUpperCase() : hex;
    }
  },

  sha512: {
    id: "sha512",
    name: "SHA-512",
    category: "Hashing",

    description: "Generates a SHA-512 cryptographic hash of the input data.",

    inputType: "byteArray",
    outputType: "string",

    options: {
      uppercase: {
        type: "checkbox",
        label: "Uppercase Output",
        default: false
      }
    },

    async run(input, options) {
      const hashBuffer = await crypto.subtle.digest("SHA-512", input);

      let hex = [...new Uint8Array(hashBuffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      return options.uppercase ? hex.toUpperCase() : hex;
    }
  },

  md5: {
    id: "md5",
    name: "MD5",
    category: "Hashing",

    description: "Generates an MD5 hash.",

    inputType: "byteArray",
    outputType: "string",

    options: {
      uppercase: {
        type: "checkbox",
        label: "Uppercase Output",
        default: false
      }
    },

    async run(input, options) {
      function leftRotate(x, c) {
        return (x << c) | (x >>> (32 - c));
      }

      const bytes = input;
      const originalLength = bytes.length * 8;

      // Padding
      const withPadding = new Uint8Array((((bytes.length + 8) >> 6) + 1) * 64);
      withPadding.set(bytes);
      withPadding[bytes.length] = 0x80;

      const view = new DataView(withPadding.buffer);
      view.setUint32(withPadding.length - 8, originalLength, true);
      view.setUint32(
        withPadding.length - 4,
        Math.floor(originalLength / 2 ** 32),
        true
      );

      let a0 = 0x67452301;
      let b0 = 0xefcdab89;
      let c0 = 0x98badcfe;
      let d0 = 0x10325476;

      const K = new Uint32Array(64);
      for (let i = 0; i < 64; i++) {
        K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32);
      }

      const s = [
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14,
        20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16,
        23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10,
        15, 21, 6, 10, 15, 21
      ];

      for (let i = 0; i < withPadding.length; i += 64) {
        const M = new Uint32Array(withPadding.buffer.slice(i, i + 64));

        let A = a0,
          B = b0,
          C = c0,
          D = d0;

        for (let j = 0; j < 64; j++) {
          let F, g;

          if (j < 16) {
            F = (B & C) | (~B & D);
            g = j;
          } else if (j < 32) {
            F = (D & B) | (~D & C);
            g = (5 * j + 1) % 16;
          } else if (j < 48) {
            F = B ^ C ^ D;
            g = (3 * j + 5) % 16;
          } else {
            F = C ^ (B | ~D);
            g = (7 * j) % 16;
          }

          const temp = D;
          D = C;
          C = B;
          B = (B + leftRotate(A + F + K[j] + M[g], s[j])) >>> 0;
          A = temp;
        }

        a0 = (a0 + A) >>> 0;
        b0 = (b0 + B) >>> 0;
        c0 = (c0 + C) >>> 0;
        d0 = (d0 + D) >>> 0;
      }

      const out = new DataView(new ArrayBuffer(16));
      out.setUint32(0, a0, true);
      out.setUint32(4, b0, true);
      out.setUint32(8, c0, true);
      out.setUint32(12, d0, true);

      let hex = [...new Uint8Array(out.buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      return options?.uppercase ? hex.toUpperCase() : hex;
    }
  }
};
