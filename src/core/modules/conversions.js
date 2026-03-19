export default {
  textToBinary: {
    id: "textToBinary",
    name: "Text → Binary",
    category: "Conversion",

    description: "Converts text into binary (ASCII-based).",

    inputType: "string",
    outputType: "string",

    options: {
      separator: {
        type: "text",
        default: " "
      }
    },

    run(input, options) {
      const sep = options.separator ?? " ";
      return input
        .split("")
        .map(char => char.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(sep);
    }
  },
  binaryToText: {
    id: "binaryToText",
    name: "Binary → Text",
    category: "Conversion",

    description: "Converts binary values back into text.",

    inputType: "string",
    outputType: "string",

    options: {
      separator: {
        type: "text",
        default: " "
      }
    },

    run(input, options) {
      const sep = options.separator ?? " ";
      return input
        .split(sep)
        .map(bin => String.fromCharCode(parseInt(bin, 2)))
        .join("");
    }
  },
  hex_to_rgb: {
    id: "hex_to_rgb",
    name: "HEX → RGB",
    category: "Conversion",
    description:
      "Converts HEX color text (#RRGGBB or RRGGBB) to RGB string 'R,G,B'.",
    inputType: "string",
    outputType: "string",

    async run(input) {
      let hex = String(input).trim();

      // Remove leading #
      if (hex.startsWith("#")) {
        hex = hex.slice(1);
      }

      if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
        throw new Error("Invalid HEX format. Expected RRGGBB.");
      }

      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      return `${r},${g},${b}`;
    }
  },
  rgb_to_hex: {
    id: "rgb_to_hex",
    name: "RGB → HEX",
    category: "Conversion",
    description: "Converts RGB string 'R,G,B' to HEX color text #RRGGBB.",
    inputType: "string",
    outputType: "string",

    async run(input) {
      const value = String(input).trim();

      const parts = value.split(",").map(v => v.trim());

      if (parts.length !== 3) {
        throw new Error("Input must be a string in format 'R,G,B'.");
      }

      const nums = parts.map(n => {
        const num = Number(n);
        if (!Number.isInteger(num) || num < 0 || num > 255) {
          throw new Error("RGB values must be integers between 0 and 255.");
        }
        return num;
      });

      const toHex = n => n.toString(16).padStart(2, "0").toUpperCase();

      const r = toHex(nums[0]);
      const g = toHex(nums[1]);
      const b = toHex(nums[2]);

      return `#${r}${g}${b}`;
    }
  },
  csv_to_json: {
    id: "csv_to_json",
    name: "CSV → JSON",
    category: "Conversion",
    description: "Converts CSV text into JSON array string.",
    inputType: "string",
    outputType: "string",

    async run(input) {
      const csv = String(input).trim();

      if (!csv) {
        throw new Error("CSV input cannot be empty.");
      }

      const lines = csv.split(/\r?\n/);
      if (lines.length < 2) {
        throw new Error("CSV must include headers and at least one data row.");
      }

      // Simple CSV line parser (handles quoted fields)
      const parseLine = line => {
        const result = [];
        let current = "";
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '"') {
            if (insideQuotes && line[i + 1] === '"') {
              current += '"'; // escaped quote
              i++;
            } else {
              insideQuotes = !insideQuotes;
            }
          } else if (char === "," && !insideQuotes) {
            result.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }

        result.push(current.trim());
        return result;
      };

      const headers = parseLine(lines[0]);

      const json = lines.slice(1).map(line => {
        const values = parseLine(line);
        const obj = {};

        headers.forEach((header, index) => {
          obj[header] = values[index] ?? "";
        });

        return obj;
      });

      return JSON.stringify(json, null, 2);
    }
  },
  binary_to_hex: {
    id: "binary_to_hex",
    name: "Binary → HEX",
    category: "Conversion",
    description: "Converts binary string to hexadecimal string.",
    inputType: "string",
    outputType: "string",

    async run(input) {
      let bin = String(input).trim();

      if (!/^[01]+$/.test(bin)) {
        throw new Error("Invalid binary format.");
      }

      // Pad to multiple of 4
      while (bin.length % 4 !== 0) {
        bin = "0" + bin;
      }

      let hex = "";
      for (let i = 0; i < bin.length; i += 4) {
        const chunk = bin.slice(i, i + 4);
        hex += parseInt(chunk, 2).toString(16);
      }

      return hex.toUpperCase();
    }
  },
  hex_to_binary: {
    id: "hex_to_binary",
    name: "HEX → Binary",
    category: "Conversion",
    description: "Converts hexadecimal string to binary string.",
    inputType: "string",
    outputType: "string",

    async run(input) {
      let hex = String(input).trim();

      if (hex.startsWith("#")) {
        hex = hex.slice(1);
      }

      if (!/^[0-9a-fA-F]+$/.test(hex)) {
        throw new Error("Invalid HEX format.");
      }

      let binary = "";
      for (let char of hex) {
        binary += parseInt(char, 16).toString(2).padStart(4, "0");
      }

      return binary;
    }
  },
  binary_to_decimal: {
    id: "binary_to_decimal",
    name: "Binary → Decimal",
    category: "Conversion",
    description: "Converts binary string to decimal string.",
    inputType: "string",
    outputType: "string",

    async run(input) {
      const bin = String(input).trim();

      if (!/^[01]+$/.test(bin)) {
        throw new Error("Invalid binary format.");
      }

      return parseInt(bin, 2).toString(10);
    }
  },
  decimal_to_binary: {
    id: "decimal_to_binary",
    name: "Decimal → Binary",
    category: "Conversion",
    description: "Converts decimal string to binary string.",
    inputType: "string",
    outputType: "string",

    async run(input) {
      const num = String(input).trim();

      if (!/^\d+$/.test(num)) {
        throw new Error("Invalid decimal format.");
      }

      return parseInt(num, 10).toString(2);
    }
  },
  hex_to_decimal: {
    id: "hex_to_decimal",
    name: "HEX → Decimal",
    category: "Conversion",
    description: "Converts hexadecimal string to decimal string.",
    inputType: "string",
    outputType: "string",

    async run(input) {
      let hex = String(input).trim();

      if (hex.startsWith("#")) {
        hex = hex.slice(1);
      }

      if (!/^[0-9a-fA-F]+$/.test(hex)) {
        throw new Error("Invalid HEX format.");
      }

      return parseInt(hex, 16).toString(10);
    }
  },
  decimal_to_hex: {
  id: "decimal_to_hex",
  name: "Decimal → HEX",
  category: "Conversion",
  description: "Converts decimal string to hexadecimal string.",
  inputType: "string",
  outputType: "string",

  async run(input) {
    const num = String(input).trim();

    if (!/^\d+$/.test(num)) {
      throw new Error("Invalid decimal format.");
    }

    return parseInt(num, 10)
      .toString(16)
      .toUpperCase();
  }
}
};
