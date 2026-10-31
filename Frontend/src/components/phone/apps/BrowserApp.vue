<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'

const props = defineProps({
  world: { type: Object, required: true },
  backTick: { type: Number, default: 0 },
})
const emit = defineEmits(['action', 'exit'])

const open = ref(false)
const expanded = ref(false)
const payTried = ref(false)

const url = computed(() => props.world.browserUrl || '')
const host = computed(() => url.value.replace(/^https?:\/\//, '').split('/')[0])
const shortHost = computed(() => (host.value.length > 24 ? `${host.value.slice(0, 24)}…` : host.value))

function readAddress() {
  expanded.value = true
  emit('action', 'tap:browser-address')
}

function close() {
  open.value = false
  emit('action', 'tap:browser-close')
}

function tryPay() {
  payTried.value = true
}

watch(
  () => props.backTick,
  () => {
    if (expanded.value) return (expanded.value = false)
    close()
  },
)
</script>

<template>
  <div class="scr brw">
    <div class="brw__chrome">
      <button type="button" class="brw__close" aria-label="Close this page" @click="close">
        <AppIcon name="x" :size="16" />
      </button>
      <button type="button" class="brw__url" :class="{ 'is-open': expanded }" aria-label="Read the full address" @click="readAddress">
        <AppIcon name="lock" :size="10" />
        <span class="brw__host">{{ expanded ? host : shortHost }}</span>
        <span class="brw__tab">1</span>
      </button>
      <span class="brw__more"><AppIcon name="more" :size="15" /></span>
    </div>

    <div v-if="expanded" class="brw__address">
      <p class="brw__addresslabel">Full address</p>
      <p class="brw__addressurl">https://{{ host }}</p>
      <p class="brw__addresswarn">
        <AppIcon name="alert" :size="12" />
        Is this the courier’s own website? Look at the name carefully: extra words and dashes are a warning.
      </p>
    </div>

    <div class="scr__body brw__page">
      <div class="brw__brand">
        <span class="brw__brandmark"><AppIcon name="send" :size="14" /></span>
        <div>
          <p class="brw__brandname">SwiftPost</p>
          <p class="brw__brandsub">Delivery support</p>
        </div>
        <span class="brw__insecure"><AppIcon name="alert" :size="10" /> Unverified</span>
      </div>

      <h4 class="brw__title">Your parcel is on hold</h4>
      <p class="brw__text">
        Parcel <b>#PK28841</b> could not be delivered because the address was incomplete. A re-delivery fee is
        required within 12 hours or the parcel will be returned.
      </p>

      <div class="brw__fee">
        <span>Re-delivery fee</span>
        <strong>Rs 250</strong>
      </div>

      <div class="brw__form">
        <label>
          <span>Card number</span>
          <input type="text" inputmode="numeric" placeholder="0000 0000 0000 0000" />
        </label>
        <div class="brw__row2">
          <label>
            <span>Expiry</span>
            <input type="text" inputmode="numeric" placeholder="MM / YY" />
          </label>
          <label>
            <span>CVV</span>
            <input type="text" inputmode="numeric" placeholder="•••" />
          </label>
        </div>
      </div>

      <button type="button" class="p-btn brw__pay" @click="tryPay">Pay Rs 250 and reschedule</button>

      <div v-if="payTried" class="p-toast p-toast--danger brw__stop" role="alert">
        <AppIcon name="ban" :size="13" />
        <span>This is where card details get stolen. Close this page and check the delivery in the courier’s own app.</span>
      </div>

      <p class="brw__legal">
        This page is a drawing inside a training simulation. It is not a real website and cannot take payments.
      </p>
    </div>
  </div>
</template>

<style scoped>
.brw {
  background: #fff;
}

.brw__chrome {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.5rem;
  background: #eef7f4;
  border-bottom: 1px solid var(--line);
}

.brw__close {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  color: var(--ink-soft);
  flex: none;
}

.brw__close:hover {
  background: #ddeee9;
}

.brw__url {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  min-width: 0;
  min-height: 1.9rem;
  padding: 0 0.5rem;
  border-radius: 0.55rem;
  background: #fff;
  border: 1px solid var(--line);
  color: var(--ink-soft);
  font-size: 0.62rem;
  text-align: left;
}

.brw__url.is-open {
  border-color: var(--warn);
  background: var(--warn-bg);
}

.brw__host {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 650;
}

.brw__tab {
  display: grid;
  place-items: center;
  width: 1rem;
  height: 1rem;
  border: 1px solid var(--line-strong);
  border-radius: 0.2rem;
  font-size: 0.5rem;
  font-weight: 750;
  flex: none;
}

.brw__more {
  color: var(--muted);
  flex: none;
}

.brw__address {
  flex: none;
  padding: 0.45rem 0.6rem 0.5rem;
  background: var(--warn-bg);
  border-bottom: 1px solid var(--warn-line);
}

.brw__addresslabel {
  font-size: 0.5rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--warn);
}

.brw__addressurl {
  margin-top: 0.1rem;
  font-size: 0.66rem;
  font-weight: 750;
  color: #7c3f00;
  overflow-wrap: anywhere;
}

.brw__addresswarn {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  margin-top: 0.25rem;
  font-size: 0.55rem;
  line-height: 1.4;
  color: var(--warn);
}

.brw__page {
  padding-top: 0.7rem;
}

.brw__brand {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--line);
}

.brw__brandmark {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.55rem;
  background: linear-gradient(145deg, #0f766e, #059669);
  color: #fff;
}

.brw__brandname {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.brw__brandsub {
  font-size: 0.52rem;
  color: var(--muted);
}

.brw__insecure {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-left: auto;
  padding: 0.12rem 0.35rem;
  border-radius: 999px;
  background: var(--warn-bg);
  border: 1px solid var(--warn-line);
  color: var(--warn);
  font-size: 0.48rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.brw__title {
  margin-top: 0.6rem;
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brw__text {
  margin-top: 0.25rem;
  font-size: 0.66rem;
  line-height: 1.5;
  color: var(--ink-soft);
}

.brw__fee {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.6rem 0;
  padding: 0.5rem 0.6rem;
  border-radius: 0.55rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
  font-size: 0.66rem;
  color: var(--ink-soft);
}

.brw__fee strong {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--teal-800);
}

.brw__form {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.brw__form label span {
  display: block;
  font-size: 0.53rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.15rem;
}

.brw__form input {
  width: 100%;
  min-height: 2.2rem;
  padding: 0 0.55rem;
  border-radius: 0.5rem;
  border: 1px solid var(--line-strong);
  font-size: 0.7rem;
  background: #fff;
}

.brw__row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
}

.brw__pay {
  margin-top: 0.65rem;
  background: var(--danger);
  box-shadow: 0 10px 20px -14px rgba(180, 35, 24, 0.8);
}

.brw__stop {
  margin-top: 0.55rem;
}

.brw__legal {
  margin-top: 0.7rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--line);
  font-size: 0.52rem;
  line-height: 1.45;
  color: var(--muted);
}
</style>
