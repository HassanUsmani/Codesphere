<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { locationPermissions } from '@/data/phoneWorld'

const props = defineProps({
  world: { type: Object, required: true },
  backTick: { type: Number, default: 0 },
})
const emit = defineEmits(['action', 'exit'])

const view = ref('main')
const permissionApp = ref(null)
const pin = ref('')
const pinStage = ref(1)
const pinFirst = ref('')
const pinError = ref('')
const inline = ref('')

const lockLabel = computed(() => {
  if (props.world.lock === 'PIN') return 'PIN'
  if (props.world.lock === 'Pattern') return 'Pattern'
  if (props.world.lock === 'Fingerprint') return 'Fingerprint'
  return 'None'
})

const apps = computed(() =>
  locationPermissions.map((a) => ({ ...a, value: props.world.permissions[a.app] })),
)

function tapWifi() {
  inline.value = 'Wi-Fi settings are not part of this mission. Go back to the main list.'
  emit('action', 'tap:settings-wifi')
}

function tapSound() {
  inline.value = 'Sound settings are not part of this mission. Try Privacy instead.'
  emit('action', 'tap:settings-sound')
}

function openSecurity() {
  inline.value = 'Screen lock protects the phone. Privacy shows what each app is allowed to see.'
  emit('action', 'tap:settings-security')
}

function openScreenLock() {
  view.value = 'screenlock'
  inline.value = ''
  emit('action', 'tap:settings-screen-lock')
}

function chooseLock(type) {
  if (type === 'none') {
    props.world.lock = 'none'
  }
  emit('action', `select-lock:${type}`)
  if (type === 'fingerprint') {
    props.world.lock = 'Fingerprint'
    emit('action', 'set-lock')
    view.value = 'main'
    inline.value = 'Fingerprint added. A PIN is still a good backup.'
    return
  }
  if (type === 'pattern') {
    props.world.lock = 'Pattern'
    emit('action', 'set-lock')
    view.value = 'main'
    inline.value = 'Pattern saved.'
    return
  }
  if (type === 'pin') {
    pin.value = ''
    pinFirst.value = ''
    pinStage.value = 1
    pinError.value = ''
    view.value = 'pin'
  }
}

function pinKey(d) {
  pinError.value = ''
  if (d === 'back') return (pin.value = pin.value.slice(0, -1))
  if (pin.value.length >= 4) return
  pin.value += d
}

function pinNext() {
  if (pin.value.length !== 4) return
  if (pinStage.value === 1) {
    pinFirst.value = pin.value
    pin.value = ''
    pinStage.value = 2
    return
  }
  if (pin.value !== pinFirst.value) {
    pinError.value = 'Those PINs did not match. Start again.'
    pinStage.value = 1
    pinFirst.value = ''
    pin.value = ''
    return
  }
  props.world.lock = 'PIN'
  emit('action', 'set-lock')
  pin.value = ''
  view.value = 'main'
  inline.value = 'Screen lock set to PIN. Your phone now asks for it when it wakes.'
}

function openPrivacy() {
  view.value = 'privacy'
  inline.value = ''
  emit('action', 'tap:settings-privacy')
}

function openPermissions() {
  view.value = 'permissions'
  emit('action', 'tap:settings-permissions')
}

function openLocation() {
  view.value = 'location'
  emit('action', 'open-permission:location')
}

function openApp(a) {
  permissionApp.value = a
  view.value = 'app'
}

function setPermission(value) {
  props.world.permissions.flashlight = value
  emit('action', `set-permission:flashlight:${value}`)
  view.value = 'location'
  inline.value =
    value === 'deny'
      ? 'Flashlight can no longer see your location.'
      : 'Flashlight can now see your location. That is more access than a torch needs.'
}

