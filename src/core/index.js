const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const dataConversions = {
  string: {
    byteArray: v => encoder.encode(v),
    number: v => Number(v),
    boolean: v => v === "true",
    object: v => JSON.parse(v),
    array: v => JSON.parse(v)
  },

  number: {
    string: v => String(v),
    byteArray: v => encoder.encode(String(v)),
    boolean: v => Boolean(v),
    array: v => [v],
    object: v => ({ value: v })
  },

  boolean: {
    string: v => String(v),
    number: v => (v ? 1 : 0),
    byteArray: v => new Uint8Array([v ? 1 : 0]),
    array: v => [v],
    object: v => ({ value: v })
  },

  object: {
    string: v => JSON.stringify(v),
    byteArray: v => encoder.encode(JSON.stringify(v)),
    array: v => Object.entries(v)
  },

  array: {
    string: v => JSON.stringify(v),
    byteArray: v => encoder.encode(JSON.stringify(v)),
    object: v => Object.fromEntries(v),
    number: v => v.length,
    boolean: v => v.length > 0
  },

  byteArray: {
    string: v => decoder.decode(v),
    number: v => Number(decoder.decode(v)),
    boolean: v => Boolean(v[0]),
    object: v => JSON.parse(decoder.decode(v)),
    array: v => Array.from(v)
  }
};

// TODO: Add strict chceking of dataType
export class Data {
  // Starting type
  constructor(input, inputType) {
    this._cache = {
      [inputType]: input
    };
  }
  // Calls on every module 'run return data'
  // outputType -> dataType
  setData(data, dataType) {
    this._cache = {
      [dataType]: data
    };
  }

  // Calls on every module 'run'
  // inputType -> targetType
  // auto converts data type from previous to
  // targetType
  getData(targetType) {
    // Already cached
    if (targetType in this._cache) {
      return this._cache[targetType];
    }

    const [fromType] = Object.keys(this._cache);
    const value = this._cache[fromType];

    const converter = dataConversions?.[fromType]?.[targetType];
    if (!converter) {
      throw new Error(
        `Cannot convert data from "${fromType}" to "${targetType}"`
      );
    }

    let converted;
    try {
      converted = converter(value);
    } catch (err) {
      throw new Error(
        `Failed converting from "${fromType}" to "${targetType}": ${err.message}`
      );
    }

    this._cache[targetType] = converted;
    return converted;
  }
}
