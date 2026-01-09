// Auto-load and validate all modules in this folder

const modules = {};

// Import all .js files in this directory (except index.js)
const files = import.meta.glob("./*.js", { eager: true });

for (const path in files) {
  // Skip self
  if (path.endsWith("/index.js")) continue;

  const file = files[path];
  const exported = file?.default;

  if (!exported || typeof exported !== "object") {
    throw new Error(`Module file "${path}" must have a default export object`);
  }

  for (const [key, mod] of Object.entries(exported)) {
    // ---------- VALIDATIONS ----------

    if (!mod || typeof mod !== "object") {
      throw new Error(`Module "${key}" in "${path}" is not an object`);
    }

    if (!mod.id) {
      throw new Error(`Module "${key}" in "${path}" is missing "id"`);
    }

    if (mod.id !== key) {
      throw new Error(
        `Module key/id mismatch in "${path}": key="${key}" id="${mod.id}"`
      );
    }

    if (!mod.name) {
      throw new Error(`Module "${key}" is missing "name"`);
    }

    if (!mod.category) {
      throw new Error(`Module "${key}" is missing "category"`);
    }

    if (!mod.inputType) {
      throw new Error(`Module "${key}" is missing "inputType"`);
    }

    if (!mod.outputType) {
      throw new Error(`Module "${key}" is missing "outputType"`);
    }

    if (typeof mod.run !== "function") {
      throw new Error(`Module "${key}" is missing a run() function`);
    }

    if (modules[key]) {
      throw new Error(`Duplicate module id detected: "${key}"`);
    }

    // ---------- REGISTER ----------

    modules[key] = mod;
  }
}

export default modules;
