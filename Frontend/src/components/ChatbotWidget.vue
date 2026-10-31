<script setup>
import { nextTick, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { sendMessage } from '@/lib/services/chatService'

const open = ref(false)
const input = ref('')
const pending = ref(false)
const error = ref('')
const log = ref(null)
const field = ref(null)
const launcher = ref(null)

let nextId = 2
const messages = ref([
  {
    id: 1,
    role: 'assistant',
    text: 'Hello. I am the Tech Guide Assistant. I can point you to a module, explain a red flag, or open a practice activity.',
    
  },
])

const suggestions = [
  "موبائل کو وائی فائی سے کیسے جوڑیں؟",
  "WhatsApp par photo kaise bhejun?",
  'How do I spot a scam?',
  'What should I check before paying?',
  'How do I practise a ride booking?',
]

function openChat() {
  open.value = true
  nextTick(() => field.value?.focus())
}

function closeChat() {
  open.value = false
  nextTick(() => launcher.value?.focus())
}

function toggleChat() {
  if (open.value) closeChat()
  else openChat()
}

function scrollToLatest() {
  nextTick(() => {
    if (log.value) log.value.scrollTop = log.value.scrollHeight
  })
}

function lastUserMessage() {
  const last = [...messages.value].reverse().find((m) => m.role === 'user')
  return last?.text || ''
}

async function submit(text = input.value) {
  const value = String(text ?? '').trim()
  if (!value || pending.value) return

  error.value = ''
  const history = messages.value.map(({ role, text: body }) => ({ role, text: body }))
  messages.value.push({ id: nextId++, role: 'user', text: value })
  input.value = ''
  pending.value = true
  scrollToLatest()

  try {
    const reply = await sendMessage(value, history)
    messages.value.push({ id: nextId++, role: 'assistant', text: reply.text, label: reply.label })
  } catch (err) {
    error.value = err?.message || 'The assistant could not reply. Please try again.'
  } finally {
    pending.value = false
    scrollToLatest()
    nextTick(() => field.value?.focus())
  }
}

function onKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    submit()
  }
}

watch(open, (value) => {
  if (value) scrollToLatest()
})
</script>

<template>
  <div class="chatbot" :class="{ 'is-open': open }">
    <button
      ref="launcher"
      type="button"
      class="chatbot__launcher"
      :aria-label="open ? 'Close Tech Guide Assistant' : 'Open Tech Guide Assistant'"
      :aria-expanded="open"
      aria-controls="tg-chat-panel"
      @click="toggleChat"
    >
      <AppIcon :name="open ? 'x' : 'chat'" :size="22" />
    </button>

    <section
      v-if="open"
      id="tg-chat-panel"
      class="chatbot__panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="tg-chat-title"
      @keydown.esc="closeChat"
    >
      <header class="chatbot__head">
        <span class="chatbot__headIcon" aria-hidden="true"><AppIcon name="sparkles" :size="17" /></span>
        <div class="chatbot__headText">
          <p id="tg-chat-title" class="chatbot__title">Tech Guide Assistant</p>
          
        </div>
        <button type="button" class="chatbot__close" aria-label="Close assistant" @click="closeChat">
          <AppIcon name="x" :size="18" />
        </button>
      </header>

      <div ref="log" class="chatbot__log" role="log" aria-live="polite" aria-relevant="additions">
        <div v-for="message in messages" :key="message.id" class="chatbot__row" :class="`is-${message.role}`">
          <p class="chatbot__bubble">{{ message.text }}</p>
          <span v-if="message.label" class="chatbot__label">{{ message.label }}</span>
        </div>

        <div v-if="pending" class="chatbot__row is-assistant">
          <span class="chatbot__typing" role="status" aria-label="Assistant is typing">
            <span /><span /><span />
          </span>
        </div>

        <p v-if="error" class="chatbot__error" role="alert">
          {{ error }}
          <button type="button" @click="submit(lastUserMessage())">Try again</button>
        </p>
      </div>

      <div v-if="!messages.some((m) => m.role === 'user')" class="chatbot__suggest">
        <button v-for="suggestion in suggestions" :key="suggestion" type="button" @click="submit(suggestion)">
          {{ suggestion }}
        </button>
      </div>

      <form class="chatbot__composer" @submit.prevent="submit()">
        <label class="sr-only" for="tg-chat-input">Message Tech Guide Assistant</label>
        <textarea
          id="tg-chat-input"
          ref="field"
          v-model="input"
          rows="1"
          placeholder="Ask about a module or a scam…"
          @keydown="onKeydown"
        />
        <button
          type="submit"
          class="chatbot__send"
          :disabled="!input.trim() || pending"
          aria-label="Send message"
        >
          <AppIcon name="send" :size="17" />
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.chatbot__launcher {
  position: fixed;
  left: max(1.25rem, env(safe-area-inset-left));
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  z-index: 90;
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--teal-700), var(--green-600));
  color: #fff;
  box-shadow: 0 18px 34px -16px rgba(4, 33, 31, 0.9);
  transition: transform 200ms var(--ease), box-shadow 200ms var(--ease);
}

