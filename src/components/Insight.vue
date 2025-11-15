<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  text: string | any; // accept any type safely
  label?: string;
  showBytes?: boolean;
  showLines?: boolean;
}>();

// safe normalized text → ALWAYS a string
const safeText = computed(() => {
  if (props.text === null || props.text === undefined) return "";
  return String(props.text);
});

// chars
const charCount = computed(() => safeText.value.length);

// words
const wordCount = computed(() => {
  const t = safeText.value.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
});

// lines
const lineCount = computed(() => {
  if (!safeText.value) return 0;
  return safeText.value.split(/\r?\n/).length;
});

// bytes
const byteSize = computed(() => {
  return new TextEncoder().encode(safeText.value).length;
});
</script>

<template>
  <div class="flex items-center gap-3 text-xs text-base-content/70">
    <div
      v-if="label"
      class="font-semibold text-sm pr-2 border-r border-base-300"
    >
      {{ label }}
    </div>

    <div class="flex gap-2 items-center">
      <span class="px-2 py-0.5 rounded bg-base-200">
        {{ $t("insight.chars") }}: <strong class="ml-1">{{ charCount }}</strong>
      </span>

      <span class="px-2 py-0.5 rounded bg-base-200">
        {{ $t("insight.words") }}: <strong class="ml-1">{{ wordCount }}</strong>
      </span>

      <span v-if="showLines !== false" class="px-2 py-0.5 rounded bg-base-200">
        {{ $t("insight.lines") }}: <strong class="ml-1">{{ lineCount }}</strong>
      </span>

      <span v-if="showBytes !== false" class="px-2 py-0.5 rounded bg-base-200">
        {{ $t("insight.bytes") }}: <strong class="ml-1">{{ byteSize }}</strong>
      </span>
    </div>
  </div>
</template>
