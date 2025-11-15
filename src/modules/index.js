export const modules = [
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
    id: "reverse",
    name: "Reverse Text",
    category: "Text",

    options: {},

    run(input) {
      return input.split("").reverse().join("");
    }
  },
  {
    id: "uppercase",
    name: "Uppercase",
    category: "Text",
    options: {},
    run(input) {
      return input.toUpperCase();
    }
  },
  {
    id: "lowercase",
    name: "Lowercase",
    category: "Text",
    options: {},
    run(input) {
      return input.toLowerCase();
    }
  }
];
