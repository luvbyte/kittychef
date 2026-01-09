<script setup lang="ts">
  import { ref } from "vue";
  import modules from "@/core/modules";

  import RecepieOptions from "@/components/RecepieOptions.vue";

  const props = defineProps<{
    recepiePipeline: any[];
    clearPipeline: () => void;
    addRecepie: () => void;
    close: () => void;
  }>();

  const collapsedPipelines = ref([]);

  function toggleOptions(mod: any, i) {
    // skip if module has no options and no description
    if (Object.keys(mod.options).length <= 0 && mod.description.length <= 0)
      return;

    const key = mod.id + i;

    const index = collapsedPipelines.value.indexOf(key);
    // if not exists
    if (index === -1) {
      collapsedPipelines.value.push(key);
    } else {
      collapsedPipelines.value.splice(index, 1);
    }
  }

  // Clear
  function clear() {
    props.clearPipeline();
    collapsedPipelines.value = [];
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

  function removeItem(i: number, mod) {
    props.recepiePipeline.splice(i, 1);

    const index = collapsedPipelines.value.indexOf(mod.id);
    if (index !== -1) {
      collapsedPipelines.value.splice(index, 1);
    }
  }

  // EXPORT  (ONLY IDs + option values)
  function exportPipeline() {
    const clean = props.recepiePipeline.map(mod => {
      const opts = {};
      for (const key in mod.options) {
        opts[key] = mod.options[key].value;
      }
      return {
        id: mod.id,
        options: opts
      };
    });

    const data = JSON.stringify(clean, null, 2);
    const blob = new Blob([data], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kittychef_pipeline.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // IMPORT (REBUILD FROM modules OBJECT)
  function importPipeline() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = async e => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text);

        if (!Array.isArray(imported)) {
          alert("Invalid pipeline file");
          return;
        }

        const rebuilt = imported
          .map(item => {
            const base = modules[item.id]; // lookup module
            if (!base) return null;

            // shallow clone module WITHOUT destroying run() function
            const modClone = {
              ...base,
              options: {}
            };

            // options
            for (const key in base.options) {
              modClone.options[key] = {
                ...base.options[key],
                value: item.options?.[key] ?? base.options[key].default ?? ""
              };
            }

            return modClone;
          })
          .filter(Boolean); // remove nulls

        props.recepiePipeline.splice(
          0,
          props.recepiePipeline.length,
          ...rebuilt
        );

        alert("Pipeline imported successfully!");
      } catch (err) {
        alert("Failed to import pipeline: " + err.message);
      }
    };

    input.click();
  }
</script>

<template>
  <div class="absolute h-screen w-screen flex flex-col bg-base-100 gap-2">
    <!-- Modal Header -->
    <div class="p-2 flex justify-between items-center border-b border-base-300">
      <!-- Title -->
      <div class="flex items-center gap-2">
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
        <div class="font-bold text-lg pt-1">{{ $t("headings.recepies") }}</div>
      </div>

      <!-- Close button -->
      <div @click="props.close">
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
      </div>
    </div>

    <div class="flex justify-between gap-1 px-2 text-sm font-medium">
      <div class="flex gap-1 items-center">
        <!-- Clear -->
        <button
          @click="clear"
          class="px-3 py-1 bg-error/80 text-error-content rounded shadow-lg active:bg-error transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4 17q-.425 0-.712-.288T3 16t.288-.712T4 15h12q.425 0 .713.288T17 16t-.288.713T16 17zm2-4q-.425 0-.712-.288T5 12t.288-.712T6 11h12q.425 0 .713.288T19 12t-.288.713T18 13zm2-4q-.425 0-.712-.288T7 8t.288-.712T8 7h12q.425 0 .713.288T21 8t-.288.713T20 9z"
            />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-1">
        <!-- IMPORT -->
        <button
          @click="importPipeline"
          class="flex items-center gap-1 px-3 py-1 bg-primary/80 text-primary-content rounded shadow-lg active:bg-primary transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.5"
            >
              <path d="M4 12a8 8 0 1 0 16 0" />
              <path stroke-linejoin="round" d="M12 4v10m0 0l3-3m-3 3l-3-3" />
            </g>
          </svg>
          <span>Import</span>
        </button>

        <!-- EXPORT -->
        <button
          @click="exportPipeline"
          class="flex items-center gap-1 px-3 py-1 bg-secondary/80 text-secondary-content rounded shadow-lg active:bg-secondary transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.5"
            >
              <path d="M4 12a8 8 0 1 0 16 0" />
              <path stroke-linejoin="round" d="M12 14V4m0 0l3 3m-3-3L9 7" />
            </g>
          </svg>
          <span>Export</span>
        </button>

        <!-- ADD BTN -->
        <button
          @click="addRecepie"
          class="px-3 py-1 bg-success/80 text-success-content rounded shadow-lg active:bg-success transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 48 48"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linejoin="round"
              stroke-width="4"
            >
              <rect width="36" height="36" x="6" y="6" rx="3" />
              <path stroke-linecap="round" d="M24 16v16m-8-8h16" />
            </g>
          </svg>
        </button>
      </div>
    </div>

    <!-- Pipeline List -->
    <div class="flex-1 overflow-y-auto p-2">
      <div
        v-for="(mod, i) in props.recepiePipeline"
        :key="mod.id + i"
        @click="toggleOptions(mod, i)"
        class="mb-2 p-1 rounded-xl bg-base-200 text-base-content shadow-sm"
      >
        <!-- Module Row -->
        <div class="flex justify-between items-center px-2 py-1">
          <div class="font-semibold text-sm truncate">
            {{ i + 1 }}. {{ mod.name }}
          </div>

          <div @click.stop class="flex items-center gap-1">
            <!-- Remove -->
            <button class="btn btn-xs btn-error" @click="removeItem(i, mod)">
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

            <!-- Move up -->
            <button
              class="btn btn-xs btn-primary"
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

            <!-- Move down -->
            <button
              class="btn btn-xs btn-secondary"
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

            <!-- Expand -->
            <button @click="toggleOptions(mod, i)" class="disabled:opacity-40">
              <div
                class="transition-transform duration-200"
                :class="
                  collapsedPipelines.includes(mod.id + i) ? 'rotate-90' : ''
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
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

        <Transition name="fade-scale">
          <div v-if="collapsedPipelines.includes(mod.id + i)" @click.stop>
            <!-- Description -->
            <div class="text-center text-sm text-xs p-2 opacity-80">
              {{ mod.description }}
            </div>
            <!-- Options panel -->
            <RecepieOptions
              :module="mod"
              @update="data => (mod.options[data.key].value = data.value)"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
