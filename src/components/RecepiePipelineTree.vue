<script setup lang="ts">
const props = defineProps<{
  recepiePipeline: any[];
  close: () => void;
}>();

import { ref } from "vue";

const openIndex = ref<number | null>(null);

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i;
}

function moveUp(i: number) {
  if (i === 0) return;
  const arr = props.recepiePipeline;
  [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
}

function moveDown(i: number) {
  const arr = props.recepiePipeline;
  if (i >= arr.length - 1) return;
  [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
}

function removeItem(i: number) {
  props.recepiePipeline.splice(i, 1);
}
</script>

<template>
  <div class="absolute h-screen w-screen flex flex-col bg-base-100 gap-2">
    <!-- Modal Header -->
    <div
      class="p-2 flex justify-between items-center py-2 border-b border-base-300"
    >
      <!-- Title -->
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            d="M4 1h6v6H4zm12 10h4v4h-4zm0 8h4v4h-4zM7 7v14h9m-9-8h9"
          />
        </svg>
        <div class="font-bold text-lg">Recepie Pipeline</div>
      </div>

      <!-- Close button -->
      <button @click="props.close" class="btn btn-sm btn-ghost">✕</button>
    </div>

    <!-- Pipeline List -->
    <div class="flex-1 overflow-y-auto p-2">
      <div
        v-for="(mod, i) in props.recepiePipeline"
        :key="mod.id + i"
        class="mb-2 p-2 rounded-xl bg-base-300 shadow-sm"
      >
        <!-- Module Row -->
        <div class="flex justify-between items-center">
          <div class="font-semibold text-sm truncate">
            {{ i + 1 }}. {{ mod.name }}
          </div>

          <div class="flex items-center gap-1">
            <!-- move up -->
            <button
              class="px-2 p-1 bg-primary text-primary-content rounded"
              @click="moveUp(i)"
              :disabled="i === 0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19"
                />
              </svg>
            </button>

            <!-- move down -->
            <button
              class="px-2 p-1 rounded bg-secondary text-secondary-content"
              @click="moveDown(i)"
              :disabled="i === props.recepiePipeline.length - 1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569z"
                />
              </svg>
            </button>

            <!-- remove -->
            <button
              class="bg-error text-error-content p-1 rounded px-2"
              @click="removeItem(i)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path
                    fill="currentColor"
                    fill-opacity="0.16"
                    d="M19 19.6V8H5v11.6A2.4 2.4 0 0 0 7.4 22h9.2a2.4 2.4 0 0 0 2.4-2.4"
                  />
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="1.5"
                    d="M19 8v11.6a2.4 2.4 0 0 1-2.4 2.4H7.4A2.4 2.4 0 0 1 5 19.6V8m11-3V3.2c0-.66-.54-1.2-1.2-1.2H9.2C8.54 2 8 2.54 8 3.2V5m8 0H8m8 0h5M8 5H3m9 6v6m3-6v6m-6-6v6"
                  />
                </g>
              </svg>
            </button>

            <!-- expand -->
            <button @click="toggle(i)" class="p-1 px-2">
              <div
                class="transition-transform duration-200"
                :class="openIndex === i ? 'rotate-90' : ''"
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
              </div>
            </button>
          </div>
        </div>

        <!-- Options panel -->
        <div
          v-if="openIndex === i"
          class="mt-2 p-2 bg-base-300 rounded-md text-xs flex flex-col gap-3"
        >
          <div v-if="Object.keys(mod.options).length === 0" class="opacity-60">
            No options
          </div>

          <div
            v-for="(opt, key) in mod.options"
            :key="key"
            class="flex flex-col gap-1 p-2 bg-base-200 rounded-md"
          >
            <!-- Label -->
            <label class="text-xs font-medium">{{ opt.label || key }}</label>

            <!-- TEXT -->
            <input
              v-if="opt.type === 'text'"
              type="text"
              class="input input-xs input-bordered w-full"
              :placeholder="opt.placeholder"
              :value="opt.value"
              @input="e => (mod.options[key].value = e.target.value)"
            />

            <!-- SELECT -->
            <select
              v-if="opt.type === 'select'"
              class="select select-xs select-bordered w-full"
              :value="opt.value"
              @change="e => (mod.options[key].value = e.target.value)"
            >
              <option v-for="c in opt.choices" :key="c" :value="c">
                {{ c }}
              </option>
            </select>

            <!-- NUMBER -->
            <input
              v-if="opt.type === 'number'"
              type="number"
              class="input input-xs input-bordered w-full"
              :value="opt.value"
              @input="e => (mod.options[key].value = Number(e.target.value))"
            />

            <!-- CHECKBOX -->
            <label
              v-if="opt.type === 'checkbox'"
              class="flex items-center gap-2"
            >
              <input
                type="checkbox"
                class="checkbox checkbox-xs"
                :checked="opt.value"
                @change="e => (mod.options[key].value = e.target.checked)"
              />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </div>

        <!-- Options panel
        <div
          v-if="openIndex === i"
          class="mt-2 p-2 bg-base-300 rounded-md text-xs"
        >
          <div v-if="Object.keys(mod.options).length === 0" class="opacity-60">
            No options
          </div>

          <div v-for="(opt, key) in mod.options" :key="key" class="py-1">
            <strong>{{ key }}:</strong>
            <span>{{ opt.value }}</span>
          </div>
        </div>
        -->
      </div>
    </div>
  </div>
</template>
