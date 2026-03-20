export default {
  ip_details_finder: {
    id: "ip_details_finder",
    name: "IP Details Finder",
    category: "Recon",

    description: "Fetches IP geolocation and ISP details using ip-api.com",

    inputType: "string", // optional IP string
    outputType: "string",

    options: {
      json: {
        type: "checkbox",
        label: "Json type",
        default: false
      }
    },

    async run(input, { json }) {
      try {
        const ip = input?.trim();

        const url = ip
          ? `http://ip-api.com/json/${ip}`
          : `http://ip-api.com/json`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status !== "success") {
          throw new Error(data.message || "Failed to fetch IP details");
        }

        const result = {
          ip: data.query,
          country: data.country,
          region: data.regionName,
          city: data.city,
          zip: data.zip,
          lat: data.lat,
          lon: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          org: data.org,
          as: data.as
        };

        // Return JSON if requested
        if (json) {
          return JSON.stringify(result);
        }

        // Else return nicely formatted text
        return `

🌐 IP Details
━━━━━━━━━━━━━━
IP Address : ${result.ip}
Country    : ${result.country}
Region     : ${result.region}
City       : ${result.city}
ZIP Code   : ${result.zip}

📍 Location
━━━━━━━━━━━━━━
Latitude   : ${result.lat}
Longitude  : ${result.lon}
Timezone   : ${result.timezone}

🏢 Network
━━━━━━━━━━━━━━
ISP        : ${result.isp}
Org        : ${result.org}
ASN        : ${result.as}
`.trim();
      } catch (err) {
        throw new Error(`IP Details Finder Error: ${err.message}`);
      }
    }
  },
  js_recon_extract: {
    id: "js_recon_extract",
    name: "JS Recon Extractor",
    category: "Recon",
    description: "Extracts endpoints, domains and secrets from JavaScript.",
    inputType: "string",
    outputType: "string",

    async run(input) {
      const code = input;
      if (!code || !code.trim()) return "No input provided.";

      const findings = {};

      function addResult(key, values) {
        if (values.length > 0) {
          findings[key] = [...new Set(values)];
        }
      }

      // Domains
      addResult(
        "Domains",
        [
          ...code.matchAll(
            /['"](?:https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,10})/g
          )
        ].map(m => m[1])
      );

      // Full URLs
      addResult("Full URLs", code.match(/https?:\/\/[^\s"'<>]+/g) || []);

      // API Routes
      addResult(
        "API Routes",
        [
          ...code.matchAll(/['"](\/[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*)['"]/g)
        ].map(m => m[1])
      );

      // Secrets
      addResult(
        "Secrets",
        [
          ...code.matchAll(
            /(?:api[_-]?key|token|secret|password)['"]?\s*[:=]\s*['"]?([a-zA-Z0-9\-_+/=]{10,})/gi
          )
        ].map(m => m[1])
      );

      // AWS Keys
      addResult("AWS Keys", code.match(/AKIA[0-9A-Z]{16}/g) || []);

      if (Object.keys(findings).length === 0) {
        return "No endpoints or secrets found.";
      }

      // Convert everything into formatted STRING
      let output = "=== JS RECON RESULTS ===\n\n";

      for (const section in findings) {
        output += `--- ${section} (${findings[section].length}) ---\n`;
        findings[section].forEach(item => {
          output += item + "\n";
        });
        output += "\n";
      }

      return output.trim();
    }
  }
};
