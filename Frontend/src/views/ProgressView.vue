<script setup>
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { missions } from '@/data/missions'
import { levels } from '@/data/scamLevels'
import {
  completedMissions,
  completedScamLevels,
  progress,
  resetProgress,
} from '@/composables/useProgress'

const armed = ref(false)
const missionPct = computed(() => Math.round((completedMissions.value / missions.length) * 100))
const scamPct = computed(() => Math.round((completedScamLevels.value / levels.length) * 100))
const totalXpPossible = computed(
  () => missions.reduce((sum, m) => sum + m.xp, 0) + levels.reduce((sum, l) => sum + l.xp, 0) + 40,
)

function erase() {
  if (!armed.value) {
    armed.value = true
    return
  }
  resetProgress()
  armed.value = false
}
</script>

<template>
  <div class="progress-view">
    <section class="progress-hero">
      <div class="container">
        <p class="eyebrow">Practice · Progress</p>
        <div class="progress-hero__row">
          <div>
            <h1 class="h1">Everything you have practised.</h1>
            <p class="lead progress-hero__lead">
              Saved in this browser only. Clearing site data, or the button below, erases it — there is no
              account to sign back into.
            </p>
          </div>
          <div class="xp-card">
            <p class="xp-card__label">XP earned</p>
            <p class="xp-card__num">{{ progress.xp }}<span>/ {{ totalXpPossible }}</span></p>
            <p class="xp-card__note">
              {{ completedMissions }} of {{ missions.length }} missions · {{ completedScamLevels }} of {{ levels.length }}
              scam modules
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container progress-body">
      <section class="block" aria-labelledby="missions-title">
        <div class="block__head">
          <div>
            <p class="eyebrow">Smartphone Simulator</p>
            <h2 id="missions-title" class="h3">Missions</h2>
          </div>
          <span class="badge">{{ completedMissions }}/{{ missions.length }}</span>
        </div>
        <div class="bar" role="progressbar" :aria-valuenow="missionPct" aria-valuemin="0" aria-valuemax="100" aria-label="Missions completed">
          <div class="bar__fill" :style="{ width: `${missionPct}%` }" />
        </div>

        <ul class="rows">
          <li v-for="m in missions" :key="m.id" class="row-item" :class="{ 'is-done': progress.missions[m.id] }">
            <span class="row-item__icon"><AppIcon :name="m.icon" :size="17" /></span>
            <span class="row-item__text">
              <span class="row-item__title">{{ m.title }}</span>
              <span class="row-item__sub">{{ m.minutes }} min · {{ m.xp }} XP</span>
            </span>
            <span v-if="progress.missions[m.id]" class="pill pill--ok">
              <AppIcon name="check" :size="11" /> Done
            </span>
            <span v-else class="pill">Not started</span>
            <a class="row-item__go" :href="`#/simulator?mission=${m.id}`">
              {{ progress.missions[m.id] ? 'Practise again' : 'Start' }}
              <AppIcon name="arrow-right" :size="12" />
            </a>
          </li>
        </ul>
      </section>

      <div class="split">
        <section class="block" aria-labelledby="scams-title">
          <div class="block__head">
            <div>
              <p class="eyebrow">Scam Simulator</p>
              <h2 id="scams-title" class="h3">Module</h2>
            </div>
            <span class="badge">{{ completedScamLevels }}/{{ levels.length }}</span>
          </div>
          <div class="bar" role="progressbar" :aria-valuenow="scamPct" aria-valuemin="0" aria-valuemax="100" aria-label="Scam module completed">
            <div class="bar__fill" :style="{ width: `${scamPct}%` }" />
          </div>

          <ul class="rows">
            <li v-for="l in levels" :key="l.id" class="row-item" :class="{ 'is-done': progress.scams[l.id] }">
              <span class="row-item__icon"><AppIcon name="shield-alert" :size="17" /></span>
              <span class="row-item__text">
                <span class="row-item__title">{{ l.title }}</span>
                <span class="row-item__sub">{{ l.minutes }} min · {{ l.xp }} XP</span>
              </span>
              <span v-if="progress.scams[l.id]" class="pill pill--ok">
                Best {{ progress.scams[l.id].best }}/{{ progress.scams[l.id].total || 5 }}
              </span>
              <span v-else class="pill">Not started</span>
              <a class="row-item__go" :href="`#/scam?level=${l.id}`">
                {{ progress.scams[l.id] ? 'Retry' : 'Start' }}
                <AppIcon name="arrow-right" :size="12" />
              </a>
            </li>
          </ul>
        </section>

        <section class="block block--plan" aria-labelledby="plan-title">
          <div class="block__head">
            <div>
              <p class="eyebrow">Safety check</p>
              <h2 id="plan-title" class="h3">Safety plan</h2>
            </div>
          </div>
          <div class="plan-state" :class="{ 'is-done': progress.safetyPlan }">
            <span class="plan-state__icon">
              <AppIcon :name="progress.safetyPlan ? 'check' : 'lightbulb'" :size="18" />
            </span>
            <p class="plan-state__title">
              {{ progress.safetyPlan ? 'A plan has been saved' : 'No plan yet' }}
            </p>
            <p class="plan-state__text">
              {{
                progress.safetyPlan
                  ? 'You have built at least one four-step plan on this device.'
                  : 'Describe a worrying message and build a plan in one sentence.'
              }}
            </p>
            <a class="btn btn--soft btn--sm" href="#/safety">
              {{ progress.safetyPlan ? 'Build another plan' : 'Open the safety check' }}
            </a>
          </div>
        </section>
      </div>

      <section class="reset card" aria-labelledby="reset-title">
        <div>
          <h2 id="reset-title" class="h3">Reset everything</h2>
          <p class="reset__text">
            Clears all {{ missions.length }} mission records, scam scores, the safety plan and the
            {{ progress.xp }} XP on this device. This cannot be undone.
          </p>
        </div>
        <button type="button" class="reset__btn" :class="{ 'is-armed': armed }" @click="erase">
          <AppIcon v-if="armed" name="alert" :size="14" />
          {{ armed ? 'Tap again to erase everything' : 'Reset progress' }}
        </button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.progress-view {
  padding-bottom: 4rem;
}

