// Extractors

const decoder = new TextDecoder();

function extractRegex(input, regex, type) {
  const results = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    results.push({
      type,
      value: match[0],
      offset: match.index,
      length: match[0].length
    });
  }

  return results;
}

function formatResults(results) {
  return results.map(r => r.value).join("\n");
}

export default {
  extract_emails: {
    id: "extract_emails",
    name: "Extract Emails",
    description: "Extract email addresses from text",
    category: "Extractors",
    inputType: "string",
    outputType: "string",

    async run(input) {
      const results = extractRegex(
        input,
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        "email"
      );
      return formatResults(results);
    }
  },

  extract_urls: {
    id: "extract_urls",
    name: "Extract URLs",
    description: "Extract HTTP/HTTPS URLs",
    category: "Extractors",
    inputType: "string",
    outputType: "string",

    async run(input) {
      return formatResults(
        extractRegex(input, /\bhttps?:\/\/[^\s'"<>]+/gi, "url")
      );
    }
  },

  extract_ipv4: {
    id: "extract_ipv4",
    name: "Extract IPv4",
    description: "Extract IPv4 addresses",
    category: "Extractors",
    inputType: "string",
    outputType: "string",

    async run(input) {
      return formatResults(
        extractRegex(input, /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "ipv4")
      );
    }
  },

  extract_mac: {
    id: "extract_mac",
    name: "Extract MAC Address",
    description: "Extract MAC addresses",
    category: "Extractors",
    inputType: "string",
    outputType: "string",

    async run(input) {
      return formatResults(
        extractRegex(input, /\b(?:[0-9A-F]{2}:){5}[0-9A-F]{2}\b/gi, "mac")
      );
    }
  },

  extract_hashes: {
    id: "extract_hashes",
    name: "Extract Hashes",
    description: "Extract MD5, SHA1 and SHA256 hashes",
    category: "Extractors",
    inputType: "string",
    outputType: "string",

    async run(input) {
      const results = [
        ...extractRegex(input, /\b[a-f0-9]{32}\b/gi, "md5"),
        ...extractRegex(input, /\b[a-f0-9]{40}\b/gi, "sha1"),
        ...extractRegex(input, /\b[a-f0-9]{64}\b/gi, "sha256")
      ];
      return formatResults(results);
    }
  },

  extract_jwt: {
    id: "extract_jwt",
    name: "Extract JWT",
    description: "Extract JSON Web Tokens",
    category: "Extractors",
    inputType: "string",
    outputType: "string",

    async run(input) {
      return formatResults(
        extractRegex(
          input,
          /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
          "jwt"
        )
      );
    }
  },

  extract_base64: {
    id: "extract_base64",
    name: "Extract Base64",
    description: "Extract Base64-encoded blobs",
    category: "Extractors",
    inputType: "string",
    outputType: "string",

    async run(input) {
      return formatResults(
        extractRegex(
          input,
          /\b(?:[A-Za-z0-9+/]{4}){4,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?\b/g,
          "base64"
        )
      );
    }
  },

  extract_strings: {
    id: "extract_strings",
    name: "Extract ASCII Strings",
    description: "Extract printable ASCII strings from binary data",
    category: "Extractors",
    inputType: "byteArray",
    outputType: "string",

    options: {
      minLength: {
        type: "number",
        label: "Minimum Length",
        default: 4
      }
    },

    async run(input, { minLength = 4 } = {}) {
      const text = decoder.decode(input);
      const regex = new RegExp(`[ -~]{${minLength},}`, "g");
      return formatResults(extractRegex(text, regex, "string"));
    }
  }
};
