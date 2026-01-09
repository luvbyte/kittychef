// Networking

export default {
  http_request: {
    id: "http_request",
    name: "HTTP Request",
    category: "Networking",

    description:
      "Performs an HTTP request (GET, POST, PUT, DELETE, etc.) and returns the response body.",

    inputType: "byteArray",
    outputType: "byteArray",

    options: {
      url: {
        type: "text",
        placeholder: "https://api.example.com",
        default: ""
      },
      method: {
        type: "select",
        default: "GET",
        choices: ["GET", "POST", "PUT", "PATCH", "DELETE"]
      },
      headers: {
        type: "textarea",
        placeholder: "Header-Name: value",
        default: ""
      },
      bodyMode: {
        type: "select",
        default: "auto",
        choices: ["auto", "text", "json", "bytes"]
      }
    },

    async run(input, options) {
      if (!options?.url) {
        throw new Error("HTTP Request: URL is required");
      }

      const method = options.method ?? "GET";

      // Parse headers
      const headers = {};
      if (options.headers) {
        for (const line of options.headers.split("\n")) {
          const idx = line.indexOf(":");
          if (idx === -1) continue;
          const key = line.slice(0, idx).trim();
          const value = line.slice(idx + 1).trim();
          if (key) headers[key] = value;
        }
      }

      let body;

      if (!["GET", "HEAD"].includes(method)) {
        switch (options.bodyMode) {
          case "json":
            headers["Content-Type"] ??= "application/json";
            body = new TextDecoder().decode(input);
            break;

          case "text":
            body = new TextDecoder().decode(input);
            break;

          case "bytes":
            body = input;
            break;

          case "auto":
          default:
            body = input.length ? input : undefined;
        }
      }

      const response = await fetch(options.url, {
        method,
        headers,
        body
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    }
  },
  ipv4_to_int: {
    id: "ipv4_to_int",
    name: "IPV4 → Integer",
    category: "Networking",
    inputType: "string",
    outputType: "number",

    async run(input) {
      return Number(input.replace(/\./g, ""));
    }
  }
};
