<script setup>
  import { ref, computed, watch, nextTick } from "vue";
  import {
    toggleFullScreen,
    copyText,
    debounce,
    toBytes,
    toText,
    bytesToHex,
    bytesToBase64
  } from "./utils";

  import Insight from "@/components/Insight.vue";
  import Sidebar from "@/components/Sidebar.vue";
  import Emoticon from "@/components/Emoticon.vue";
  import RecepieBox from "@/components/RecepieBox.vue";
  import TextAreaUtils from "@/components/TextAreaUtils.vue";
  import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
  import RecepieOptions from "@/components/RecepieOptions.vue";
  import RecepiePipelineTree from "@/components/RecepiePipelineTree.vue";

  import { Data } from "@/core";
  import modules from "@/core/modules";

  /* ---------------- UI STATE ---------------- */

  const showRecepieBox = ref(false);
  const showThemeSwitcher = ref(false);
  const showRecepiePipelineTree = ref(false);
  const showSideBar = ref(false);

  const inputFullScreen = ref(false);
  const showInputBox = ref(true);
  const showOutputBox = ref(true);
  const fullScreenLevel = ref(0);

  const liveUpdate = ref(true);
  const outputMode = ref("text"); // "text" | "hex" | "base64"

  const inputBoxLocked = ref(false);

  /* ---------------- PIPELINE STATE ---------------- */

  // UI text
  const inputText = ref("");

  // Bytes (ONLY bytes)
  const inputBytes = ref(new Uint8Array());
  const outputBytes = ref(new Uint8Array());

  // Rendered output text (VIEW ONLY)
  const outputText = computed(() => {
    if (!outputBytes.value || outputBytes.value.length === 0) return "";

    switch (outputMode.value) {
      case "hex":
        return bytesToHex(outputBytes.value);
      case "base64":
        return bytesToBase64(outputBytes.value);
      default:
        return toText(outputBytes.value);
    }
  });

  watch(inputText, val => {
    inputBytes.value = toBytes(val);
  });

  /* ---------------- PIPELINE ---------------- */

  const recepiePipeline = ref([]);
  const selectedModule = ref(null);
  const selectedModuleIndex = ref(null);
  const isPipelineError = ref(false);

  const modulesChipsRef = ref(null);

  /* ---------------- HELPERS ---------------- */

  function showRecepieOptions(m) {
    const idx = recepiePipeline.value.indexOf(m);
    selectedModuleIndex.value = idx;
    selectedModule.value = recepiePipeline.value[idx];
  }

  function scrollModuleChipsboxToRight() {
    if (modulesChipsRef.value) {
      modulesChipsRef.value.scrollTo({
        left: modulesChipsRef.value.scrollWidth,
        behavior: "smooth"
      });
    }
  }

  function onToggleFullScreen() {
    fullScreenLevel.value =
      fullScreenLevel.value >= 2 ? 0 : fullScreenLevel.value + 1;
  }

  function groupModulesByCategory(modsObj) {
    const groups = {};
    for (const id in modsObj) {
      const mod = modsObj[id];
      if (!groups[mod.category]) groups[mod.category] = [];
      groups[mod.category].push(mod);
    }
    return groups;
  }

  function cloneModule(m) {
    const clone = { ...m };
    clone.options = {};
    for (const key in m.options) {
      const opt = m.options[key];
      clone.options[key] = { ...opt, value: opt.default ?? "" };
    }
    return clone;
  }

  function toggleLiveUpdate() {
    liveUpdate.value = !liveUpdate.value;
    compilePipeline();
  }

  const hasOptions = computed(() => {
    const opts = selectedModule.value?.options;
    return opts && Object.keys(opts).length > 0;
  });

  const grouped = groupModulesByCategory(modules);

  /* ---------------- MODULE ACTIONS ---------------- */

  function selectModule(m) {
    recepiePipeline.value.push(cloneModule(m));
    nextTick(scrollModuleChipsboxToRight);
  }

  function clearPipeline() {
    recepiePipeline.value.length = 0;
    selectedModule.value = null;
    isPipelineError.value = false;
  }

  function clearTextBoxes() {
    inputText.value = "";
    outputBytes.value = new Uint8Array();
  }

  function copyOutputBox() {
    copyText(outputText.value);
  }

  function swapTextBox() {
    const tmp = inputText.value;
    inputText.value = outputText.value;
    outputBytes.value = toBytes(tmp);
  }

  /* ---------------- PIPELINE EXECUTION ---------------- */

  let runId = 0;

  async function compilePipeline() {
    const id = ++runId;
    isPipelineError.value = false;

    // Explicitly declare input type
    let data = new Data(inputBytes.value, "byteArray");

    try {
      for (const [index, mod] of recepiePipeline.value.entries()) {
        if (id !== runId) return;

        try {
          const options = Object.fromEntries(
            Object.entries(mod.options ?? {}).map(([k, v]) => [k, v.value])
          );

          const inputType = mod.inputType ?? "byteArray";
          const outputType = mod.outputType ?? "byteArray";

          const result = await mod.run(data.getData(inputType), options);

          // Convert + store correctly
          data.setData(result, outputType);
        } catch (err) {
          throw new Error(
            `Error in module ${index + 1} ${mod.name}: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }
      }

      if (id === runId) {
        // Always emit bytes
        outputBytes.value = data.getData("byteArray");
      }
    } catch (err) {
      if (id === runId) {
        outputBytes.value = toBytes(
          err instanceof Error ? err.message : String(err)
        );
        isPipelineError.value = true;
      }
    }
  }

  const compilePipelineDebounced = debounce(compilePipeline, 300);

  /* ---------------- LIVE UPDATE ---------------- */

  watch(
    [inputBytes, recepiePipeline],
    () => {
      if (liveUpdate.value) compilePipelineDebounced();
    },
    { deep: true }
  );

  /* ---------------- BOX TOGGLING ---------------- */

  function toggleBoxes() {
    if (showInputBox.value && showOutputBox.value) {
      showOutputBox.value = false;
    } else if (showInputBox.value) {
      showInputBox.value = false;
      showOutputBox.value = true;
    } else {
      showInputBox.value = true;
      showOutputBox.value = true;
    }
  }
</script>
<template>
  <div
    id="main"
    data-theme="light"
    class="h-dvh flex flex-col overflow-hidden font-body"
  >
    <!-- Header / Navbar -->
    <div
      v-show="fullScreenLevel < 1"
      class="relative bg-primary glass text-primary-content p-2 py-3 flex justify-between items-center shadow-lg font-heading"
    >
      <button @click="showSideBar = true" class="flex items-center gap-1">
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
        <!-- Browser fullscreen -->
        <button @click="toggleFullScreen" class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M21 3v6h-2V6.41l-3.29 3.3l-1.42-1.42L17.59 5H15V3zM3 3v6h2V6.41l3.29 3.3l1.42-1.42L6.41 5H9V3zm18 18v-6h-2v2.59l-3.29-3.29l-1.41 1.41L17.59 19H15v2zM9 21v-2H6.41l3.29-3.29l-1.41-1.42L5 17.59V15H3v6z"
            />
          </svg>
        </button>
        <!-- Theme -->
        <button
          class="flex items-center gap-1 hover:cursor-pointer"
          @click="showThemeSwitcher = !showThemeSwitcher"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 22A10 10 0 0 1 2 12A10 10 0 0 1 12 2c5.5 0 10 4 10 9a6 6 0 0 1-6 6h-1.8c-.3 0-.5.2-.5.5c0 .1.1.2.1.3c.4.5.6 1.1.6 1.7c.1 1.4-1 2.5-2.4 2.5m0-18a8 8 0 0 0-8 8a8 8 0 0 0 8 8c.3 0 .5-.2.5-.5c0-.2-.1-.3-.1-.4c-.4-.5-.6-1-.6-1.6c0-1.4 1.1-2.5 2.5-2.5H16a4 4 0 0 0 4-4c0-3.9-3.6-7-8-7m-5.5 6c.8 0 1.5.7 1.5 1.5S7.3 13 6.5 13S5 12.3 5 11.5S5.7 10 6.5 10m3-4c.8 0 1.5.7 1.5 1.5S10.3 9 9.5 9S8 8.3 8 7.5S8.7 6 9.5 6m5 0c.8 0 1.5.7 1.5 1.5S15.3 9 14.5 9S13 8.3 13 7.5S13.7 6 14.5 6m3 4c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5"
            />
          </svg>

          <span class="sm:block">{{ $t("btn.theme") }}</span>
        </button>
      </div>

      <!-- Theme switcher -->
      <Transition name="slide-left">
        <div
          v-show="showThemeSwitcher"
          class="absolute top-12 right-0 w-3/4 sm:w-2/3 max-h-[400px] overflow-y-auto"
        >
          <ThemeSwitcher />
        </div>
      </Transition>
    </div>

    <!-- Main Layout -->
    <div class="flex-1 flex flex-col">
      <!-- InputBox Top Utils-->
      <div
        class="p-1 pt-2 flex items-center gap-1 overflow-x-auto scrollbar-hide"
      >
        <div class="flex items-center gap-2 px-1">
          <!-- Fullscreen Button -->
          <button @click="onToggleFullScreen" class="active:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M18.29 2.89c-1.028-.138-2.383-.14-4.29-.14a.75.75 0 0 1 0-1.5h.056c1.838 0 3.294 0 4.433.153c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433V10a.75.75 0 0 1-1.5 0c0-1.907-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008s-1.003-.677-2.009-.812M2 13.25a.75.75 0 0 1 .75.75c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14a.75.75 0 0 1 0 1.5h-.056c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433V14a.75.75 0 0 1 .75-.75"
                clip-rule="evenodd"
              />
              <path
                fill="currentColor"
                d="M9.944 1.25H10a.75.75 0 0 1 0 1.5c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812S3.025 4.705 2.89 5.71c-.138 1.029-.14 2.383-.14 4.29a.75.75 0 0 1-1.5 0v-.056c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153M22 13.25a.75.75 0 0 1 .75.75v.056c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H14a.75.75 0 0 1 0-1.5c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812s.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289a.75.75 0 0 1 .75-.75"
                opacity="0.5"
              />
            </svg>
          </button>
          <!-- Lock Button -->
          <button
            @click="inputBoxLocked = !inputBoxLocked"
            class="active:scale-105"
          >
            <svg
              v-if="inputBoxLocked"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.5"
                d="M6 10V8q0-.511.083-1M18 10V8A6 6 0 0 0 7.5 4.031M11 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16s0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22h-1"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none">
                <path
                  fill="currentColor"
                  d="M4.565 12.407a.75.75 0 1 0-1.13.986zM7.143 16.5l-.565.493a.75.75 0 0 0 1.13 0zm8.422-8.507a.75.75 0 1 0-1.13-.986zm-5.059 3.514a.75.75 0 0 0 1.13.986zm-.834 3.236a.75.75 0 1 0-1.13-.986zm-6.237-1.35l3.143 3.6l1.13-.986l-3.143-3.6zm4.273 3.6l1.964-2.25l-1.13-.986l-1.964 2.25zm3.928-4.5l1.965-2.25l-1.13-.986l-1.965 2.25zm1.965-2.25l1.964-2.25l-1.13-.986l-1.964 2.25z"
                />
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="m20 7.563l-4.286 4.5M11 16l.429.563l2.143-2.25"
                />
              </g>
            </svg>
          </button>
        </div>
        <TextAreaUtils v-model:text="inputText" />
      </div>
      <!-- Input Box & Output Box -->
      <div class="flex-1 flex flex-col md:flex-row">
        <!-- Input -->
        <div v-if="showInputBox" class="flex-1 flex flex-col">
          <textarea
            id="input-box-ref"
            placeholder="Input Here..."
            v-model="inputText"
            spellcheck="off"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            :readonly="inputBoxLocked"
            inputmode="text"
            class="flex-1 resize-none px-1 bg-base-100/20 text-base-content/60 focus:outline-none placeholder:opacity-80"
          ></textarea>
          <!-- Quick Insight -->
          <div class="p-1 bg-base-300 flex gap-2 text-xs text-base-content/70">
            <Insight :text="inputText" :isInputBox="true" />
          </div>
        </div>

        <div
          v-if="showInputBox && showOutputBox"
          class="divider divider-horizontal m-0"
        ></div>

        <!-- Output -->
        <div v-if="showOutputBox" class="flex-1 bg-base-100 flex flex-col">
          <textarea
            v-model="outputText"
            id="output-box-ref"
            @dblclick="copyOutputBox"
            readonly
            spellcheck="false"
            autocorrect="off"
            autocapitalize="off"
            placeholder="Output ..."
            class="w-full h-full resize-none px-1 bg-base-100/10 focus:outline-none placeholder:opacity-80"
            :class="isPipelineError ? 'text-error' : 'text-base-content/60'"
          ></textarea>
          <!-- output quick insight -->
          <div class="p-1 bg-base-300 flex gap-2 text-xs text-base-content/70">
            <Insight :text="outputText" :isInputBox="false" />
          </div>
        </div>
      </div>
      <!-- Bottom Main Bar -->
      <div
        v-show="fullScreenLevel < 2"
        class="min-h-18 flex border-b border-primary/60 font-heading"
      >
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
            <!-- Emoji -->
            <div class="flex-1">
              <Emoticon />
            </div>

            <!-- Toggle Output Box Button -->
            <button
              @click="toggleBoxes"
              class="h-full px-2 bg-secondary/60 flex items-center gap-1"
            >
              <!-- Both True -->
              <svg
                v-if="showInputBox && showOutputBox"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M21.707 9.777V8.313H2.428v1.334L2 9.644v.834l2.052 5.209h16.392L22 10.433v-.654Zm-2.368 5.481H5.044S3.714 11 3.623 10.929h16.889z"
                />
              </svg>
              <svg
                v-else-if="showOutputBox"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 21 21"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5.5 3.5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2m1 12h8"
                  stroke-width="1"
                />
              </svg>
              <svg
                v-else-if="showInputBox"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 21 21"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5.5 3.5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2m1 2h8"
                  stroke-width="1"
                />
              </svg>
              <span class="hidden sm:block">{{ $t("btn.output") }}</span>
            </button>

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
              ref="modulesChipsRef"
              class="flex-1 py-1 pr-1 flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth whitespace-nowrap select-none flex-shrink-0"
            >
              <!-- middle modules / recepies list -->
              <div
                v-for="(m, index) in recepiePipeline"
                @click="showRecepieOptions(m)"
                class="px-2 glass rounded text-xs p-0.5 flex items-center justify-center border shadow-lg hover:cursor-pointer py-1"
                :class="
                  index % 2 === 0
                    ? 'bg-primary text-primary-content'
                    : 'bg-secondary text-secondary-content'
                "
              >
                {{ m.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- kittychef quick insight -->
    <div
      v-if="fullScreenLevel < 2"
      class="p-1 px-2 bg-primary/60 flex gap-2 text-xs text-base-content/70 font-heading"
    >
      <span class="px-2 py-0.5 rounded bg-primary/60 text-primary-content">
        {{ $t("insight.live") }}
        <strong class="ml-1">{{ liveUpdate ? "Yes" : "No" }}</strong>
      </span>
      <span class="px-2 py-0.5 rounded bg-primary/60 text-primary-content">
        {{ $t("insight.recepies") }}
        <strong class="ml-1">{{ recepiePipeline.length }}</strong>
      </span>
    </div>

    <!-- Recepie Options overlay fixed -->
    <Transition name="fade-scale">
      <div
        v-if="selectedModule"
        class="fixed top-0 left-0 w-full h-full flex flex-col items-center px-8 justify-center bg-black/60"
        @click.self="selectedModule = null"
      >
        <div
          class="w-full h-[25rem] sm:h-[50%] sm:w-[50%] rstyle bg-base-100 shadow-lg flex flex-col overflow-hidden"
        >
          <!-- HEAD -->
          <div
            class="flex items-center justify-between p-2 py-3 bg-primary text-primary-content glass"
          >
            <h1 class="font-bold text-lg">{{ selectedModule.name }} Options</h1>

            <!-- close btn -->
            <button @click="selectedModule = null" class="opacity-80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
                />
              </svg>
            </button>
          </div>

          <div class="p-2 opacity-60 text-center text-xs">
            {{ selectedModule.description }}
          </div>

          <div v-if="!hasOptions" class="p-2 text-center opacity-80">
            No options required
          </div>
          <!-- Options -->
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
    <!-- Sidebar -->
    <div
      class="fixed inset-0 z-20 full overflow-hidden"
      @click.self="showSideBar = false"
      :class="{ 'pointer-events-none -z-20': !showSideBar }"
    >
      <!-- SIDEBAR -->
      <Transition name="slide-right">
        <div v-if="showSideBar" class="relative h-full w-3/4 sm:w-1/3 glass">
          <Sidebar />
        </div>
      </Transition>
    </div>
  </div>
</template>
