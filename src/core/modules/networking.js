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
    name: "IPv4 → Integer",
    category: "Networking",

    description: "Converts IPv4 address into a proper 32-bit integer.",

    inputType: "string",
    outputType: "number",

    run(input) {
      const parts = input.split(".").map(Number);

      if (parts.length !== 4 || parts.some(n => n < 0 || n > 255)) {
        throw new Error("Invalid IPv4 address");
      }

      return (
        ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
      );
    }
  },
  int_to_ipv4: {
    id: "int_to_ipv4",
    name: "Integer → IPv4",
    category: "Networking",

    description: "Converts integer back to IPv4 address.",

    inputType: "number",
    outputType: "string",

    run(input) {
      return [
        (input >>> 24) & 255,
        (input >>> 16) & 255,
        (input >>> 8) & 255,
        input & 255
      ].join(".");
    }
  },
  user_agent_parse: {
    id: "user_agent_parse",
    name: "User-Agent Parser",
    category: "Networking",

    description:
      "Parses a User-Agent string and extracts browser, OS, and device info.",

    inputType: "string",
    outputType: "object",

    run(input) {
      const ua = input;

      const browser = /chrome/i.test(ua)
        ? "Chrome"
        : /firefox/i.test(ua)
          ? "Firefox"
          : /safari/i.test(ua)
            ? "Safari"
            : /edge/i.test(ua)
              ? "Edge"
              : "Unknown";

      const os = /windows/i.test(ua)
        ? "Windows"
        : /android/i.test(ua)
          ? "Android"
          : /iphone|ipad|ios/i.test(ua)
            ? "iOS"
            : /mac/i.test(ua)
              ? "macOS"
              : /linux/i.test(ua)
                ? "Linux"
                : "Unknown";

      const device = /mobile/i.test(ua)
        ? "Mobile"
        : /tablet/i.test(ua)
          ? "Tablet"
          : "Desktop";

      return { browser, os, device, raw: ua };
    }
  },
  user_agent_generate: {
    id: "user_agent_generate",
    name: "User-Agent Generator",
    category: "Networking",

    description:
      "Generates realistic User-Agent strings based on browser, OS, and device type.",

    inputType: "string",
    outputType: "string",

    options: {
      browser: {
        type: "select",
        default: "chrome",
        choices: ["chrome", "firefox", "safari", "edge"]
      },
      os: {
        type: "select",
        default: "windows",
        choices: ["windows", "mac", "linux", "android", "ios"]
      },
      device: {
        type: "select",
        default: "desktop",
        choices: ["desktop", "mobile"]
      }
    },

    run(_, options) {
      const browser = options.browser ?? "chrome";
      const os = options.os ?? "windows";
      const device = options.device ?? "desktop";

      const versions = {
        chrome: "122.0.0.0",
        firefox: "124.0",
        safari: "17.0",
        edge: "122.0.0.0"
      };

      // OS strings
      const osMap = {
        windows: "Windows NT 10.0; Win64; x64",
        mac: "Macintosh; Intel Mac OS X 13_5",
        linux: "X11; Linux x86_64",
        android: "Linux; Android 13; SM-S918B",
        ios: "iPhone; CPU iPhone OS 17_0 like Mac OS X"
      };

      const osString = osMap[os];

      // Device suffix
      const mobileSuffix =
        device === "mobile" || os === "android" || os === "ios"
          ? " Mobile"
          : "";

      switch (browser) {
        case "chrome":
          return `Mozilla/5.0 (${osString}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${versions.chrome}${mobileSuffix} Safari/537.36`;

        case "firefox":
          return `Mozilla/5.0 (${osString}; rv:${versions.firefox}) Gecko/20100101 Firefox/${versions.firefox}`;

        case "safari":
          return `Mozilla/5.0 (${osString}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${versions.safari}${mobileSuffix} Safari/605.1.15`;

        case "edge":
          return `Mozilla/5.0 (${osString}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${versions.edge}${mobileSuffix} Safari/537.36 Edg/${versions.edge}`;

        default:
          return "Mozilla/5.0";
      }
    }
  },
  url_parse: {
    id: "url_parse",
    name: "Parse URL",
    category: "Networking",

    description: "Breaks a URL into its components.",

    inputType: "string",
    outputType: "object",

    run(input) {
      try {
        const url = new URL(input);

        return {
          href: url.href,
          protocol: url.protocol,
          host: url.host,
          hostname: url.hostname,
          port: url.port,
          pathname: url.pathname,
          search: url.search,
          hash: url.hash
        };
      } catch {
        throw new Error("Invalid URL");
      }
    }
  },
  query_to_json: {
    id: "query_to_json",
    name: "Query → JSON",
    category: "Networking",

    description: "Converts query string into JSON.",

    inputType: "string",
    outputType: "object",

    run(input) {
      const params = new URLSearchParams(input);
      const obj = {};

      for (const [key, value] of params.entries()) {
        obj[key] = value;
      }

      return obj;
    }
  },
  json_to_query: {
    id: "json_to_query",
    name: "JSON → Query",
    category: "Networking",

    description: "Converts JSON into query string.",

    inputType: "string",
    outputType: "string",

    run(input) {
      let obj;

      try {
        obj = JSON.parse(input);
      } catch {
        throw new Error("Invalid JSON");
      }

      return Object.entries(obj)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
    }
  },
  headers_to_json: {
    id: "headers_to_json",
    name: "Headers → JSON",
    category: "Networking",

    description: "Parses raw HTTP headers into JSON.",

    inputType: "string",
    outputType: "object",

    run(input) {
      const result = {};

      input.split("\n").forEach(line => {
        const idx = line.indexOf(":");
        if (idx === -1) return;

        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();

        if (key) result[key] = value;
      });

      return result;
    }
  },
  json_to_headers: {
    id: "json_to_headers",
    name: "JSON → Headers",
    category: "Networking",

    description: "Converts JSON into HTTP header format.",

    inputType: "string",
    outputType: "string",

    run(input) {
      let obj;

      try {
        obj = JSON.parse(input);
      } catch {
        throw new Error("Invalid JSON");
      }

      return Object.entries(obj)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
    }
  }
};
