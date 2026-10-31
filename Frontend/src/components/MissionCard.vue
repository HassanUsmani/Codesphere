<script setup>
import AppIcon from '@/components/AppIcon.vue'

defineProps({
  mission: { type: Object, required: true },
  done: { type: Boolean, default: false },
})
</script>

<template>
  <a
    class="mission"
    :class="[`mission--${mission.pathway}`, { 'is-done': done }]"
    :href="`#/simulator?mission=${mission.id}`"
  >
    <span class="mission__top">
      <span class="mission__icon"><AppIcon :name="mission.icon" :size="20" /></span>
      <span v-if="mission.isNew" class="mission__new">New</span>
      <span v-if="done" class="mission__done"><AppIcon name="check" :size="11" /> Done</span>
    </span>
    <span class="mission__title">{{ mission.title }}</span>
    <span class="mission__story">{{ mission.story }}</span>
    <span class="mission__meta">
      <span class="meta"><AppIcon name="clock" :size="12" /> {{ mission.minutes }} min</span>
      <span class="meta"><AppIcon name="bolt" :size="12" /> {{ mission.xp }} XP</span>
      <span class="spacer" />
      <span class="mission__go">
        {{ done ? 'Practise again' : 'Start' }}
        <AppIcon name="arrow-right" :size="13" />
      </span>
    </span>
  </a>
</template>

<style scoped>
.mission {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.05rem 1.1rem 1rem;
  border-radius: var(--r-lg);
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-xs);
  text-decoration: none;
  color: var(--ink);
  transition: transform 240ms var(--ease), box-shadow 240ms var(--ease), border-color 240ms var(--ease);
}

.mission:hover {
  transform: translateY(-3px);
  border-color: var(--teal-400);
  box-shadow: var(--shadow-md);
}

.mission__top {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.6rem;
}

.mission__icon {
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 14px;
  background: linear-gradient(145deg, var(--mint-100), var(--mint-200));
  color: var(--teal-700);
}

.mission--safety .mission__icon {
  background: linear-gradient(145deg, #e8f8ef, #c8efe2);
  color: var(--green-600);
}

.mission__new {
  padding: 0.1rem 0.4rem;
  border-radius: var(--r-pill);
  background: var(--teal-700);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 750;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mission__done {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  margin-left: auto;
  padding: 0.1rem 0.45rem;
  border-radius: var(--r-pill);
  background: var(--success-bg);
  color: #04624f;
  font-size: 0.6rem;
  font-weight: 750;
}

.mission__title {
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 750;
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.mission__story {
  display: block;
  margin-top: 0.3rem;
  font-size: var(--step--1);
  line-height: 1.45;
  color: var(--muted);
  flex: 1;
}

.mission__meta {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 0.85rem;
  padding-top: 0.65rem;
  border-top: 1px solid var(--line);
}

.mission__go {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--step--1);
  font-weight: 700;
  color: var(--teal-700);
  white-space: nowrap;
}

.mission:hover .mission__go {
  gap: 0.4rem;
}

@media (prefers-reduced-motion: reduce) {
  .mission:hover {
    transform: none;
  }
}
</style>
