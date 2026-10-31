<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import PhotoScene from '@/components/phone/PhotoScene.vue'
import { chatOrder } from '@/data/phoneWorld'

const props = defineProps({
  world: { type: Object, required: true },
  backTick: { type: Number, default: 0 },
})
const emit = defineEmits(['action', 'exit'])

const view = ref('list')
const chatId = ref(null)
const sheet = ref('')
const selected = ref(null)
const caption = ref('')
const call = ref(null)
const blockAsk = ref(false)
const sent = ref(false)

const chats = computed(() => chatOrder.map((id) => props.world.chats[id]).filter(Boolean))
const chat = computed(() => (chatId.value ? props.world.chats[chatId.value] : null))
const photos = computed(() => {
  const shots = props.world.photos.map((p) => ({ ...p, isNew: false }))
  if (props.world.newPhotoTaken) shots.unshift({ id: 'new', scene: 'garden', label: 'Garden', isNew: true })
  return shots
})

function preview(c) {
  const last = c.messages[c.messages.length - 1]
  if (!last) return 'Tap to start chatting'
  if (last.photo) return '📷 Photo'
  return `${last.from === 'me' ? 'You: ' : ''}${last.text}`
}

function openChat(id) {
  chatId.value = id
  view.value = 'chat'
  sent.value = false
  emit('action', `open-chat:${id}`)
}

function openContact() {
  if (!chat.value) return
  view.value = 'contact'
  emit('action', `contact-info:${chatId.value}`)
}

function startCall() {
  if (!chat.value) return
  call.value = { name: chat.value.name, connected: false, blocked: Boolean(props.world.blocked[chatId.value]) }
  emit('action', `call:${chatId.value}`)
  setTimeout(() => {
    if (call.value) call.value.connected = true
  }, 900)
}

function endCall() {
  call.value = null
}

function attach() {
  sheet.value = 'attach'
  emit('action', 'tap:wa-attach')
}

function attachPhotos() {
  sheet.value = 'picker'
  emit('action', 'tap:wa-attach-photos')
}

function pick(photo) {
  selected.value = photo
  sheet.value = 'preview'
  emit('action', `select-photo:${photo.id === 'new' ? 'garden' : photo.id}`)
}

function sendPhoto() {
  if (!selected.value || !chat.value) return
  chat.value.messages.push({
    from: 'me',
    photo: selected.value.scene,
    text: caption.value.trim(),
    time: 'now',
  })
  sent.value = true
  sheet.value = ''
  selected.value = null
  caption.value = ''
  emit('action', 'tap:wa-send-photo')
}

function confirmBlock() {
  props.world.blocked[chatId.value] = true
  blockAsk.value = false
  emit('action', `confirm-block:${chatId.value}`)
  chat.value.messages.push({ from: 'system', text: 'You blocked this contact.', time: 'now' })
}

watch(
  () => props.backTick,
  () => {
    if (call.value) return endCall()
    if (blockAsk.value) return (blockAsk.value = false)
    if (sheet.value) return (sheet.value = '')
    if (view.value === 'contact') return (view.value = 'chat')
    if (view.value === 'chat') return (view.value = 'list')
    emit('exit')
  },
)

defineExpose({ openChat })
</script>

