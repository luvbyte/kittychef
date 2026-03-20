const decoder = new TextDecoder();
const encoder = new TextEncoder();

export default {
  dataToString: {
    id: "dataToString",
    name: "Data → String",
    category: "Data",
    description: "Converts byteArray to string.",

    inputType: "byteArray",
    outputType: "string",

    run(input) {
      return decoder.decode(input);
    }
  },
  dataToNumber: {
    id: "dataToNumber",
    name: "Data → Number",
    category: "Data",
    description: "Converts byteArray to number.",

    inputType: "byteArray",
    outputType: "number",

    run(input) {
      const str = decoder.decode(input);
      return Number(str);
    }
  },
  dataToBoolean: {
    id: "dataToBoolean",
    name: "Data → Boolean",
    category: "Data",
    description: "Converts byteArray to boolean.",

    inputType: "byteArray",
    outputType: "boolean",

    run(input) {
      const str = decoder.decode(input);
      return str === "true";
    }
  },
  dataToObject: {
    id: "dataToObject",
    name: "Data → Object",
    category: "Data",
    description: "Converts byteArray (JSON) to object.",

    inputType: "byteArray",
    outputType: "object",

    run(input) {
      const str = decoder.decode(input);
      return JSON.parse(str);
    }
  },
  dataToArray: {
    id: "dataToArray",
    name: "Data → Array",
    category: "Data",
    description: "Converts byteArray (JSON) to array.",

    inputType: "byteArray",
    outputType: "array",

    run(input) {
      const str = decoder.decode(input);
      return JSON.parse(str);
    }
  },
  dataToByteArray: {
    id: "dataToByteArray",
    name: "Data → ByteArray",
    category: "Data",
    description: "Returns the same byteArray.",

    inputType: "byteArray",
    outputType: "byteArray",

    run(input) {
      return input;
    }
  }
};
