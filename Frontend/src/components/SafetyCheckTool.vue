<script setup>
import { computed, nextTick, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { fallbackPlan, phases, planFor, scenarios } from '@/data/safetyScenarios'
import { markSafetyPlan } from '@/composables/useProgress'

const note = ref('')
const plan = ref(null)
const matched = ref(false)
const searched = ref(false)
const emptyWarn = ref(false)
const field = ref(null)
const result = ref(null)

const phaseIcon = { stop: 'ban', check: 'search', verify: 'phone', act: 'shield' }
const chips = scenarios.map((s) => ({ id: s.id, chip: s.chip, urgent: Boolean(s.urgent) }))

const preview = computed(() => note.value.trim().length)

function scrollToResult() {
  nextTick(() => {
    result.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    result.value?.focus?.({ preventScroll: true })
  })
}

function build() {
  const text = note.value.trim()
  if (!text) {
    emptyWarn.value = true
    field.value?.focus()
    return
  }
  emptyWarn.value = false
  const found = planFor(text)
  plan.value = found || fallbackPlan
  matched.value = Boolean(found)
  searched.value = true
  markSafetyPlan()
  scrollToResult()
}

function useChip(s) {
  note.value = `${s.chip} — ${s.summary}`
  emptyWarn.value = false
  plan.value = s
  matched.value = true
  searched.value = true
  markSafetyPlan()
  scrollToResult()
}

function clearAll() {
  note.value = ''
  plan.value = null
  matched.value = false
  searched.value = false
  emptyWarn.value = false
  field.value?.focus()
}
</script>

<template>
  <section class="tool" aria-labelledby="tool-title">
    <div class="tool__form card">
      <div class="tool__head">
        <p class="eyebrow">Safety check</p>
        <h2 id="tool-title" class="h3">What happened?</h2>
        <p class="tool__sub">
          Write a sentence about the message, call or link that worried you. The plan is built from keywords on
          this device — nothing is sent anywhere.
        </p>
      </div>

      <label class="tool__label" for="safety-note">Describe it in your own words</label>
      <textarea
        id="safety-note"
        ref="field"
        v-model="note"
        class="field tool__field"
        rows="4"
        maxlength="600"
        placeholder="For example: I got a text saying my parcel is on hold and I need to pay Rs 25 on a link."
        :aria-invalid="emptyWarn"
        aria-describedby="safety-note-help"
        @keydown.ctrl.enter="build"
        @keydown.meta.enter="build"
      />
      <div class="tool__meta">
        <p id="safety-note-help" class="tiny muted">
          {{ preview }}/600 characters · Ctrl + Enter to build the plan
        </p>
        <p v-if="emptyWarn" class="tool__warn" role="alert">
          <AppIcon name="alert" :size="12" /> Add a few words first.
        </p>
      </div>

      <p class="tool__chipslabel">Or pick a situation</p>
      <div class="tool__chips">
        <button
          v-for="c in chips"
          :key="c.id"
          type="button"
          class="chip"
          :class="{ 'chip--urgent': c.urgent }"
          @click="useChip(scenarios.find((s) => s.id === c.id))"
        >
          {{ c.chip }}
        </button>
      </div>

      <div class="tool__actions">
        <button type="button" class="btn btn--primary" @click="build">
          <AppIcon name="lightbulb" :size="15" />
          Build my plan
        </button>
        <button v-if="searched" type="button" class="btn btn--ghost btn--sm" @click="clearAll">
          Clear
        </button>
      </div>

      <p class="tool__privacy">
        <AppIcon name="lock" :size="12" />
        Your words stay in this browser tab and are not saved with your progress.
      </p>
    </div>

    <div
      ref="result"
      class="tool__result"
      tabindex="-1"
      :class="{ 'is-empty': !plan }"
      aria-live="polite"
    >
      <template v-if="plan">
        <div class="plan card">
          <header class="plan__head">
            <span class="plan__badge" :class="matched ? 'is-match' : 'is-general'">
              <AppIcon :name="matched ? 'check' : 'info'" :size="12" />
              {{ matched ? 'Closest situation' : 'General plan' }}
            </span>
            <h3 class="plan__title">{{ plan.title }}</h3>
            <p class="plan__summary">{{ plan.summary }}</p>
          </header>

          <ol class="plan__phases">
            <li v-for="phase in phases" :key="phase.id" class="plan__phase">
              <span class="plan__icon"><AppIcon :name="phaseIcon[phase.id]" :size="15" /></span>
              <div class="plan__body">
                <p class="plan__phasehead">
                  <span class="plan__step">Step {{ phases.indexOf(phase) + 1 }}</span>
                  <span class="plan__name">{{ phase.label }}</span>
                  <span class="plan__hint">{{ phase.hint }}</span>
                </p>
                <ul class="plan__list">
                  <li v-for="item in plan.steps[phase.id]" :key="item">{{ item }}</li>
                </ul>
              </div>
            </li>
          </ol>

          <footer class="plan__foot">
            <p class="tiny muted">Saved to your progress on this device.</p>
            <button type="button" class="btn btn--soft btn--sm" @click="clearAll">
              Start over
            </button>
          </footer>
        </div>
      </template>

      <template v-else>
        <div class="placeholder">
          <span class="placeholder__icon"><AppIcon name="lightbulb" :size="22" /></span>
          <p class="placeholder__title">Your plan appears here</p>
          <p class="placeholder__text">
            Four steps, in order: <strong>stop</strong>, <strong>check</strong>,
            <strong>verify</strong>, <strong>act</strong>. Short enough to remember when you are flustered.
          </p>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.tool {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: 1rem;
  align-items: start;
}

.tool__form {
  padding: 1.15rem 1.2rem 1.2rem;
}

.tool__head .h3 {
  margin-top: 0.15rem;
}

.tool__sub {
  margin-top: 0.35rem;
  font-size: var(--step--1);
  line-height: 1.55;
  color: var(--muted);
}

.tool__label {
  display: block;
  margin-top: 1rem;
  margin-bottom: 0.35rem;
  font-size: var(--step--1);
  font-weight: 700;
}

.tool__field {
  min-height: 6.5rem;
  background: var(--mint-50);
}

.tool__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
}

