<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import SmartphoneSimulator from '@/components/phone/SmartphoneSimulator.vue'
import { useSimulation } from '@/composables/useSimulation'

const props = defineProps({
  mission: { type: Object, required: true },
  completed: { type: Boolean, default: false },
})
const emit = defineEmits(['complete', 'next', 'restart'])

const sim = useSimulation(props.mission)
const phoneKey = ref(0)
const chosen = ref('')

const step = sim.step
const state = sim.state

const hintToken = computed(() => step.value?.expect?.[0] || '')

const phoneNotice = computed(() => {
  const feedback = state.feedback
  if (feedback && feedback.tone === 'warn') return feedback
  if (state.stepDone && feedback) return feedback
  if (state.hintOpen && step.value?.hint) return { tone: 'hint', text: step.value.hint }
  return null
})

watch(
  () => state.index,
  () => {
    chosen.value = ''
  },
)

watch(
  () => state.complete,
  (isComplete) => {
    if (isComplete) emit('complete')
  },
)

function choose(option) {
  chosen.value = option.id
  sim.choose(option)
}

function restart() {
  sim.restart()
  chosen.value = ''
  phoneKey.value += 1
  emit('restart')
}
</script>

<template>
  <div class="guided">
    <div class="guided__stage">
      <SmartphoneSimulator
        :key="phoneKey"
        :mission="mission"
        :hint-token="hintToken"
        :show-hint="state.hintOpen"
        :notice="phoneNotice"
        @action="sim.dispatch"
      />
      <p class="guided__caption">
        <AppIcon name="shield" :size="12" />
        Tap inside the phone. Mistakes here cost nothing.
      </p>
    </div>

    <aside class="guided__panel" aria-label="Mission instructions">
      <div class="guided__mission">
        <p class="eyebrow">Guided mission</p>
        <h2 class="h3 guided__title">{{ mission.title }}</h2>
        <p class="small muted guided__story">{{ mission.story }}</p>
        <div class="row guided__meta">
          <span class="meta"><AppIcon name="clock" :size="12" /> {{ mission.minutes }} min</span>
          <span class="meta"><AppIcon name="bolt" :size="12" /> {{ mission.xp }} XP</span>
          <span v-if="completed" class="badge"><AppIcon name="check" :size="10" /> Done earlier</span>
        </div>
      </div>

      <template v-if="!state.complete">
        <div class="guided__progress">
          <div class="row guided__steprow">
            <p class="guided__count">Step {{ state.index + 1 }} of {{ sim.total }}</p>
            <span class="spacer" />
            <p class="tiny muted">{{ sim.progressPct.value }}%</p>
          </div>
          <div class="bar" role="progressbar" :aria-valuenow="sim.progressPct.value" aria-valuemin="0" aria-valuemax="100" :aria-label="`Step ${state.index + 1} of ${sim.total}`">
            <div class="bar__fill" :style="{ width: `${sim.progressPct.value}%` }" />
          </div>
          <ol class="guided__dots" aria-hidden="true">
            <li
              v-for="(s, i) in sim.steps"
              :key="s.id"
              :class="{ 'is-done': i < state.index || (i === state.index && state.stepDone), 'is-on': i === state.index }"
            />
          </ol>
        </div>

        <div class="guided__instruction">
          <h3 class="guided__what">
            <span class="guided__whaticon"><AppIcon name="arrow-right" :size="15" /></span>
            <span>{{ step.instruction }}</span>
          </h3>
          <p v-if="step.hint" class="small muted guided__hintline">{{ step.hint }}</p>
        </div>

        <div v-if="state.feedback && step.decision" class="toast" :class="`toast--${state.feedback.tone === 'warn' ? 'warn' : state.feedback.tone === 'ok' ? 'ok' : 'hint'}`" role="status" aria-live="polite">
          <AppIcon :name="state.feedback.tone === 'ok' ? 'check' : state.feedback.tone === 'warn' ? 'alert' : 'lightbulb'" :size="14" />
          <span>{{ state.feedback.text }}</span>
        </div>

        <div v-if="step.decision" class="decision">
          <p class="decision__prompt">{{ step.decision.prompt }}</p>
          <button
            v-for="option in step.decision.options"
            :key="option.id"
            type="button"
            class="decision__opt"
            :class="{ 'is-chosen': chosen === option.id, 'is-correct': chosen === option.id && option.correct }"
            :disabled="state.stepDone"
            @click="choose(option)"
          >
            <span class="decision__radio"><AppIcon v-if="chosen === option.id && option.correct" name="check" :size="12" /></span>
            <span class="decision__text">
              <span class="decision__label">{{ option.label }}</span>
              <span class="decision__detail">{{ option.detail }}</span>
            </span>
          </button>
        </div>

        <div v-else-if="state.feedback && !state.stepDone" class="toast" :class="state.feedback.tone === 'warn' ? 'toast--warn' : 'toast--hint'" role="status" aria-live="polite">
          <AppIcon :name="state.feedback.tone === 'warn' ? 'alert' : 'lightbulb'" :size="14" />
          <span>{{ state.feedback.text }}</span>
        </div>

        <div v-else-if="state.stepDone && state.feedback" class="toast toast--ok" role="status" aria-live="polite">
          <AppIcon name="check" :size="14" />
          <span>{{ state.feedback.text }}</span>
        </div>

        <button v-if="step.hint" type="button" class="hint-toggle" :aria-expanded="state.hintOpen" @click="sim.toggleHint">
          <AppIcon name="lightbulb" :size="13" />
          {{ state.hintOpen ? 'Hide the hint' : 'Need a hint?' }}
        </button>
        <div v-if="state.hintOpen" class="hint-box">
          <strong>Hint</strong>
          <span>{{ step.hint }}</span>
        </div>

        <div class="guided__controls">
          <button type="button" class="btn btn--ghost btn--sm" :disabled="state.index === 0" @click="sim.previous">
            <AppIcon name="arrow-left" :size="13" /> Previous
          </button>
          <button type="button" class="btn btn--ghost btn--sm" @click="restart">
            <AppIcon name="restart" :size="13" /> Restart
          </button>
          <span class="spacer" />
          <button type="button" class="btn btn--primary" :disabled="!state.stepDone" @click="sim.next">
            {{ sim.isLast.value ? 'Finish mission' : 'Next' }}
            <AppIcon :name="sim.isLast.value ? 'check' : 'arrow-right'" :size="14" />
          </button>
        </div>
        <p v-if="!state.stepDone" class="tiny muted guided__wait">Next unlocks when you complete the step in the phone.</p>
      </template>

      <div v-else class="done-card">
        <span class="done-card__check"><AppIcon name="check" :size="24" /></span>
        <h3 class="h3">{{ mission.success.title }}</h3>
        <p class="small muted">{{ mission.success.message }}</p>
        <p class="done-card__xp"><AppIcon name="bolt" :size="13" /> +{{ mission.xp }} XP saved to this device</p>
        <div class="done-card__actions">
          <button type="button" class="btn btn--primary" @click="emit('next')">
            Next mission <AppIcon name="arrow-right" :size="14" />
          </button>
          <button type="button" class="btn btn--ghost btn--sm" @click="restart">Practise again</button>
        </div>
        <a class="done-card__link" href="#/practice">Back to all missions</a>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.guided {
  display: grid;
  grid-template-columns: auto minmax(19rem, 24rem);
  gap: clamp(1.25rem, 4vw, 3.5rem);
  justify-content: center;
  align-items: start;
}

