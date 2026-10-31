<script setup>
import AppIcon from '@/components/AppIcon.vue'
import { a11y, resetA11y, toggle } from '@/composables/useA11y'

const options = [
  { key: 'largeText', label: 'Larger text', icon: 'text-size' },
  { key: 'highContrast', label: 'High contrast', icon: 'contrast' },
  { key: 'reduceMotion', label: 'Reduce motion', icon: 'motion' },
  { key: 'senior', label: 'Senior mode', icon: 'accessibility' },
]
</script>

<template>
  <div class="a11y-bar">
    <p class="a11y-bar__label">
      <AppIcon name="accessibility" :size="14" />
      Make this page comfortable
    </p>
    <div class="a11y-bar__chips">
      <button
        v-for="option in options"
        :key="option.key"
        type="button"
        class="chip"
        :aria-pressed="a11y[option.key]"
        @click="toggle(option.key)"
      >
        <AppIcon :name="option.icon" :size="14" />
        {{ option.label }}
      </button>
      <button type="button" class="a11y-bar__reset" @click="resetA11y">Reset</button>
    </div>
  </div>
</template>

<style scoped>
.a11y-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  flex-wrap: wrap;
  padding: 0.75rem 0.9rem;
  border-radius: var(--r-lg);
  background: var(--paper);
  border: 1px solid var(--line);
}

.a11y-bar__label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--step--1);
  font-weight: 650;
  color: var(--ink-soft);
}

.a11y-bar__chips {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.a11y-bar__chips .chip {
  min-height: 2.1rem;
  font-size: var(--step--2);
  padding: 0 0.7rem;
}

.a11y-bar__reset {
  font-size: var(--step--2);
  font-weight: 650;
  color: var(--teal-700);
  padding: 0.35rem 0.4rem;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