<template>
  <div class="scr wa">
    <!-- chat list -->
    <template v-if="view === 'list'">
      <header class="wa__head">
        <h3 class="wa__brand">WhatsApp</h3>
        <span class="spacer" />
        <span class="wa__ico"><AppIcon name="search" :size="15" /></span>
        <span class="wa__ico"><AppIcon name="more" :size="15" /></span>
      </header>
      <div class="scr__body wa__list">
        <button
          v-for="c in chats"
          :key="c.id"
          type="button"
          class="wa__row"
          @click="openChat(c.id)"
        >
          <span class="wa__avatar" :class="{ 'is-unknown': c.unknown }">{{ c.initials }}</span>
          <span class="wa__rowtext">
            <span class="wa__rowtop">
              <span class="wa__name">{{ c.name }}</span>
              <span class="wa__time">{{ c.messages[c.messages.length - 1]?.time || '' }}</span>
            </span>
            <span class="wa__preview">{{ preview(c) }}</span>
          </span>
          <span v-if="c.unknown && !world.blocked[c.id]" class="wa__dot" aria-label="New message" />
        </button>
        <p class="wa__note"><AppIcon name="lock" :size="11" /> Messages in this demo never leave the phone.</p>
      </div>
    </template>

    <!-- chat -->
    <template v-else-if="view === 'chat' && chat">
      <header class="wa__chathead">
        <button type="button" class="scr__back wa__back" aria-label="Back to chats" @click="view = 'list'">
          <AppIcon name="back" :size="17" />
        </button>
        <button type="button" class="wa__who" @click="openContact">
          <span class="wa__avatar wa__avatar--sm" :class="{ 'is-unknown': chat.unknown }">{{ chat.initials }}</span>
          <span class="wa__whotext">
            <span class="wa__name">{{ chat.name }}</span>
            <span class="wa__about">{{ world.blocked[chat.id] ? 'Blocked' : chat.about }}</span>
          </span>
        </button>
        <span class="spacer" />
        <span class="wa__ico"><AppIcon name="volume" :size="15" /></span>
        <button type="button" class="wa__ico" aria-label="Call this contact" @click="startCall">
          <AppIcon name="phone" :size="15" />
        </button>
      </header>

      <div class="scr__body wa__thread">
        <p class="wa__stamp">Today</p>
        <div
          v-for="(m, i) in chat.messages"
          :key="i"
          class="wa__msg"
          :class="{ 'is-me': m.from === 'me', 'is-system': m.from === 'system' }"
        >
          <template v-if="m.photo">
            <span class="wa__photo"><PhotoScene :scene="m.photo" /></span>
            <span v-if="m.text" class="wa__msgtext">{{ m.text }}</span>
          </template>
          <template v-else>{{ m.text }}</template>
          <span v-if="m.from !== 'system'" class="wa__msgtime">{{ m.time }}</span>
        </div>
        <div v-if="world.blocked[chat.id]" class="wa__blocked">
          <AppIcon name="ban" :size="13" /> You blocked this contact. Messages can no longer be sent.
        </div>
        <p v-if="sent" class="wa__sent" role="status"><AppIcon name="check" :size="11" /> Photo sent ✓✓</p>
      </div>

      <div class="wa__composer">
        <button type="button" class="wa__attach" aria-label="Add an attachment" :disabled="world.blocked[chat.id]" @click="attach">
          <AppIcon name="plus" :size="16" />
        </button>
        <span class="wa__input" :class="{ 'is-disabled': world.blocked[chat.id] }">
          <AppIcon name="chat" :size="12" />
          {{ world.blocked[chat.id] ? 'You cannot reply to a blocked contact' : 'Message' }}
        </span>
        <span class="wa__mic"><AppIcon name="mic" :size="15" /></span>
      </div>
    </template>

    <!-- contact info -->
    <template v-else-if="view === 'contact' && chat">
      <header class="scr__head wa__plainhead">
        <button type="button" class="scr__back" aria-label="Back to chat" @click="view = 'chat'">
          <AppIcon name="back" :size="17" />
        </button>
        <h3 class="scr__title">Contact info</h3>
      </header>
      <div class="scr__body">
        <div class="wa__profile">
          <span class="wa__avatar wa__avatar--lg" :class="{ 'is-unknown': chat.unknown }">{{ chat.initials }}</span>
          <p class="wa__profilename">{{ chat.name }}</p>
          <p class="wa__phonenum">{{ chat.unknown ? '+92 301 ••• 5802' : chat.about }}</p>
          <span v-if="chat.unknown" class="p-badge"><AppIcon name="alert" :size="10" /> Not in your contacts</span>
        </div>
        <button type="button" class="p-row wa__danger" @click="blockAsk = true">
          <span class="p-row__icon wa__dangericon"><AppIcon name="ban" :size="16" /></span>
          <span class="p-row__text">
            <span class="p-row__title">{{ world.blocked[chat.id] ? 'Unblock and report' : 'Block and report' }}</span>
            <span class="p-row__sub">Stop this number messaging or calling you</span>
          </span>
          <AppIcon name="chevron-right" :size="14" />
        </button>
        <p class="wa__note wa__note--left">
          <AppIcon name="shield" :size="12" />
          Reporting sends the last messages to WhatsApp for review. In this demo nothing is sent.
        </p>
      </div>
    </template>

    <!-- attachment sheet -->
    <div v-if="sheet === 'attach'" class="p-scrim" @click.self="sheet = ''">
      <div class="p-sheet">
        <span class="p-sheet__grip" />
        <p class="p-sheet__title">Share with {{ chat?.name }}</p>
        <div class="wa__attachgrid">
          <button type="button" class="wa__attachitem" @click="attachPhotos">
            <span class="wa__attachicon is-green"><AppIcon name="image" :size="18" /></span>
            <span>Photos</span>
          </button>
          <span class="wa__attachitem is-off">
            <span class="wa__attachicon"><AppIcon name="camera" :size="18" /></span>
            <span>Camera</span>
          </span>
          <span class="wa__attachitem is-off">
            <span class="wa__attachicon"><AppIcon name="link" :size="18" /></span>
            <span>Document</span>
          </span>
          <span class="wa__attachitem is-off">
            <span class="wa__attachicon"><AppIcon name="pin" :size="18" /></span>
            <span>Location</span>
          </span>
        </div>
        <p class="wa__note wa__note--left">Only Photos is available in this demo.</p>
      </div>
    </div>

    <!-- photo picker -->
    <div v-if="sheet === 'picker'" class="p-scrim p-scrim--full" @click.self="sheet = 'attach'">
      <div class="p-sheet">
        <span class="p-sheet__grip" />
        <p class="p-sheet__title">Choose a photo</p>
        <div class="wa__pickgrid">
          <button
            v-for="p in photos"
            :key="p.id"
            type="button"
            class="wa__pick"
            :aria-label="`Choose ${p.label}`"
            @click="pick(p)"
          >
            <PhotoScene :scene="p.scene" />
            <span v-if="p.isNew" class="gal__new">New</span>
          </button>
        </div>
      </div>
    </div>

    <!-- send preview -->
    <div v-if="sheet === 'preview' && selected" class="p-scrim p-scrim--full" @click.self="sheet = 'picker'">
      <div class="p-sheet">
        <span class="p-sheet__grip" />
        <p class="p-sheet__title">Send photo</p>
        <div class="wa__preview">
          <span class="wa__previewimg"><PhotoScene :scene="selected.scene" /></span>
          <label class="wa__caption">
            <span>Add a caption</span>
            <input v-model="caption" type="text" maxlength="60" placeholder="Say something…" />
          </label>
          <div class="wa__sendrow">
            <span class="p-muted p-small">To {{ chat?.name }}</span>
            <button type="button" class="wa__sendbtn" aria-label="Send photo" @click="sendPhoto">
              <AppIcon name="send" :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- block confirm -->
    <div v-if="blockAsk" class="p-dialog">
      <div class="p-dialog__card">
        <p class="p-dialog__title">Block and report this number?</p>
        <p class="p-dialog__text">
          {{ chat?.name }} will not be able to message or call you. The last few messages are sent for review.
        </p>
        <div class="p-dialog__actions">
          <button type="button" class="p-btn p-btn--ghost p-btn--sm" @click="blockAsk = false">Cancel</button>
          <button type="button" class="p-btn p-btn--sm wa__blockbtn" @click="confirmBlock">Block and report</button>
        </div>
      </div>
    </div>

    <!-- call overlay -->
    <div v-if="call" class="wa__call">
      <div class="wa__calltop">
        <span class="wa__avatar wa__avatar--lg">{{ call.name.charAt(0) }}</span>
        <p class="wa__callname">{{ call.name }}</p>
        <p class="wa__callstate">{{ call.blocked ? 'Blocked contact' : call.connected ? 'Connected · 00:07' : 'Calling…' }}</p>
      </div>
      <div class="wa__callnote">
        <AppIcon name="shield" :size="13" />
        <span>This is a pretend call. Nothing is dialled.</span>
      </div>
      <button type="button" class="wa__hangup" aria-label="End call" @click="endCall">
        <AppIcon name="phone" :size="22" />
      </button>
      <p class="wa__hangup-label">End call</p>
    </div>
  </div>
