<script setup>
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { messagesByLevel } from '@/data/scamLevels'

const props = defineProps({
  level: { type: Object, required: true },
  completed: { type: Boolean, default: false },
})
const emit = defineEmits(['complete', 'next-level', 'retry'])

const messages = messagesByLevel(props.level.id)
const index = ref(0)
const picks = ref([])
const inspected = ref([])
const judged = ref(false)
const finished = ref(false)

const current = computed(() => messages[index.value])
const total = messages.length
const correctCount = computed(() => picks.value.filter((p) => p.correct).length)
const checkedCount = computed(() => picks.value.filter((p) => p.pick === 'verify').length)
const pct = computed(() => Math.round(((index.value + (judged.value ? 1 : 0)) / total) * 100))

const channel = computed(() => {
  const map = {
    sms: { icon: 'message', label: 'Text message' },
    whatsapp: { icon: 'chat', label: 'WhatsApp' },
    email: { icon: 'globe', label: 'Email' },
  }
  return map[current.value.channel] || map.sms
})

const verdictOptions = [
  {
    id: 'safe',
    label: 'Safe',
    icon: 'check',
    hint: 'Nothing here asks you to trust, pay or click.',
  },
  {
    id: 'verify',
    label: 'Check first',
    icon: 'search',
    hint: 'Possible, but confirm through another route.',
  },
  {
    id: 'scam',
    label: 'Scam',
    icon: 'shield-alert',
    hint: 'Pressure, payment or a code — the warning signs are there.',
  },
]

const correctVerdict = computed(() => (current.value.isScam ? 'scam' : 'safe'))

function hasInspected(segId) {
  return inspected.value.includes(`${index.value}:${segId}`)
}

function toggleInspect(seg) {
  const key = `${index.value}:${seg.id}`
  const at = inspected.value.indexOf(key)
  if (at === -1) inspected.value.push(key)
  else inspected.value.splice(at, 1)
}

function senderOpen() {
  return inspected.value.includes(`${index.value}:sender`)
}

function toggleSender() {
  const key = `${index.value}:sender`
  const at = inspected.value.indexOf(key)
  if (at === -1) inspected.value.push(key)
  else inspected.value.splice(at, 1)
}

function judge(pick) {
  if (judged.value) return
  judged.value = true
  picks.value.push({
    id: current.value.id,
    pick,
    correct: pick === correctVerdict.value,
    answer: correctVerdict.value,
  })
}

function nextMessage() {
  if (index.value + 1 >= total) {
    finished.value = true
    emit('complete', { correct: correctCount.value, total, checked: checkedCount.value })
    return
  }
  index.value += 1
  judged.value = false
}

function restart() {
  index.value = 0
  picks.value = []
  inspected.value = []
  judged.value = false
  finished.value = false
  emit('retry')
}

function replay() {
  restart()
}

const chosen = computed(() => picks.value[picks.value.length - 1] || null)
</script>

