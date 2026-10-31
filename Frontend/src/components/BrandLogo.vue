<script setup>
defineProps({
  size: { type: [Number, String], default: 34 },
  showText: { type: Boolean, default: true },
})
</script>

<template>
  <span class="brand-logo">
    <span class="brand-logo__mark" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <rect x="11.2" y="7.6" width="17.6" height="24.8" rx="4.2" class="brand-logo__phone" />
        <path d="M15.4 19.6l3 3 6-6.6" class="brand-logo__check" />
        <circle cx="20" cy="27.2" r="1.15" class="brand-logo__dot" />
        <path d="M30.6 8.2l.85 2.05 2.05.85-2.05.85-.85 2.05-.85-2.05-2.05-.85 2.05-.85Z" class="brand-logo__spark" />
      </svg>
    </span>
    <span v-if="showText" class="brand-logo__text">Tech Guide</span>
  </span>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.brand-logo__mark {
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 12px;
  background: linear-gradient(145deg, var(--teal-700), var(--green-500));
  box-shadow: 0 8px 18px -10px rgba(15, 118, 110, 0.9);
}

.brand-logo__mark svg {
  width: 100%;
  height: 100%;
}

.brand-logo__phone {
  fill: none;
  stroke: #fff;
  stroke-width: 2.1;
}

.brand-logo__check {
  fill: none;
  stroke: var(--mint-300);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.brand-logo__dot {
  fill: var(--mint-300);
}

.brand-logo__spark {
  fill: var(--mint-300);
}

.brand-logo__text {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink);
  white-space: nowrap;
}
</style>