watch(
  () => props.backTick,
  () => {
    if (view.value === 'app') return (view.value = 'location')
    if (view.value === 'location') return (view.value = 'permissions')
    if (view.value === 'permissions') return (view.value = 'privacy')
    if (view.value === 'privacy') return (view.value = 'main')
    if (view.value === 'screenlock') return (view.value = 'main')
    if (view.value === 'pin') return (view.value = 'screenlock')
    emit('exit')
  },
)
</script>

<template>
  <div class="scr set">
    <!-- main list -->
    <template v-if="view === 'main'">
      <header class="scr__head set__head">
        <h3 class="scr__title">Settings</h3>
        <span class="spacer" />
        <span class="set__search"><AppIcon name="search" :size="13" /></span>
      </header>
      <div class="scr__body">
        <div class="set__profile">
          <span class="set__avatar">AK</span>
          <div>
            <p class="set__pname">Ayesha Khan</p>
            <p class="p-small p-muted">Google account · demo</p>
          </div>
        </div>

        <p v-if="inline" class="set__inline"><AppIcon name="info" :size="11" /> {{ inline }}</p>

        <p class="p-label set__label">Network &amp; phone</p>
        <button type="button" class="p-row" @click="tapWifi">
          <span class="p-row__icon"><AppIcon name="wifi" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Wi-Fi</span>
            <span class="p-row__sub">Home_WiFi · connected</span>
          </span>
          <AppIcon name="chevron-right" :size="13" />
        </button>
        <button type="button" class="p-row" @click="tapSound">
          <span class="p-row__icon"><AppIcon name="volume" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Sound</span>
            <span class="p-row__sub">Ring, media, calls</span>
          </span>
          <AppIcon name="chevron-right" :size="13" />
        </button>

        <button type="button" class="p-row" @click="openSecurity">
          <span class="p-row__icon"><AppIcon name="lock" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Security</span>
            <span class="p-row__sub">Screen lock and app permissions</span>
          </span>
        </button>
        <button type="button" class="p-row" @click="openScreenLock">
          <span class="p-row__icon"><AppIcon name="lock" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Screen lock</span>
            <span class="p-row__sub">{{ lockLabel === 'None' ? 'Not set — anyone can open your phone' : `${lockLabel} is on` }}</span>
          </span>
          <span class="p-row__end" :class="{ 'set__danger': lockLabel === 'None' }">{{ lockLabel }}</span>
        </button>
        <button type="button" class="p-row" @click="openPrivacy">
          <span class="p-row__icon"><AppIcon name="shield" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Privacy</span>
            <span class="p-row__sub">Permissions, personal data</span>
          </span>
          <AppIcon name="chevron-right" :size="13" />
        </button>

        <p class="p-label set__label">More</p>
        <div class="p-row">
          <span class="p-row__icon"><AppIcon name="battery" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Battery</span>
            <span class="p-row__sub">78% · about 9 hours left</span>
          </span>
        </div>
        <div class="p-row">
          <span class="p-row__icon"><AppIcon name="info" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">About phone</span>
            <span class="p-row__sub">Demo device · Tech Guide</span>
          </span>
        </div>
      </div>
    </template>

    <!-- screen lock -->
    <template v-else-if="view === 'screenlock'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to settings" @click="view = 'main'">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">Screen lock</h3>
          <p class="scr__sub">Currently: {{ lockLabel }}</p>
        </div>
      </header>
      <div class="scr__body">
        <div class="set__lockart">
          <span class="set__lockphone"><AppIcon name="lock" :size="22" /></span>
          <p class="set__locktitle">A lock is the first thing a stranger meets</p>
          <p class="p-small p-muted">Even a 4-digit PIN keeps your messages, photos and wallet app out of reach.</p>
        </div>
        <button type="button" class="p-row set__lockrow" @click="chooseLock('none')">
          <span class="p-row__text">
            <span class="p-row__title">None</span>
            <span class="p-row__sub">No lock at all</span>
          </span>
          <span v-if="lockLabel === 'None'" class="p-badge">In use</span>
        </button>
        <button type="button" class="p-row set__lockrow" @click="chooseLock('pin')">
          <span class="p-row__text">
            <span class="p-row__title">PIN</span>
            <span class="p-row__sub">Four numbers you will remember</span>
          </span>
          <span v-if="lockLabel === 'PIN'" class="p-badge">In use</span>
        </button>
        <button type="button" class="p-row set__lockrow" @click="chooseLock('pattern')">
          <span class="p-row__text">
            <span class="p-row__title">Pattern</span>
            <span class="p-row__sub">Join at least four dots</span>
          </span>
          <span v-if="lockLabel === 'Pattern'" class="p-badge">In use</span>
        </button>
        <button type="button" class="p-row set__lockrow" @click="chooseLock('fingerprint')">
          <span class="p-row__text">
            <span class="p-row__title">Fingerprint</span>
            <span class="p-row__sub">Touch the sensor to unlock</span>
          </span>
          <span v-if="lockLabel === 'Fingerprint'" class="p-badge">In use</span>
        </button>
      </div>
    </template>

    <!-- pin setup -->
    <template v-else-if="view === 'pin'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to lock types" @click="view = 'screenlock'">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">{{ pinStage === 1 ? 'Choose a PIN' : 'Confirm your PIN' }}</h3>
          <p class="scr__sub">Step {{ pinStage }} of 2</p>
        </div>
      </header>
      <div class="scr__body set__pinbody">
        <p class="set__pinhint">
          {{ pinStage === 1 ? 'Pick four numbers only you know. Avoid 1234 or your birth year.' : 'Type the same four numbers again.' }}
        </p>
        <div class="set__dots" aria-label="PIN entry">
          <span v-for="i in 4" :key="i" class="set__dot" :class="{ 'is-filled': pin.length >= i }" />
        </div>
        <p v-if="pinError" class="p-toast p-toast--danger" role="alert">{{ pinError }}</p>
        <div class="set__keypad" role="group" aria-label="PIN keypad">
          <button v-for="d in ['1', '2', '3', '4', '5', '6', '7', '8', '9']" :key="d" type="button" class="set__key" @click="pinKey(d)">{{ d }}</button>
          <span class="set__key set__key--empty" />
          <button type="button" class="set__key" @click="pinKey('0')">0</button>
          <button type="button" class="set__key set__key--icon" aria-label="Delete digit" @click="pinKey('back')">
            <AppIcon name="backspace" :size="17" />
          </button>
        </div>
      </div>
      <div class="scr__foot">
        <button type="button" class="p-btn" :disabled="pin.length !== 4" @click="pinNext">
          {{ pinStage === 1 ? 'Next' : 'Confirm PIN' }}
        </button>
      </div>
    </template>

    <!-- privacy -->
    <template v-else-if="view === 'privacy'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to settings" @click="view = 'main'">
          <AppIcon name="back" :size="17" />
        </button>
        <h3 class="scr__title">Privacy</h3>
      </header>
      <div class="scr__body">
        <div class="set__privacyart">
          <AppIcon name="shield" :size="22" />
          <p class="p-small">Permissions decide what each app can see and do. They should match what the app is for.</p>
        </div>
        <p v-if="inline" class="set__inline"><AppIcon name="info" :size="11" /> {{ inline }}</p>
        <button type="button" class="p-row" @click="openPermissions">
          <span class="p-row__icon"><AppIcon name="lock" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Permission manager</span>
            <span class="p-row__sub">Location, camera, microphone</span>
          </span>
          <AppIcon name="chevron-right" :size="13" />
        </button>
        <div class="p-row">
          <span class="p-row__icon"><AppIcon name="eye" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Privacy dashboard</span>
            <span class="p-row__sub">What apps used this week</span>
          </span>
        </div>
        <div class="p-row">
          <span class="p-row__icon"><AppIcon name="info" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Personal data</span>
            <span class="p-row__sub">Ads, usage access</span>
          </span>
        </div>
      </div>
    </template>

    <!-- permissions -->
    <template v-else-if="view === 'permissions'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to privacy" @click="view = 'privacy'">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">Permission manager</h3>
          <p class="scr__sub">Choose a permission</p>
        </div>
      </header>
      <div class="scr__body">
        <button type="button" class="p-row" @click="openLocation">
          <span class="p-row__icon"><AppIcon name="pin" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Location</span>
            <span class="p-row__sub">{{ apps.filter((a) => a.value !== 'deny').length }} apps can use it</span>
          </span>
          <AppIcon name="chevron-right" :size="13" />
        </button>
        <div class="p-row">
          <span class="p-row__icon"><AppIcon name="camera" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Camera</span>
            <span class="p-row__sub">2 apps</span>
          </span>
        </div>
        <div class="p-row">
          <span class="p-row__icon"><AppIcon name="mic" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">Microphone</span>
            <span class="p-row__sub">1 app</span>
          </span>
        </div>
      </div>
    </template>

    <!-- location detail -->
    <template v-else-if="view === 'location'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to permissions" @click="view = 'permissions'">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">Location</h3>
          <p class="scr__sub">Apps with access</p>
        </div>
      </header>
      <div class="scr__body">
        <p v-if="inline" class="set__inline" :class="{ 'is-ok': world.permissions.flashlight === 'deny' }">
          <AppIcon name="info" :size="11" /> {{ inline }}
        </p>
        <div v-for="a in apps" :key="a.app" class="set__permrow">
          <span class="p-row__icon"><AppIcon :name="a.icon" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">{{ a.name }}</span>
            <span class="p-row__sub">
              {{ a.value === 'deny' ? 'Not allowed' : a.value === 'always' ? 'Allowed all the time' : 'Allowed while in use' }}
            </span>
          </span>
          <button v-if="a.app === 'flashlight'" type="button" class="p-btn p-btn--ghost p-btn--sm set__manage" @click="openApp(a)">
            Manage
          </button>
          <span v-else class="p-row__end">
            <AppIcon :name="a.value === 'deny' ? 'ban' : 'check'" :size="12" />
          </span>
        </div>
        <p class="set__note"><AppIcon name="lightbulb" :size="12" /> Ask yourself: why would a torch need to know where you are?</p>
      </div>
    </template>

    <!-- flashlight permission -->
    <template v-else-if="view === 'app' && permissionApp">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to location list" @click="view = 'location'">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">{{ permissionApp.name }}</h3>
          <p class="scr__sub">Location permission</p>
        </div>
      </header>
      <div class="scr__body">
        <div class="set__appart">
          <span class="set__appicon"><AppIcon :name="permissionApp.icon" :size="22" /></span>
          <p class="p-small">A flashlight only needs the lamp. Location access lets an app know where you are, even when you are not using it.</p>
        </div>
        <p class="p-label set__label">Allow {{ permissionApp.name }} to access this phone’s location?</p>
        <button type="button" class="set__choice" @click="setPermission('allow')">
          <span class="set__radio" :class="{ 'is-on': world.permissions.flashlight !== 'deny' }" />
          <span>
            <span class="set__choicetitle">Allow</span>
            <span class="set__choicesub">While the app is in use</span>
          </span>
        </button>
        <button type="button" class="set__choice" @click="setPermission('deny')">
          <span class="set__radio" :class="{ 'is-on': world.permissions.flashlight === 'deny' }" />
          <span>
            <span class="set__choicetitle">Don’t allow</span>
            <span class="set__choicesub">The app cannot see your location</span>
          </span>
        </button>
        <p class="set__note"><AppIcon name="shield" :size="12" /> Denying a permission never breaks a basic feature like the torch.</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.set {
  background: #fff;
}

