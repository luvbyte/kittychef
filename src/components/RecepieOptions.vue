<script setup lang="ts">
  const props = defineProps<{
    module: any;
  }>();

  const emit = defineEmits(["update"]);
</script>

<template>
  <div class="p-2 w-full flex flex-col gap-2 overflow-y-auto">
    <div v-for="(opt, key) in module.options" :key="key" class="flex flex-col">
      <!-- label -->
      <div v-if="opt.type !== 'checkbox'">{{ opt.label }}</div>
      <!-- TEXT -->
      <input
        v-if="opt.type === 'text'"
        type="text"
        :placeholder="opt.placeholder"
        class="input input-sm input-bordered w-full bg-transparent focus:outline-none placeholder:opacity-60"
        :value="opt.value"
        @input="e => emit('update', { key, value: e.target.value })"
      />

      <!-- TEXTAREA -->
      <textarea
        v-if="opt.type === 'textarea'"
        :placeholder="opt.placeholder"
        class="textarea textarea-sm textarea-bordered w-full bg-transparent focus:outline-none placeholder:opacity-60"
        :value="opt.value"
        @input="e => emit('update', { key, value: e.target.value })"
      ></textarea>

      <!-- SELECT -->
      <select
        v-if="opt.type === 'select'"
        class="select select-sm select-bordered w-full focus:outline-none"
        :value="opt.value"
        @change="e => emit('update', { key, value: e.target.value })"
      >
        <option v-for="c in opt.choices" :key="c">{{ c }}</option>
      </select>

      <!-- NUMBER -->
      <input
        v-if="opt.type === 'number'"
        type="number"
        :placeholder="opt.placeholder"
        class="input input-sm input-bordered w-full bg-transparent focus:outline-none placeholder:opacity-60"
        :value="opt.value"
        @input="e => emit('update', { key, value: Number(e.target.value) })"
      />

      <!-- CHECKBOX -->
      <label
        v-if="opt.type === 'checkbox'"
        class="w-full flex items-center gap-2"
      >
        <input
          type="checkbox"
          class="checkbox checkbox-secondary"
          :checked="opt.value"
          @change="e => emit('update', { key, value: e.target.checked })"
        />
        <span class="text-sm font-medium">{{ opt.label }}</span>
      </label>

      <span class="text-xs opacity-60 italic">{{ opt.info }}</span>
    </div>
  </div>
</template>
