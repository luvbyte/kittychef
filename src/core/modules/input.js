// Input

export default {
  readFile: {
    id: "readFile",
    name: "Read File",
    category: "Input",
    description: "Reads file(s) and outputs as byte array.",

    inputType: "byteArray",
    outputType: "byteArray",

    options: {
      files: {
        type: "file",
        label: "Select Files",
        multiple: true
      },
      concat: {
        type: "checkbox",
        label: "Append to input",
        default: false
      }
    },

    async run(input, { files, concat }) {
      if (!files || files.length === 0) {
        throw new Error("No files selected");
      }

      const buffers = await Promise.all(
        Array.from(files).map(f => f.arrayBuffer())
      );

      // Merge selected files
      const totalFileLength = buffers.reduce((sum, b) => sum + b.byteLength, 0);
      const fileBytes = new Uint8Array(totalFileLength);

      let offset = 0;
      for (const buf of buffers) {
        fileBytes.set(new Uint8Array(buf), offset);
        offset += buf.byteLength;
      }

      // If concat enabled and input exists
      if (concat && input instanceof Uint8Array) {
        const result = new Uint8Array(input.length + fileBytes.length);

        result.set(input, 0);
        result.set(fileBytes, input.length);

        return result;
      }

      // Default: just return file data
      return fileBytes;
    }
  }
};
