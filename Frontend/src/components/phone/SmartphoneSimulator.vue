<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { createWorld, homeApps } from '@/data/phoneWorld'
import CameraGalleryApp from '@/components/phone/apps/CameraGalleryApp.vue'
import WhatsAppApp from '@/components/phone/apps/WhatsAppApp.vue'
import MapsApp from '@/components/phone/apps/MapsApp.vue'
import PayApp from '@/components/phone/apps/PayApp.vue'
import SettingsApp from '@/components/phone/apps/SettingsApp.vue'
import MessagesApp from '@/components/phone/apps/MessagesApp.vue'
import BrowserApp from '@/components/phone/apps/BrowserApp.vue'
import RideApp from '@/components/phone/apps/RideApp.vue'
import FoodApp from '@/components/phone/apps/FoodApp.vue'

const props = defineProps({
  mission: { type: Object, required: true },
  hintToken: { type: String, default: '' },
  showHint: { type: Boolean, default: false },
  notice: { type: Object, default: null },
})
const emit = defineEmits(['action'])

const APPS = {
  camera: CameraGalleryApp,
  gallery: CameraGalleryApp,
  whatsapp: WhatsAppApp,
  maps: MapsApp,
  pay: PayApp,
  settings: SettingsApp,
  messages: MessagesApp,
  browser: BrowserApp,
  ride: RideApp,
  food: FoodApp,
}

const world = reactive(createWorld(props.mission.id))
const screen = ref('home')
const backTick = ref(0)
const appRef = ref(null)
const browserOrigin = ref('home')
const notifOpen = ref(true)

const NOTIFS = {
  'whatsapp-photo': {
    app: 'whatsapp',
    chat: 'ammi',
    icon: 'message',
    title: 'Ammi · WhatsApp',
    text: 'Beta, send me a photo of the garden 🌸',
  },
  'whatsapp-new-number': {
    app: 'whatsapp',
    chat: 'unknown',
    icon: 'shield-alert',
    title: 'Unknown number · WhatsApp',
    text: 'Assalam-o-Alaikum uncle, this is Bilal. New number, please save it…',
  },
  'sms-delivery-link': {
    app: 'messages',
    sms: 'parcel',
    icon: 'chat',
    title: 'VK-PRCLDL · Messages',
    text: 'Your parcel #PK28841 is on hold due to an incomplete address…',
  },
}

const notification = computed(() => (screen.value === 'home' && notifOpen.value ? NOTIFS[props.mission.id] : null))
const current = computed(() => APPS[screen.value] || null)
const darkTop = computed(() => screen.value === 'home' || screen.value === 'camera')

function openApp(id) {
  screen.value = id
  emit('action', `open:${id}`)
}

function goHome() {
  screen.value = 'home'
}

function goBack() {
  if (screen.value === 'home') return
  backTick.value += 1
}

function onExit() {
  screen.value = screen.value === 'browser' ? browserOrigin.value : 'home'
}

function handleAction(token) {
  if (token === 'tap:sms-link') {
    world.browserUrl = world.sms.parcel.href
    browserOrigin.value = 'messages'
    screen.value = 'browser'
  } else if (token === 'tap:browser-close') {
    screen.value = browserOrigin.value
  } else if (token === 'open:gallery') {
    screen.value = 'gallery'
  }
  emit('action', token)
}

function openNotification() {
  const n = notification.value
  if (!n) return
  notifOpen.value = false
  screen.value = n.app
  nextTick(() => {
    if (n.chat) appRef.value?.openChat?.(n.chat)
    if (n.sms) appRef.value?.openThread?.(n.sms)
  })
}

function isTarget(id) {
  return props.showHint && props.hintToken === `open:${id}`
}

const dockIds = ['messages', 'browser']
const dockApps = computed(() => homeApps.filter((a) => dockIds.includes(a.id)))
const gridApps = computed(() => homeApps.filter((a) => !dockIds.includes(a.id)))
</script>

