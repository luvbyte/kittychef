<script setup lang="ts">
  import { usePWAInstall } from "@/composables/usePWAInstall";

  const { installPWA, isInstallable } = usePWAInstall();
</script>

<template>
  <div class="h-full w-full flex flex-col p-3 font-heading">
    <div class="flex-1 flex flex-col gap-3">
      <!-- Top -->
      <div class="w-full flex flex-col justify-center items-center">
        <div>
          <!-- Cat Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
          >
            <g fill="none">
              <path
                fill="currentColor"
                d="m19.98 9.063l.75.002v-.002zm-15.96 0h-.75v.002zM19.1 10.66l-.573.485l.084.1l.114.065zm-.272-1.265a.75.75 0 0 0-.888 1.21zM4.02 15h-.75zm2.04-4.395a.75.75 0 1 0-.888-1.21zM12 5.656c-.772 0-1.21.041-1.556.084c-.34.042-.512.072-.838.072v1.5c.44 0 .725-.047 1.02-.083c.29-.036.666-.073 1.374-.073zm0 1.5c.708 0 1.085.037 1.373.073c.296.036.58.083 1.021.083v-1.5c-.326 0-.498-.03-.838-.072A12 12 0 0 0 12 5.656zm2.394.157c.213 0 .412-.061.555-.114c.156-.058.317-.134.472-.214c.305-.157.659-.367.983-.554c.34-.195.66-.373.947-.503c.308-.14.484-.178.554-.178v-1.5c-.408 0-.83.157-1.171.31a13 13 0 0 0-1.078.571c-.354.204-.658.385-.922.52q-.194.1-.306.141c-.087.032-.087.02-.034.02zm3.511-1.563c.345 0 .675.103.907.303c.212.182.418.51.418 1.135h1.5c0-1-.352-1.766-.939-2.272c-.566-.487-1.272-.666-1.886-.666zm1.325 1.438v1.875h1.5V7.188zM9.606 5.813c.053 0 .053.011-.034-.02a3 3 0 0 1-.306-.141c-.264-.136-.568-.317-.922-.52c-.34-.196-.716-.408-1.078-.571c-.34-.154-.763-.311-1.171-.311v1.5c.07 0 .246.039.554.178c.287.13.608.308.947.503c.324.187.678.397.983.554c.155.08.316.156.472.214c.143.053.342.114.555.114zM6.095 4.25c-.614 0-1.32.179-1.886.666c-.587.505-.939 1.272-.939 2.271h1.5c0-.625.206-.952.418-1.134c.232-.2.563-.303.907-.303zM3.27 7.188v1.875h1.5V7.187zM12 20.75c1.431 0 3.54-.285 5.32-1.104c1.784-.82 3.41-2.273 3.41-4.646h-1.5c0 1.533-1.007 2.58-2.536 3.284s-3.412.966-4.694.966zm7.672-10.574a5 5 0 0 0-.844-.78l-.888 1.208q.358.267.587.54zM19.23 9.06c0 .198-.041.61-.138.895c-.055.159-.086.155-.03.11a.42.42 0 0 1 .412-.055l-.749 1.3c.18.104.402.18.65.167c.255-.013.466-.114.626-.242c.287-.23.432-.566.51-.796c.168-.491.218-1.08.22-1.374zM12 19.25c-1.282 0-3.163-.262-4.694-.966C5.776 17.58 4.77 16.533 4.77 15h-1.5c0 2.373 1.626 3.826 3.41 4.646c1.78.82 3.889 1.104 5.32 1.104zM4.77 15c0-.788-.057-1.437.019-2.128c.07-.645.253-1.218.684-1.727l-1.145-.97c-.68.805-.938 1.693-1.03 2.534c-.087.797-.028 1.66-.028 2.291zm.703-3.855a3.4 3.4 0 0 1 .587-.54l-.888-1.21q-.493.364-.844.78zM3.27 9.065c.001.294.051.883.219 1.374c.078.23.223.566.51.796c.16.128.371.229.625.242c.249.012.47-.063.651-.167l-.749-1.3a.42.42 0 0 1 .411.055c.057.045.026.049-.029-.11a3.3 3.3 0 0 1-.138-.895z"
              />
              <path
                stroke="currentColor"
                stroke-width="1.5"
                d="M12.826 16c0 .173-.361.313-.806.313s-.807-.14-.807-.313s.361-.312.807-.312c.445 0 .806.14.806.312Zm2.674-2.406c0 .431-.217.781-.484.781s-.484-.35-.484-.781s.217-.781.484-.781s.484.35.484.78Zm-6 0c0 .431-.217.781-.484.781s-.484-.35-.484-.781s.217-.781.484-.781s.484.35.484.78Z"
              />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.5"
                d="M22 15.469c-.483-.313-2.58-1.094-3.387-1.094m1.774 3.594c-.484-.313-1.613-1.094-2.42-1.094M2 15.469c.484-.313 2.58-1.094 3.387-1.094m-1.774 3.594c.484-.313 1.613-1.094 2.42-1.094"
              />
            </g>
          </svg>
        </div>
        <div class="mb-3">{{ $t("app.title") }} - 0.0.6</div>
      </div>
      <!-- PWA Install button -->
      <div
        @click="installPWA"
        v-if="isInstallable"
        class="flex justify-between bg-primary/50 rounded-lg shadow-primary/50 p-2 gap-2"
      >
        Install App
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M4 16h4v4H4V16z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin=".2"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M10 16h4v4h-4V16z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin=".4"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M16 16h4v4h-4V16z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin=".6"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M4 10h4v4H4V10z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin=".8"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M10 10h4v4h-4V10z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin="1"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M16 10h4v4h-4V10z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin="1.2"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M4 4h4v4H4V4z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin="1.4"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M10 4h4v4h-4V4z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin="1.6"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
            <path fill="currentColor" d="M16 4h4v4h-4V4z" class="st0">
              <animate
                fill="remove"
                accumulate="none"
                additive="replace"
                attributeName="opacity"
                begin="1.8"
                calcMode="linear"
                dur="3s"
                keyTimes="0;0.9;1"
                repeatCount="indefinite"
                restart="always"
                values="1;0;0"
              />
            </path>
          </svg>
        </span>
      </div>

      <!-- Languages select box -->
      <div class="flex flex-col rounded-lg p-2 gap-2">
        <div class="text-base-content/60">{{ $t("sidebar.language") }}</div>
        <select
          v-model="$i18n.locale"
          class="select outline-none select-sm bg-transparent"
        >
          <option value="en">🇬🇧 English</option>
          <option value="hi">🇮🇳 हिन्दी</option>
          <option value="te">🇮🇳 తెలుగు</option>
          <option value="ru">🇷🇺 Русский</option>
          <option value="hy">🇦🇲 Հայերեն</option>
          <option value="es">🇪🇸 Español</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="zh">🇨🇳 中文</option>
        </select>
      </div>

      <!-- Social -->
      <div class="flex flex-col rounded-lg p-2">
        <div class="text-base-content/60 mb-3">SOCIAL</div>

        <a
          href="https://instagram.com/4b_49_4b_4b_55"
          target="_blank"
          class="flex justify-between items-center no-underline"
        >
          <div>Instagram</div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
                />
                <path
                  d="M3 16V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m17.5 6.51l.01-.011"
                />
              </g>
            </svg>
          </div>
        </a>
        <div class="divider m-0"></div>
        <a
          href="https://github.com/luvbyte"
          target="_blank"
          class="flex justify-between items-center no-underline"
        >
          <div>Github</div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
              />
            </svg>
          </div>
        </a>
        <div class="divider m-0"></div>
        <a
          href="https://kikku.vercel.app"
          target="_blank"
          class="flex justify-between items-center no-underline"
        >
          <div>Portfolio</div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <g fill="none" stroke="currentColor" stroke-width="3">
                <path
                  stroke-linejoin="round"
                  d="M3.539 39.743c.208 2.555 2.163 4.51 4.718 4.718C11.485 44.723 16.636 45 24 45s12.515-.277 15.743-.539c2.555-.208 4.51-2.163 4.718-4.718C44.723 36.515 45 31.364 45 24s-.277-12.515-.539-15.743c-.208-2.555-2.163-4.51-4.718-4.718C36.515 3.277 31.364 3 24 3s-12.515.277-15.743.539c-2.555.208-4.51 2.163-4.718 4.718C3.277 11.485 3 16.636 3 24s.277 12.515.539 15.743Z"
                />
                <path stroke-linecap="round" d="M3.5 13.5h41" />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10 8.5h2m6 0h2"
                />
              </g>
            </svg>
          </div>
        </a>
      </div>
      <!-- Support -->
      <div class="flex flex-col rounded-lg p-2">
        <div class="text-base-content/60 mb-3">SUPPORT</div>
        <a
          href="/terms.html"
          target="_blank"
          class="flex justify-between items-center no-underline"
        >
          <div>Terms of use</div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M4 4a2 2 0 0 1 2-2h8a1 1 0 0 1 .707.293l5 5A1 1 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm13.586 4L14 4.414V8zM12 4H6v16h12V10h-5a1 1 0 0 1-1-1zm-4 9a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"
              />
            </svg>
          </div>
        </a>
        <div class="divider m-0"></div>
        <a
          href="/privacy.html"
          target="_blank"
          class="flex justify-between items-center no-underline"
        >
          <div>Privacy policy</div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 17a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m6 3V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
              />
            </svg>
          </div>
        </a>
        <div class="divider m-0"></div>
        <a
          href="mailto:lovemelong@protonmail.com"
          class="flex justify-between items-center no-underline"
        >
          <div>Contact</div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"
              />
            </svg>
          </div>
        </a>
      </div>
    </div>

    <!-- Footer -->

    <div class="w-full flex justify-center items-center">
      <pre class="text-sm opacity-80">
 /)/)        KIKKU
(⌯'.')      💕
(>ᡕᠵ᠊ᡃ࡚ࠢ࠘ ⸝່ࠡࠣ᠊߯᠆ࠣ࠘ᡁࠣ࠘᠊᠊ࠢ࠘𐡏💕
/   \  Created By
      </pre>
    </div>
  </div>
</template>