<template>
  <section class="scam" aria-labelledby="scam-level-title">
    <header class="scam__head">
      <div class="scam__level">
        <p class="eyebrow">Scam Simulator</p>
        <h2 id="scam-level-title" class="h2">{{ level.title }} messages</h2>
        <p class="scam__desc">{{ level.description }}</p>
      </div>
      <div class="scam__meta">
        <span class="badge"><AppIcon name="clock" :size="12" /> {{ level.minutes }} min</span>
        <span class="badge"><AppIcon name="bolt" :size="12" /> {{ level.xp }} XP</span>
        <span v-if="completed" class="badge badge--done"><AppIcon name="check" :size="12" /> Done before</span>
      </div>
    </header>

    <template v-if="!finished">
      <div class="scam__progress">
        <div class="scam__count">
          <span>Message {{ index + 1 }} of {{ total }}</span>
          <span class="scam__dots" aria-hidden="true">
            <span
              v-for="(m, i) in messages"
              :key="m.id"
              class="scam__dot"
              :class="{ 'is-on': i === index, 'is-passed': i < index }"
            />
          </span>
        </div>
        <div class="bar" role="progressbar" :aria-valuenow="pct" aria-valuemin="0" aria-valuemax="100" aria-label="Messages judged">
          <div class="bar__fill" :style="{ width: `${pct}%` }" />
        </div>
      </div>

      <article class="sms card" :key="current.id">
        <header class="sms__top">
          <span class="sms__channel">
            <AppIcon :name="channel.icon" :size="14" />
            {{ channel.label }}
          </span>
          <span class="spacer" />
          <span class="sms__time">{{ current.time }}</span>
        </header>

        <button
          type="button"
          class="sms__sender"
          :class="{ 'is-open': senderOpen() }"
          :aria-expanded="senderOpen()"
          @click="toggleSender"
        >
          <span class="sms__avatar" :class="{ 'is-suspicious': current.sender.suspicious }">
            <AppIcon :name="current.sender.suspicious ? 'alert' : 'check'" :size="14" />
          </span>
          <span class="sms__sendertext">
            <span class="sms__sendername">{{ current.sender.text }}</span>
            <span class="sms__senderlabel">{{ current.senderLabel }}</span>
          </span>
          <span class="sms__inspecticon" aria-hidden="true">
            <AppIcon name="search" :size="13" />
          </span>
        </button>

        <div v-if="senderOpen()" class="inspect" :class="current.sender.suspicious ? 'inspect--bad' : 'inspect--ok'">
          <p class="inspect__what">{{ current.sender.inspect }}</p>
          <p class="inspect__why"><strong>Why it matters:</strong> {{ current.sender.why }}</p>
        </div>

        <p class="sms__body">
          <template v-for="(seg, i) in current.body" :key="i">
            <button
              v-if="typeof seg === 'object'"
              type="button"
              class="seg"
              :class="[seg.suspicious ? 'seg--bad' : 'seg--ok', { 'is-open': hasInspected(seg.id) }]"
              :aria-expanded="hasInspected(seg.id)"
              @click="toggleInspect(seg)"
            >
              {{ seg.text }}
            </button>
            <span v-else>{{ seg }}</span>
          </template>
        </p>

        <div
          v-for="seg in current.body.filter((s) => typeof s === 'object' && hasInspected(s.id))"
          :key="`note-${seg.id}`"
          class="inspect"
          :class="seg.suspicious ? 'inspect--bad' : 'inspect--ok'"
        >
          <p class="inspect__what">{{ seg.inspect }}</p>
          <p class="inspect__why"><strong>Why it matters:</strong> {{ seg.why }}</p>
        </div>

        <p v-if="!judged" class="sms__hint">
          <AppIcon name="info" :size="12" />
          Tap the sender or any underlined part to inspect it before you judge.
        </p>

        <div v-else class="result" :class="chosen?.correct ? 'result--ok' : 'result--bad'" aria-live="polite">
          <p class="result__head">
            <AppIcon :name="chosen?.correct ? 'check' : 'alert'" :size="15" />
            <template v-if="chosen?.correct">Correct — {{ current.verdict }}.</template>
            <template v-else-if="chosen?.pick === 'verify'">
              Checking was wise, but this one gives enough to judge: {{ current.verdict.toLowerCase() }}.
            </template>
            <template v-else>
              Not quite — this is {{ current.isScam ? 'a scam' : 'genuine' }}: {{ current.verdict.toLowerCase() }}.
            </template>
          </p>
          <p class="result__body">{{ current.explanation }}</p>
          <ul class="result__list">
            <li v-for="tip in current.whatToDo" :key="tip">{{ tip }}</li>
          </ul>
        </div>
      </article>

      <div v-if="!judged" class="verdict" role="group" aria-label="Choose your verdict">
        <p class="verdict__prompt">What do you make of this message?</p>
        <div class="verdict__grid">
          <button
            v-for="opt in verdictOptions"
            :key="opt.id"
            type="button"
            class="verdict__btn"
            @click="judge(opt.id)"
          >
            <span class="verdict__icon" :class="`verdict__icon--${opt.id}`">
              <AppIcon :name="opt.icon" :size="18" />
            </span>
            <span class="verdict__label">{{ opt.label }}</span>
            <span class="verdict__hint">{{ opt.hint }}</span>
          </button>
        </div>
      </div>

      <div v-else class="scam__actions">
        <button type="button" class="btn btn--ghost btn--sm" @click="restart">Start this level again</button>
        <button type="button" class="btn btn--primary" @click="nextMessage">
          {{ index + 1 < total ? 'Next message' : 'See my results' }}
          <AppIcon name="arrow-right" :size="15" />
        </button>
      </div>
    </template>

    <template v-else>
      <div class="finish panel">
        <p class="eyebrow">Level complete</p>
        <h3 class="h2 finish__title">{{ correctCount }} of {{ total }} called correctly</h3>
        <p class="finish__sub">
          <template v-if="checkedCount">
            You also asked to check {{ checkedCount }} before judging — a good habit, but these messages had
            enough signs to decide.
          </template>
          <template v-else>Every message judged straight away. Compare your answers below.</template>
        </p>

        <ol class="finish__list">
          <li v-for="pick in picks" :key="pick.id" class="finish__row" :class="pick.correct ? 'is-ok' : 'is-bad'">
            <span class="finish__mark">
              <AppIcon :name="pick.correct ? 'check' : 'x'" :size="13" />
            </span>
            <span class="finish__what">
              <span class="finish__msg">{{ messages.find((m) => m.id === pick.id)?.verdict }}</span>
              <span class="finish__detail">
                You chose <strong>{{ pick.pick === 'verify' ? 'check first' : pick.pick }}</strong>; the answer was
                <strong>{{ pick.answer }}</strong>.
              </span>
            </span>
          </li>
        </ol>

        <div class="finish__actions">
          <button type="button" class="btn btn--ghost" @click="replay">Practise this level again</button>
          <button type="button" class="btn btn--primary" @click="emit('next-level')">
            Try the next level
            <AppIcon name="arrow-right" :size="15" />
          </button>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.scam {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scam__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.scam__desc {
  margin-top: 0.35rem;
  max-width: 52ch;
  font-size: var(--step--1);
  line-height: 1.5;
  color: var(--muted);
}

.scam__meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.badge--done {
  background: var(--success-bg);
  color: #04624f;
}

.scam__progress {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.scam__count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: var(--step--2);
  font-weight: 650;
  color: var(--muted);
}

.scam__dots {
  display: flex;
  gap: 0.3rem;
}

.scam__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--line-strong);
}

