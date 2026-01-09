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
  }
};
