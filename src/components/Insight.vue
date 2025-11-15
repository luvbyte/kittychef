<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  text: string; // text
  label?: string;
  showBytes?: boolean; // show bytes
  showLines?: boolean; // show lines
}>();

// chars count computed
const charCount = computed(() => props.text.length);

const wordCount = computed(() => {
  const t = props.text.trim();
  if (!t) return 0;
  // split on whitespace
  return t.split(/\s+/).length;
});

const lineCount = computed(() => {
  if (!props.text) return 0;
  return props.text.split(/\r?\n/).length;
});

const byteSize = computed(() => {
  return new TextEncoder().encode(props.text).length;
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
      <span class="px-2 py-0.5 rounded bg-base-200"
        >Chars: <strong class="ml-1">{{ charCount }}</strong></span
      >
      <span class="px-2 py-0.5 rounded bg-base-200"
        >Words: <strong class="ml-1">{{ wordCount }}</strong></span
      >
      <span v-if="showLines !== false" class="px-2 py-0.5 rounded bg-base-200"
        >Lines: <strong class="ml-1">{{ lineCount }}</strong></span
      >
      <span v-if="showBytes !== false" class="px-2 py-0.5 rounded bg-base-200"
        >Bytes: <strong class="ml-1">{{ byteSize }}</strong></span
      >
    </div>
  </div>
</template>
