<script setup>
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import GuidedSimulation from '@/components/GuidedSimulation.vue'
import { missionById, missions } from '@/data/missions'
import { completeMission, completedMissions, isMissionDone, progress } from '@/composables/useProgress'
import { navigate, route } from '@/lib/router'

const mission = computed(() => missionById[route.params.mission] || missions[0])

function select(id) {
  navigate('simulator', { mission: id }, { replace: true })
}

function onComplete() {
  completeMission(mission.value.id, { xp: mission.value.xp })
}

function nextMission() {
  const index = missions.findIndex((m) => m.id === mission.value.id)
  const next = missions[(index + 1) % missions.length]
  select(next.id)
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}
</script>

<template>
  <div class="sim-view">
    <section class="sim-hero">
      <div class="container">
        <p class="eyebrow">Practice · Smartphone Simulator</p>
        <div class="sim-hero__row">
          <div>
            <h1 class="h1">Try it on a pretend phone</h1>
            <p class="lead sim-hero__lead">
              Follow one step at a time, tap around, and make mistakes safely. Nothing here connects to a real
              app, account or bank.
            </p>
          </div>
          <div class="sim-hero__stats card">
            <div>
              <p class="sim-hero__num">{{ completedMissions }}<span>/ {{ missions.length }}</span></p>
              <p class="tiny muted">Missions completed</p>
            </div>
            <div class="sim-hero__divider" aria-hidden="true" />
            <div>
              <p class="sim-hero__num">{{ progress.xp }}<span> XP</span></p>
              <p class="tiny muted">Earned on this device</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="sim-picker" role="group" aria-label="Choose a mission">
        <p class="sim-picker__label">Mission</p>
        <div class="sim-picker__strip">
          <button
            v-for="m in missions"
            :key="m.id"
            type="button"
            class="sim-picker__btn"
            :class="{ 'is-on': m.id === mission.id }"
            :aria-pressed="m.id === mission.id"
            @click="select(m.id)"
          >
            <span class="sim-picker__icon"><AppIcon :name="m.icon" :size="14" /></span>
            <span class="sim-picker__title">{{ m.title }}</span>
            <AppIcon v-if="isMissionDone(m.id)" name="check" :size="12" class="sim-picker__done" />
          </button>
        </div>
      </div>

      <GuidedSimulation
        :key="mission.id"
        :mission="mission"
        :completed="isMissionDone(mission.id)"
        @complete="onComplete"
        @next="nextMission"
      />

      <p class="sim-foot">
        <AppIcon name="info" :size="12" />
        Progress and preferences are saved in this browser only. No account, no database.
      </p>
    </div>
  </div>
</template>

<style scoped>
.sim-view {
  padding-bottom: 4.5rem;
}

.sim-hero {
  padding: clamp(2rem, 5vw, 3.25rem) 0 1.4rem;
}

.sim-hero__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
}

.sim-hero__lead {
  margin-top: 0.5rem;
  max-width: 46ch;
}

.sim-hero__stats {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 0.8rem 1rem;
}

.sim-hero__num {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--teal-800);
  line-height: 1.1;
}

.sim-hero__num span {
  font-size: 0.85rem;
  font-weight: 650;
  color: var(--muted);
}

.sim-hero__divider {
  width: 1px;
  align-self: stretch;
  background: var(--line);
}

.sim-picker {
  position: sticky;
  top: 4.55rem;
  z-index: 30;
  padding: 0.6rem 0 0.65rem;
  background: linear-gradient(to bottom, var(--bg) 72%, rgba(244, 251, 248, 0));
}

.sim-picker__label {
  font-size: var(--step--2);
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.35rem;
}

.sim-picker__strip {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.3rem;
  scrollbar-width: thin;
}

.sim-picker__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex: none;
  min-height: 2.4rem;
  padding: 0 0.8rem;
  border-radius: var(--r-pill);
  border: 1px solid var(--line);
  background: var(--paper);
  font-size: var(--step--1);
  font-weight: 650;
  color: var(--ink-soft);
  white-space: nowrap;
  transition: all 180ms var(--ease);
}

.sim-picker__btn:hover {
  border-color: var(--teal-400);
  color: var(--teal-700);
}

.sim-picker__btn.is-on {
  background: var(--teal-700);
  border-color: var(--teal-700);
  color: #fff;
  box-shadow: 0 10px 20px -14px rgba(15, 118, 110, 0.9);
}

.sim-picker__icon {
  display: grid;
  place-items: center;
  width: 1.55rem;
  height: 1.55rem;
  border-radius: 50%;
  background: var(--mint-100);
  color: var(--teal-700);
  flex: none;
}

.sim-picker__btn.is-on .sim-picker__icon {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.sim-picker__done {
  color: var(--green-500);
}

.sim-picker__btn.is-on .sim-picker__done {
  color: #a9e8d4;
}

.sim-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 2.5rem;
  font-size: var(--step--2);
  color: var(--muted);
  text-align: center;
}

@media (max-width: 63.99rem) {
  .sim-picker {
    position: static;
  }
}
</style>