.set__head {
  border-bottom: 1px solid var(--line);
}

.set__search {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background: var(--mint-50);
  color: var(--muted);
}

.set__profile {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.6rem;
  border-radius: 0.8rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
  margin-bottom: 0.6rem;
}

.set__avatar {
  display: grid;
  place-items: center;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #0f766e, #059669);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 750;
}

.set__pname {
  font-size: 0.75rem;
  font-weight: 700;
}

.set__inline {
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
  margin-bottom: 0.55rem;
  padding: 0.4rem 0.5rem;
  border-radius: 0.55rem;
  background: var(--warn-bg);
  border: 1px solid var(--warn-line);
  color: var(--warn);
  font-size: 0.58rem;
  line-height: 1.4;
}

.set__inline.is-ok {
  background: var(--success-bg);
  border-color: var(--mint-300);
  color: #04624f;
}

.set__label {
  margin: 0.65rem 0 0.1rem;
}

.set__danger {
  color: var(--danger) !important;
  font-weight: 750;
}

.set__lockart {
  padding: 0.9rem 0.6rem;
  border-radius: 0.8rem;
  background: linear-gradient(160deg, var(--mint-100), var(--mint-50));
  border: 1px solid var(--line);
  text-align: center;
  margin-bottom: 0.55rem;
}

