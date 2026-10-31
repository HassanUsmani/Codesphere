<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { places } from '@/data/phoneWorld'

const props = defineProps({
  world: { type: Object, required: true },
  backTick: { type: Number, default: 0 },
})
const emit = defineEmits(['action', 'exit'])

const view = ref('home')
const place = ref(null)
const mode = ref('')

const modes = [
  { id: 'walk', label: 'Walk', icon: 'walk', time: '14 min' },
  { id: 'ride', label: 'Ride', icon: 'car', time: '6 min' },
  { id: 'bike', label: 'Bike', icon: 'bike', time: '3 min' },
]

const routeLabel = computed(() => (place.value ? place.value.name : 'Choose a destination'))

function openDirections() {
  view.value = 'directions'
  emit('action', 'tap:maps-directions')
}

function openDestination() {
  view.value = 'places'
  emit('action', 'tap:maps-destination')
}

function choose(p) {
  place.value = p
  view.value = 'directions'
  emit('action', `select-place:${p.id}`)
}

function setMode(id) {
  mode.value = id
  emit('action', `select-mode:${id}`)
}

function start() {
  view.value = 'nav'
  emit('action', 'tap:maps-start')
}

watch(
  () => props.backTick,
  () => {
    if (view.value === 'nav') return (view.value = 'directions')
    if (view.value === 'places') return (view.value = 'directions')
    if (view.value === 'directions') return (view.value = 'home')
    emit('exit')
  },
)
</script>

<template>
  <div class="scr maps">
    <template v-if="view === 'home'">
      <div class="maps__canvas">
        <span class="road road-a" />
        <span class="road road-b" />
        <span class="road road-c" />
        <span class="block block-a" />
        <span class="block block-b" />
        <span class="park" />
        <span class="maps__me"><span /></span>
        <span class="maps__pin maps__pin--a"><span class="maps__ping" /></span>
      </div>
      <div class="maps__search"><AppIcon name="search" :size="14" /> Search here</div>
      <div class="maps__sheet">
        <span class="p-sheet__grip" />
        <div class="maps__quick">
          <button type="button" class="maps__quick-btn" @click="openDirections">
            <span class="maps__quick-ico"><AppIcon name="walk" :size="17" /></span>
            <span>Directions</span>
          </button>
          <span class="maps__quick-btn is-off">
            <span class="maps__quick-ico"><AppIcon name="pin" :size="17" /></span>
            <span>Saved</span>
          </span>
          <span class="maps__quick-btn is-off">
            <span class="maps__quick-ico"><AppIcon name="clock" :size="17" /></span>
            <span>Recent</span>
          </span>
        </div>
        <p class="p-label">Nearby</p>
        <div v-for="p in places" :key="p.id" class="p-row">
          <span class="p-row__icon"><AppIcon name="pin" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">{{ p.name }}</span>
            <span class="p-row__sub">{{ p.area }}</span>
          </span>
          <span class="p-row__end">{{ p.km }} km</span>
        </div>
      </div>
    </template>

    <template v-else-if="view === 'directions' || view === 'places'">
      <header class="maps__head">
        <button type="button" class="scr__back" aria-label="Back" @click="view === 'places' ? (view = 'directions') : (view = 'home')">
          <AppIcon name="back" :size="17" />
        </button>
        <h3 class="scr__title">Directions</h3>
        <span class="spacer" />
        <span class="p-badge">Demo</span>
      </header>

      <div class="scr__body maps__body">
        <div class="maps__fields">
          <span class="maps__dot" />
          <button type="button" class="maps__field" disabled>
            <span class="maps__field-label">From</span>
            <span class="maps__field-value">Your location · Gulshan-e-Iqbal</span>
          </button>
          <span class="maps__line" />
          <span class="maps__dot maps__dot--end" />
          <button
            type="button"
            class="maps__field maps__field--to"
            :class="{ 'is-active': view === 'places' }"
            aria-label="Choose a destination"
            @click="openDestination"
          >
            <span class="maps__field-label">To</span>
            <span class="maps__field-value" :class="{ 'is-empty': !place }">{{ routeLabel }}</span>
            <AppIcon name="chevron-right" :size="13" />
          </button>
        </div>

        <template v-if="view === 'places'">
          <p class="p-label maps__label">Nearby places</p>
          <button v-for="p in places" :key="p.id" type="button" class="p-row" @click="choose(p)">
            <span class="p-row__icon"><AppIcon name="pin" :size="15" /></span>
            <span class="p-row__text">
              <span class="p-row__title">{{ p.name }}</span>
              <span class="p-row__sub">{{ p.area }}</span>
            </span>
            <span class="p-row__end">{{ p.km }} km</span>
          </button>
          <p class="maps__hintmap"><AppIcon name="info" :size="11" /> This map is a drawing, not a live map.</p>
        </template>

        <template v-else>
          <div class="maps__mini">
            <span class="road road-a" />
            <span class="road road-b" />
            <span class="maps__route" />
            <span class="maps__pin maps__pin--b"><span class="maps__ping" /></span>
          </div>

          <ul class="maps__modes">
            <li v-for="m in modes" :key="m.id">
              <button type="button" class="maps__mode" :aria-pressed="mode === m.id" @click="setMode(m.id)">
                <AppIcon :name="m.icon" :size="15" />
                <span>{{ m.label }}</span>
                <span class="maps__modetime">{{ m.time }}</span>
              </button>
            </li>
          </ul>

          <div class="maps__summary">
            <p class="maps__dist">{{ place ? '1.2 km' : '— km' }}<span>{{ mode === 'walk' ? '· 14 min walk' : mode === 'ride' ? '· 6 min by car' : mode === 'bike' ? '· 3 min by bike' : '· choose how to travel' }}</span></p>
            <p class="p-small p-muted">{{ place ? `${place.name} · ${place.area}` : 'Pick a destination to see the route.' }}</p>
          </div>

          <button type="button" class="p-btn" :disabled="!place || !mode" @click="start">
            <AppIcon name="walk" :size="14" /> Start directions
          </button>
        </template>
      </div>
    </template>

    <div v-else-if="view === 'nav'" class="maps__nav">
      <div class="maps__banner">
        <span class="maps__turn"><AppIcon name="arrow-right" :size="20" /></span>
        <div>
          <p class="maps__turn-main">In 200 m, turn right</p>
          <p class="maps__turn-sub">onto Alamgir Road · {{ place?.name }}</p>
        </div>
      </div>
      <div class="maps__canvas maps__canvas--nav">
        <span class="road road-a" />
        <span class="road road-b" />
        <span class="maps__route maps__route--nav" />
        <span class="maps__me maps__me--nav"><span /></span>
      </div>
      <div class="maps__navfoot">
        <div>
          <p class="maps__eta">14 min</p>
          <p class="p-small p-muted">1.2 km · walking</p>
        </div>
        <button type="button" class="p-btn p-btn--ghost p-btn--sm maps__end" @click="view = 'directions'">End</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maps {
  background: #fff;
  position: relative;
}

