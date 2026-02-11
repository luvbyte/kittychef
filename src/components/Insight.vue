<script setup lang="ts">
  import { computed } from "vue";

  const props = defineProps({
    text: String,
    isInputBox: {
      type: Boolean,
      required: true
    }
  });

  // normalized text (always string)
  const safeText = computed(() =>
    props.text == null ? "" : String(props.text)
  );

  // counts
  const charCount = computed(() => safeText.value.length);

  const wordCount = computed(() => {
    const t = safeText.value.trim();
    return t ? t.split(/\s+/).length : 0;
  });

  const lineCount = computed(() =>
    safeText.value ? safeText.value.split(/\r?\n/).length : 0
  );

  const byteSize = computed(
    () => new TextEncoder().encode(safeText.value).length
  );

  const encoding = computed(() => {
    if (!safeText.value) return "ASCII";
    return [...safeText.value].every(c => c.charCodeAt(0) < 128)
      ? "ASCII"
      : "UTF-8";
  });
</script>

<template>
  <div
    class="w-full flex items-center justify-between gap-3 text-xs px-1 font-heading"
  >
    <div
      class="flex gap-1 items-center *:shadow-lg *:shrink-0 overflow-x-auto scrollbar-hide"
    >
      <span>
        <svg
          v-if="isInputBox"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M4 17V7zm.616 1q-.691 0-1.153-.462T3 16.384V7.616q0-.691.463-1.153T4.615 6h14.77q.69 0 1.152.463T21 7.616v5.275q-.233-.189-.473-.323q-.24-.133-.527-.256V7.616q0-.231-.192-.424T19.385 7H4.615q-.23 0-.423.192T4 7.616v8.769q0 .23.192.423t.423.192h7.427q-.011.135-.014.247q-.003.113-.003.253t.003.253t.014.247zm3.615-3.77v1.54h4.061q.143-.422.337-.806t.44-.733zm-3-3v1.54h1.538v-1.54zm3 0v1.54h1.538v-1.54zm3 0v1.54h1.538v-1.54zm3 0v1.54h.315q.281-.2.587-.344t.636-.268v-.927zm3 0v.62q.115-.011.228-.027q.112-.015.233-.015q.275 0 .542.034q.266.035.535.085v-.696zm-12-3v1.54h1.538V8.23zm3 0v1.54h1.538V8.23zm3 0v1.54h1.538V8.23zm3 0v1.54h1.538V8.23zm3 0v1.54h1.538V8.23zm.461 12.559l-.688-.689l2.055-2.1h-4.867v-1h4.868l-2.056-2.1l.688-.688l3.289 3.288z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6zm2.23-2.116h11.54q.213 0 .356-.143t.143-.357t-.143-.356t-.357-.144H6.231q-.214 0-.357.144q-.143.143-.143.357q0 .213.143.356t.357.144m0-3.385h11.538q.214 0 .357-.143t.143-.357t-.143-.357t-.357-.143H6.231q-.214 0-.357.143T5.731 12t.143.357t.357.143m0-3.384H14q.214 0 .357-.144q.143-.143.143-.356q0-.214-.143-.357T14 8.116H6.23q-.213 0-.356.143t-.143.357t.143.356t.357.144"
          />
        </svg>
      </span>

      <span class="badge badge-sm">
        {{ $t("insight.chars") }}<strong>{{ charCount }}</strong>
      </span>

      <span class="badge badge-sm">
        {{ $t("insight.words") }} <strong>{{ wordCount }}</strong>
      </span>

      <span class="badge badge-sm">
        {{ $t("insight.lines") }} <strong>{{ lineCount }}</strong>
      </span>

      <span class="badge badge-sm">
        {{ $t("insight.bytes") }} <strong>{{ byteSize }}</strong>
      </span>
    </div>

    <span v-if="text.length > 0" class="pl-2 py-0.5 rounded whitespace-nowrap">
      <strong>{{ encoding }}</strong>
    </span>
  </div>
</template>