.set__lockphone {
  display: grid;
  place-items: center;
  width: 2.9rem;
  height: 2.9rem;
  margin: 0 auto 0.45rem;
  border-radius: 0.8rem;
  background: #fff;
  color: var(--teal-700);
  box-shadow: var(--shadow-sm);
}

.set__locktitle {
  font-size: 0.78rem;
  font-weight: 750;
  margin-bottom: 0.15rem;
}

.set__lockrow {
  border: 1px solid var(--line);
  border-radius: 0.65rem;
  padding: 0.55rem 0.6rem;
  margin-bottom: 0.35rem;
}

.set__pinbody {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.6rem;
}

.set__pinhint {
  font-size: 0.64rem;
  line-height: 1.45;
  color: var(--muted);
  text-align: center;
  max-width: 16rem;
}

.set__dots {
  display: flex;
  gap: 0.65rem;
  margin: 0.9rem 0;
}

.set__dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
}

.set__dot.is-filled {
  background: var(--teal-600);
  border-color: var(--teal-600);
}

.set__keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.3rem;
  width: 100%;
  margin-top: auto;
}

.set__key {
  display: grid;
  place-items: center;
  min-height: 2.45rem;
  border-radius: 0.65rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
  font-size: 1rem;
  font-weight: 650;
}

