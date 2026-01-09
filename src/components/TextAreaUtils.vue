<script setup lang="ts">
  import { computed } from "vue";
  import { copyText, pasteText } from "@/utils";

  /* ================= PROPS / EMITS ================= */

  const props = defineProps<{
    text: string;
  }>();

  const emit = defineEmits<{
    (e: "update:text", val: string): void;
  }>();

  /* ================= DERIVED TEXT ================= */

  const text = computed(() => props.text);

  function updateText(val: string) {
    emit("update:text", val);
  }

  /* ================= IMPORT FILE ================= */

  function importFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.json,.md,.csv,.log,.html,.xml,*/*";

    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const content = await file.text();
      updateText(content);
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
    <button class="btn btn-xs btn-primary" @click="importFile">
      {{ $t("text_utils.import") }}
    </button>
    <button class="btn btn-xs btn-primary" @click="copy">
      {{ $t("text_utils.copy") }}
    </button>
    <button class="btn btn-xs btn-primary" @click="paste">
      {{ $t("text_utils.paste") }}
    </button>

    <button class="btn btn-xs btn-secondary" @click="clearText">
      {{ $t("text_utils.clear") }}
    </button>
    <button class="btn btn-xs btn-accent" @click="selectAll">
      {{ $t("text_utils.select") }}
    </button>

    <button class="btn btn-xs" @click="toUppercase">
      {{ $t("text_utils.upper") }}
    </button>
    <button class="btn btn-xs" @click="toLowercase">
      {{ $t("text_utils.lower") }}
    </button>

    <button class="btn btn-xs" @click="reverseText">
      {{ $t("text_utils.reverse") }}
    </button>
    <button class="btn btn-xs" @click="trimText">
      {{ $t("text_utils.trim") }}
    </button>
    <button class="btn btn-xs" @click="removeSpaces">
      {{ $t("text_utils.no_space") }}
    </button>
    <button class="btn btn-xs" @click="removeBlankLines">
      {{ $t("text_utils.no_blank_lines") }}
    </button>

    <button class="btn btn-xs" @click="swapCase">
      {{ $t("text_utils.swap_case") }}
    </button>
    <button class="btn btn-xs" @click="insertTimestamp">
      {{ $t("text_utils.timestamp") }}
    </button>
  </div>
</template>
