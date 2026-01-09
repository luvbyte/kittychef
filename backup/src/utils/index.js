export function toBytes(text, encoding = "utf-8") {
  return new TextEncoder(encoding).encode(text);
}

export function toText(bytes, encoding = "utf-8") {
  return new TextDecoder(encoding, { fatal: false }).decode(bytes);
}

export function bytesToHex(bytes) {
  return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex) {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex");
  return new Uint8Array(hex.match(/../g).map(h => parseInt(h, 16)));
}

//
export function copyText(text) {
  navigator.clipboard.writeText(text);
}

export async function pasteText() {
  return await navigator.clipboard.readText();
}

export function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000; // 32KB chunks to avoid stack overflow

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function toggleFullScreen() {
  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    const docEl = document.documentElement;

    if (docEl.requestFullscreen) {
      docEl.requestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      // Firefox
      docEl.mozRequestFullScreen();
    } else if (docEl.webkitRequestFullscreen) {
      // Chrome, Safari, Opera
      docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      // IE/Edge
      docEl.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}
