export const byteUtils = {
  stringToBytes(str) {
    return new TextEncoder().encode(str);
  },

  bytesToString(bytes) {
    return new TextDecoder().decode(bytes);
  },

  bytesToBinary(bytes) {
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return binary;
  },

  binaryToBytes(binary) {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  },

  bytesToBase64(bytes) {
    let binary = "";
    const chunkSize = 0x8000; // 32KB chunks to avoid stack overflow

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }
};