.maps__canvas {
  position: relative;
  flex: none;
  height: 47%;
  overflow: hidden;
  background:
    linear-gradient(115deg, rgba(255, 255, 255, 0.7), transparent 45%),
    #e3f7ef;
}

.maps__canvas::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 1px 1px, rgba(15, 95, 87, 0.12) 1px, transparent 0);
  background-size: 14px 14px;
}

.road {
  position: absolute;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 95, 87, 0.08);
}

.road-a {
  width: 140%;
  height: 0.55rem;
  top: 38%;
  left: -20%;
  transform: rotate(-14deg);
}

.road-b {
  width: 0.5rem;
  height: 140%;
  top: -20%;
  left: 62%;
  transform: rotate(9deg);
}

.road-c {
  width: 120%;
  height: 0.35rem;
  top: 72%;
  left: -10%;
  transform: rotate(7deg);
}

.block {
  position: absolute;
  border-radius: 0.3rem;
  background: #d7eae4;
  box-shadow: inset 0 0 0 1px #c8ded8;
}

.block-a {
  width: 26%;
  height: 20%;
  top: 12%;
  left: 12%;
}

.block-b {
  width: 20%;
  height: 26%;
  bottom: 10%;
  right: 8%;
}

.park {
  position: absolute;
  width: 30%;
  height: 24%;
  border-radius: 0.5rem;
  background: #b7ecd8;
  bottom: 14%;
  left: 14%;
  box-shadow: inset 0 0 0 1px #a9e8d4;
}

.maps__me {
  position: absolute;
  top: 54%;
  left: 46%;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  background: #0f766e;
  border: 2px solid #fff;
  box-shadow: 0 0 0 6px rgba(15, 118, 110, 0.18);
}

.maps__pin {
  position: absolute;
  width: 1.3rem;
  height: 1.6rem;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: linear-gradient(145deg, #34d399, #059669);
  border: 2px solid #fff;
  box-shadow: 0 6px 12px -6px rgba(4, 33, 31, 0.5);
}

.maps__pin--a {
  top: 16%;
  right: 22%;
}

.maps__pin--b {
  top: 20%;
  left: 28%;
}

.maps__ping {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.5);
  animation: ping 2.2s ease-out infinite;
}

