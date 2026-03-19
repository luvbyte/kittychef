<template>
  <div
    class="fixed p-4 inset-0 fscreen z-60 flex items-center justify-center bg-black/60"
  >
    <div
      class="bg-base-100 w-full md:w-1/2 p-6 rounded-lg shadow-lg flex flex-col gap-2"
    >
      <h2 class="text-lg font-bold">Save File</h2>

      <!-- Filename -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">Filename</label>
        <input
          v-model="filename"
          type="text"
          placeholder="Filename"
          class="input input-sm w-full max-w-md focus:outline-none placeholder:opacity-60"
        />
      </div>

      <!-- File Type -->
      <div v-if="file.dataType === null" class="flex flex-col gap-1">
        <label class="text-sm font-medium">File Type</label>
        <select v-model="selectedType" class="select select-sm w-full max-w-md">
          <option value="text/plain">TXT (.txt)</option>
          <option value="application/json">JSON (.json)</option>
          <option value="application/pdf">PDF (.pdf)</option>
          <option value="application/octet-stream">Binary (.bin)</option>
        </select>
      </div>

      <!-- Fixed File Type (read-only display) -->
      <div v-else class="flex flex-col gap-1">
        <label class="text-sm font-medium">File Type</label>
        <div class="px-3 py-2 border rounded bg-gray-100 text-sm">
          {{ activeType }}
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-2 flex justify-end gap-2">
        <button class="btn btn-sm" @click="$emit('close')">Cancel</button>

        <button class="btn btn-sm btn-secondary" @click="downloadFile">
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";

  // Supported MIME Types
  type SupportedType =
    | "text/plain"
    | "application/json"
    | "application/pdf"
    | "application/octet-stream";

  interface SaveFilePayload {
    data: Uint8Array;
    dataType: SupportedType | null;
    name: string | null;
  }

  const props = defineProps<{
    file: SaveFilePayload;
  }>();

  const emit = defineEmits<{
    (e: "close"): void;
  }>();

  const filename = ref(props.file.name || "output");

  // Used only if parent did NOT fix the type
  // const selectedType = ref<SupportedType>("application/octet-stream");
  const selectedType = ref<SupportedType>("text/plain");

  // Computed Active MIME Type
  const activeType = computed<SupportedType>(() => {
    return props.file.dataType ?? selectedType.value;
  });

  // Extension Resolver
  const extension = computed(() => {
    switch (activeType.value) {
      case "text/plain":
        return "txt";
      case "application/json":
        return "json";
      case "application/pdf":
        return "pdf";
      default:
        return "bin";
    }
  });

  const downloadFile = () => {
    if (!props.file?.data || !filename.value.trim()) return;

    const blob = new Blob([props.file.data], {
      type: activeType.value
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename.value.trim()}.${extension.value}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    emit("close");
  };
</script>
