<template>
  <div class="relative w-full">
    <!-- Trigger -->
    <button
      ref="button"
      type="button"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.esc="close"
      class="w-full select-none rounded-lg border border-base-content/40 px-4 py-1 text-left transition bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
      :class="{ 'bg-base-100': isOpen }"
    >
      <span class="text-base-content">
        {{ selectedLabel || placeholder }}
      </span>
    </button>

    <!-- Dropdown -->
    <ul
      v-show="isOpen"
      class="absolute z-20 mt-1 w-full rounded-lg overflow-hidden border border-base-300 bg-base-100 shadow max-h-64 overflow-y-auto"
    >
      <li
        v-for="option in options"
        :key="option.value"
        @click="select(option)"
        class="cursor-pointer px-4 py-1 hover:bg-base-200"
        :class="{ 'bg-base-200': option.value === modelValue }"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from "vue";

  const props = defineProps({
    modelValue: [String, Number],
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: "Select option"
    }
  });

  const emit = defineEmits(["update:modelValue"]);

  const isOpen = ref(false);
  const button = ref(null);

  const selectedLabel = computed(
    () => props.options.find(o => o.value === props.modelValue)?.label
  );

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  function close() {
    isOpen.value = false;
  }

  function select(option) {
    emit("update:modelValue", option.value);
    close();
  }

  // Close on outside click
  function onClickOutside(e) {
    if (!button.value?.parentElement.contains(e.target)) {
      close();
    }
  }

  onMounted(() => {
    document.addEventListener("click", onClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", onClickOutside);
  });
</script>