.set__key:hover {
  background: var(--mint-100);
}

.set__key--empty {
  visibility: hidden;
}

.set__key--icon {
  color: var(--teal-700);
}

.set__privacyart {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.6rem;
  border-radius: 0.7rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
  color: var(--teal-700);
  margin-bottom: 0.5rem;
}

.set__privacyart .p-small {
  color: var(--ink-soft);
}

.set__permrow {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--line);
}

.set__manage {
  width: auto;
  padding-inline: 0.6rem;
}

.set__note {
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
  margin-top: 0.7rem;
  padding: 0.45rem 0.5rem;
  border-radius: 0.55rem;
  background: var(--mint-50);
  font-size: 0.58rem;
  line-height: 1.4;
  color: var(--ink-soft);
}

.set__appart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  padding: 0.8rem 0.5rem 0.9rem;
  text-align: center;
}

.set__appicon {
  display: grid;
  place-items: center;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 1rem;
  background: linear-gradient(145deg, #34d399, #059669);
  color: #fff;
  box-shadow: 0 12px 24px -14px rgba(5, 150, 105, 0.9);
}

.set__choice {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.55rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: 0.65rem;
  margin-bottom: 0.35rem;
  text-align: left;
}

.set__radio {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
  flex: none;
  display: grid;
  place-items: center;
}

.set__radio.is-on {
  border-color: var(--teal-600);
  background: var(--teal-600);
  box-shadow: inset 0 0 0 2px #fff;
}

.set__choicetitle {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
}

.set__choicesub {
  display: block;
  font-size: 0.58rem;
  color: var(--muted);
}
</style>
