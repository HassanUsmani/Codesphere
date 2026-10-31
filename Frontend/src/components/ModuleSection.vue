<script setup>
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { missionById } from '@/data/missions'
import { isMissionDone } from '@/composables/useProgress'

const props = defineProps({
  module: { type: Object, required: true },
  alt: { type: Boolean, default: false },
})

const practiceItems = computed(() =>
  props.module.practice.map((item) => {
    if (item.type === 'mission') {
      const mission = missionById[item.id]
      return {
        key: `mission-${mission.id}`,
        href: `#/simulator?mission=${mission.id}`,
        icon: mission.icon,
        title: mission.title,
        text: mission.story,
        meta: `Guided mission · ${mission.minutes} min · ${mission.xp} XP`,
        done: isMissionDone(mission.id),
        cta: 'Start',
      }
    }
    return {
      key: `${item.href}-${item.label}`,
      href: item.href,
      icon: item.icon,
      title: item.label,
      text: item.text,
      meta: item.meta,
      done: false,
      cta: 'Open',
    }
  }),
)
</script>

<template>
  <section
    :id="module.id"
    class="module-sec"
    :class="[`tone--${module.tone}`, { 'is-alt': alt }]"
    :data-spy="module.id"
    :aria-labelledby="`${module.id}-title`"
  >
    <div class="container">
      <header class="module-sec__head">
        <div class="module-sec__intro">
          <p class="eyebrow">
            <span class="module-sec__num">{{ module.index }}</span>
            {{ module.kicker }}
          </p>
          <h2 :id="`${module.id}-title`" class="h2 module-sec__title">{{ module.name }}</h2>
          <p class="module-sec__lead">{{ module.intro }}</p>
        </div>

        <div class="module-sec__badge">
          <span class="module-sec__icon" aria-hidden="true">
            <AppIcon :name="module.icon" :size="24" />
          </span>
          <p class="module-sec__badgeText">{{ module.summary }}</p>
        </div>
      </header>

      <div class="practice">
        <div class="practice__head">
          <p class="eyebrow">Practise this module</p>
          <p class="practice__note tiny">
            Opens the existing guided mission or tool. Nothing changes in how it works.
          </p>
        </div>
        <ul class="practice__grid">
          <li v-for="item in practiceItems" :key="item.key">
            <a class="practice__item" :href="item.href">
              <span class="practice__icon" aria-hidden="true">
                <AppIcon :name="item.icon" :size="17" />
              </span>
              <span class="practice__body">
                <span class="practice__title">{{ item.title }}</span>
                <span class="practice__text">{{ item.text }}</span>
                <span class="practice__meta">{{ item.meta }}</span>
              </span>
              <span class="practice__go" :class="{ 'is-done': item.done }">
                <template v-if="item.done">
                  <AppIcon name="check" :size="11" /> Done
                </template>
                <template v-else>
                  {{ item.cta }} <AppIcon name="arrow-right" :size="12" />
                </template>
              </span>
            </a>
          </li>
        </ul>
      </div>

      <div class="module-sec__grid">
        <div class="module-sec__main">
          <article class="block">
            <h3 class="block__title">Scams to know</h3>
            <ul class="scam-list">
              <li v-for="scam in module.scams" :key="scam.title" class="scam-list__item">
                <p class="scam-list__title">{{ scam.title }}</p>
                <p class="scam-list__text">{{ scam.example }}</p>
              </li>
            </ul>
          </article>

          <article class="block">
            <h3 class="block__title">How scammers target people</h3>
            <ul class="dot-list">
              <li v-for="tactic in module.tactics" :key="tactic">{{ tactic }}</li>
            </ul>
          </article>

          <article class="block block--avoid">
            <h3 class="block__title">What to avoid</h3>
            <ul class="x-list">
              <li v-for="item in module.avoid" :key="item">
                <span class="x-list__mark" aria-hidden="true"><AppIcon name="x" :size="11" /></span>
                {{ item }}
              </li>
            </ul>
          </article>
        </div>

        <aside class="module-sec__aside">
          <article class="block block--flags">
            <h3 class="block__title">Red flags to check</h3>
            <ul class="flag-list">
              <li v-for="flag in module.redFlags" :key="flag">
                <span class="flag-list__box" aria-hidden="true" />
                {{ flag }}
              </li>
            </ul>
          </article>

          <article class="block">
            <h3 class="block__title">Everyday safety</h3>
            <ul class="check-list">
              <li v-for="tip in module.safety" :key="tip">
                <span class="check-list__mark" aria-hidden="true"><AppIcon name="check" :size="11" /></span>
                {{ tip }}
              </li>
            </ul>
          </article>

          <article class="block block--after">
            <h3 class="block__title">If it already happened</h3>
            <ol class="steps">
              <li v-for="step in module.after" :key="step">{{ step }}</li>
            </ol>
          </article>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.module-sec {
  padding-block: var(--section-y);
  border-top: 1px solid var(--line);
  scroll-margin-top: 5.5rem;
}

.module-sec.is-alt {
  background: var(--surface-soft);
}

/* ---------- head ---------- */
.module-sec__head {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(15rem, 0.8fr);
  gap: var(--card-gap);
  align-items: start;
  margin-bottom: var(--space-lg);
}

.module-sec__num {
  display: inline-grid;
  place-items: center;
  min-width: 1.6rem;
  height: 1.6rem;
  margin-right: 0.45rem;
  padding: 0 0.35rem;
  border-radius: 7px;
  background: var(--mint-100);
  color: var(--teal-700);
  font-size: 0.68rem;
  letter-spacing: 0;
}

.module-sec__title {
  margin-top: 0.5rem;
}

