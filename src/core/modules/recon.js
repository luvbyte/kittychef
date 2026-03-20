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
          ? `https://ipapi.co/${ip}/json/`
          : `https://ipapi.co/json/`;

        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json"
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        if (data.error) {
          throw new Error(data.reason || "Failed to fetch IP details");
        }

        // Return full JSON if requested
        if (json) {
          return JSON.stringify(data, null);
        }

        // Pretty output
        return `
🌐 IP Details
━━━━━━━━━━━━━━
IP Address : ${data.ip}
Version    : ${data.version}

🌍 Geography
━━━━━━━━━━━━━━
Country    : ${data.country_name} (${data.country_code})
Region     : ${data.region}
City       : ${data.city}
Postal     : ${data.postal}
Continent  : ${data.continent_code}

📍 Coordinates
━━━━━━━━━━━━━━
Latitude   : ${data.latitude}
Longitude  : ${data.longitude}

🕒 Timezone
━━━━━━━━━━━━━━
Timezone   : ${data.timezone}
UTC Offset : ${data.utc_offset}

💰 Currency
━━━━━━━━━━━━━━
Currency   : ${data.currency} (${data.currency_name})

📞 Extra
━━━━━━━━━━━━━━
Calling Code : ${data.country_calling_code}
Languages    : ${data.languages}

🏢 Network
━━━━━━━━━━━━━━
ISP / Org  : ${data.org}
ASN        : ${data.asn}
`.trim();
      } catch (err) {
        console.error("IP Fetch Error:", err);
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
