// Detection

export default {
  detect_encoding: {
    id: "detect_encoding",
    name: "Detect Encoding",
    category: "Detection",
    description:
      "Attempts to detect common encodings like Base64, Hex, or plain text.",

    inputType: "string",
    outputType: "string",

    run(input) {
      const trimmed = input.trim();

      // Base64 check
      const base64Regex = /^(?:[A-Za-z0-9+/]+={0,2})$/;
      if (base64Regex.test(trimmed) && trimmed.length % 4 === 0) {
        return "Possible Base64";
      }

      // Hex check
      const hexRegex = /^[0-9a-fA-F]+$/;
      if (hexRegex.test(trimmed) && trimmed.length % 2 === 0) {
        return "Possible Hex";
      }

      // Binary check
      const binRegex = /^[01\s]+$/;
      if (binRegex.test(trimmed)) {
        return "Possible Binary";
      }

      return "Likely Plain Text / Unknown";
    }
  },
  detect_file_type: {
    id: "detect_file_type",
    name: "Detect File Type",
    category: "Detection",
    description: "Detects file type using magic bytes.",

    inputType: "byteArray",
    outputType: "string",

    strict: true,

    run(input) {
      const hex = Array.from(input.slice(0, 8))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

      if (hex.startsWith("89504E47")) return "PNG Image";
      if (hex.startsWith("FFD8FF")) return "JPEG Image";
      if (hex.startsWith("25504446")) return "PDF Document";
      if (hex.startsWith("504B0304")) return "ZIP Archive";
      if (hex.startsWith("47494638")) return "GIF Image";

      return "Unknown File Type";
    }
  },
  detect_repetition: {
    id: "detect_repetition",
    name: "Detect Repetition",
    category: "Detection",

    inputType: "string",
    outputType: "object",

    run(input) {
      const map = {};
      const words = input.split(/\s+/);

      for (const w of words) {
        map[w] = (map[w] || 0) + 1;
      }

      return map;
    }
  },
  smart_guess: {
    id: "smart_guess",
    name: "Smart Guess",
    category: "Detection",

    inputType: "string",
    outputType: "array",

    run(input) {
      const guesses = [];

      if (/^[A-Za-z0-9+/=]+$/.test(input)) {
        guesses.push("Base64");
      }

      if (/^[0-9a-fA-F]+$/.test(input)) {
        guesses.push("Hex");
      }

      if (/^[01\s]+$/.test(input)) {
        guesses.push("Binary");
      }

      if (/^[a-f0-9]{32,}$/i.test(input)) {
        guesses.push("Possible Hash");
      }

      return guesses;
    }
  },
  byte_frequency: {
    id: "byte_frequency",
    name: "Byte Frequency",
    category: "Detection",

    inputType: "byteArray",
    outputType: "array",

    run(input) {
      const freq = new Array(256).fill(0);

      for (const b of input) {
        freq[b]++;
      }

      return freq;
    }
  }
};
