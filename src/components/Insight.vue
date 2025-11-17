<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  text: string | any;
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

// detect text encoding
const encoding = computed(() => {
  const text = safeText.value;

  if (!text) return "ASCII";

  const bytes = new TextEncoder().encode(text);

  // ASCII check
  if (bytes.every(b => b < 128)) return "ASCII";

  return "UTF-8";
});
</script>

<template>
  <div
    class="w-full px-2 flex items-center justify-between gap-3 text-xs text-base-content/70"
  >
    <div
      class="flex gap-2 items-center *:shadow-lg *:shrink-0 overflow-x-auto scrollbar-hide"
    >
      <span class="px-2 py-0.5 rounded bg-base-200">
        {{ $t("insight.chars") }}<strong class="ml-1">{{ charCount }}</strong>
      </span>

      <span class="px-2 py-0.5 rounded bg-base-200">
        {{ $t("insight.words") }} <strong class="ml-1">{{ wordCount }}</strong>
      </span>

      <span v-if="showLines !== false" class="px-2 py-0.5 rounded bg-base-200">
        {{ $t("insight.lines") }} <strong class="ml-1">{{ lineCount }}</strong>
      </span>

      <span v-if="showBytes !== false" class="px-2 py-0.5 rounded bg-base-200">
        {{ $t("insight.bytes") }} <strong class="ml-1">{{ byteSize }}</strong>
      </span>
    </div>

    <span v-if="showBytes !== false" class="pl-2 py-0.5 rounded">
      <strong>{{ encoding }}</strong>
    </span>
  </div>
</template>
