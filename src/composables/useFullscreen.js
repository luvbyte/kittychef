import { ref, onMounted, onUnmounted } from 'vue'

export function useFullscreen(targetRef = null) {
  const isFullscreen = ref(false)

  const getFullscreenElement = () =>
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement

  const enter = async () => {
    const el = targetRef?.value || document.documentElement

    if (el.requestFullscreen) await el.requestFullscreen()
    else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen()
    else if (el.mozRequestFullScreen) await el.mozRequestFullScreen()
    else if (el.msRequestFullscreen) await el.msRequestFullscreen()
  }

  const exit = async () => {
    if (document.exitFullscreen) await document.exitFullscreen()
    else if (document.webkitExitFullscreen) await document.webkitExitFullscreen()
    else if (document.mozCancelFullScreen) await document.mozCancelFullScreen()
    else if (document.msExitFullscreen) await document.msExitFullscreen()
  }

  const toggle = async () => {
    if (getFullscreenElement()) {
      await exit()
    } else {
      await enter()
    }
  }

  const update = () => {
    isFullscreen.value = !!getFullscreenElement()
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', update)
    document.addEventListener('webkitfullscreenchange', update)
    document.addEventListener('mozfullscreenchange', update)
    document.addEventListener('MSFullscreenChange', update)
    update()
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', update)
    document.removeEventListener('webkitfullscreenchange', update)
    document.removeEventListener('mozfullscreenchange', update)
    document.removeEventListener('MSFullscreenChange', update)
  })

  return {
    isFullscreen,
    enter,
    exit,
    toggle,
  }
}