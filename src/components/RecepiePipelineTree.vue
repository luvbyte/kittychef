<script setup lang="ts">
const props = defineProps(["recepiePipeline", "close"]);
</script>

<template>
  <div class="absolute h-screen w-screen flex flex-col bg-base-100 gap-2">
    <!-- Modal Header -->
    <div class="p-2 flex justify-between items-center mb-2 py-2">
      <!--left side Header + Icon -->
      <div class="flex justify-between items-center gap-1">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              d="M4 1h6v6H4zm12 10h4v4h-4zm0 8h4v4h-4zM7 7v14h9m-9-8h9"
            />
          </svg>
        </div>
        <div class="font-bold pt-1">Recepies Tree</div>
      </div>
      <!-- close button -->
      <div @click="props.close" class="pt-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12"
          />
          <path
            fill="currentColor"
            d="M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"
          />
        </svg>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center">
      under development...
    </div>
  </div>
</template>
