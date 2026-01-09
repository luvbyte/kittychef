// JSON

export default {
  json_pretty: {
    id: "json_pretty",
    name: "JSON Pretty Print",
    category: "JSON",

    description:
      "Formats JSON with indentation and line breaks to make it more readable.",

    inputType: "string",
    outputType: "string",

    options: {
      indent: {
        type: "number",
        label: "Indent Spaces",
        placeholder: "e.g. 2",
        default: 2
      }
    },

    run(input, options) {
      if (typeof input !== "string") {
        throw new Error("JSON Pretty Print expects string input");
      }

      try {
        const obj = JSON.parse(input);
        const indent = Number(options?.indent) || 2;
        return JSON.stringify(obj, null, indent).replace(/\r\n/g, "\n");
      } catch (err) {
        throw new Error("Invalid JSON:\n" + err.message);
      }
    }
  },

  json_minify: {
    id: "json_minify",
    name: "JSON Minify",
    category: "JSON",

    description:
      "Removes all unnecessary whitespace from JSON to produce a compact output.",

    inputType: "string",
    outputType: "string",

    options: {},

    run(input) {
      if (typeof input !== "string") {
        throw new Error("JSON Minify expects string input");
      }

      try {
        const obj = JSON.parse(input);
        return JSON.stringify(obj);
      } catch (err) {
        throw new Error("Invalid JSON:\n" + err.message);
      }
    }
  },

  json_filter: {
    id: "json_filter",
    name: "JSON Filter",
    category: "JSON",

    description:
      "Filters and transforms JSON using jq-style expressions (e.g. .foo.bar, .items[], .items[].name).",

    inputType: "string",
    outputType: "string",

    options: {
      filter: {
        type: "text",
        label: "Filter",
        placeholder: "e.g. .items[].name",
        default: "."
      }
    },

    run(input, options) {
      if (typeof input !== "string") {
        throw new Error("JSON jq expects string input");
      }

      let data;
      try {
        data = JSON.parse(input);
      } catch (err) {
        throw new Error("Invalid JSON:\n" + err.message);
      }

      const filter = options?.filter?.trim() || ".";

      try {
        const result = applyJqFilter(data, filter);

        // If it's already an object/array
        if (typeof result === "object" && result !== null) {
          return JSON.stringify(result, null, 2);
        }

        // If it's a string that might be JSON
        if (typeof result === "string") {
          try {
            const parsed = JSON.parse(result);
            return JSON.stringify(parsed, null, 2);
          } catch {
            return result; // plain text
          }
        }

        return String(result);
      } catch (err) {
        throw new Error("Invalid jq filter:\n" + err.message);
      }
    }
  }
};

//
function applyJqFilter(data, filter) {
  if (filter === ".") return data;

  // Remove leading dot
  if (!filter.startsWith(".")) {
    throw new Error("Filter must start with '.'");
  }

  const tokens = filter.slice(1).split(".").filter(Boolean);

  let current = data;

  for (const token of tokens) {
    if (token.endsWith("[]")) {
      const key = token.slice(0, -2);
      const arr = key ? current[key] : current;

      if (!Array.isArray(arr)) {
        throw new Error(`Expected array at '${key || "."}'`);
      }

      current = arr;
    } else if (token.includes("[") && token.endsWith("]")) {
      const [key, indexPart] = token.split("[");
      const index = Number(indexPart.slice(0, -1));

      current = key ? current[key] : current;

      if (!Array.isArray(current)) {
        throw new Error(`'${key}' is not an array`);
      }

      current = current[index];
    } else {
      if (Array.isArray(current)) {
        current = current.map(item => item?.[token]);
      } else {
        current = current?.[token];
      }
    }
  }

  return current;
}
