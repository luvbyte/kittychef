<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  text: string;
}>();

const emit = defineEmits(["update:text"]);

const update = (val: string) => emit("update:text", val);


// IMPORT FILE
function importFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt,.json,.md,.csv,.log,.html,.xml,*/*";

  input.onchange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();

    // Replace OR append?  
    // You can decide. I use REPLACE (better for editing).
    update(text);

    // If you want APPEND instead:
    // update(props.text + "\n" + text);
  };

  input.click();
}


function copyText() {
  navigator.clipboard.writeText(props.text || "");
}

function pasteText() {
  navigator.clipboard.readText().then(pasted => {
    update(props.text + pasted);
  });
}

function clearText() {
  update("");
}

function selectAll() {
  const el = document.getElementById("textarea-ref");
  if (el) el.select();
}

function toUppercase() {
  update(props.text.toUpperCase());
}

function toLowercase() {
  update(props.text.toLowerCase());
}

function reverseText() {
  update(props.text.split("").reverse().join(""));
}

function trimText() {
  update(props.text.trim());
}

function removeSpaces() {
  update(props.text.replace(/\s+/g, ""));
}

function removeBlankLines() {
  update(
    props.text
      .split(/\r?\n/)
      .filter(l => l.trim() !== "")
      .join("\n")
  );
}

function swapCase() {
  update(
    props.text
      .split("")
      .map(ch =>
        ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()
      )
      .join("")
  );
}

function insertTimestamp() {
  update(props.text + "\n" + new Date().toISOString());
}

</script>

<template>
  <div
    class="w-full flex gap-1 text-xs shrink-0 overflow-x-auto scroll-smooth scrollbar-hide"
  >
    <button class="btn btn-xs btn-primary" @click="importFile">
      {{ $t("text_utils.import") }}
    </button>
    <button class="btn btn-xs btn-primary" @click="copyText">
      {{ $t("text_utils.copy") }}
    </button>
    <button class="btn btn-xs btn-primary" @click="pasteText">
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
