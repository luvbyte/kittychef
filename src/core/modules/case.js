function splitWords(input) {
  return input
    // handle camelCase → camel Case
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    // handle kebab-case & snake_case
    .replace(/[-_]/g, " ")
    // remove extra junk
    .replace(/[^\w\s]/g, "")
    .toLowerCase()
    .trim()
    .split(/\s+/);
}

export default {
  camelCase: {
    id: "camelCase",
    name: "camelCase",
    category: "Case",

    description: "Converts text to camelCase (e.g. helloWorldExample).",

    inputType: "string",
    outputType: "string",

    run(input) {
      const words = splitWords(input);

      return words
        .map((word, i) =>
          i === 0
            ? word
            : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");
    }
  },

  pascalCase: {
    id: "pascalCase",
    name: "PascalCase",
    category: "Case",

    description: "Converts text to PascalCase (e.g. HelloWorldExample).",

    inputType: "string",
    outputType: "string",

    run(input) {
      return splitWords(input)
        .map(
          word => word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");
    }
  },

  snake_case: {
    id: "snake_case",
    name: "snake_case",
    category: "Case",

    description: "Converts text to snake_case.",

    inputType: "string",
    outputType: "string",

    run(input) {
      return splitWords(input).join("_");
    }
  },

  kebab_case: {
    id: "kebab_case",
    name: "kebab-case",
    category: "Case",

    description: "Converts text to kebab-case.",

    inputType: "string",
    outputType: "string",

    run(input) {
      return splitWords(input).join("-");
    }
  },

  constant_case: {
    id: "constant_case",
    name: "CONSTANT_CASE",
    category: "Case",

    description: "Converts text to CONSTANT_CASE.",

    inputType: "string",
    outputType: "string",

    run(input) {
      return splitWords(input)
        .join("_")
        .toUpperCase();
    }
  },

  titleCase: {
    id: "titleCase",
    name: "Title Case",
    category: "Case",

    description: "Capitalizes the first letter of each word.",

    inputType: "string",
    outputType: "string",

    run(input) {
      return splitWords(input)
        .map(
          word => word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
    }
  },

  sentenceCase: {
    id: "sentenceCase",
    name: "Sentence case",
    category: "Case",

    description:
      "Capitalizes only the first letter of the sentence.",

    inputType: "string",
    outputType: "string",

    run(input) {
      const str = input.trim().toLowerCase();
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },

  alternatingCase: {
    id: "alternatingCase",
    name: "aLtErNaTiNg CaSe",
    category: "Case",

    description: "Alternates uppercase and lowercase letters.",

    inputType: "string",
    outputType: "string",

    run(input) {
      return input
        .split("")
        .map((char, i) =>
          i % 2 === 0
            ? char.toLowerCase()
            : char.toUpperCase()
        )
        .join("");
    }
  }
};