@keyframes ping {
  60% {
    box-shadow: 0 0 0 0.7rem rgba(52, 211, 153, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
  }
}

.maps__search {
  position: absolute;
  top: calc(var(--sb) + 0.4rem);
  left: 0.7rem;
  right: 0.7rem;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 10px 24px -14px rgba(4, 33, 31, 0.5);
  font-size: 0.7rem;
  color: var(--muted);
}

.maps__sheet {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-top: -1.1rem;
  z-index: 6;
  padding: 0.35rem 0.8rem 0.8rem;
  border-radius: 1.2rem 1.2rem 0 0;
  background: #fff;
  box-shadow: 0 -14px 30px -22px rgba(4, 33, 31, 0.4);
}

.maps__quick {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
  margin: 0.15rem 0 0.7rem;
}

.maps__quick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.45rem 0.2rem;
  border-radius: 0.7rem;
  border: 1px solid var(--line);
  font-size: 0.58rem;
  font-weight: 650;
  color: var(--ink-soft);
}

.maps__quick-btn.is-off {
  opacity: 0.45;
}

.maps__quick-ico {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--mint-100);
  color: var(--teal-700);
}

.maps__quick-btn:first-child .maps__quick-ico {
  background: var(--teal-600);
  color: #fff;
}

.maps__head {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem 0.5rem;
  border-bottom: 1px solid var(--line);
}

.maps__body {
  padding-top: 0.7rem;
}

.maps__fields {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.15rem 0 0.4rem 0.85rem;
}

.maps__dot {
  position: absolute;
  left: 0.1rem;
  top: 1.05rem;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--green-500);
}

.maps__dot--end {
  top: auto;
  bottom: 1.35rem;
  background: var(--teal-700);
  border-radius: 2px;
}

.maps__line {
  position: absolute;
  left: 0.33rem;
  top: 1.6rem;
  bottom: 1.7rem;
  width: 1px;
  background: repeating-linear-gradient(to bottom, var(--line-strong) 0 3px, transparent 3px 6px);
}

.maps__field {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  min-height: 2.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 0.65rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
  text-align: left;
  font-size: 0.68rem;
  color: var(--ink);
}

.maps__field--to {
  border-color: var(--teal-400);
  background: #fff;
}

.maps__field.is-active {
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.18);
}

.maps__field-label {
  flex: none;
  font-size: 0.5rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  width: 2rem;
}

.maps__field-value {
  flex: 1;
  font-weight: 650;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.maps__field-value.is-empty {
  color: var(--muted);
  font-weight: 600;
}

.maps__label {
  margin: 0.5rem 0 0.1rem;
}

.maps__hintmap {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.1rem;
  font-size: 0.56rem;
  color: var(--muted);
}

.maps__mini {
  position: relative;
  height: 4.9rem;
  margin: 0.2rem 0 0.55rem;
  border-radius: 0.8rem;
  overflow: hidden;
  background: #e3f7ef;
}

.maps__route {
  position: absolute;
  left: 24%;
  top: 66%;
  width: 48%;
  height: 0.3rem;
  border-radius: 999px;
  background: linear-gradient(90deg, #0f766e, #10b981);
  transform: rotate(-18deg);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.16);
}

.maps__modes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
  margin-bottom: 0.55rem;
}

.maps__mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  width: 100%;
  padding: 0.4rem 0.2rem;
  border-radius: 0.65rem;
  border: 1px solid var(--line);
  font-size: 0.6rem;
  font-weight: 650;
  color: var(--ink-soft);
}

.maps__mode[aria-pressed='true'] {
  background: var(--mint-100);
  border-color: var(--teal-400);
  color: var(--teal-800);
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.12);
}

.maps__modetime {
  font-size: 0.52rem;
  color: var(--muted);
}

.maps__summary {
  padding: 0.5rem 0.6rem;
  border-radius: 0.7rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
  margin-bottom: 0.55rem;
}

.maps__dist {
  font-size: 0.82rem;
  font-weight: 750;
}

.maps__dist span {
  margin-left: 0.3rem;
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--muted);
}

.maps__nav {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.maps__banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.7rem;
  background: linear-gradient(135deg, #0f5f57, #059669);
  color: #fff;
}

.maps__turn {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.6rem;
  background: rgba(255, 255, 255, 0.16);
}

.maps__turn-main {
  font-size: 0.78rem;
  font-weight: 750;
}

.maps__turn-sub {
  font-size: 0.58rem;
  color: rgba(255, 255, 255, 0.75);
}

.maps__canvas--nav {
  height: auto;
  flex: 1;
}

.maps__route--nav {
  left: 18%;
  top: 58%;
  width: 56%;
  height: 0.45rem;
  transform: rotate(-24deg);
}

.maps__me--nav {
  top: 70%;
  left: 26%;
}

.maps__navfoot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 0.6rem 0.8rem;
  border-top: 1px solid var(--line);
}

.maps__eta {
  font-size: 1rem;
  font-weight: 750;
}

.maps__end {
  width: auto;
  padding-inline: 0.9rem;
}
</style>
