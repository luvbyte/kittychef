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
  }
};
