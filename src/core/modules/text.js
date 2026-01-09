// Text

export default {
  reverse: {
    id: "reverse",
    name: "Reverse Text",
    category: "Text",

    description: "Reverses the entire text character by character.",

    inputType: "string",
    outputType: "string",

    run(input) {
      return input.split("").reverse().join("");
    }
  },

  uppercase: {
    id: "uppercase",
    name: "Uppercase",
    category: "Text",

    description:
      "Converts text to uppercase. You can apply it to the whole text, each word, each sentence, or each paragraph.",

    inputType: "string",
    outputType: "string",

    options: {
      scope: {
        type: "select",
        default: "All",
        choices: ["All", "Word", "Sentence", "Paragraph"]
      }
    },

    run(input, options) {
      const scope = options.scope ?? "All";

      switch (scope) {
        case "Word":
          return input
            .split(/\b/)
            .map(token => (/^\w+$/.test(token) ? token.toUpperCase() : token))
            .join("");

        case "Sentence":
          return input.replace(/(^\s*[a-z])|([.!?]\s*[a-z])/g, match =>
            match.toUpperCase()
          );

        case "Paragraph":
          return input.replace(/(^\s*[a-z])|(\n\s*[a-z])/g, match =>
            match.toUpperCase()
          );

        case "All":
        default:
          return input.toUpperCase();
      }
    }
  },

  lowercase: {
    id: "lowercase",
    name: "Lowercase",
    category: "Text",

    description: "Converts all characters in the text to lowercase.",

    inputType: "string",
    outputType: "string",

    run(input) {
      return input.toLowerCase();
    }
  },

  trimWhitespace: {
    id: "trimWhitespace",
    name: "Trim Whitespace",
    category: "Text",

    description:
      "Removes extra whitespace from the beginning, end, or both sides of the text.",

    inputType: "string",
    outputType: "string",

    options: {
      mode: {
        type: "select",
        default: "Both",
        choices: ["Left", "Right", "Both"]
      }
    },

    run(input, options) {
      switch (options.mode) {
        case "Left":
          return input.trimStart();
        case "Right":
          return input.trimEnd();
        case "Both":
        default:
          return input.trim();
      }
    }
  },

  replaceText: {
    id: "replaceText",
    name: "Replace Text",
    category: "Text",

    description:
      "Finds a specific piece of text and replaces it with another value throughout the input.",

    inputType: "string",
    outputType: "string",

    options: {
      find: {
        type: "text",
        placeholder: "Text to find",
        default: ""
      },
      replace: {
        type: "text",
        placeholder: "Text to replace",
        default: ""
      }
    },

    run(input, options) {
      if (!options.find) return input;

      return input.split(options.find).join(options.replace);
    }
  },

  regex_extract: {
    id: "regex_extract",
    name: "Regex Extract",
    category: "Text",
    inputType: "string",
    outputType: "array",

    options: {
      pattern: { type: "text", label: "Regex Pattern", required: true },
      flags: { type: "text", label: "Flags", default: "g" }
    },

    async run(input, { pattern, flags }) {
      const regex = new RegExp(pattern, flags);
      return [...input.matchAll(regex)].map(m => m[0]);
    }
  },

  remove_duplicate_lines: {
    id: "remove_duplicate_lines",
    name: "Remove Duplicate Lines",
    category: "Text",
    inputType: "string",
    outputType: "string",

    async run(input) {
      return [...new Set(input.split("\n"))].join("\n");
    }
  }
};