</template>

<style scoped>
.wa {
  background: #fff;
}

.wa__head {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.8rem 0.6rem;
  background: linear-gradient(135deg, #0f5f57, #0b3d39);
  color: #fff;
}

.wa__brand {
  font-size: 1rem;
  font-weight: 750;
  letter-spacing: -0.01em;
}

.wa__ico {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  color: inherit;
  background: rgba(255, 255, 255, 0.12);
}

.wa__list {
  padding-top: 0.2rem;
}

.wa__row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.55rem 0.1rem;
  border-bottom: 1px solid var(--line);
  text-align: left;
}

.wa__avatar {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #34d399, #059669);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 750;
  flex: none;
}

.wa__avatar.is-unknown {
  background: linear-gradient(145deg, #f59e0b, #b45309);
}

.wa__avatar--sm {
  width: 1.9rem;
  height: 1.9rem;
  font-size: 0.7rem;
}

.wa__avatar--lg {
  width: 4.4rem;
  height: 4.4rem;
  font-size: 1.6rem;
  box-shadow: 0 12px 26px -14px rgba(6, 48, 45, 0.45);
}

.wa__rowtext {
  min-width: 0;
  flex: 1;
}

.wa__rowtop {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.4rem;
}

.wa__name {
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wa__time {
  font-size: 0.56rem;
  color: var(--muted);
  flex: none;
}

.wa__preview {
  display: block;
  margin-top: 0.05rem;
  font-size: 0.66rem;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wa__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--green-500);
  flex: none;
}

.wa__note {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.7rem;
  font-size: 0.58rem;
  color: var(--muted);
  text-align: center;
  justify-content: center;
}

.wa__note--left {
  justify-content: flex-start;
  text-align: left;
  line-height: 1.4;
  margin-top: 0.6rem;
}

.wa__chathead {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.6rem 0.5rem;
  background: linear-gradient(135deg, #0f5f57, #0b3d39);
  color: #fff;
}

.wa__back {
  color: #fff;
}

.wa__who {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  text-align: left;
  color: #fff;
}

.wa__whotext {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.wa__about {
  font-size: 0.56rem;
  color: rgba(255, 255, 255, 0.7);
}

.wa__thread {
  background:
    radial-gradient(circle at 20% 10%, rgba(16, 185, 129, 0.05), transparent 40%),
    var(--mint-50);
  padding-top: 0.5rem;
}

.wa__stamp {
  width: fit-content;
  margin: 0 auto 0.6rem;
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 0.54rem;
  font-weight: 650;
  color: var(--muted);
}

.wa__msg {
  position: relative;
  width: fit-content;
  max-width: 84%;
  margin-bottom: 0.4rem;
  padding: 0.4rem 0.55rem 0.55rem;
  border-radius: 0.6rem 0.6rem 0.6rem 0.15rem;
  background: #fff;
  box-shadow: 0 1px 0 rgba(6, 48, 45, 0.08);
  font-size: 0.7rem;
  line-height: 1.4;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.wa__msg.is-me {
  margin-left: auto;
  border-radius: 0.6rem 0.6rem 0.15rem 0.6rem;
  background: var(--mint-200);
}

.wa__msg.is-system {
  margin-inline: auto;
  border-radius: 999px;
  background: rgba(4, 33, 31, 0.06);
  font-size: 0.58rem;
  color: var(--muted);
  box-shadow: none;
}

.wa__msgtime {
  display: block;
  margin-top: 0.1rem;
  font-size: 0.5rem;
  color: var(--muted);
  text-align: right;
}

.wa__photo {
  display: block;
  width: 9rem;
  aspect-ratio: 4 / 3;
  border-radius: 0.45rem;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.wa__msgtext {
  display: block;
}

.wa__blocked {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0.6rem auto;
  width: fit-content;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: var(--danger-bg);
  border: 1px solid var(--danger-line);
  color: var(--danger);
  font-size: 0.56rem;
  font-weight: 650;
}

.wa__sent {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.58rem;
  font-weight: 650;
  color: #04624f;
}

.wa__composer {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.55rem;
  background: var(--mint-50);
  border-top: 1px solid var(--line);
}

.wa__attach {
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  background: var(--teal-600);
  color: #fff;
  flex: none;
}

.wa__attach:disabled {
  opacity: 0.4;
}

.wa__input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 1.9rem;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 0.64rem;
  color: var(--muted);
}

.wa__input.is-disabled {
  background: #f3f6f5;
}

.wa__mic {
  color: var(--teal-700);
  flex: none;
}

.wa__plainhead {
  border-bottom: 1px solid var(--line);
}

.wa__profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.9rem 0 1rem;
  text-align: center;
}

.wa__profilename {
  font-size: 0.92rem;
  font-weight: 750;
}

.wa__phonenum {
  font-size: 0.68rem;
  color: var(--muted);
}

.wa__danger {
  border: 1px solid var(--danger-line);
  border-radius: 0.7rem;
  padding: 0.55rem 0.6rem;
  background: var(--danger-bg);
  color: var(--danger);
}

.wa__dangericon {
  background: #fde8e6;
  color: var(--danger);
}

.wa__danger .p-row__title {
  color: var(--danger);
}

.wa__danger .p-row__sub {
  color: #8a3b34;
}

.wa__blockbtn {
  background: var(--danger);
}

.wa__attachgrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  padding: 0.2rem 0 0.4rem;
}

.wa__attachitem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.58rem;
  font-weight: 650;
  color: var(--ink-soft);
}

.wa__attachitem.is-off {
  opacity: 0.45;
}

.wa__attachicon {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--mint-100);
  color: var(--teal-700);
}