.guided__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.guided__caption {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--step--2);
  color: var(--muted);
  text-align: center;
}

.guided__panel {
  position: sticky;
  top: 5.5rem;
  width: 100%;
  padding: 1.15rem 1.2rem 1.25rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-md);
}

.guided__title {
  margin-top: 0.2rem;
}

.guided__story {
  margin-top: 0.35rem;
  line-height: 1.5;
}

.guided__meta {
  margin-top: 0.55rem;
  gap: 0.75rem;
}

.guided__progress {
  margin-top: 0.9rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--line);
}

.guided__steprow {
  margin-bottom: 0.4rem;
}

.guided__count {
  font-size: var(--step--1);
  font-weight: 750;
  color: var(--teal-700);
}

.guided__dots {
  display: flex;
  gap: 0.3rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.guided__dots li {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--line);
  transition: background 200ms ease, transform 200ms ease;
}

.guided__dots li.is-done {
  background: var(--green-500);
}

.guided__dots li.is-on {
  background: var(--teal-700);
  transform: scale(1.35);
}

.guided__instruction {
  margin-top: 0.9rem;
}

.guided__what {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.guided__whaticon {
  display: grid;
  place-items: center;
  width: 1.65rem;
  height: 1.65rem;
  margin-top: 0.05rem;
  border-radius: 50%;
  background: var(--mint-100);
  color: var(--teal-700);
  flex: none;
}

.guided__hintline {
  margin: 0.35rem 0 0 2.15rem;
  line-height: 1.45;
}

.guided__panel .toast {
  margin-top: 0.7rem;
}

.decision {
  margin-top: 0.75rem;
  padding: 0.7rem;
  border-radius: var(--r-md);
  background: var(--mint-50);
  border: 1px solid var(--line);
}

.decision__prompt {
  font-size: var(--step--1);
  font-style: italic;
  line-height: 1.5;
  color: var(--ink-soft);
  margin-bottom: 0.55rem;
}

.decision__opt {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
  padding: 0.55rem 0.6rem;
  margin-top: 0.35rem;
  border-radius: var(--r-sm);
  border: 1px solid var(--line-strong);
  background: var(--paper);
  text-align: left;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.decision__opt:hover {
  border-color: var(--teal-400);
}

.decision__opt.is-chosen {
  border-color: var(--teal-600);
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.14);
}

.decision__opt.is-correct {
  border-color: var(--green-500);
  background: var(--mint-50);
}

.decision__opt:disabled {
  cursor: default;
}

.decision__radio {
  display: grid;
  place-items: center;
  width: 1.05rem;
  height: 1.05rem;
  margin-top: 0.08rem;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
  color: var(--green-600);
  flex: none;
}

.decision__opt.is-correct .decision__radio {
  border-color: var(--green-500);
}

.decision__text {
  min-width: 0;
}

.decision__label {
  display: block;
  font-size: 0.92rem;
  font-weight: 650;
  line-height: 1.3;
}

.decision__detail {
  display: block;
  margin-top: 0.1rem;
  font-size: var(--step--2);
  color: var(--muted);
  line-height: 1.4;
}

.hint-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.7rem;
  font-size: var(--step--1);
  font-weight: 650;
  color: var(--teal-700);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hint-box {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 0.45rem;
  padding: 0.55rem 0.65rem;
  border-radius: var(--r-sm);
  background: var(--warn-bg);
  border: 1px solid var(--warn-line);
  color: #7c4a09;
  font-size: var(--step--1);
  line-height: 1.45;
}

.hint-box strong {
  font-size: var(--step--2);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--warn);
}

.guided__controls {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.9rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--line);
  flex-wrap: wrap;
}

.guided__controls .btn {
  min-height: 2.4rem;
}

.guided__wait {
  margin-top: 0.45rem;
  line-height: 1.4;
}

.done-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
  padding-top: 0.9rem;
}

.done-card__check {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #34d399, #059669);
  color: #fff;
  box-shadow: 0 14px 26px -14px rgba(5, 150, 105, 0.9);
}

.done-card p {
  line-height: 1.5;
}

.done-card__xp {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.55rem;
  border-radius: var(--r-pill);
  background: var(--mint-100);
  color: var(--teal-700);
  font-size: var(--step--1);
  font-weight: 700;
}

.done-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
}

.done-card__link {
  margin-top: 0.1rem;
  font-size: var(--step--1);
  font-weight: 650;
  color: var(--teal-700);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 63.99rem) {
  .guided {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }

  .guided__panel {
    position: static;
    order: 1;
  }

  .guided__stage {
    order: 2;
  }

  .guided__panel {
    max-width: 34rem;
    margin-inline: auto;
  }
}
</style>