<template>
  <div class="phone" :class="{ 'phone--home': screen === 'home' }">
    <div class="phone__frame">
      <div class="phone__screen">
        <div class="phone__status" :class="{ 'is-dark': darkTop }">
          <span>9:41</span>
          <span class="phone__status-right">
            <AppIcon name="signal" :size="11" />
            <AppIcon name="wifi" :size="11" />
            <span class="phone__batt" />
          </span>
        </div>
        <span class="phone__island" aria-hidden="true" />

        <div class="phone__body" :class="{ 'is-dark-top': screen === 'camera' }">
          <div v-if="screen === 'home'" key="home" class="p-home">
              <div class="p-home__clock">
                <p class="p-home__time">9:41</p>
                <p class="p-home__date">Thursday, 30 October · Practice phone</p>
              </div>

              <div class="p-home__grid">
                <button
                  v-for="app in gridApps"
                  :key="app.id"
                  type="button"
                  class="p-appicon"
                  :class="{ 'is-target': isTarget(app.id) }"
                  :aria-label="`Open ${app.name}`"
                  @click="openApp(app.id)"
                >
                  <span class="p-appicon__tile" :class="`tone-${app.tone}`">
                    <AppIcon :name="app.icon" :size="19" />
                    <span v-if="app.isNew" class="p-appicon__new">New</span>
                  </span>
                  <span class="p-appicon__label">{{ app.name }}</span>
                </button>
              </div>

              <div class="p-home__dock">
                <button
                  v-for="app in dockApps"
                  :key="app.id"
                  type="button"
                  class="p-appicon"
                  :class="{ 'is-target': isTarget(app.id) }"
                  :aria-label="`Open ${app.name}`"
                  @click="openApp(app.id)"
                >
                  <span class="p-appicon__tile" :class="`tone-${app.tone}`">
                    <AppIcon :name="app.icon" :size="18" />
                  </span>
                </button>
              </div>
              <p class="p-home__note">A pretend phone. Nothing here is real.</p>
            </div>

            <KeepAlive v-else>
              <component
                :is="current"
                ref="appRef"
                :world="world"
                :back-tick="backTick"
                @action="handleAction"
                @exit="onExit"
              />
            </KeepAlive>

          <button v-if="notification" type="button" class="p-notif" @click="openNotification">
            <span class="p-notif__icon"><AppIcon :name="notification.icon" :size="15" /></span>
            <span class="p-notif__copy">
              <span class="p-notif__app">Now</span>
              <span class="p-notif__title">{{ notification.title }}</span>
              <span class="p-notif__text">{{ notification.text }}</span>
            </span>
          </button>

          <p v-if="notice" class="phone__hint" :class="`phone__hint--${notice.tone}`" role="status">
            <AppIcon
              :name="notice.tone === 'ok' ? 'check' : notice.tone === 'warn' ? 'alert' : 'lightbulb'"
              :size="12"
            />
            <span>{{ notice.text }}</span>
          </p>
        </div>

        <div class="phone__nav">
          <button type="button" class="phone__navbtn" aria-label="Go back" :disabled="screen === 'home'" @click="goBack">
            <AppIcon name="back" :size="15" />
          </button>
          <button type="button" class="phone__navbtn" aria-label="Go to home screen" @click="goHome">
            <span class="phone__homecircle" />
          </button>
          <span class="phone__gesture" aria-hidden="true" />
          <button type="button" class="phone__navbtn" aria-label="Recent apps" @click="goHome">
            <AppIcon name="grid" :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone__body.is-dark-top {
  background: #04211f;
}

.p-home__note {
  position: relative;
  margin-top: 0.55rem;
  text-align: center;
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.45);
}

.phone__hint {
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
  bottom: 0.5rem;
  z-index: 36;
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 0.45rem 0.55rem;
  border-radius: 0.65rem;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid var(--warn-line);
  color: var(--warn);
  font-size: 0.6rem;
  line-height: 1.4;
  box-shadow: 0 10px 24px -14px rgba(4, 33, 31, 0.55);
  animation: notif-in 260ms var(--ease) both;
}

.phone__hint--ok {
  border-color: var(--mint-300);
  background: rgba(240, 253, 247, 0.98);
  color: #04624f;
}

.phone__hint--warn {
  border-color: var(--danger-line);
  background: rgba(254, 243, 242, 0.98);
  color: var(--danger);
}

.phone__homecircle {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  border: 1.5px solid currentColor;
}

.p-home__grid {
  margin-bottom: 1rem;
}

.p-home__dock {
  margin-top: auto;
}

.p-home__dock .p-appicon {
  justify-self: center;
}

.phone__body > .p-home {
  animation: screen-in 220ms var(--ease) both;
}

.phone__body :deep(.scr) {
  animation: screen-in 220ms var(--ease) both;
}

@keyframes screen-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
