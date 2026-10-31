<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { smsOrder } from '@/data/phoneWorld'

const props = defineProps({
  world: { type: Object, required: true },
  backTick: { type: Number, default: 0 },
})
const emit = defineEmits(['action', 'exit'])

const view = ref('list')
const threadId = ref(null)
const menu = ref(false)
const askReport = ref(false)
const reported = ref(false)

const threads = computed(() => smsOrder.map((id) => props.world.sms[id]))
const thread = computed(() => (threadId.value ? props.world.sms[threadId.value] : null))

function openThread(id, announce = true) {
  threadId.value = id
  view.value = 'thread'
  menu.value = false
  if (announce) emit('action', `open-sms:${id}`)
}

function readLink() {
  emit('action', 'tap:sms-link')
}

function confirmReport() {
  props.world.reportDone = true
  reported.value = true
  askReport.value = false
  menu.value = false
  emit('action', `confirm-report:${threadId.value}`)
}

defineExpose({ openThread })

watch(
  () => props.backTick,
  () => {
    if (askReport.value) return (askReport.value = false)
    if (menu.value) return (menu.value = false)
    if (view.value === 'thread') return (view.value = 'list')
    emit('exit')
  },
)
</script>

<template>
  <div class="scr msg">
    <template v-if="view === 'list'">
      <header class="scr__head msg__head">
        <h3 class="scr__title">Messages</h3>
        <span class="spacer" />
        <span class="msg__search"><AppIcon name="search" :size="13" /></span>
        <span class="msg__avatar">AK</span>
      </header>
      <div class="scr__body">
        <p class="p-label msg__label">Inbox</p>
        <button
          v-for="m in threads"
          :key="m.id"
          type="button"
          class="msg__row"
          :class="{ 'is-unread': m.id === 'parcel' && !world.reportDone }"
          @click="openThread(m.id)"
        >
          <span class="msg__avatar-sm">{{ m.sender.charAt(0) }}</span>
          <span class="p-row__text">
            <span class="msg__rowtop">
              <span class="msg__sender">{{ m.sender }}</span>
              <span class="msg__time">{{ m.time }}</span>
            </span>
            <span class="msg__snippet">{{ m.text }}</span>
          </span>
        </button>
        <p class="msg__note"><AppIcon name="shield" :size="12" /> Companies never ask for card details in a text.</p>
      </div>
    </template>

    <template v-else-if="view === 'thread' && thread">
      <header class="scr__head msg__threadhead">
        <button type="button" class="scr__back" aria-label="Back to messages" @click="view = 'list'">
          <AppIcon name="back" :size="17" />
        </button>
        <span class="msg__avatar-sm">{{ thread.sender.charAt(0) }}</span>
        <div>
          <h3 class="scr__title">{{ thread.sender }}</h3>
          <p class="scr__sub">SMS · {{ world.reportDone && thread.id === 'parcel' ? 'Blocked' : 'Not in contacts' }}</p>
        </div>
        <span class="spacer" />
        <button type="button" class="msg__more" aria-label="Message options" @click="menu = true">
          <AppIcon name="more" :size="15" />
        </button>
      </header>

      <div class="scr__body msg__thread">
        <p class="msg__stamp">Today · {{ thread.time }}</p>
        <div class="msg__bubble">
          <p>
            {{ thread.text }}
            <template v-if="thread.link">
              <button type="button" class="msg__link" @click="readLink">{{ thread.link }}</button>
            </template>
          </p>
        </div>
        <p class="msg__tiny">SMS messages are not end-to-end encrypted. Anyone with the link can build a fake page.</p>
        <div v-if="reported" class="msg__reported" role="status">
          <AppIcon name="check" :size="12" /> Reported and blocked. This sender is out of your inbox.
        </div>
      </div>
    </template>

    <!-- options -->
    <div v-if="menu" class="p-scrim" @click.self="menu = false">
      <div class="p-sheet">
        <span class="p-sheet__grip" />
        <p class="p-sheet__title">{{ thread?.sender }}</p>
        <button type="button" class="p-row msg__menurow" @click="askReport = true; menu = false">
          <span class="p-row__icon msg__dangericon"><AppIcon name="ban" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Block and report junk</span>
            <span class="p-row__sub">Report this sender to your network</span>
          </span>
        </button>
        <button type="button" class="p-row msg__menurow" @click="menu = false">
          <span class="p-row__icon"><AppIcon name="trash" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Delete conversation</span>
            <span class="p-row__sub">Only removes it from this phone</span>
          </span>
        </button>
        <button type="button" class="p-btn p-btn--ghost p-btn--sm msg__cancel" @click="menu = false">Cancel</button>
      </div>
    </div>

    <!-- confirm report -->
    <div v-if="askReport" class="p-dialog">
      <div class="p-dialog__card">
        <p class="p-dialog__title">Block and report?</p>
        <p class="p-dialog__text">
          {{ thread?.sender }} will be blocked and the message reported as junk. The sender is not told.
        </p>
        <div class="p-dialog__actions">
          <button type="button" class="p-btn p-btn--ghost p-btn--sm" @click="askReport = false">Cancel</button>
          <button type="button" class="p-btn p-btn--sm msg__reportbtn" @click="confirmReport">Report junk</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msg {
  background: #fff;
}

