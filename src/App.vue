<script setup>
import { ref, watch } from "vue";

import Insight from "@/components/Insight.vue";
import Sidebar from "@/components/Sidebar.vue";
import Emoticon from "@/components/Emoticon.vue";
import RecepieBox from "@/components/RecepieBox.vue";
import TextAreaUtils from "@/components/TextAreaUtils.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import RecepieOptions from "@/components/RecepieOptions.vue";
import RecepiePipelineTree from "@/components/RecepiePipelineTree.vue";

import { modules } from "@/modules";

const showRecepieBox = ref(false);
const showThemeSwitcher = ref(false);
const showRecepiePipelineTree = ref(false);

const showSideBar = ref(false);

const liveUpdate = ref(true);

const inputBox = ref("");
const outputBox = ref("");

const recepiePipeline = ref([]);
const selectedModule = ref(null);
const selectedModuleIndex = ref(null);

// Live Update
let stopWatcher = null;

watch(
  () => liveUpdate.value,
  enabled => {
    // stop old watcher if exists
    if (stopWatcher) {
      stopWatcher();
      stopWatcher = null;
    }

    // create new watcher if enabled
    if (enabled) {
      stopWatcher = watch([inputBox, recepiePipeline], compilePipeline, {
        deep: true
      });
    }
  },
  { immediate: true }
);

function showRecepieOptions(m) {
  const idx = recepiePipeline.value.indexOf(m);
  selectedModuleIndex.value = idx;
  selectedModule.value = recepiePipeline.value[idx];
}

function groupModulesByCategory(modsObj) {
  const groups = {};

  for (const id in modsObj) {
    const mod = modsObj[id];
    if (!groups[mod.category]) {
      groups[mod.category] = [];
    }
    groups[mod.category].push(mod);
  }

  return groups;
}

// clone module object
function cloneModule(m) {
  const clone = { ...m }; // keeps run()

  clone.options = {};

  for (const key in m.options) {
    const opt = m.options[key];

    clone.options[key] = {
      ...opt,
      value: opt.default ?? ""
    };
  }

  return clone;
}

// static grouped
const grouped = groupModulesByCategory(modules);

function selectModule(m) {
  recepiePipeline.value.push(cloneModule(m));
}

// clear pipeline
function clearPipeline() {
  recepiePipeline.value.length = 0;
  selectModule.value = null;
}
// clear both text boxea
function clearTextBoxes() {
  inputBox.value = "";
  outputBox.value = "";
}
// copy output box text
function copyOutputBox() {
  navigator.clipboard.writeText(outputBox.value);
}
// swap both input boxes
function swapTextBox() {
  [inputBox.value, outputBox.value] = [outputBox.value, inputBox.value];
}

function toggleLiveUpdate() {
  liveUpdate.value = !liveUpdate.value;
  compilePipeline();
}

// Start Compile pipeline and display in output box
function compilePipeline() {
  let result = Promise.resolve(inputBox.value);

  for (const mod of recepiePipeline.value) {
    const options = {};

    for (const key in mod.options) {
      options[key] = mod.options[key].value;
    }

    // chain sync or async module
    result = result
      .then(r => mod.run(r, options)) // handles sync + async safely
      .catch(err => {
        return "Error in module " + mod.name + ": " + err;
      });
  }

  // output
  result.then(final => {
    outputBox.value = final;
  });
}
</script>

