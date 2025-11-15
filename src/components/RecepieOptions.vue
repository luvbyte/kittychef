<script setup lang="ts">
const props = defineProps<{
  module: any;
}>();

const emit = defineEmits(["update"]);
</script>

<template>
  <div class="p-4 w-full">
    <h3 class="font-bold text-lg mb-2">{{ module.name }} Options</h3>

    <div v-for="(opt, key) in module.options" :key="key" class="mb-3">
      <label class="block text-sm font-medium mb-1">{{ opt.label }}</label>

      <!-- Text -->
      <input
        v-if="opt.type === 'text'"
        type="text"
        :placeholder="opt.placeholder"
        class="input input-bordered w-full"
        :value="opt.value"
        @input="e => emit('update', { key, value: e.target.value })"
      />

      <!-- Select -->
      <select
        v-if="opt.type === 'select'"
        class="select select-bordered w-full"
        :value="opt.value"
        @change="e => emit('update', { key, value: e.target.value })"
      >
        <option v-for="c in opt.choices" :key="c">{{ c }}</option>
      </select>

      <!-- Number -->
      <input
        v-if="opt.type === 'number'"
        type="number"
        :placeholder="opt.placeholder"
        class="input input-bordered w-full"
        :value="opt.value"
        @input="e => emit('update', { key, value: Number(e.target.value) })"
      />

      <!-- Checkbox -->
      <input
        v-if="opt.type === 'checkbox'"
        type="checkbox"
        class="checkbox"
        :checked="opt.value"
        @change="e => emit('update', { key, value: e.target.checked })"
      />
    </div>
  </div>
</template>
