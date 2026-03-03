export default {
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
