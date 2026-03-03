<script setup lang="ts">
  import { computed } from "vue";
  import { copyText, pasteText } from "@/utils";

  /* ================= PROPS / EMITS ================= */

  const props = defineProps<{
    data: Uint8Array; //
  }>();

  const emit = defineEmits<{
    (e: "update:data", val: Uint8Array): void;
  }>();

  /* ================= TEXT <-> BINARY ================= */

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  /* Convert incoming binary → string for UI */
  const text = computed(() => {
    return props.data ? decoder.decode(props.data) : "";
  });

  /* Emit string as Uint8Array */
  function updateText(val: string) {
    emit("update:data", encoder.encode(val));
  }

  /* ================= IMPORT FILE ================= */

  function importFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.json,.md,.csv,.log,.html,.xml,*/*";

    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const arrayBuffer = await file.arrayBuffer();
      emit("update:data", new Uint8Array(arrayBuffer));
    };

    input.click();
  }

  /* ================= CLIPBOARD ================= */

  function copy() {
    copyText(text.value);
  }

  async function paste() {
    const pasted = await pasteText();
    updateText(text.value + pasted);
  }

  /* ================= BASIC ACTIONS ================= */

  function clearText() {
    updateText("");
  }

  function selectAll() {
    const el = document.getElementById("input-box-ref") as HTMLTextAreaElement;
    el?.select();
  }

  /* ================= TRANSFORMS ================= */

  function toUppercase() {
    updateText(text.value.toUpperCase());
  }

  function toLowercase() {
    updateText(text.value.toLowerCase());
  }

  function reverseText() {
    updateText([...text.value].reverse().join(""));
  }

  function trimText() {
    updateText(text.value.trim());
  }

  function removeSpaces() {
    updateText(text.value.replace(/\s+/g, ""));
  }

  function removeBlankLines() {
    updateText(
      text.value
        .split(/\r?\n/)
        .filter(l => l.trim() !== "")
        .join("\n")
    );
  }

  function swapCase() {
    updateText(
      [...text.value]
        .map(ch =>
          ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()
        )
        .join("")
    );
  }

  function insertTimestamp() {
    updateText(text.value + new Date().toISOString());
  }
</script>

<template>
  <div
    class="w-full flex gap-1 text-xs shrink-0 overflow-x-auto scroll-smooth scrollbar-hide font-heading pb-1"
  >
    <!-- Import -->
    <button type="button" class="btn btn-xs btn-primary" @click="importFile">
      {{ $t("text_utils.import") }}
    </button>

    <!-- Clipboard -->
    <button
      type="button"
      class="btn btn-xs btn-primary"
      :disabled="!text"
      @click="copy"
    >
      {{ $t("text_utils.copy") }}
    </button>

    <button type="button" class="btn btn-xs btn-primary" @click="paste">
      {{ $t("text_utils.paste") }}
    </button>

    <!-- Basic -->
    <button
      type="button"
      class="btn btn-xs btn-secondary"
      :disabled="!text"
      @click="clearText"
    >
      {{ $t("text_utils.clear") }}
    </button>

    <button
      type="button"
      class="btn btn-xs btn-accent"
      :disabled="!text"
      @click="selectAll"
    >
      {{ $t("text_utils.select") }}
    </button>

    <!-- Transforms -->
    <button
      type="button"
      class="btn btn-xs"
      :disabled="!text"
      @click="toUppercase"
    >
      {{ $t("text_utils.upper") }}
    </button>

    <button
      type="button"
      class="btn btn-xs"
      :disabled="!text"
      @click="toLowercase"
    >
      {{ $t("text_utils.lower") }}
    </button>

    <button
      type="button"
      class="btn btn-xs"
      :disabled="!text"
      @click="reverseText"
    >
      {{ $t("text_utils.reverse") }}
    </button>

    <button
      type="button"
      class="btn btn-xs"
      :disabled="!text"
      @click="trimText"
    >
      {{ $t("text_utils.trim") }}
    </button>

    <button
      type="button"
      class="btn btn-xs"
      :disabled="!text"
      @click="removeSpaces"
    >
      {{ $t("text_utils.no_space") }}
    </button>

    <button
      type="button"
      class="btn btn-xs"
      :disabled="!text"
      @click="removeBlankLines"
    >
      {{ $t("text_utils.no_blank_lines") }}
    </button>

    <button
      type="button"
      class="btn btn-xs"
      :disabled="!text"
      @click="swapCase"
    >
      {{ $t("text_utils.swap_case") }}
    </button>

    <button type="button" class="btn btn-xs" @click="insertTimestamp">
      {{ $t("text_utils.timestamp") }}
    </button>
  </div>
</template>
