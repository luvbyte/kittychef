// Misc

export default {
  uuid: {
    id: "uuid",
    name: "UUID Generator",
    description: "Generate unique UUIDs",
    category: "Misc",
    inputType: "string",
    outputType: "string",

    options: {
      count: {
        type: "number",
        label: "Count",
        placeholder: "Number of UUIDs to generate",
        default: 1
      }
    },

    async run(_, { count = 1 } = {}) {
      const uuids = Array.from({ length: count }, () => crypto.randomUUID());

      return uuids.join("\n");
    }
  },
  timestamp_to_date: {
    id: "timestamp_to_date",
    name: "Timestamp → Date",
    category: "Misc",
    inputType: "number",
    outputType: "string",

    async run(input) {
      return new Date(input * 1000).toISOString();
    }
  },
  random_bytes: {
    id: "random_bytes",
    name: "Random Bytes",
    category: "Misc",
    description: "Generate cryptographically secure random bytes",
    inputType: "number",
    outputType: "byteArray",

    async run(length) {
      return crypto.getRandomValues(new Uint8Array(length));
    }
  },
  random_string: {
    id: "random_string",
    name: "Random String",
    category: "Misc",
    description: "Generate a random alphanumeric string",
    inputType: "number",
    outputType: "string",

    async run(length = 10) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
    }
  },
  slugify: {
    id: "slugify",
    name: "Slugify",
    category: "Misc",
    description: "Convert text into a URL-friendly slug",
    inputType: "string",
    outputType: "string",

    async run(input) {
      return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
  },
  sleep: {
    id: "sleep",
    name: "Sleep (Delay)",
    category: "Misc",
    description: "Pause execution for a given time in milliseconds",
    inputType: "byteArray",
    outputType: "byteArray",

    options: {
      ms: {
        type: "number",
        label: "Sleep delay in ms"
      }
    },

    async run(input, { ms }) {
      await new Promise(resolve => setTimeout(resolve, ms));
      return input
    }
  },
  clamp: {
    id: "clamp",
    name: "Clamp Number",
    category: "Misc",
    description: "Restrict a number within a min and max range",
    inputType: "number",
    outputType: "number",

    options: {
      min: { type: "number", default: 0 },
      max: { type: "number", default: 100 }
    },

    async run(input, { min = 0, max = 100 } = {}) {
      return Math.min(Math.max(input, min), max);
    }
  }
};
