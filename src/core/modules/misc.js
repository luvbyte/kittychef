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
    inputType: "number",
    outputType: "byteArray",

    async run(length) {
      return crypto.getRandomValues(new Uint8Array(length));
    }
  }
};
