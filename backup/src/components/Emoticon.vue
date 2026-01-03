<script setup lang="ts">
import { ref } from "vue";

const emoticonsList: string[] = [
  "( ꜆⌯' '⌯)꜆♡",
  "( ⊃🌹⊂ )",
  "╰(⸝⸝⸝´꒳`⸝⸝⸝)╯",
  "(՞⸝⸝ᵒ̴̶̷꒳ᵒ̴̶̷⸝⸝՞)💕",
  "ᡕᠵ᠊ᡃ࡚ࠢ࠘ ⸝່ࠡࠣ᠊߯᠆ࠣ࠘ᡁࠣ࠘᠊᠊ࠢ࠘𐡏 💕"
];

const emoticon = ref<string>(emoticonsList[0]);

let index: number = 0;

function nextEmoticon(): void {
  index = (index + 1) % emoticonsList.length;
  emoticon.value = emoticonsList[index];
}
</script>

<template>
  <div
    class="w-full h-full flex items-center justify-center text-secondary-content cursor-pointer select-none"
    @click="nextEmoticon"
  >
    {{ emoticon }}
  </div>
</template>
