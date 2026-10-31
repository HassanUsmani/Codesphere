<script setup>
defineProps({
  scene: { type: String, default: 'blank' },
})
</script>

<template>
  <div class="scene" :class="`scene--${scene}`" aria-hidden="true">
    <template v-if="scene === 'garden'">
      <span class="scene__sun" />
      <span class="hill-a scene__hill" />
      <span class="hill-b scene__hill" />
      <span class="leaf leaf-1" />
      <span class="leaf leaf-2" />
      <span class="bloom bloom-1" />
      <span class="bloom bloom-2" />
      <span class="bloom bloom-3" />
      <span class="bloom bloom-4" />
    </template>
    <template v-else-if="scene === 'tea'">
      <span class="table" />
      <span class="steam" />
      <span class="steam steam--b" />
      <span class="saucer" />
      <span class="cup" />
    </template>
    <template v-else-if="scene === 'family'">
      <span class="table" />
      <span class="person p1" />
      <span class="person p2" />
      <span class="person p3" />
      <span class="plate" />
    </template>
    <template v-else-if="scene === 'shrine'">
      <span class="moon" />
      <span class="dome" />
      <span class="base" />
      <span class="lamp" style="left: 26%" />
      <span class="lamp" style="right: 26%" />
    </template>
  </div>
</template>