.scam__dot.is-passed {
  background: var(--green-500);
}

.scam__dot.is-on {
  background: var(--teal-700);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.16);
}

/* ---------- message artefact ---------- */
.sms {
  padding: 1rem 1.1rem 1.15rem;
  border-radius: var(--r-lg);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.sms__top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--muted);
  font-size: var(--step--2);
  font-weight: 650;
}

.sms__channel {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: var(--r-pill);
  background: var(--mint-100);
  color: var(--teal-700);
}

.sms__sender {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.5rem 0.55rem;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--mint-50);
  text-align: left;
  transition: border-color 180ms var(--ease), background 180ms var(--ease);
}

.sms__sender:hover,
.sms__sender.is-open {
  border-color: var(--teal-400);
  background: var(--paper);
}

.sms__avatar {
  display: grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  background: var(--mint-200);
  color: var(--teal-700);
  flex: none;
}

.sms__avatar.is-suspicious {
  background: var(--warn-bg);
  color: var(--warn);
}

.sms__sendertext {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.sms__sendername {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sms__senderlabel {
  font-size: var(--step--2);
  color: var(--muted);
}

.sms__inspecticon {
  display: grid;
  place-items: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--teal-700);
  flex: none;
}

.sms__body {
  padding: 0.85rem 0.95rem;
  border-radius: 1rem 1rem 1rem 0.3rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
  font-size: 0.98rem;
  line-height: 1.65;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.seg {
  display: inline;
  padding: 0.03em 0.12em;
  margin: 0 0.03em;
  border-radius: 0.3rem;
  border-bottom: 2px dotted var(--teal-500);
  background: rgba(20, 150, 139, 0.08);
  color: inherit;
  font: inherit;
  font-weight: 650;
  text-align: left;
  transition: background 160ms var(--ease), border-color 160ms var(--ease);
}

.seg:hover,
.seg.is-open {
  background: var(--mint-200);
  border-bottom-style: solid;
}

.seg--bad.is-open {
  background: var(--warn-bg);
  border-color: var(--warn);
}

.inspect {
  padding: 0.6rem 0.75rem;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  background: var(--paper);
  font-size: var(--step--1);
  line-height: 1.5;
}

.inspect--bad {
  border-color: var(--warn-line);
  background: var(--warn-bg);
  color: #6b3f06;
}

.inspect--ok {
  border-color: var(--mint-300);
  background: var(--success-bg);
  color: #04624f;
}

.inspect__what {
  font-weight: 600;
}

.inspect__why {
  margin-top: 0.25rem;
}

.sms__hint {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: var(--step--2);
  color: var(--muted);
}

/* ---------- verdict ---------- */
.verdict__prompt {
  font-size: var(--step--1);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.verdict__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.55rem;
}

.verdict__btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
  padding: 0.8rem 0.85rem;
  border-radius: var(--r-md);
  border: 1px solid var(--line-strong);
  background: var(--paper);
  text-align: left;
  transition: transform 180ms var(--ease), border-color 180ms var(--ease), box-shadow 180ms var(--ease);
}

.verdict__btn:hover {
  transform: translateY(-2px);
  border-color: var(--teal-500);
  box-shadow: var(--shadow-sm);
}

.verdict__icon {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 10px;
  margin-bottom: 0.1rem;
}

.verdict__icon--safe {
  background: var(--success-bg);
  color: var(--green-600);
}

.verdict__icon--verify {
  background: var(--mint-100);
  color: var(--teal-700);
}

.verdict__icon--scam {
  background: var(--warn-bg);
  color: var(--warn);
}

.verdict__label {
  font-size: 0.95rem;
  font-weight: 750;
}

.verdict__hint {
  font-size: var(--step--2);
  line-height: 1.4;
  color: var(--muted);
}

/* ---------- result ---------- */
.result {
  padding: 0.8rem 0.9rem;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  font-size: var(--step--1);
  line-height: 1.5;
}

.result--ok {
  background: var(--success-bg);
  border-color: var(--mint-300);
}

.result--bad {
  background: var(--warn-bg);
  border-color: var(--warn-line);
}

.result__head {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-weight: 750;
  color: var(--ink);
}

.result__body {
  margin-top: 0.4rem;
  color: var(--ink-soft);
}

.result__list {
  margin: 0.5rem 0 0;
  padding-left: 1.15rem;
  color: var(--ink-soft);
}

.result__list li + li {
  margin-top: 0.15rem;
}

.scam__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  flex-wrap: wrap;
}

/* ---------- finish ---------- */
.finish {
  padding: 1.25rem 1.3rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.finish__title {
  margin-top: 0.1rem;
}

.finish__sub {
  font-size: var(--step--1);
  line-height: 1.55;
  color: var(--muted);
  max-width: 58ch;
}

.finish__list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.finish__row {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.55rem 0.65rem;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
}

.finish__row.is-ok {
  background: var(--success-bg);
  border-color: var(--mint-300);
}

.finish__row.is-bad {
  background: var(--warn-bg);
  border-color: var(--warn-line);
}

.finish__mark {
  display: grid;
  place-items: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  background: var(--paper);
  flex: none;
}

.finish__what {
  display: flex;
  flex-direction: column;
  font-size: var(--step--1);
  line-height: 1.45;
}

.finish__msg {
  font-weight: 700;
}

.finish__detail {
  color: var(--ink-soft);
}

.finish__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
}

@media (max-width: 40rem) {
  .verdict__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .scam__actions,
  .finish__actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .scam__actions .btn,
  .finish__actions .btn {
    justify-content: center;
  }
}
</style>
