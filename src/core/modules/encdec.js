export default {
  base64_encode: {
    id: "base64_encode",
    name: "Base64 Encode",
    category: "Encoding",
    description: "Encodes input to Base64.",
    inputType: "byteArray",
    outputType: "string",

    async run(input) {
      return btoa(String.fromCharCode(...input));
    }
  },
  base64_decode: {
    id: "base64_decode",
    name: "Base64 Decode",
    category: "Decoding",
    description: "Decodes Base64 to bytes.",
    inputType: "string",
    outputType: "byteArray",

    async run(input) {
      return new Uint8Array(
        atob(input)
          .split("")
          .map(c => c.charCodeAt(0))
      );
    }
  },

  // Hex
  hex_encode: {
    id: "hex_encode",
    name: "Hex Encode",
    category: "Encoding",
    inputType: "byteArray",
    outputType: "string",

    async run(input) {
      return [...input].map(b => b.toString(16).padStart(2, "0")).join("");
    }
  },
  hex_decode: {
    id: "hex_decode",
    name: "Hex Decode",
    category: "Decoding",
    inputType: "string",
    outputType: "byteArray",

    async run(input) {
      return new Uint8Array(input.match(/.{1,2}/g).map(h => parseInt(h, 16)));
    }
  },

  // URL
  url_encode: {
    id: "url_encode",
    name: "URL Encode",
    category: "Encoding",
    inputType: "string",
    outputType: "string",

    async run(input) {
      return encodeURIComponent(input);
    }
  },
  url_decode: {
    id: "url_decode",
    name: "URL Decode",
    category: "Decoding",
    inputType: "string",
    outputType: "string",

    async run(input) {
      return decodeURIComponent(input);
    }
  },

  // JWT
  jwt_decode: {
    id: "jwt_decode",
    name: "JWT Decode",
    category: "Decoding",
    inputType: "string",
    outputType: "object",

    run(token) {
      if (!token) return {};

      try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const payload = parts[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
          .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");

        return JSON.parse(atob(payload));
      } catch (err) {
        throw new Error(`JWT decode failed: ${err.message}`);
      }
    }
  }
};
