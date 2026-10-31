/* The step engine behind every guided mission.
   Tokens arrive from the pretend phone; one matching token advances the step.
   Wrong taps get a targeted correction, and a second stray tap opens the hint. */

import { computed, reactive } from 'vue'

export function useSimulation(mission) {
  const state = reactive({
    index: 0,
    stepDone: false,
    feedback: null,
    hintOpen: false,
    attempts: 0,
    complete: false,
  })

  const steps = mission.steps || []
  const total = steps.length
  const step = computed(() => steps[state.index] || null)
  const isLast = computed(() => state.index === total - 1)
  const progressPct = computed(() => {
    if (!total) return 0
    const done = state.index + (state.stepDone ? 1 : 0)
    return Math.round((done / total) * 100)
  })

  function say(tone, text) {
    state.feedback = { tone, text }
  }

  function pass(text) {
    state.stepDone = true
    state.attempts = 0
    say('ok', text || 'That is the right move. Press Next when you are ready.')
  }

  function fail(text) {
    state.attempts += 1
    say('warn', text)
    if (state.attempts >= 2) state.hintOpen = true
  }

  function dispatch(token) {
    if (state.complete || !step.value) return
    if (step.value.decision) {
      say('hint', 'Use the decision in this panel: pick one of the options to continue.')
      return
    }
    if (state.stepDone) {
      const upcoming = steps[state.index + 1]
      if (upcoming && !upcoming.decision && (upcoming.expect || []).includes(token)) {
        state.index += 1
        state.stepDone = false
        state.feedback = null
        state.hintOpen = false
        state.attempts = 0
        dispatch(token)
        return
      }
      say('hint', 'This step is done. Press Next to move on.')
      return
    }
    if ((step.value.expect || []).includes(token)) {
      pass(step.value.done)
      return
    }
    const trap = mission.traps?.[token]
    if (trap) {
      fail(trap)
      return
    }
    const wrong = step.value.wrong?.[token]
    if (wrong) {
      fail(wrong)
      return
    }
    if (state.attempts >= 1) {
      state.hintOpen = true
      say('hint', `Not this one. ${step.value.hint || 'Read the instruction again.'}`)
    } else {
      state.attempts = 1
      say('hint', 'That is not what this step needs. Read the instruction again, or open the hint.')
    }
  }

  function choose(option) {
    if (!step.value?.decision || state.complete) return
    if (option.correct) {
      pass(option.feedback)
    } else {
      state.attempts += 1
      say('warn', option.feedback)
      if (state.attempts >= 2) state.hintOpen = true
    }
  }

  function next() {
    if (!state.stepDone) return
    if (isLast.value) {
      state.complete = true
      state.feedback = null
      return
    }
    state.index += 1
    state.stepDone = false
    state.feedback = null
    state.hintOpen = false
    state.attempts = 0
  }

  function previous() {
    if (state.complete) {
      state.complete = false
      state.stepDone = true
      return
    }
    if (state.index === 0) return
    state.index -= 1
    state.stepDone = false
    state.feedback = null
    state.hintOpen = false
    state.attempts = 0
  }

  function restart() {
    state.index = 0
    state.stepDone = false
    state.feedback = null
    state.hintOpen = false
    state.attempts = 0
    state.complete = false
  }

  function toggleHint() {
    state.hintOpen = !state.hintOpen
  }

  return {
    state,
    step,
    steps,
    total,
    isLast,
    progressPct,
    dispatch,
    choose,
    next,
    previous,
    restart,
    toggleHint,
  }
}
