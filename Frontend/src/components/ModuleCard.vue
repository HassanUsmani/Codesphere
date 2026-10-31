<script setup>
import AppIcon from '@/components/AppIcon.vue'

defineProps({
  module: { type: Object, required: true },
})

defineEmits(['select'])
</script>

<template>
  <a
    class="module-card"
    :class="`tone--${module.tone}`"
    :href="`#/practice?section=${module.id}`"
    @click.prevent="$emit('select', module.id)"
  >
    <span class="module-card__icon" aria-hidden="true">
      <AppIcon :name="module.icon" :size="26" />
    </span>

    <span class="module-card__body">
      <span class="module-card__index">Module {{ module.index }}</span>
      <span class="module-card__title">{{ module.name }}</span>
      <span class="module-card__text">{{ module.summary }}</span>
    </span>

    <span class="module-card__cta">
      Learn more
      <AppIcon name="arrow-right" :size="15" />
    </span>
  </a>
</template>

<style scoped>
.module-card {
  display: flex;
  align-items: center;
  gap: var(--card-pad);
  padding: var(--card-pad);
  border-radius: var(--r-xl);
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-xs);
  text-decoration: none;
  color: var(--ink);
  transition: transform 240ms var(--ease), box-shadow 240ms var(--ease), border-color 240ms var(--ease);
}

.module-card:hover {
  transform: translateY(-3px);
  border-color: var(--teal-400);
  box-shadow: var(--shadow-md);
}

.module-card__icon {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  flex: none;
  border-radius: 18px;
  color: #fff;
  box-shadow: 0 12px 24px -16px rgba(6, 48, 45, 0.9);
}

.tone--green .module-card__icon {
  background: linear-gradient(145deg, var(--green-600), var(--green-500));
}

.tone--teal .module-card__icon {
  background: linear-gradient(145deg, var(--teal-700), var(--teal-500));
}

.tone--deep .module-card__icon {
  background: linear-gradient(145deg, var(--teal-900), var(--teal-600));
}

.tone--mint .module-card__icon {
  background: linear-gradient(145deg, var(--teal-500), var(--green-500));
}

.tone--leaf .module-card__icon {
  background: linear-gradient(145deg, var(--green-600), var(--mint-300));
  color: var(--teal-900);
}

.module-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 0;
}

.module-card__index {
  font-size: var(--step--2);
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--teal-600);
}

.module-card__title {
  font-family: var(--font-display);
  font-size: var(--step-2);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.module-card__text {
  font-size: var(--step--1);
  line-height: 1.55;
  color: var(--muted);
  max-width: 62ch;
}

.module-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex: none;
  min-height: 2.6rem;
  padding: 0 1.1rem;
  border-radius: var(--r-pill);
  background: var(--mint-100);
  color: var(--teal-700);
  font-size: var(--step--1);
  font-weight: 750;
  transition: background 200ms var(--ease), gap 200ms var(--ease);
}

.module-card:hover .module-card__cta {
  background: var(--mint-200);
  gap: 0.5rem;
}

@media (max-width: 47.99rem) {
  .module-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .module-card__icon {
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 15px;
  }

  .module-card__cta {
    width: 100%;
    justify-content: space-between;
  }
}

@media (prefers-reduced-motion: reduce) {
  .module-card:hover {
    transform: none;
  }
}
</style>