.module-sec__lead {
  margin-top: 0.75rem;
  max-width: 60ch;
  font-size: var(--step-0);
  line-height: 1.65;
  color: var(--ink-soft);
}

.module-sec__badge {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: var(--card-pad);
  border-radius: var(--r-xl);
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-xs);
}

.module-sec__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  flex: none;
  border-radius: 14px;
  color: #fff;
}

.tone--green .module-sec__icon {
  background: linear-gradient(145deg, var(--green-600), var(--green-500));
}

.tone--teal .module-sec__icon {
  background: linear-gradient(145deg, var(--teal-700), var(--teal-500));
}

.tone--deep .module-sec__icon {
  background: linear-gradient(145deg, var(--teal-900), var(--teal-600));
}

.tone--mint .module-sec__icon {
  background: linear-gradient(145deg, var(--teal-500), var(--green-500));
}

.tone--leaf .module-sec__icon {
  background: linear-gradient(145deg, var(--green-600), var(--mint-300));
  color: var(--teal-900);
}

.module-sec__badgeText {
  font-size: var(--step--1);
  line-height: 1.6;
  color: var(--muted);
}

/* ---------- practice (existing material) ---------- */
.practice {
  padding: var(--card-pad);
  border-radius: var(--r-xl);
  background: var(--paper);
  border: 1px solid var(--line-strong);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--card-gap);
}

.practice__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.9rem;
}

.practice__note {
  color: var(--muted);
}

.practice__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 0.65rem;
}

.practice__item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  height: 100%;
  padding: 0.75rem 0.8rem;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--surface-soft);
  color: var(--ink);
  text-decoration: none;
  transition: border-color 200ms var(--ease), transform 200ms var(--ease), box-shadow 200ms var(--ease);
}

.practice__item:hover {
  border-color: var(--teal-400);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.practice__icon {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  flex: none;
  border-radius: 10px;
  background: var(--mint-100);
  color: var(--teal-700);
}

.practice__body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.practice__title {
  font-size: 0.88rem;
  font-weight: 750;
  line-height: 1.3;
}

.practice__text {
  font-size: var(--step--2);
  line-height: 1.45;
  color: var(--muted);
}

.practice__meta {
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--teal-600);
}

.practice__go {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  flex: none;
  font-size: var(--step--2);
  font-weight: 750;
  color: var(--teal-700);
  white-space: nowrap;
}

.practice__go.is-done {
  color: var(--green-600);
}

/* ---------- content ---------- */
.module-sec__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(16rem, 0.85fr);
  gap: var(--card-gap);
  align-items: start;
}

.module-sec__main,
.module-sec__aside {
  display: flex;
  flex-direction: column;
  gap: var(--card-gap);
}

.module-sec__aside {
  position: sticky;
  top: 6rem;
}

.block {
  padding: var(--card-pad);
  border-radius: var(--r-xl);
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-xs);
}

.block__title {
  font-family: var(--font-display);
  font-size: var(--step-0);
  font-weight: 750;
  letter-spacing: -0.015em;
  margin-bottom: 0.75rem;
}

.block--flags {
  border-color: var(--teal-400);
  box-shadow: inset 0 3px 0 var(--teal-600), var(--shadow-xs);
}

.block--after {
  background: var(--surface-soft);
}

/* scam list */
.scam-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  gap: 0.55rem;
}

.scam-list__item {
  padding: 0.7rem 0.8rem;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  border-left: 3px solid var(--teal-500);
  background: var(--surface-soft);
}

.scam-list__title {
  font-size: 0.9rem;
  font-weight: 750;
  line-height: 1.35;
}

.scam-list__text {
  margin-top: 0.2rem;
  font-size: var(--step--1);
  line-height: 1.5;
  color: var(--muted);
}

/* dot list */
.dot-list,
.x-list,
.flag-list,
.check-list,
.steps {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.dot-list li {
  position: relative;
  padding-left: 1rem;
  font-size: var(--step--1);
  line-height: 1.55;
  color: var(--ink-soft);
}

.dot-list li::before {
  content: '';
  position: absolute;
  left: 0.1rem;
  top: 0.52em;
  width: 0.36rem;
  height: 0.36rem;
  border-radius: 50%;
  background: var(--teal-500);
}

.x-list li,
.check-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: var(--step--1);
  line-height: 1.55;
  color: var(--ink-soft);
}

.x-list__mark,
.check-list__mark {
  display: grid;
  place-items: center;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.12rem;
  flex: none;
  border-radius: 50%;
}

.x-list__mark {
  background: var(--danger-bg);
  border: 1px solid var(--danger-line);
  color: var(--danger);
}

.check-list__mark {
  background: var(--success-bg);
  border: 1px solid var(--mint-300);
  color: var(--green-600);
}

.flag-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: var(--step--1);
  line-height: 1.5;
  color: var(--ink-soft);
}

.flag-list__box {
  width: 1.05rem;
  height: 1.05rem;
  margin-top: 0.18rem;
  flex: none;
  border-radius: 4px;
  border: 2px solid var(--teal-500);
  background: var(--mint-50);
}

.steps {
  counter-reset: after;
}

.steps li {
  position: relative;
  counter-increment: after;
  padding-left: 1.9rem;
  font-size: var(--step--1);
  line-height: 1.55;
  color: var(--ink-soft);
}

.steps li::before {
  content: counter(after);
  position: absolute;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  background: var(--teal-700);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 750;
}

@media (max-width: 63.99rem) {
  .module-sec__head,
  .module-sec__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .module-sec__aside {
    position: static;
  }
}

@media (max-width: 47.99rem) {
  .practice__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .scam-list {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .practice__item:hover {
    transform: none;
  }
}
</style>