.msg__head {
  border-bottom: 1px solid var(--line);
}

.msg__search {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background: var(--mint-50);
  color: var(--muted);
}

.msg__avatar {
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #0f766e, #059669);
  color: #fff;
  font-size: 0.55rem;
  font-weight: 750;
}

.msg__label {
  margin: 0.55rem 0 0.25rem;
}

.msg__row {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  width: 100%;
  padding: 0.6rem 0.1rem;
  border-bottom: 1px solid var(--line);
  text-align: left;
}

.msg__avatar-sm {
  display: grid;
  place-items: center;
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 50%;
  background: var(--mint-100);
  color: var(--teal-700);
  font-size: 0.7rem;
  font-weight: 750;
  flex: none;
}

.msg__rowtop {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.4rem;
}

.msg__sender {
  font-size: 0.74rem;
  font-weight: 750;
  letter-spacing: 0.01em;
}

.msg__time {
  font-size: 0.55rem;
  color: var(--muted);
}

.msg__snippet {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 0.08rem;
  font-size: 0.63rem;
  line-height: 1.35;
  color: var(--muted);
}

.msg__row.is-unread .msg__snippet {
  color: var(--ink-soft);
  font-weight: 600;
}

.msg__row.is-unread .msg__sender::after {
  content: '';
  display: inline-block;
  width: 0.38rem;
  height: 0.38rem;
  margin-left: 0.3rem;
  border-radius: 50%;
  background: var(--green-500);
  vertical-align: middle;
}

.msg__note {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.8rem;
  font-size: 0.58rem;
  color: var(--muted);
}

.msg__threadhead {
  border-bottom: 1px solid var(--line);
  background: var(--mint-50);
}

.msg__more {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  color: var(--ink-soft);
}

.msg__thread {
  padding-top: 0.6rem;
  background: var(--mint-50);
}

.msg__stamp {
  text-align: center;
  font-size: 0.55rem;
  color: var(--muted);
  margin-bottom: 0.5rem;
}

.msg__bubble {
  max-width: 92%;
  padding: 0.55rem 0.65rem;
  border-radius: 0.9rem 0.9rem 0.9rem 0.2rem;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 0.7rem;
  line-height: 1.5;
  box-shadow: var(--shadow-xs);
}

.msg__link {
  display: inline;
  color: var(--teal-700);
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 2px;
  overflow-wrap: anywhere;
  text-align: left;
}

.msg__tiny {
  margin-top: 0.5rem;
  font-size: 0.55rem;
  line-height: 1.4;
  color: var(--muted);
}

.msg__reported {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.7rem;
  padding: 0.45rem 0.55rem;
  border-radius: 0.6rem;
  background: var(--success-bg);
  border: 1px solid var(--mint-300);
  color: #04624f;
  font-size: 0.6rem;
  font-weight: 650;
}

.msg__menurow {
  border: 0;
  padding: 0.6rem 0.1rem;
}

.msg__dangericon {
  background: var(--danger-bg);
  color: var(--danger);
}

.msg__cancel {
  margin-top: 0.5rem;
}

.msg__reportbtn {
  background: var(--danger);
}
</style>
