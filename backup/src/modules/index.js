export const modules = {
  base64_encode: {
    id: "base64_encode",
    name: "Base64 Encode",
    category: "Encoding",

    options: {
      urlsafe: {
        type: "checkbox",
        label: "URL Safe Output",
        default: false
      }
    },

    run(input, options) {
      let output = btoa(input);

      if (options.urlsafe) {
        output = output
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      }

      return output;
    }
  },
  base64_decode: {
    id: "base64_decode",
    name: "Base64 Decode",
    category: "Encoding",

    options: {
      urlsafe: {
        type: "checkbox",
        label: "Input is URL Safe",
        default: false
      },
      fixPadding: {
        type: "checkbox",
        label: "Fix Missing '=' Padding",
        default: true
      }
    },

    run(input, options) {
      let text = input;

      if (options.urlsafe) {
        text = text.replace(/-/g, "+").replace(/_/g, "/");
      }

      if (options.fixPadding) {
        const pad = text.length % 4;
        if (pad === 2) text += "==";
        if (pad === 3) text += "=";
        if (pad === 1) text += "===";
      }

      return atob(text);
    }
  },
  url_encode: {
    id: "url_encode",
    name: "URL Encode",
    category: "Encoding",

    options: {
      spaces: {
        type: "select",
        label: "Space Encoding",
        choices: ["%20", "+"],
        default: "%20"
      }
    },

    run(input, options) {
      let out = encodeURIComponent(input);

      if (options.spaces === "+") {
        out = out.replace(/%20/g, "+");
      }

      return out;
    }
  },
  url_decode: {
    id: "url_decode",
    name: "URL Decode",
    category: "Encoding",

    options: {
      plusAsSpace: {
        type: "checkbox",
        label: "Treat + as space",
        default: true
      }
    },

    run(input, options) {
      let text = input;

      if (options.plusAsSpace) {
        text = text.replace(/\+/g, "%20");
      }

      return decodeURIComponent(text);
    }
  },
  hex_encode: {
    id: "hex_encode",
    name: "Hex Encode",
    category: "Encoding",

    options: {
      uppercase: {
        type: "checkbox",
        label: "Uppercase Output",
        default: false
      }
    },

    run(input, options) {
      let hex = [...input]
        .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");

      if (options.uppercase) {
        hex = hex.toUpperCase();
      }

      return hex;
    }
  },
  hex_decode: {
    id: "hex_decode",
    name: "Hex Decode",
    category: "Encoding",

    options: {},

    run(input) {
      const clean = input.replace(/[^0-9a-fA-F]/g, "");

      let out = "";
      for (let i = 0; i < clean.length; i += 2) {
        out += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
      }

      return out;
    }
  },
  rot13: {
    id: "rot13",
    name: "ROT13",
    category: "Ciphers",

    options: {},

    run(input) {
      return input.replace(/[a-zA-Z]/g, c =>
        String.fromCharCode(
          c <= "Z"
            ? ((c.charCodeAt(0) - 65 + 13) % 26) + 65
            : ((c.charCodeAt(0) - 97 + 13) % 26) + 97
        )
      );
    }
  },
  xor: {
    id: "xor",
    name: "XOR",
    category: "Crypto",

    options: {
      key: {
        type: "text",
        label: "XOR Key",
        placeholder: "e.g. A",
        default: ""
      }
    },

    run(input, options) {
      const key = options.key || "\x00";

      let out = "";
      for (let i = 0; i < input.length; i++) {
        out += String.fromCharCode(
          input.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return out;
    }
  },
  reverse: {
    id: "reverse",
    name: "Reverse Text",
    category: "Text",

    options: {},

    run(input) {
      return input.split("").reverse().join("");
    }
  },
  uppercase: {
    id: "uppercase",
    name: "Uppercase",
    category: "Text",
    options: {},
    run(input) {
      return input.toUpperCase();
    }
  },
  lowercase: {
    id: "lowercase",
    name: "Lowercase",
    category: "Text",
    options: {},
    run(input) {
      return input.toLowerCase();
    }
  },

  // Pretty JSON
  json_pretty: {
    id: "json_pretty",
    name: "JSON Pretty Print",
    category: "JSON",

    options: {
      indent: {
        type: "number",
        label: "Indent Spaces",
        placeholder: "e.g. 2",
        default: 2
      }
    },

    run(input, options) {
      try {
        const obj = JSON.parse(input);

        const indent = Number(options.indent) || 2;

        return JSON.stringify(obj, null, indent).replace(/\r\n/g, "\n"); // normalize newlines
      } catch (err) {
        return "❌ Invalid JSON:\n" + err.message;
      }
    }
  },
  json_minify: {
    id: "json_minify",
    name: "JSON Minify",
    category: "JSON",

    options: {},

    run(input) {
      try {
        const obj = JSON.parse(input);
        return JSON.stringify(obj);
      } catch (err) {
        return "❌ Invalid JSON:\n" + err.message;
      }
    }
  },

  xml_pretty: {
    id: "xml_pretty",
    name: "XML Pretty Print",
    category: "XML",

    options: {
      indent: {
        type: "number",
        label: "Indent Spaces",
        default: 2
      }
    },

    run(input, options) {
      try {
        const indent = Number(options.indent) || 2;

        // Basic formatting using regex approach
        let xml = input
          .replace(/>\s*</g, "><") // collapse all whitespace between tags
          .replace(/></g, ">\n<");

        let formatted = "";
        let pad = 0;

        xml.split("\n").forEach(line => {
          if (line.match(/^<\/\w/)) pad--;

          formatted += " ".repeat(pad * indent) + line + "\n";

          if (line.match(/^<\w[^>]*[^\/]>$/)) pad++;
        });

        return formatted.trim();
      } catch (e) {
        return "❌ Invalid XML format.";
      }
    }
  },

  xml_minify: {
    id: "xml_minify",
    name: "XML Minify",
    category: "XML",

    options: {},

    run(input) {
      return input
        .replace(/>\s+</g, "><")
        .replace(/\s{2,}/g, " ")
        .trim();
    }
  },
  jwt_decode: {
    id: "jwt_decode",
    name: "JWT Decode",
    category: "Crypto",

    options: {},

    run(input) {
      const parts = input.split(".");
      if (parts.length < 2) return "❌ Invalid JWT token.";

      function base64urlDecode(str) {
        str = str.replace(/-/g, "+").replace(/_/g, "/");
        const pad = str.length % 4;
        if (pad) str += "=".repeat(4 - pad);
        return atob(str);
      }

      try {
        const header = JSON.parse(base64urlDecode(parts[0]));
        const payload = JSON.parse(base64urlDecode(parts[1]));

        return (
          "HEADER:\n" +
          JSON.stringify(header, null, 2) +
          "\n\nPAYLOAD:\n" +
          JSON.stringify(payload, null, 2)
        );
      } catch (e) {
        return "❌ Failed to decode JWT.";
      }
    }
  },

  sha256: {
    id: "sha256",
    name: "SHA-256 Hash",
    category: "Hashing",

    options: {
      uppercase: {
        type: "checkbox",
        label: "Uppercase Output",
        default: false
      }
    },

    async run(input, options) {
      const enc = new TextEncoder();
      const data = enc.encode(input);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);

      let hex = [...new Uint8Array(hashBuffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      if (options.uppercase) hex = hex.toUpperCase();

      return hex;
    }
  },

  html_encode: {
    id: "html_encode",
    name: "HTML Encode",
    category: "Web",

    options: {},

    run(input) {
      return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  },

  html_decode: {
    id: "html_decode",
    name: "HTML Decode",
    category: "Web",

    options: {},

    run(input) {
      return input
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&");
    }
  },

  base32_encode: {
    id: "base32_encode",
    name: "Base32 Encode",
    category: "Encoding",

    options: {},

    run(input) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      let bits = "";
      let out = "";

      for (const c of input) {
        bits += c.charCodeAt(0).toString(2).padStart(8, "0");
      }

      while (bits.length % 5 !== 0) bits += "0";

      for (let i = 0; i < bits.length; i += 5) {
        out += alphabet[parseInt(bits.slice(i, i + 5), 2)];
      }

      return out;
    }
  },
  base32_decode: {
    id: "base32_decode",
    name: "Base32 Decode",
    category: "Encoding",

    options: {},

    run(input) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      let bits = "";
      let out = "";

      for (const c of input.replace(/=+$/, "")) {
        const idx = alphabet.indexOf(c.toUpperCase());
        if (idx >= 0) bits += idx.toString(2).padStart(5, "0");
      }

      for (let i = 0; i < bits.length; i += 8) {
        const byte = bits.slice(i, i + 8);
        if (byte.length === 8) out += String.fromCharCode(parseInt(byte, 2));
      }

      return out;
    }
  },

  uuid_v4: {
    id: "uuid_v4",
    name: "UUID v4 Generate",
    category: "Utilities",

    options: {},

    run() {
      const arr = crypto.getRandomValues(new Uint8Array(16));

      arr[6] = (arr[6] & 0x0f) | 0x40;
      arr[8] = (arr[8] & 0x3f) | 0x80;

      const hex = [...arr].map(b => b.toString(16).padStart(2, "0")).join("");

      return (
        hex.substring(0, 8) +
        "-" +
        hex.substring(8, 12) +
        "-" +
        hex.substring(12, 16) +
        "-" +
        hex.substring(16, 20) +
        "-" +
        hex.substring(20)
      );
    }
  },
  csv_to_json: {
    id: "csv_to_json",
    name: "CSV → JSON",
    category: "Data",
    options: {
      header: {
        type: "checkbox",
        label: "CSV has header row",
        default: true
      }
    },
    run(input, options) {
      try {
        const lines = input
          .trim()
          .split(/\r?\n/)
          .map(l => l.split(","));
        let headers = [];

        if (options.header) {
          headers = lines.shift();
        } else {
          headers = lines[0].map((_, i) => "col" + (i + 1));
        }

        const out = lines.map(row => {
          const obj = {};
          row.forEach((v, i) => (obj[headers[i]] = v));
          return obj;
        });

        return JSON.stringify(out, null, 2);
      } catch (e) {
        return "❌ CSV parsing failed.";
      }
    }
  },
  json_to_csv: {
    id: "json_to_csv",
    name: "JSON → CSV",
    category: "Data",
    options: {},
    run(input) {
      try {
        const arr = JSON.parse(input);
        if (!Array.isArray(arr)) return "❌ Input must be an array";

        const headers = Object.keys(arr[0]);
        const rows = arr.map(obj => headers.map(h => obj[h] ?? "").join(","));

        return [headers.join(","), ...rows].join("\n");
      } catch (e) {
        return "❌ Invalid JSON for CSV.";
      }
    }
  },
  regex_extract: {
    id: "regex_extract",
    name: "Regex Extract",
    category: "Regex",
    options: {
      pattern: {
        type: "text",
        label: "Pattern",
        placeholder: "e.g. (\\d+)"
      },
      global: {
        type: "checkbox",
        label: "Global",
        default: true
      }
    },
    run(input, options) {
      try {
        const flags = options.global ? "g" : "";
        const re = new RegExp(options.pattern, flags);
        const matches = [...input.matchAll(re)].map(m => m[0]);

        return JSON.stringify(matches, null, 2);
      } catch (e) {
        return "❌ Regex error: " + e.message;
      }
    }
  },
  regex_replace: {
    id: "regex_replace",
    name: "Regex Replace",
    category: "Regex",
    options: {
      pattern: { type: "text", label: "Pattern" },
      replace: { type: "text", label: "Replace With" }
    },
    run(input, options) {
      try {
        const re = new RegExp(options.pattern, "g");
        return input.replace(re, options.replace);
      } catch (e) {
        return "❌ Regex error: " + e.message;
      }
    }
  },
  line_sort: {
    id: "line_sort",
    name: "Sort Lines",
    category: "Text Utils",
    options: {
      descending: {
        type: "checkbox",
        label: "Descending",
        default: false
      }
    },
    run(input, options) {
      const lines = input.split(/\r?\n/).sort();
      if (options.descending) lines.reverse();
      return lines.join("\n");
    }
  },
  remove_blank_lines: {
    id: "remove_blank_lines",
    name: "Remove Blank Lines",
    category: "Text Utils",
    options: {},
    run(input) {
      return input
        .split(/\r?\n/)
        .filter(l => l.trim() !== "")
        .join("\n");
    }
  },
  unique_lines: {
    id: "unique_lines",
    name: "Unique Lines",
    category: "Text Utils",
    options: {},
    run(input) {
      return [...new Set(input.split(/\r?\n/))].join("\n");
    }
  },
  password_generator: {
    id: "password_generator",
    name: "Password Generator",
    category: "Utilities",
    options: {
      length: {
        type: "number",
        label: "Length",
        default: 16
      }
    },
    run(_, options) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=?";
      const len = Number(options.length) || 16;
      let out = "";

      for (let i = 0; i < len; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
      }

      return out;
    }
  },
  html_to_text: {
    id: "html_to_text",
    name: "HTML → Text",
    category: "Web",
    options: {},
    run(input) {
      return input
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<\/?[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }
  },

  aes_encrypt: {
    id: "aes_encrypt",
    name: "AES Encrypt (AES-GCM)",
    category: "Crypto",

    options: {
      key: { type: "text", label: "Key", default: "" },
      iv: { type: "text", label: "IV", default: "default_iv" },
      base64: { type: "checkbox", label: "Output Base64", default: true }
    },

    async run(input, options) {
      try {
        const textEncoder = new TextEncoder();

        // Derive AES-256 key using SHA-256
        const rawKey = await crypto.subtle.digest(
          "SHA-256",
          textEncoder.encode(options.key)
        );

        // Derive 12-byte IV from SHA-256 of IV string
        const fullIV = await crypto.subtle.digest(
          "SHA-256",
          textEncoder.encode(options.iv)
        );
        const iv = new Uint8Array(fullIV).slice(0, 12);

        const alg = { name: "AES-GCM", iv };

        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          rawKey,
          alg,
          false,
          ["encrypt"]
        );

        const encrypted = await crypto.subtle.encrypt(
          alg,
          cryptoKey,
          textEncoder.encode(input)
        );

        const bytes = new Uint8Array(encrypted);

        if (options.base64) {
          return btoa(String.fromCharCode(...bytes));
        }

        return Array.from(bytes).join(",");
      } catch (e) {
        return "❌ AES Encryption Failed: " + e.message;
      }
    }
  },
  aes_decrypt_gcm: {
    id: "aes_decrypt_gcm",
    name: "AES Decrypt (AES-GCM)",
    category: "Crypto",

    options: {
      key: { type: "text", label: "Key", default: "" },
      iv: { type: "text", label: "IV", default: "default_iv" },
      base64: { type: "checkbox", label: "Input is Base64", default: true }
    },

    async run(input, options) {
      try {
        const textEncoder = new TextEncoder();
        const textDecoder = new TextDecoder();

        // Derive AES-256 key
        const rawKey = await crypto.subtle.digest(
          "SHA-256",
          textEncoder.encode(options.key)
        );

        // Derive IV (12 bytes)
        const fullIV = await crypto.subtle.digest(
          "SHA-256",
          textEncoder.encode(options.iv)
        );
        const iv = new Uint8Array(fullIV).slice(0, 12);

        const alg = { name: "AES-GCM", iv };

        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          rawKey,
          alg,
          false,
          ["decrypt"]
        );

        let bytes;

        if (options.base64) {
          const bin = atob(input);
          bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
        } else {
          bytes = Uint8Array.from(input.split(",").map(Number));
        }

        const decrypted = await crypto.subtle.decrypt(alg, cryptoKey, bytes);
        return textDecoder.decode(decrypted);
      } catch (e) {
        return "❌ AES Decryption Failed: " + e.message;
      }
    }
  },

  markdown_to_html: {
    id: "markdown_to_html",
    name: "Markdown → HTML",
    category: "Web",

    options: {},

    run(input) {
      let html = input;

      html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
      html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
      html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
      html = html.replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>");
      html = html.replace(/\*(.*?)\*/gim, "<i>$1</i>");
      html = html.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>");
      html = html.replace(/\n$/gim, "<br/>");

      return html.trim();
    }
  },
  html_to_md: {
    id: "html_to_md",
    name: "HTML → Markdown",
    category: "Web",

    options: {},

    run(input) {
      return input
        .replace(/<h1>(.*?)<\/h1>/gi, "# $1")
        .replace(/<h2>(.*?)<\/h2>/gi, "## $1")
        .replace(/<h3>(.*?)<\/h3>/gi, "### $1")
        .replace(/<b>(.*?)<\/b>/gi, "**$1**")
        .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<i>(.*?)<\/i>/gi, "*$1*")
        .replace(/<em>(.*?)<\/em>/gi, "*$1*")
        .replace(/<a href=['"](.*?)['"]>(.*?)<\/a>/gi, "[$2]($1)")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?[^>]+>/g, "")
        .trim();
    }
  },
  base58_encode: {
    id: "base58_encode",
    name: "Base58 Encode",
    category: "Encoding",

    options: {},

    run(input) {
      const alphabet =
        "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      let bytes = [...input].map(c => c.charCodeAt(0));
      let x = BigInt(
        "0x" + bytes.map(b => b.toString(16).padStart(2, "0")).join("")
      );
      let out = "";

      while (x > 0) {
        let mod = x % 58n;
        x = x / 58n;
        out = alphabet[Number(mod)] + out;
      }

      return out;
    }
  },
  base58_decode: {
    id: "base58_decode",
    name: "Base58 Decode",
    category: "Encoding",

    options: {},

    run(input) {
      const alphabet =
        "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      let x = 0n;

      for (let char of input) {
        const value = alphabet.indexOf(char);
        if (value < 0) return "❌ Invalid Base58 input";
        x = x * 58n + BigInt(value);
      }

      const hex = x.toString(16);
      let out = "";

      for (let i = 0; i < hex.length; i += 2) {
        out += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }

      return out;
    }
  },
  hex_to_rgb: {
    id: "hex_to_rgb",
    name: "HEX → RGB",
    category: "Color",

    options: {},

    run(input) {
      const hex = input.replace("#", "");
      if (![3, 6].includes(hex.length)) return "❌ Invalid HEX";

      const num = parseInt(
        hex.length === 3
          ? hex
              .split("")
              .map(c => c + c)
              .join("")
          : hex,
        16
      );

      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;

      return `rgb(${r}, ${g}, ${b})`;
    }
  },
  rgb_to_hex: {
    id: "rgb_to_hex",
    name: "RGB → HEX",
    category: "Color",

    options: {},

    run(input) {
      const match = input.match(/rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/i);
      if (!match) return "❌ Invalid RGB format";

      const [_, r, g, b] = match.map(Number);

      return (
        "#" +
        [r, g, b]
          .map(n => n.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase()
      );
    }
  },
  text_to_binary: {
    id: "text_to_binary",
    name: "Text → Binary",
    category: "Encoding",

    options: {},

    run(input) {
      return [...input]
        .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" ");
    }
  },
  binary_to_text: {
    id: "binary_to_text",
    name: "Binary → Text",
    category: "Encoding",

    options: {},

    run(input) {
      return input
        .split(/\s+/)
        .map(b => String.fromCharCode(parseInt(b, 2)))
        .join("");
    }
  },
  diff: {
    id: "diff",
    name: "Diff Text (line by line)",
    category: "Text Utils",

    options: {},

    run(input) {
      const [a, b] = input.split(/\n-{3,}\n/);

      if (!a || !b) {
        return "❌ Provide input as:\n\ntext1\n---\ntext2";
      }

      const left = a.split("\n");
      const right = b.split("\n");
      const max = Math.max(left.length, right.length);

      let out = "";

      for (let i = 0; i < max; i++) {
        const L = left[i] ?? "";
        const R = right[i] ?? "";

        if (L === R) {
          out += `  ${L}\n`;
        } else {
          out += `- ${L}\n+ ${R}\n`;
        }
      }

      return out.trim();
    }
  },

  // MySQL -> PostgreSQL converter module
  mysql_to_postgres: {
    id: "mysql_to_postgres",
    name: "MySQL → PostgreSQL",
    category: "SQL",
    options: {
      convertBackticks: {
        type: "checkbox",
        label: "Convert backticks to double quotes",
        default: true
      },
      convertAutoIncrement: {
        type: "checkbox",
        label: "Convert AUTO_INCREMENT to SERIAL",
        default: true
      },
      convertBoolean: {
        type: "checkbox",
        label: "TINYINT(1) → BOOLEAN",
        default: true
      },
      removeEngine: {
        type: "checkbox",
        label: "Remove ENGINE / CHARSET table options",
        default: true
      },
      removeUnsigned: {
        type: "checkbox",
        label: "Drop UNSIGNED attribute",
        default: true
      },
      convertEnumToCheck: {
        type: "checkbox",
        label: "Convert ENUM to TEXT + CHECK (best-effort)",
        default: false
      },
      fixTimestamps: {
        type: "checkbox",
        label: "Adjust CURRENT_TIMESTAMP / ON UPDATE",
        default: true
      }
    },

    run(input, options = {}) {
      // merge defaults
      const opts = {
        convertBackticks: true,
        convertAutoIncrement: true,
        convertBoolean: true,
        removeEngine: true,
        removeUnsigned: true,
        convertEnumToCheck: false,
        fixTimestamps: true,
        ...options
      };

      let sql = input;

      // Normalize newlines
      sql = sql.replace(/\r\n/g, "\n");

      // 1) Remove MySQL-specific table options (ENGINE=..., DEFAULT CHARSET=..., COLLATE=...)
      if (opts.removeEngine) {
        sql = sql.replace(/\)\s*ENGINE\s*=\s*\w+[^;]*;/gi, ") ;"); // remove engine options at end of CREATE TABLE
        sql = sql.replace(/\)\s*DEFAULT\s+CHARSET\s*=\s*\w+[^;]*;/gi, ") ;");
        sql = sql.replace(/\)\s*COLLATE\s*=\s*\w+[^;]*;/gi, ") ;");
      }

      // 2) Convert backticks to double quotes (identifiers)
      if (opts.convertBackticks) {
        // Avoid changing backticks inside string literals by only replacing backticks that are not inside single quotes.
        // Simple approach: replace all backticks (works for most dumps). Warn: complex cases may need parser.
        sql = sql.replace(/`([^`]+)`/g, (_m, p1) => `"${p1}"`);
      }

      // 3) Drop UNSIGNED keyword
      if (opts.removeUnsigned) {
        sql = sql.replace(/\bunsigned\b/gi, "");
      }

      // 4) Convert TINYINT(1) to BOOLEAN
      if (opts.convertBoolean) {
        sql = sql.replace(/\bTINYINT\s*\(\s*1\s*\)\b/gi, "BOOLEAN");
        // sometimes tinyint(1) unsigned etc.
        sql = sql.replace(/\bTINYINT\s*\(\s*1\s*\)\s*UNSIGNED\b/gi, "BOOLEAN");
      }

      // 5) Convert INT / INTEGER with AUTO_INCREMENT to SERIAL / BIGSERIAL where appropriate
      if (opts.convertAutoIncrement) {
        // Attempt to convert common patterns:
        // `integer_type [NOT NULL] AUTO_INCREMENT` -> SERIAL (keep NOT NULL implied)
        // handle BIGINT AUTO_INCREMENT -> BIGSERIAL
        sql = sql.replace(
          /\bBIGINT\b([^;,\n)]*?)\bAUTO_INCREMENT\b/gi,
          (_m, p1) => {
            // preserve NOT NULL presence but replace with BIGSERIAL
            return `BIGSERIAL${p1.replace(/\bAUTO_INCREMENT\b/gi, "")}`;
          }
        );

        sql = sql.replace(
          /\bINT\b([^;,\n)]*?)\bAUTO_INCREMENT\b/gi,
          (_m, p1) => {
            return `SERIAL${p1.replace(/\bAUTO_INCREMENT\b/gi, "")}`;
          }
        );

        sql = sql.replace(
          /\bINTEGER\b([^;,\n)]*?)\bAUTO_INCREMENT\b/gi,
          (_m, p1) => {
            return `SERIAL${p1.replace(/\bAUTO_INCREMENT\b/gi, "")}`;
          }
        );

        // remove standalone AUTO_INCREMENT clauses leftover
        sql = sql.replace(/\bAUTO_INCREMENT\b/gi, "");
      }

      // 6) Convert default CURRENT_TIMESTAMP + ON UPDATE CURRENT_TIMESTAMP -> PostgreSQL equivalent
      if (opts.fixTimestamps) {
        // MySQL: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        // PostgreSQL: TIMESTAMP DEFAULT CURRENT_TIMESTAMP (ON UPDATE behavior needs trigger; we drop ON UPDATE)
        sql = sql.replace(/\bON UPDATE CURRENT_TIMESTAMP\b/gi, "");
        // Keep DEFAULT CURRENT_TIMESTAMP as-is (Postgres supports it)
      }

      // 7) ENUM -> convert to TEXT with CHECK (best-effort)
      if (opts.convertEnumToCheck) {
        // find ENUM(...) definitions and convert
        sql = sql.replace(/\bENUM\s*\(([^)]+)\)/gi, (_m, p1) => {
          // create list of values
          const vals = p1
            .split(/,(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/)
            .map(s => s.trim());
          const cleanVals = vals.map(v =>
            v.replace(/^'(.*)'$/, "$1").replace(/^"(.*)"$/, "$1")
          );
          const list = cleanVals
            .map(v => `'${v.replace(/'/g, "''")}'`)
            .join(", ");
          // return TEXT and append a comment with possible CHECK (user can manually create)
          return `TEXT /* ENUM(${list}) */`;
        });
      }

      // 8) Replace `AUTO_INCREMENT=...` table creation attributes (MySQL) remove them
      sql = sql.replace(/\bAUTO_INCREMENT\s*=\s*\d+\b/gi, "");

      // 9) Convert `DEFAULT ''` with '' to E'' if needed? leave as-is (Postgres supports '')
      // 10) Replace unsigned zerofill / other MySQL-specific attributes (best-effort)
      sql = sql.replace(/\bZEROFILL\b/gi, "");
      sql = sql.replace(/\bON DELETE\s+RESTRICT\b/gi, "ON DELETE RESTRICT"); // leave unchanged

      // 11) Convert backslash-escaped quotes in strings from mysql style to postgres compatible
      // (Postgres accepts standard SQL strings, so we generally can leave them as is.)

      // 12) Convert `AUTO_INCREMENT` table creation line: `CREATE TABLE "t" (...) ;` ensure semicolon present
      // Clean up multiple spaces
      sql = sql.replace(/[ \t]+/g, " ");

      // Trim excessive semicolons / spaces
      sql = sql.replace(/\s+;\s+/g, ";\n");

      return sql;
    }
  },

  // PostgreSQL -> MySQL converter module
  postgres_to_mysql: {
    id: "postgres_to_mysql",
    name: "PostgreSQL → MySQL",
    category: "SQL",
    options: {
      convertQuotes: {
        type: "checkbox",
        label: "Double quotes → backticks",
        default: true
      },
      convertSerial: {
        type: "checkbox",
        label: "SERIAL → INT AUTO_INCREMENT",
        default: true
      },
      convertBoolean: {
        type: "checkbox",
        label: "BOOLEAN → TINYINT(1)",
        default: true
      },
      addEngine: {
        type: "checkbox",
        label: "Append ENGINE=InnoDB to CREATE TABLE",
        default: true
      },
      convertTimestampDefaults: {
        type: "checkbox",
        label: "Adjust timestamp defaults (CURRENT_TIMESTAMP)",
        default: true
      }
    },

    run(input, options = {}) {
      const opts = {
        convertQuotes: true,
        convertSerial: true,
        convertBoolean: true,
        addEngine: true,
        convertTimestampDefaults: true,
        ...options
      };

      let sql = input;
      sql = sql.replace(/\r\n/g, "\n");

      // 1) Convert double-quoted identifiers to backticks (if requested)
      if (opts.convertQuotes) {
        // Beware of quoted string literals using double quotes: SQL uses single quotes for literals, so this is usually safe
        sql = sql.replace(/"([^"]+)"/g, (_m, p1) => {
          // Leave if looks like a function or type (rough heuristic) - but we keep simple approach
          return `\`${p1}\``;
        });
      }

      // 2) Convert SERIAL / BIGSERIAL to INT AUTO_INCREMENT / BIGINT AUTO_INCREMENT
      if (opts.convertSerial) {
        sql = sql.replace(/\bBIGSERIAL\b/gi, "BIGINT AUTO_INCREMENT");
        sql = sql.replace(/\bSERIAL\b/gi, "INT AUTO_INCREMENT");
      }

      // 3) Convert BOOLEAN -> TINYINT(1)
      if (opts.convertBoolean) {
        // convert column types
        sql = sql.replace(/\bBOOLEAN\b/gi, "TINYINT(1)");
        // convert literal TRUE/FALSE to 1/0 only in INSERT VALUES (best-effort)
        sql = sql.replace(/\bTRUE\b/gi, "1");
        sql = sql.replace(/\bFALSE\b/gi, "0");
      }

      // 4) Convert PostgreSQL-specific DEFAULT nextval('...') sequences to AUTO_INCREMENT
      // This is complicated; we will remove default nextval(...) and leave to SERIAL handling above.
      sql = sql.replace(/\bDEFAULT\s+nextval\([^)]*\)\s*/gi, "");

      // 5) Convert boolean casts like ::boolean - remove cast (MySQL doesn't support ::type)
      sql = sql.replace(/::\s*\w+/g, "");

      // 6) Convert double-dollar quoted function bodies or dollar-quoted strings to single-quoted where appropriate - skip complex cases.
      // 7) Convert PostgreSQL-specific type names that MySQL differs: TEXT -> TEXT (OK), BYTEA -> BLOB
      sql = sql.replace(/\bbytea\b/gi, "BLOB");

      // 8) Convert timestamp with time zone -> DATETIME (best-effort)
      sql = sql.replace(/\btimestamp with(out)? time zone\b/gi, "DATETIME");

      // 9) Adjust DEFAULT CURRENT_TIMESTAMP handling (MySQL accepts DEFAULT CURRENT_TIMESTAMP)
      if (opts.convertTimestampDefaults) {
        // leave DEFAULT CURRENT_TIMESTAMP as-is; MySQL supports it but ON UPDATE syntax differs
        // Remove PostgreSQL column-level GENERATED ALWAYS AS IDENTITY (leave to manual)
        sql = sql.replace(/\bGENERATED ALWAYS AS IDENTITY\b/gi, "");
      }

      // 10) Optionally append ENGINE=InnoDB to CREATE TABLE ends
      if (opts.addEngine) {
        sql = sql.replace(/\)\s*;/g, ") ENGINE=InnoDB;");
        // If multiple replacements overdo it, make sure we don't duplicate
        sql = sql.replace(/ENGINE=InnoDB;\s*ENGINE=InnoDB;/g, "ENGINE=InnoDB;");
      }

      // 11) Clean up sequences or schema-specific types references (best-effort)
      sql = sql.replace(/\bschema\.\w+/gi, m => m.replace(/\./g, "_")); // basic flattening of schema.table -> schema_table

      // 12) Remove Postgres-specific "USING" clauses in indexes (best-effort)
      sql = sql.replace(/\sUSING\s+\w+\b/gi, "");

      // Keep result tidy
      sql = sql.replace(/[ \t]+/g, " ");
      sql = sql.replace(/\s+;\s+/g, ";\n");

      return sql;
    }
  }
};
