<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps(["grouped", "close"]);
const emit = defineEmits(["select"]);

const search = ref("");

const filteredGroups = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return props.grouped;

  const result = {};
  for (const [category, mods] of Object.entries(props.grouped)) {
    const filtered = mods.filter(m => m.name.toLowerCase().includes(term));
    if (filtered.length > 0) {
      result[category] = filtered;
    }
  }
  return result;
});

// UI Accordian
const openCategory = ref<string | null>(null);

function toggle(category: string) {
  // When searching, ignore manual toggling
  if (search.value.trim()) return;

  openCategory.value = openCategory.value === category ? null : category;
}

// expansion
const isOpen = (category: string) => {
  if (search.value.trim()) return true; // Auto-expand all during search
  return openCategory.value === category;
};

function selectModule(m) {
  emit("select", m);
  props.close();
}
</script>

<template>
  <!-- Modal -->
  <div class="absolute h-screen w-screen flex flex-col bg-base-100 gap-2">
    <div class="p-2">
      <!-- Header -->
      <div class="flex justify-between items-center mb-2 py-2">
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
                fill="currentColor"
                d="M21 5c-1.11-.35-2.33-.5-3.5-.5c-1.95 0-4.05.4-5.5 1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5c.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.3 4.75 1.05c.1.05.15.05.25.05c.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1M3 18.5V7c1.1-.35 2.3-.5 3.5-.5c1.34 0 3.13.41 4.5.99v11.5C9.63 18.41 7.84 18 6.5 18c-1.2 0-2.4.15-3.5.5m18 0c-1.1-.35-2.3-.5-3.5-.5c-1.34 0-3.13.41-4.5.99V7.49c1.37-.59 3.16-.99 4.5-.99c1.2 0 2.4.15 3.5.5z"
              />
              <path
                fill="currentColor"
                d="M11 7.49c-1.37-.58-3.16-.99-4.5-.99c-1.2 0-2.4.15-3.5.5v11.5c1.1-.35 2.3-.5 3.5-.5c1.34 0 3.13.41 4.5.99z"
                opacity="0.3"
              />
              <path
                fill="currentColor"
                d="M17.5 10.5c.88 0 1.73.09 2.5.26V9.24c-.79-.15-1.64-.24-2.5-.24c-1.28 0-2.46.16-3.5.47v1.57c.99-.35 2.18-.54 3.5-.54m0 2.66c.88 0 1.73.09 2.5.26V11.9c-.79-.15-1.64-.24-2.5-.24c-1.28 0-2.46.16-3.5.47v1.57c.99-.34 2.18-.54 3.5-.54m0 2.67c.88 0 1.73.09 2.5.26v-1.52c-.79-.15-1.64-.24-2.5-.24c-1.28 0-2.46.16-3.5.47v1.57c.99-.35 2.18-.54 3.5-.54"
              />
            </svg>
          </div>
          <div class="font-bold pt-1">Select a Recepie</div>
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

      <!-- Search -->
      <div class="w-full">
        <input
          v-model="search"
          placeholder="Search"
          class="w-full p-1 px-2 bg-transparent focus:outline-none border rstyle text-base-content/60"
        />
      </div>

      <!-- Modules List -->
      <div class="w-full mt-2 rounded overflow-hidden">
        <div v-for="(mods, category) in filteredGroups" :key="category">
          <!-- Category Header -->
          <button
            class="w-full flex justify-between items-center p-2 text-sm font-medium bg-info active:bg-info/80 text-info-content"
            @click="toggle(category)"
          >
            <span>{{ category }}</span>

            <span
              class="transition-transform duration-200"
              :class="isOpen(category) ? 'rotate-90' : ''"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </button>

          <!-- Category Body -->
          <div
            class="overflow-hidden transition-[max-height] duration-300 pb-1"
            :class="isOpen(category) ? 'max-h-96' : 'max-h-0'"
          >
            <div class="flex flex-col gap-1 mt-1">
              <button
                v-for="m in mods"
                :key="m.id"
                class="text-left text-xs p-2 bg-gradient-to-r from-primary to-secondary text-primary-content text-bold active:bg-accent/60 rounded-sm"
                @click="selectModule(m)"
              >
                {{ m.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
