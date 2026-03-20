<script setup>
  import RecepieOptions from "@/components/RecepieOptions.vue";

  const props = defineProps(["selectedModule", "hasOptions"]);
  const emit = defineEmits(["close", "update"]);

  const close = () => emit("close");
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-full flex flex-col items-center px-8 justify-center bg-black/60"
    @click.self="close"
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
        <button @click="close" class="opacity-80">
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
        @update="data => emit('update', data)"
      />
    </div>
  </div>
</template>