.wa__attachicon.is-green {
  background: linear-gradient(145deg, #34d399, #059669);
  color: #fff;
}

.p-scrim--full {
  align-items: stretch;
}

.p-scrim--full .p-sheet {
  max-height: 100%;
  height: 100%;
  border-radius: 1.2rem 1.2rem 0 0;
  justify-content: flex-start;
}

.wa__pickgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
}

.wa__pick {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.4rem;
  overflow: hidden;
}

.wa__preview {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.wa__previewimg {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 0.7rem;
  overflow: hidden;
}

.wa__caption span {
  display: block;
  font-size: 0.58rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.2rem;
}

.wa__caption input {
  width: 100%;
  min-height: 2.3rem;
  padding: 0 0.65rem;
  border-radius: 0.6rem;
  border: 1px solid var(--line-strong);
  font-size: 0.72rem;
}

.wa__sendrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.wa__sendbtn {
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #34d399, #059669);
  color: #fff;
  box-shadow: 0 8px 16px -10px rgba(5, 150, 105, 0.9);
}

.wa__call {
  position: absolute;
  inset: 0;
  z-index: 55;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.2rem 1.2rem 1.6rem;
  color: #fff;
  background:
    radial-gradient(circle at 50% 18%, rgba(52, 211, 153, 0.35), transparent 55%),
    linear-gradient(170deg, #0b3d39, #04211f);
  animation: fade-in 200ms ease both;
}

.wa__calltop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin-top: 1.6rem;
}

.wa__callname {
  font-size: 1.3rem;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.wa__callstate {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.72);
}

.wa__callnote {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.7rem;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.58rem;
  color: rgba(255, 255, 255, 0.8);
}

.wa__hangup {
  display: grid;
  place-items: center;
  width: 3.7rem;
  height: 3.7rem;
  margin-top: auto;
  border-radius: 50%;
  background: var(--danger);
  color: #fff;
  box-shadow: 0 16px 30px -12px rgba(180, 35, 24, 0.8);
  transform: rotate(135deg);
}

.wa__hangup-label {
  margin-top: 0.4rem;
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>
