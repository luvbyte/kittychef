<template>
  <div
    class="fixed fscreen inset-0 z-[999] flex flex-col items-center gap-4 pt-16 bg-base-100/60"
  >
    <div
      class="w-[90%] max-h-[80%] md:w-[60%] bg-base-100 shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-base-content/10"
    >
      <!-- Header -->
      <div class="p-5 pb-3">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-bold tracking-tight">KittyChef</h2>
            <Emoticon class="max-w-8" />
          </div>
          <div class="opacity-60">v{{ VERSION }}</div>
        </div>
        <p class="text-sm opacity-70 mt-1">
          Fast, mobile-first data transformation toolkit
        </p>
      </div>

      <!-- Divider -->
      <div class="divider my-0"></div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <!-- Feature Card -->
        <div class="glass rounded-xl p-3 transition hover:scale-[1.01]">
          <div class="flex items-start gap-3">
            <span class="text-lg">🔧</span>
            <div>
              <h3 class="font-semibold">Encoding & Decoding</h3>
              <p class="text-sm opacity-70">
                Base64, Text, Hex, URL, XOR & more
              </p>
            </div>
          </div>
        </div>

        <div class="glass rounded-xl p-3 transition hover:scale-[1.01]">
          <div class="flex items-start gap-3">
            <span class="text-lg">🧪</span>
            <div>
              <h3 class="font-semibold">Recipe Pipeline</h3>
              <p class="text-sm opacity-70">
                Chain and run multiple transformations
              </p>
            </div>
          </div>
        </div>

        <div class="glass rounded-xl p-3 transition hover:scale-[1.01]">
          <div class="flex items-start gap-3">
            <span class="text-lg">⚡</span>
            <div>
              <h3 class="font-semibold">Quick Insights</h3>
              <p class="text-sm opacity-70">Length, words, lines & byte size</p>
            </div>
          </div>
        </div>

        <div class="glass rounded-xl p-3 transition hover:scale-[1.01]">
          <div class="flex items-start gap-3">
            <span class="text-lg">🎛</span>
            <div>
              <h3 class="font-semibold">Mobile UI</h3>
              <p class="text-sm opacity-70">
                Smooth, touch-first, fast interactions
              </p>
            </div>
          </div>
        </div>

        <!-- Coming Soon Badge -->
        <div class="text-xs text-center opacity-60 pt-2">
          ❤ Created by @luvbyte
        </div>
      </div>

      <!-- Footer CTA -->
      <div class="p-4 border-t border-base-content/10">
        <button
          @click="emit('close')"
          class="btn btn-primary w-full rounded-xl"
        >
          Start Cooking
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <!-- checkbox -->
    <label class="flex flex gap-1 items-center justify-center">
      <input type="checkbox" class="checkbox" v-model="noIntroFlag" />
      <h1>Don’t show at startup</h1>
    </label>
  </div>
</template>

<script setup>
  import { ref, watch } from "vue";
  import { VERSION } from "@/api/config";

  import Emoticon from "@/components/Emoticon.vue";

  const noIntroFlag = ref(localStorage.getItem("no-intro") === "true");
  const emit = defineEmits(["close"]);

  watch(noIntroFlag, newVal => {
    localStorage.setItem("no-intro", newVal);
  });
</script>