.tool__warn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--step--2);
  font-weight: 700;
  color: var(--danger);
}

.tool__chipslabel {
  margin-top: 1rem;
  font-size: var(--step--2);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.tool__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.45rem;
}

.tool__chips .chip {
  min-height: 2.1rem;
  font-size: var(--step--2);
  padding: 0 0.7rem;
}

.tool__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 1.1rem;
}

.tool__privacy {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.8rem;
  font-size: var(--step--2);
  color: var(--muted);
}

/* ---------- result ---------- */
.tool__result {
  min-width: 0;
  outline: none;
}

.plan {
  padding: 1.1rem 1.2rem 1.15rem;
  border-radius: var(--r-lg);
  border-top: 4px solid var(--teal-600);
}

.plan__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.18rem 0.55rem;
  border-radius: var(--r-pill);
  font-size: var(--step--2);
  font-weight: 750;
}

.plan__badge.is-match {
  background: var(--success-bg);
  color: #04624f;
}

.plan__badge.is-general {
  background: var(--mint-100);
  color: var(--teal-700);
}

.plan__title {
  margin-top: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 750;
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.plan__summary {
  margin-top: 0.35rem;
  font-size: var(--step--1);
  line-height: 1.55;
  color: var(--muted);
}

.plan__phases {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin: 0.95rem 0 0;
  padding: 0;
  list-style: none;
  counter-reset: phase;
}

.plan__phase {
  display: flex;
  gap: 0.6rem;
  padding: 0.6rem 0.65rem;
  border-radius: var(--r-md);
  background: var(--mint-50);
  border: 1px solid var(--line);
}

.plan__icon {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--teal-700);
  flex: none;
}

.plan__body {
  min-width: 0;
  flex: 1;
}

.plan__phasehead {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.plan__step {
  font-size: 0.62rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--teal-600);
}

.plan__name {
  font-size: 0.95rem;
  font-weight: 750;
}

.plan__hint {
  font-size: var(--step--2);
  color: var(--muted);
}

.plan__list {
  margin: 0.3rem 0 0;
  padding-left: 1.05rem;
  font-size: var(--step--1);
  line-height: 1.5;
  color: var(--ink-soft);
}

.plan__list li + li {
  margin-top: 0.2rem;
}

.plan__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.9rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--line);
}

/* ---------- placeholder (Updated to Dark Green Theme) ---------- */
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  padding: 1.4rem 1.25rem;
  border-radius: var(--r-lg);
  border: 1px dashed rgba(45, 212, 191, 0.3);
  background: rgba(13, 31, 28, 0.85);
  color: #e2e8f0;
}

.placeholder__icon {
  display: grid;
  place-items: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.15);
  color: #2dd4bf;
  margin-bottom: 0.2rem;
}

.placeholder__title {
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 750;
  color: #ffffff;
}

.placeholder__text {
  max-width: 38ch;
  font-size: var(--step--1);
  line-height: 1.55;
  color: #94a3b8;
}

.placeholder__text strong {
  color: #2dd4bf;
}

@media (max-width: 56rem) {
  .tool {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>