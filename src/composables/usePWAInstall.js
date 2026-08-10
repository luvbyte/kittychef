import { ref } from "vue";

const deferredPrompt = ref(null);
const isInstallable = ref(false);

// Listen for the event only once
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt.value = e;
  isInstallable.value = true;
});

export function usePWAInstall() {
  async function installPWA() {
    if (!deferredPrompt.value) {
      alert("PWA install not available yet.");
      return;
    }

    // Show the native install prompt
    deferredPrompt.value.prompt();

    // Wait for user action
    const choice = await deferredPrompt.value.userChoice;

    if (choice.outcome === "accepted") {
      if ("Toast" in window) {
        new Toast("Installed Successfully").show();
      }
    }

    // Reset so it doesn't show twice
    deferredPrompt.value = null;
    isInstallable.value = false;
  }

  return {
    installPWA,
    isInstallable
  };
}
