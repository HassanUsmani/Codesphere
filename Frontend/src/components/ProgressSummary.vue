<script setup>
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { missions } from '@/data/missions'
import { levels } from '@/data/scamLevels'
import { completedMissions, completedScamLevels, progress, resetProgress } from '@/composables/useProgress'

const armed = ref(false)
const pct = computed(() => Math.round((completedMissions.value / missions.length) * 100))
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
  <section class="summary card" aria-labelledby="summary-title">
    <div class="summary__head">
      <div>
        <p class="eyebrow">Saved on this device</p>
        <h2 id="summary-title" class="h3">{{ completedMissions }} of {{ missions.length }} missions complete</h2>
      </div>
      <div class="summary__xp">
        <span class="summary__xpnum">{{ progress.xp }}</span>
        <span class="summary__xplabel">XP</span>
      </div>
    </div>

    <div class="bar summary__bar" role="progressbar" :aria-valuenow="pct" aria-valuemin="0" aria-valuemax="100" aria-label="Missions completed">
      <div class="bar__fill" :style="{ width: `${pct}%` }" />
    </div>

    <div class="summary__grid">
      <div class="summary__stat">
        <span class="summary__icon"><AppIcon name="check" :size="15" /></span>
        <div>
          <p class="summary__num">{{ completedMissions }}</p>
          <p class="summary__label">Missions done</p>
        </div>
      </div>
      <div class="summary__stat">
        <span class="summary__icon"><AppIcon name="shield" :size="15" /></span>
        <div>
          <p class="summary__num">{{ completedScamLevels }}<span>/{{ levels.length }}</span></p>
          <p class="summary__label">Scam module</p>
        </div>
      </div>
      <div class="summary__stat">
        <span class="summary__icon"><AppIcon name="lightbulb" :size="15" /></span>
        <div>
          <p class="summary__num summary__num--word">{{ progress.safetyPlan ? 'Saved' : 'Not yet' }}</p>
          <p class="summary__label">Safety plan</p>
        </div>
      </div>
    </div>

    <div class="summary__foot">
      <a class="btn btn--soft btn--sm" href="#/progress">See full progress</a>
      <button type="button" class="summary__reset" :class="{ 'is-armed': armed }" @click="erase">
        {{ armed ? 'Tap again to erase everything' : 'Reset progress' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.summary {
  padding: 1.15rem 1.25rem 1.2rem;
  border-radius: var(--r-xl);
}

.summary__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.summary__head .h3 {
  margin-top: 0.15rem;
}

.summary__xp {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  padding: 0.35rem 0.7rem;
  border-radius: var(--r-pill);
  background: var(--teal-800);
  color: #fff;
  flex: none;
}

.summary__xpnum {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.summary__xplabel {
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--mint-300);
}

.summary__bar {
  margin-top: 0.85rem;
}

.summary__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin-top: 0.9rem;
}

.summary__stat {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.6rem;
  border-radius: var(--r-md);
  background: var(--mint-50);
  border: 1px solid var(--line);
}

.summary__icon {
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  background: var(--paper);
  color: var(--teal-700);
  flex: none;
}

.summary__num {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.1;
}

.summary__num span {
  font-size: 0.7rem;
  color: var(--muted);
}

.summary__num--word {
  font-size: 0.85rem;
  padding-top: 0.1rem;
}

.summary__label {
  font-size: var(--step--2);
  color: var(--muted);
  line-height: 1.3;
}

.summary__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.95rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--line);
}

.summary__reset {
  font-size: var(--step--2);
  font-weight: 650;
  color: var(--muted);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.summary__reset:hover {
  color: var(--danger);
}

.summary__reset.is-armed {
  padding: 0.35rem 0.6rem;
  border-radius: var(--r-pill);
  background: var(--danger-bg);
  border: 1px solid var(--danger-line);
  color: var(--danger);
  text-decoration: none;
}

@media (max-width: 40rem) {
  .summary__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
