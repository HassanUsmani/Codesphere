<script setup>
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import ScamSimulator from '@/components/ScamSimulator.vue'
import { levels } from '@/data/scamLevels'
import { completeScamLevel, completedScamLevels, progress } from '@/composables/useProgress'
import { navigate, route } from '@/lib/router'

const level = computed(() => levels.find((l) => l.id === route.params.level) || levels[0])

const rules = [
  {
    icon: 'clock',
    title: 'Slow the clock',
    text: 'Urgency is a tool. A real bank, courier or family member can wait ten minutes while you check.',
  },
  {
    icon: 'search',
    title: 'Read the sender and the link',
    text: 'Look at the full address, the part before the first slash, and whether the number is saved.',
  },
  {
    icon: 'phone',
    title: 'Verify on a route you chose',
    text: 'Call the number on your card or open the official app yourself — never the contact details in the message.',
  },
]

function choose(id) {
  navigate('scam', { level: id }, { replace: true })
}

function onComplete({ correct, total }) {
  completeScamLevel(level.value.id, { correct, total })
}

function nextLevel() {
  const at = levels.findIndex((l) => l.id === level.value.id)
  const next = levels[(at + 1) % levels.length]
  choose(next.id)
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}
</script>

<template>
  <div class="scam-view">
    <section class="scam-hero">
      <div class="container">
        <p class="eyebrow">Practice · Scam Simulator</p>
        <h1 class="h1 scam-hero__title">Judge the message, not the panic.</h1>
        <p class="lead scam-hero__lead">
          Five realistic messages in one module. Inspect the sender, the words and the links, then decide:
          safe, check first, or scam. Nothing opens a real link.
        </p>

        <div class="scam-hero__strip">
          <div class="scam-hero__stat">
            <span class="scam-hero__num">{{ completedScamLevels }}<span>/{{ levels.length }}</span></span>
            <span class="tiny muted">Module completed</span>
          </div>
          <div class="scam-hero__divider" aria-hidden="true" />
          <div class="scam-hero__stat">
            <span class="scam-hero__num">{{ progress.xp }}<span> XP</span></span>
            <span class="tiny muted">Earned on this device</span>
          </div>
          <div class="scam-hero__divider" aria-hidden="true" />
          <p class="scam-hero__note">
            <AppIcon name="lock" :size="13" /> Rule-based feedback. No network, no real messages.
          </p>
        </div>
      </div>
    </section>

    <div class="container scam-body">
      <div class="level-picker" role="group" aria-label="Scam Simulator module">
        <button
          v-for="l in levels"
          :key="l.id"
          type="button"
          class="level-btn"
          :class="{ 'is-on': l.id === level.id }"
          :aria-pressed="l.id === level.id"
          @click="choose(l.id)"
        >
          <span class="level-btn__top">
            <span class="level-btn__title">{{ l.title }}</span>
            <span v-if="progress.scams[l.id]" class="level-btn__best">
              Best {{ progress.scams[l.id].best }}/{{ progress.scams[l.id].total || 5 }}
            </span>
          </span>
          <span class="level-btn__desc">{{ l.description }}</span>
          <span class="level-btn__meta">{{ l.minutes }} min · {{ l.xp }} XP</span>
        </button>
      </div>

      <ScamSimulator
        :key="level.id"
        :level="level"
        :completed="Boolean(progress.scams[level.id])"
        @complete="onComplete"
        @next-level="nextLevel"
      />

      <section class="rules" aria-labelledby="rules-title">
        <p class="eyebrow">Three habits that beat most scams</p>
        <h2 id="rules-title" class="h3 rules__title">Use these on any message, in any app</h2>
        <div class="rules__grid">
          <article v-for="rule in rules" :key="rule.title" class="rule card">
            <span class="rule__icon"><AppIcon :name="rule.icon" :size="18" /></span>
            <h3 class="rule__title">{{ rule.title }}</h3>
            <p class="rule__text">{{ rule.text }}</p>
          </article>
        </div>
        <p class="rules__foot">
          <AppIcon name="lightbulb" :size="13" />
          Worried about a real message?
          <a href="#/safety">Build a safety plan</a> before you reply.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.scam-view {
  padding-bottom: 4rem;
}

.scam-hero {
  padding: clamp(2rem, 5vw, 3.25rem) 0 1.3rem;
}

.scam-hero__title {
  margin-top: 0.35rem;
  max-width: 20ch;
}

.scam-hero__lead {
  margin-top: 0.7rem;
  max-width: 58ch;
}

.scam-hero__strip {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  flex-wrap: wrap;
  margin-top: 1.4rem;
  padding: 0.75rem 1rem;
  border-radius: var(--r-lg);
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-xs);
  width: 100%;
  max-width: none;
  box-sizing: border-box;
}

.scam-hero__stat {
  display: flex;
  flex-direction: column;
}

.scam-hero__num {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--teal-800);
  line-height: 1.1;
}

.scam-hero__num span {
  font-size: 0.8rem;
  font-weight: 650;
  color: var(--muted);
}

.scam-hero__divider {
  width: 1px;
  align-self: stretch;
  background: var(--line);
}

.scam-hero__note {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--step--2);
  color: var(--muted);
}

.scam-body {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  max-width: 50rem;
}

/* ---------- level picker ---------- */
.level-picker {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.7rem;
  padding-top: 0.4rem;
}

.level-btn {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.8rem 0.9rem;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--paper);
  text-align: left;
  color: var(--ink-soft);
  width: 100%;
  box-sizing: border-box;
  transition: transform 180ms var(--ease), border-color 180ms var(--ease), box-shadow 180ms var(--ease);
}

.level-btn:hover {
  transform: translateY(-2px);
  border-color: var(--teal-400);
  box-shadow: var(--shadow-sm);
}

.level-btn.is-on {
  border-color: var(--teal-600);
  background: var(--mint-50);
  box-shadow: inset 0 0 0 1px var(--teal-600);
}

.level-btn__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.level-btn__title {
  font-family: var(--font-display);
  font-size: 0.98rem;
  font-weight: 750;
  color: var(--ink);
}

.level-btn__best {
  padding: 0.1rem 0.4rem;
  border-radius: var(--r-pill);
  background: var(--success-bg);
  color: #04624f;
  font-size: 0.6rem;
  font-weight: 750;
  white-space: nowrap;
}

.level-btn__desc {
  font-size: var(--step--2);
  line-height: 1.4;
}

.level-btn__meta {
  margin-top: auto;
  padding-top: 0.3rem;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--teal-600);
}

/* ---------- rules ---------- */
.rules {
  padding-top: 0.7rem;
}

.rules__title {
  margin-top: 0.2rem;
}

.rules__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 0.85rem;
}

.rule {
  padding: 0.95rem 1rem;
}

.rule__icon {
  display: grid;
  place-items: center;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 12px;
  background: linear-gradient(145deg, var(--mint-100), var(--mint-200));
  color: var(--teal-700);
  margin-bottom: 0.6rem;
}

.rule__title {
  font-size: 0.95rem;
  font-weight: 750;
}

.rule__text {
  margin-top: 0.3rem;
  font-size: var(--step--1);
  line-height: 1.5;
  color: var(--muted);
}

.rules__foot {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-top: 0.9rem;
  font-size: var(--step--1);
  color: var(--muted);
}

.rules__foot a {
  color: var(--teal-700);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 44rem) {
  .level-picker,
  .rules__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .scam-hero__divider {
    display: none;
  }
}
</style>
