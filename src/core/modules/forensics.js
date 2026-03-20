// Forensics

export default {
  entropy: {
    id: "entropy",
    name: "Entropy Analysis",
    category: "Forensics",
    inputType: "byteArray",
    outputType: "number",

    async run(input) {
      const freq = {};
      input.forEach(b => (freq[b] = (freq[b] || 0) + 1));

      return Object.values(freq).reduce((h, f) => {
        const p = f / input.length;
        return h - p * Math.log2(p);
      }, 0);
    }
  },
  hexDump: {
    id: "hexDump",
  name: "Hex Dump",
  category: "Forensics",
  description: "Displays byte array in hex + ASCII format.",

  inputType: "byteArray",
  outputType: "string",

  options: {
    bytesPerLine: {
      type: "number",
      label: "Bytes per line",
      default: 16,
      min: 4,
      max: 32
    }
  },

  async run(input, { bytesPerLine }) {
    if (!(input instanceof Uint8Array)) {
      throw new Error("Input must be a byte array");
    }

    const width = bytesPerLine || 16;
    let output = "";

    for (let i = 0; i < input.length; i += width) {
      const slice = input.slice(i, i + width);

      // Offset
      const offset = i.toString(16).padStart(8, "0");

      // Hex section
      const hex = Array.from(slice)
        .map(b => b.toString(16).padStart(2, "0"))
        .join(" ")
        .padEnd(width * 3);

      // ASCII section
      const ascii = Array.from(slice)
        .map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "."))
        .join("");

      output += `${offset}  ${hex}  ${ascii}\n`;
    }

    return output.trim();
  }
  }
};