.chatbot__launcher:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 40px -16px rgba(4, 33, 31, 0.95);
}

.chatbot__panel {
  position: fixed;
  left: max(1.25rem, env(safe-area-inset-left));
  bottom: calc(max(1.25rem, env(safe-area-inset-bottom)) + 4.4rem);
  z-index: 95;
  display: flex;
  flex-direction: column;
  width: min(23rem, calc(100vw - 2.5rem));
  height: min(34rem, calc(100dvh - 7rem));
  overflow: hidden;
  border-radius: var(--r-xl);
  background: var(--paper);
  border: 1px solid var(--line-strong);
  box-shadow: var(--shadow-lg);
}

.chatbot__head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 0.9rem;
  border-bottom: 1px solid var(--line);
  background: var(--surface-soft);
}

.chatbot__headIcon {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  flex: none;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--teal-700), var(--green-500));
  color: #fff;
}

.chatbot__headText {
  flex: 1;
  min-width: 0;
}

.chatbot__title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.chatbot__sub {
  font-size: var(--step--2);
  color: var(--muted);
  line-height: 1.3;
}

.chatbot__close {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  flex: none;
  border-radius: 50%;
  color: var(--ink-soft);
}

.chatbot__close:hover {
  background: var(--mint-100);
  color: var(--teal-700);
}

.chatbot__log {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  overflow-y: auto;
  padding: 0.9rem;
  scroll-behavior: smooth;
}

.chatbot__row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  max-width: 88%;
}

.chatbot__row.is-user {
  align-self: flex-end;
  align-items: flex-end;
}

.chatbot__row.is-assistant {
  align-self: flex-start;
}

.chatbot__bubble {
  padding: 0.6rem 0.8rem;
  border-radius: 14px;
  font-size: var(--step--1);
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.is-assistant .chatbot__bubble {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  color: var(--ink-soft);
  border-bottom-left-radius: 5px;
}

.is-user .chatbot__bubble {
  background: linear-gradient(135deg, var(--teal-700), var(--teal-500));
  color: #fff;
  border-bottom-right-radius: 5px;
}

.chatbot__label {
  font-size: 0.62rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
  padding-left: 0.2rem;
}

.chatbot__typing {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.7rem 0.85rem;
  border-radius: 14px;
  border-bottom-left-radius: 5px;
  background: var(--surface-soft);
  border: 1px solid var(--line);
}

.chatbot__typing span {
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 50%;
  background: var(--teal-500);
  animation: chat-dot 1.1s ease-in-out infinite;
}

.chatbot__typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.chatbot__typing span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes chat-dot {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

.chatbot__error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.5rem 0.65rem;
  border-radius: var(--r-sm);
  background: var(--danger-bg);
  border: 1px solid var(--danger-line);
  color: var(--danger);
  font-size: var(--step--2);
  line-height: 1.4;
}

.chatbot__error button {
  font-weight: 750;
  color: var(--danger);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.chatbot__suggest {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  padding: 0 0.9rem 0.6rem;
}

.chatbot__suggest button {
  padding: 0.3rem 0.6rem;
  border-radius: var(--r-pill);
  border: 1px solid var(--line);
  background: var(--paper);
  font-size: 0.7rem;
  font-weight: 650;
  color: var(--teal-700);
}

.chatbot__suggest button:hover {
  border-color: var(--teal-400);
  background: var(--mint-50);
}

.chatbot__composer {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.7rem 0.8rem;
  border-top: 1px solid var(--line);
  background: var(--paper);
}

.chatbot__composer textarea {
  flex: 1;
  min-height: 2.6rem;
  max-height: 6rem;
  padding: 0.65rem 0.8rem;
  border-radius: var(--r-md);
  border: 1px solid var(--line-strong);
  background: var(--surface-soft);
  color: var(--ink);
  font-size: var(--step--1);
  line-height: 1.4;
  resize: none;
}

.chatbot__send {
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  flex: none;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--teal-700), var(--green-600));
  color: #fff;
}

.chatbot__send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 40rem) {
  .chatbot__panel {
    inset: 0;
    width: 100%;
    height: 100dvh;
    border-radius: 0;
    border: 0;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }

  .chatbot__log {
    padding: 1rem;
  }

  .chatbot__composer {
    padding-bottom: max(0.8rem, env(safe-area-inset-bottom));
  }
}

@media (prefers-reduced-motion: reduce) {
  .chatbot__launcher:hover {
    transform: none;
  }

  .chatbot__log {
    scroll-behavior: auto;
  }

  .chatbot__typing span {
    animation: none;
    opacity: 0.7;
  }
}
</style>