.progress-hero {
  padding: clamp(2rem, 5vw, 3.25rem) 0 1.5rem;
}

.progress-hero__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
}

.progress-hero__lead {
  margin-top: 0.6rem;
  max-width: 50ch;
}

.xp-card {
  min-width: 15rem;
  padding: 0.95rem 1.15rem;
  border-radius: var(--r-lg);
  background: var(--hero);
  color: #fff;
  box-shadow: var(--shadow-md);
}

.xp-card__label {
  font-size: var(--step--2);
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #a9e8d4;
}

.xp-card__num {
  margin-top: 0.2rem;
  font-family: var(--font-display);
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.xp-card__num span {
  font-size: 0.85rem;
  font-weight: 650;
  color: var(--mint-300);
}

.xp-card__note {
  margin-top: 0.35rem;
  font-size: var(--step--2);
  color: rgba(236, 253, 247, 0.75);
}

.progress-body {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.block {
  padding: 1.15rem 1.2rem 1.2rem;
  border-radius: var(--r-lg);
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-xs);
}

.block__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.7rem;
}

.block__head .h3 {
  margin-top: 0.1rem;
}

.bar {
  margin-bottom: 0.85rem;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.row-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.55rem;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  flex-wrap: wrap;
}

.row-item.is-done {
  background: var(--success-bg);
  border-color: var(--mint-300);
}

.row-item__icon {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 10px;
  background: var(--mint-100);
  color: var(--teal-700);
  flex: none;
}

.row-item.is-done .row-item__icon {
  background: var(--paper);
  color: var(--green-600);
}

.row-item__text {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 9rem;
}

.row-item__title {
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.3;
}

.row-item__sub {
  font-size: var(--step--2);
  color: var(--muted);
}

.pill {
  padding: 0.15rem 0.5rem;
  border-radius: var(--r-pill);
  background: var(--mint-50);
  border: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.62rem;
  font-weight: 700;
  white-space: nowrap;
}

.pill--ok {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  background: var(--paper);
  border-color: var(--mint-300);
  color: #04624f;
}

.row-item__go {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  margin-left: auto;
  font-size: var(--step--2);
  font-weight: 700;
  color: var(--teal-700);
  text-decoration: none;
  white-space: nowrap;
}

.row-item__go:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.split {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.1rem;
  align-items: start;
}

.split > .block {
  width: 100%;
  min-width: 0;
}

.plan-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
  padding: 0.9rem 0.95rem;
  border-radius: var(--r-md);
  border: 1px dashed var(--line-strong);
  background: var(--mint-50);
}

.plan-state.is-done {
  border-style: solid;
  border-color: var(--mint-300);
  background: var(--success-bg);
}

.plan-state__icon {
  display: grid;
  place-items: center;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 50%;
  background: var(--paper);
  color: var(--teal-700);
  margin-bottom: 0.2rem;
}

.plan-state.is-done .plan-state__icon {
  color: var(--green-600);
}

.plan-state__title {
  font-size: 0.95rem;
  font-weight: 750;
}

.plan-state__text {
  font-size: var(--step--1);
  line-height: 1.5;
  color: var(--muted);
  margin-bottom: 0.4rem;
}

.reset {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
  padding: 1.1rem 1.2rem;
  border-color: var(--danger-line);
}

.reset__text {
  margin-top: 0.3rem;
  max-width: 60ch;
  font-size: var(--step--1);
  line-height: 1.5;
  color: var(--muted);
}

.reset__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2.5rem;
  padding: 0 1rem;
  border-radius: var(--r-pill);
  border: 1px solid var(--danger-line);
  background: var(--paper);
  color: var(--danger);
  font-size: var(--step--1);
  font-weight: 700;
  transition: background 180ms var(--ease), color 180ms var(--ease), border-color 180ms var(--ease);
}

.reset__btn:hover {
  background: var(--danger-bg);
}

.reset__btn.is-armed {
  background: var(--danger);
  border-color: var(--danger);
  color: #fff;
}

@media (max-width: 48rem) {
  .split {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
