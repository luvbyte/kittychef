<script setup lang="ts">
const props = defineProps<{
  module: any;
}>();

const emit = defineEmits(["update"]);
</script>

<template>
  <div class="p-4 w-full">
    <h3 class="font-bold text-lg mb-2">{{ module.name }} Options</h3>

    <div
      v-for="(opt, key) in module.options"
      :key="key"
      class="flex gap-2 mb-2"
      :class="
        opt.type != 'checkbox'
          ? 'flex-col '
          : 'flex-row flex-row-reverse justify-end items-center '
      "
    >
      <label class="text-sm font-medium">{{ opt.label }}</label>

      <!-- TEXT -->
      <input
        v-if="opt.type === 'text'"
        type="text"
        :placeholder="opt.placeholder"
        class="input input-bordered w-full"
        :value="opt.value"
        @input="e => emit('update', { key, value: e.target.value })"
      />

      <!-- SELECT -->
      <select
        v-if="opt.type === 'select'"
        class="select select-bordered w-full"
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
        class="input input-bordered w-full"
        :value="opt.value"
        @input="e => emit('update', { key, value: Number(e.target.value) })"
      />

      <!-- CHECKBOX -->
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
