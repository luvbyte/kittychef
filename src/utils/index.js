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