<template>
  <div id="main" data-theme="light" class="h-dvh flex flex-col overflow-hidden">
    <!-- Header -->
    <div
      class="relative bg-primary/20 text-primary p-2 py-3 flex justify-between items-center shadow-lg"
    >
      <button @click="showSideBar = true" class="flex items-center gap-1 hover:cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 8h22M5 16h22M5 24h22"
          />
        </svg>
        <!-- cat icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
        <h1 class="font-bold">{{ $t("app.title") }}</h1>
      </button>
      <div class="flex gap-1 items-center">
        <button
          class="flex items-center gap-1 hover:cursor-pointer"
          @click="showThemeSwitcher = !showThemeSwitcher"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m3.975 19.8l-.85-.35q-.775-.325-1.037-1.125t.087-1.575l1.8-3.9zm4 2.2q-.825 0-1.412-.587T5.975 20v-6l2.65 7.35q.075.175.15.338t.2.312zm5.15-.1q-.8.3-1.55-.075t-1.05-1.175l-4.45-12.2q-.3-.8.05-1.562t1.15-1.038l7.55-2.75q.8-.3 1.55.075t1.05 1.175l4.45 12.2q.3.8-.05 1.563t-1.15 1.037zM10.975 10q.425 0 .713-.288T11.975 9t-.287-.712T10.975 8t-.712.288T9.975 9t.288.713t.712.287m1.45 10l7.55-2.75L15.525 5l-7.55 2.75zM7.975 7.75L15.525 5z"
            />
          </svg>

          <span class="hidden sm:block">{{ $t("btn.theme") }}</span>
        </button>
      </div>

      <!-- Theme switcher -->
      <Transition name="slide-left">
        <div
          v-show="showThemeSwitcher"
          class="absolute top-13 right-0 w-3/4 sm:w-1/3 max-h-[50svh] overflow-y-auto"
        >
          <ThemeSwitcher />
        </div>
      </Transition>
    </div>

    <!-- Main Layout -->
    <div class="flex-1 flex flex-col">
      <div class="p-1 py-2">
        <TextAreaUtils v-model:text="inputBox" />
      </div>
      <!-- Input -->
      <div class="flex-1 flex flex-col">
        <textarea
          id="textarea-ref"
          v-model="inputBox"
          spellcheck="off"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          inputmode="text"
          class="flex-1 resize-none px-1 bg-base-100/20 text-base-content/60 focus:outline-none"
        ></textarea>
        <!-- Quick Insight -->
        <div class="p-1 bg-base-300 flex gap-2 text-xs text-base-content/70">
          <Insight :text="inputBox" showLines showBytes />
        </div>
      </div>

      <!-- Middle Bar -->
      <div class="min-h-18 flex border-b border-primary/60">
        <!-- left part -->
        <div class="flex flex-col h-full min-w-10 sm:min-w-32">
          <!-- live update button -->
          <button
            class="h-1/2 w-full flex items-center justify-center transition gap-1 text-secondary-content hover:cursor-pointer"
            :class="liveUpdate ? 'bg-secondary/80' : 'bg-secondary/60'"
            @click="toggleLiveUpdate"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 14 14"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M7.009 1.75q-.78 0-1.443.117A.625.625 0 1 1 5.352.636A9.7 9.7 0 0 1 7.009.5c2.053 0 3.746.56 4.928 1.703C13.122 3.35 13.707 5 13.707 7c0 1.133-.188 2.152-.565 3.032l.523.275a.625.625 0 0 1 .129 1.017c-.694.628-1.534.867-2.46.708a.63.63 0 0 1-.344-.181c-.652-.675-.909-1.502-.74-2.42a.625.625 0 0 1 .905-.441l.875.46c.277-.683.426-1.497.426-2.45c0-1.76-.508-3.047-1.388-3.898c-.883-.854-2.226-1.352-4.06-1.352m-6.803.933c.692-.627 1.53-.865 2.455-.707a.63.63 0 0 1 .344.182c.65.672.906 1.498.738 2.415a.625.625 0 0 1-.905.44l-.856-.449c-.273.68-.42 1.49-.42 2.436c0 1.76.508 3.047 1.388 3.898c.883.854 2.225 1.352 4.059 1.352q.819 0 1.51-.129a.625.625 0 1 1 .226 1.23q-.816.15-1.736.15c-2.053 0-3.746-.56-4.928-1.704C.896 10.65.31 9 .31 7c0-1.127.186-2.142.56-3.019l-.536-.28a.625.625 0 0 1-.13-1.018M7.015 3.74c.386-.343.964-.05.964.441v2.104h1.193c.476 0 .765.537.482.931c-.804 1.12-1.632 2.124-2.668 3.044c-.385.343-.963.051-.963-.44V7.714H4.829a.589.589 0 0 1-.482-.93C5.151 5.664 5.98 4.66 7.015 3.74"
                clip-rule="evenodd"
              />
            </svg>
            <span class="hidden sm:block">{{ $t("btn.live") }}</span>
          </button>
          <!-- Recepie tree button -->
          <button
            class="h-1/2 w-full flex items-center bg-primary/80 text-primary-content justify-center gap-2 hover:cursor-pointer"
          >
            <div
              class="flex gap-1 items-center"
              @click="showRecepiePipelineTree = true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  d="M4 1h6v6H4zm12 10h4v4h-4zm0 8h4v4h-4zM7 7v14h9m-9-8h9"
                />
              </svg>
              <span class="hidden sm:block">{{ $t("btn.recepies") }}</span>
            </div>
          </button>
        </div>
        <!-- right part -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- right top part -->
          <div
            class="h-1/2 w-full bg-secondary/60 text-secondary-content/80 flex justify-between items-center"
          >
            <!-- remaining (emoticon) -->
            <div class="flex-1">
              <Emoticon />
            </div>

            <div class="h-full flex items-center">
              <!-- swap button -->
              <button
                @click="swapTextBox"
                class="h-full px-2 bg-info/40 text-info-content active:bg-info flex items-center justify-center gap-1 hover:cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M17.707 20.707a1 1 0 0 1-1.414 0l-4-4A1 1 0 0 1 13 15h3V4a1 1 0 1 1 2 0v11h3a1 1 0 0 1 .707 1.707zm-10-17.414a1 1 0 0 0-1.414 0l-4 4A1 1 0 0 0 3 9h3v11a1 1 0 1 0 2 0V9h3a1 1 0 0 0 .707-1.707z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="hidden sm:block">{{ $t("btn.swap") }}</span>
              </button>
              <!-- copy output text area button -->
              <button
                @click="copyOutputBox"
                class="h-full px-2 bg-info/60 text-info-content active:bg-info flex items-center justify-center gap-1 hover:cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                >
                  <defs>
                    <mask id="SVGUpRmCb0d">
                      <g
                        fill="none"
                        stroke="#fff"
                        stroke-linejoin="round"
                        stroke-width="4"
                      >
                        <path
                          stroke-linecap="round"
                          d="M13 12.432v-4.62A2.813 2.813 0 0 1 15.813 5h24.374A2.813 2.813 0 0 1 43 7.813v24.375A2.813 2.813 0 0 1 40.188 35h-4.672"
                        />
                        <path
                          fill="#555555"
                          d="M32.188 13H7.811A2.813 2.813 0 0 0 5 15.813v24.374A2.813 2.813 0 0 0 7.813 43h24.375A2.813 2.813 0 0 0 35 40.188V15.811A2.813 2.813 0 0 0 32.188 13Z"
                        />
                      </g>
                    </mask>
                  </defs>
                  <path
                    fill="currentColor"
                    d="M0 0h48v48H0z"
                    mask="url(#SVGUpRmCb0d)"
                  />
                </svg>
                <span class="hidden sm:block">{{ $t("btn.copy") }}</span>
              </button>
              <!-- clear text boxes button -->
              <button
                @click="clearTextBoxes"
                class="h-full px-2 bg-warning/60 text-warning-content active:bg-warning flex items-center justify-center gap-1 hover:cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                  >
                    <path
                      d="M5.185 31.954C6.529 26.914 10.638 23 15.854 23c4.895 0 8.164 4.425 8.056 9.32l-.057 2.569a7 7 0 0 0 2.097 5.154l1.106 1.086c1.586 1.557.66 4.224-1.555 4.408c-2.866.237-6.41.463-9.501.463c-3.982 0-7.963-.375-10.45-.666c-1.472-.172-2.558-1.428-2.417-2.902c.32-3.363 1.174-7.188 2.052-10.478"
                    />
                    <path
                      d="M20 24.018c1.68-6.23 3.462-12.468 4.853-18.773c.219-.993-.048-2.01-1-2.365a8 8 0 0 0-.717-.226a8 8 0 0 0-.734-.162c-1.002-.17-1.742.578-2.048 1.547c-1.96 6.191-3.542 12.522-5.213 18.792M45 45H35m7-8H32m7-8H29m-18.951 8.75c-.167 1.5 0 5.2 2 8m5-7.75s0 5 2.951 7.5"
                    />
                  </g>
                </svg>
                <span class="hidden sm:block">{{ $t("btn.clear") }}</span>
              </button>
              <!-- clear pipeline button -->
              <button
                @click="clearPipeline"
                class="h-full px-2 bg-secondary/40 text-secondary-content active:bg-secondary flex items-center justify-center gap-1 hover:cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M6 13h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1m-2 4h12c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m3-9c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1"
                  />
                </svg>
                <span class="hidden sm:block">{{ $t("btn.reset") }}</span>
              </button>
              <!-- Run button -->
              <button
                @click="compilePipeline"
                class="h-full px-2 bg-secondary/70 text-secondary-content active:bg-secondary flex items-center justify-center gap-1 hover:cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g fill="none">
                    <path
                      fill="currentColor"
                      fill-opacity="0.16"
                      d="m5 3l16 9l-16 9z"
                    />
                    <path
                      stroke="currentColor"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="m5 3l16 9l-16 9z"
                    />
                  </g>
                </svg>
                <span class="hidden sm:block">{{ $t("btn.cook") }}</span>
              </button>
            </div>
          </div>
          <!-- right bottom part -->
          <!-- Operation Bar -->
          <div
            class="h-1/2 w-full flex items-center justify-between bg-primary/40 text-primary-content/80 gap-1 overflow-x-auto"
          >
            <!-- Recepie add button -->
            <button
              class="h-full px-2 bg-primary/40 text-primary-content flex items-center gap-1 hover:cursor-pointer"
              @click="showRecepieBox = true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 48 48"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="4"
                >
                  <rect width="36" height="36" x="6" y="6" rx="3" />
                  <path stroke-linecap="round" d="M24 16v16m-8-8h16" />
                </g>
              </svg>
              <span class="hidden sm:block">{{ $t("btn.add") }}</span>
            </button>
            <!-- Module chips -->
            <div
              class="flex-1 py-1 pr-1 flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth whitespace-nowrap select-none flex-shrink-0"
            >
              <!-- middle modules list -->
              <div
                v-for="(m, index) in recepiePipeline"
                @click="showRecepieOptions(m)"
                class="px-2 rstyle text-xs p-0.5 flex items-center justify-center border shadow-lg hover:cursor-pointer"
                :class="
                  index % 2 === 0
                    ? 'bg-success/70 text-success-content/80 border-success-content/30'
                    : 'bg-warning/70 text-warning-content/80 border-warning-content/30'
                "
              >
                {{ m.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Output -->

      <div class="flex-1 bg-base-100 flex flex-col">
        <textarea
          v-model="outputBox"
          @dblclick="copyOutputBox"
          readonly
          spellcheck="false"
          autocorrect="off"
          autocapitalize="off"
          class="w-full h-full resize-none p-1 bg-base-100/10 focus:outline-none text-base-content/60"
        ></textarea>
        <!-- output quick insight -->
        <div class="p-1 bg-base-300 flex gap-2 text-xs text-base-content/70">
          <Insight :text="outputBox" showLines showBytes />
        </div>
      </div>
    </div>

    <!-- Recepie Options -->
    <Transition name="fade-scale">
      <div
        v-if="selectedModule"
        class="fixed top-0 left-0 w-full h-full flex flex-col items-center px-8 justify-center bg-base-100/80"
        @click="selectedModule = null"
      >
        <div
          @click.stop
          class="w-full min-h-[25rem] sm:min-h-[50%] sm:w-[50%] bg-base-100 border rstyle border-base-content/60 overflow-y-auto"
        >
          <RecepieOptions
            :module="selectedModule"
            @update="
              data =>
                (recepiePipeline[selectedModuleIndex].options[data.key].value =
                  data.value)
            "
          />
        </div>
      </div>
    </Transition>

    <!-- recepie pipeline tree ( development ) -->
    <Transition name="fade-scale">
      <RecepiePipelineTree
        v-if="showRecepiePipelineTree"
        :recepiePipeline
        :clearPipeline
        :close="() => (showRecepiePipelineTree = false)"
        :addRecepie="() => (showRecepieBox = true)"
      />
    </Transition>
    <!-- RecepieBox Modal -->
    <Transition name="fade-scale">
      <RecepieBox
        v-if="showRecepieBox"
        :grouped
        @select="selectModule"
        :close="() => (showRecepieBox = false)"
      />
    </Transition>
    <!-- sidebar -->
    <Transition name="slide-right">
      <div
        v-if="showSideBar"
        class="fixed w-full h-full top-0 left-0 bg-base-300/40"
        @click="showSideBar = false"
      >
        <div @click.stop class="h-full w-3/4 sm:w-1/3 bg-base-300">
          <Sidebar />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.rstyle {
  border-radius: 0.5rem;
  border-top-left-radius: 0;
  border-bottom-right-radius: 0;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-scale-enter-to {
  opacity: 1;
  transform: scale(1);
}

.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
