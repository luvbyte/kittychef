<script setup lang="ts">
  const props = defineProps<{
    module: Object;
  }>();

  const emit = defineEmits(["update"]);
</script>

<template>
  <div class="p-4 w-full">
    <div
      v-for="(opt, key) in module.options"
      :key="key"
      class="flex gap-1 flex-col"
    >
      <!--
      <label class="text-sm font-medium">{{ opt.label }}</label>
    -->
      <div class="divider m-0">{{ opt.label }}</div>

      <!-- TEXT -->
      <input
        v-if="opt.type === 'text'"
        type="text"
        :placeholder="opt.placeholder"
        class="input input-sm input-bordered w-full bg-transparent focus:outline-none"
        :value="opt.value"
        @input="e => emit('update', { key, value: e.target.value })"
      />

      <!-- SELECT -->
      <select
        v-if="opt.type === 'select'"
        class="select select-sm select-bordered w-full bg-transparent focus:outline-none"
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
        class="input input-sm input-bordered w-full bg-transparent focus:outline-none"
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
          class="checkbox checkbox-primary"
          :checked="opt.value"
          @change="e => emit('update', { key, value: e.target.checked })"
        />
        <span class="text-sm font-medium">{{ opt.label }}</span>
      </label>

      <span class="text-xs opacity-60 italic">{{ opt.info }}</span>
    </div>
  </div>
</template>
