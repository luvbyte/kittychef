<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from "vue";

  const idleFrames = ["😺", "😺", "😸", "😺"];
  const loveBurstFrames = ["😻", "😽", "😻"];

  const emoticon = ref(idleFrames[0]);

  let frameIndex = 0;
  let intervalId: number | undefined;
  let isHovering = false;
  let isBursting = false;

  function startIdle() {
    stopLoop();
    intervalId = window.setInterval(() => {
      if (isHovering || isBursting) return;
      frameIndex = (frameIndex + 1) % idleFrames.length;
      emoticon.value = idleFrames[frameIndex];
    }, 300);
  }

  function stopLoop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function onHover() {
    isHovering = true;
    emoticon.value = "😻";
  }

  function onLeave() {
    isHovering = false;
  }

  function onClick() {
    if (isBursting) return;
    isBursting = true;
    stopLoop();

    let i = 0;
    intervalId = window.setInterval(() => {
      emoticon.value = loveBurstFrames[i];
      i++;
      if (i >= loveBurstFrames.length) {
        isBursting = false;
        frameIndex = 0;
        startIdle();
      }
    }, 200);
  }

  onMounted(startIdle);
  onBeforeUnmount(stopLoop);
</script>

<template>
  <div
    class="w-full h-full flex items-center justify-center cursor-pointer select-none text-xl"
    @mouseenter="onHover"
    @mouseleave="onLeave"
    @click="onClick"
  >
    {{ emoticon }}
  </div>
</template>
