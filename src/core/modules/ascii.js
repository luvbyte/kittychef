// ASCII

export default {
  textToAscii: {
    id: "textToAscii",
    name: "Text → ASCII Codes",
    category: "ASCII",

    description: "Converts each character in the text to its ASCII code.",

    inputType: "string",
    outputType: "string",

    options: {
      separator: {
        type: "text",
        default: " ",
        placeholder: "Separator (e.g. space, comma)"
      }
    },

    run(input, options) {
      const sep = options.separator ?? " ";
      return input
        .split("")
        .map(char => char.charCodeAt(0))
        .join(sep);
    }
  },
  asciiToText: {
    id: "asciiToText",
    name: "ASCII Codes → Text",
    category: "ASCII",

    description: "Converts ASCII codes back into readable text.",

    inputType: "string",
    outputType: "string",

    options: {
      separator: {
        type: "text",
        default: " ",
        placeholder: "Separator used between ASCII codes"
      }
    },

    run(input, options) {
      const sep = options.separator ?? " ";
      return input
        .split(sep)
        .map(code => String.fromCharCode(Number(code)))
        .join("");
    }
  },
  charInfo: {
    id: "charInfo",
    name: "Character Info",
    category: "ASCII",

    description:
      "Returns detailed ASCII info (char, code, hex, binary) for each character.",

    inputType: "string",
    outputType: "array",

    run(input) {
      return input.split("").map(char => {
        const code = char.charCodeAt(0);
        return {
          char,
          decimal: code,
          hex: "0x" + code.toString(16).toUpperCase(),
          binary: code.toString(2).padStart(8, "0")
        };
      });
    }
  },
  removeNonASCII: {
    id: "removeNonASCII",
    name: "Remove Non-ASCII",
    category: "ASCII",

    description: "Removes all non-ASCII characters from the text.",

    inputType: "string",
    outputType: "string",

    run(input) {
      return input.replace(/[^\x00-\x7F]/g, "");
    }
  },
  keepPrintableASCII: {
    id: "keepPrintableASCII",
    name: "Keep Printable ASCII",
    category: "ASCII",

    description:
      "Keeps only printable ASCII characters (32–126) and removes control characters.",

    inputType: "string",
    outputType: "string",

    run(input) {
      return input.replace(/[^\x20-\x7E]/g, "");
    }
  }
};
