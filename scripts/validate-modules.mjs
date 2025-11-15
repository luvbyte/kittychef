import {modules} from "../src/modules/index.js";

function validateModules(modList) {
  const seen = new Set();
  const duplicates = [];

  for (const m of modList) {
    if (seen.has(m.id)) {
      duplicates.push(m.id);
    }
    seen.add(m.id);
  }

  if (duplicates.length > 0) {
    console.error("❌ Duplicate module IDs found:");
    duplicates.forEach(d => console.error(" - " + d));
    process.exit(1); // VERY IMPORTANT → fail script
  }

  console.log("✔ All module IDs are unique.");
}

validateModules(modules);
