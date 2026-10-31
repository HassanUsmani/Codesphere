<script setup>
import AppIcon from '@/components/AppIcon.vue'
import { a11y, resetA11y, toggle } from '@/composables/useA11y'

const options = [
  { key: 'largeText', label: 'Larger text', sub: 'Bigger words everywhere', icon: 'text-size' },
  { key: 'highContrast', label: 'High contrast', sub: 'Stronger borders and darker text', icon: 'contrast' },
  { key: 'reduceMotion', label: 'Reduce motion', sub: 'Stop slides and pulses', icon: 'motion' },
  { key: 'senior', label: 'Senior mode', sub: 'Bigger buttons, one column, simple layout', icon: 'accessibility' },
]
</script>

<template>
  <details class="a11y-menu">
    <summary class="a11y-menu__trigger">
      <AppIcon name="accessibility" :size="17" />
      <span class="a11y-menu__label">Accessibility</span>
    </summary>
    <div class="a11y-menu__panel">
      <p class="a11y-menu__title">Make it easier to use</p>
      <button
        v-for="option in options"
        :key="option.key"
        type="button"
        class="a11y-menu__row"
        :aria-pressed="a11y[option.key]"
        @click="toggle(option.key)"
      >
        <span class="a11y-menu__icon"><AppIcon :name="option.icon" :size="16" /></span>
        <span class="a11y-menu__text">
          <span class="a11y-menu__name">{{ option.label }}</span>
          <span class="a11y-menu__sub">{{ option.sub }}</span>
        </span>
        <span class="a11y-menu__switch" :class="{ 'is-on': a11y[option.key] }" aria-hidden="true"><span /></span>
      </button>
      <button type="button" class="a11y-menu__reset" @click="resetA11y">Reset all settings</button>
    </div>
  </details>
</template>

<style scoped>
.a11y-menu {
  position: relative;
}

.a11y-menu__trigger {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2.35rem;
  padding: 0 0.7rem;
  border-radius: var(--r-pill);
  color: var(--ink-soft);
  font-size: 0.86rem;
  font-weight: 650;
  cursor: pointer;
  list-style: none;
  transition: background 180ms ease, color 180ms ease;
}

.a11y-menu__trigger::-webkit-details-marker {
  display: none;
}

.a11y-menu__trigger:hover,
.a11y-menu[open] .a11y-menu__trigger {
  background: var(--mint-100);
  color: var(--teal-700);
}

.a11y-menu__panel {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  z-index: 80;
  width: min(19rem, calc(100vw - 2rem));
  padding: 0.75rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg);
}

.a11y-menu__title {
  font-size: var(--step--2);
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 0.1rem 0.35rem 0.4rem;
}

.a11y-menu__row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.45rem 0.4rem;
  border-radius: var(--r-sm);
  text-align: left;
}

.a11y-menu__row:hover {
  background: var(--mint-50);
}

.a11y-menu__icon {
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  background: var(--mint-100);
  color: var(--teal-700);
  flex: none;
}

.a11y-menu__text {
  flex: 1;
  min-width: 0;
}

.a11y-menu__name {
  display: block;
  font-size: 0.9rem;
  font-weight: 650;
}

.a11y-menu__sub {
  display: block;
  font-size: var(--step--2);
  color: var(--muted);
  line-height: 1.35;
}

.a11y-menu__switch {
  width: 2.2rem;
  height: 1.25rem;
  padding: 0.12rem;
  border-radius: 999px;
  background: var(--line-strong);
  flex: none;
  transition: background 180ms ease;
}

.a11y-menu__switch span {
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(6, 48, 45, 0.3);
  transition: transform 200ms var(--ease);
}

.a11y-menu__switch.is-on {
  background: var(--green-500);
}

.a11y-menu__switch.is-on span {
  transform: translateX(0.95rem);
}

.a11y-menu__reset {
  width: 100%;
  margin-top: 0.4rem;
  padding: 0.45rem;
  border-top: 1px solid var(--line);
  font-size: var(--step--1);
  font-weight: 650;
  color: var(--teal-700);
}

.a11y-menu__reset:hover {
  color: var(--teal-800);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 30rem) {
  .a11y-menu__label {
    display: none;
  }

  .a11y-menu__trigger {
    width: 2.35rem;
    padding: 0;
    justify-content: center;
  }
}
</style>
