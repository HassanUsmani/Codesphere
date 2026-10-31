<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { payees } from '@/data/phoneWorld'

const props = defineProps({
  world: { type: Object, required: true },
  backTick: { type: Number, default: 0 },
})
const emit = defineEmits(['action', 'exit'])

const view = ref('home')
const payee = ref(null)
const amount = ref('')
const pin = ref('')
const reference = ref('')

const amountLabel = computed(() => (amount.value ? Number(amount.value).toLocaleString('en-PK') : '0'))
const pinDots = computed(() => [0, 1, 2, 3].map((i) => i < pin.value.length))

function openPayees() {
  view.value = 'payees'
  emit('action', 'tap:pay-anyone')
}

function choosePayee(p) {
  payee.value = p
  amount.value = ''
  view.value = 'amount'
  emit('action', `select-payee:${p.id}`)
}

function key(d) {
  if (d === 'back') return (amount.value = amount.value.slice(0, -1))
  if (d === '00') return (amount.value = amount.value ? `${amount.value}00` : '')
  if (amount.value.length >= 4) return
  amount.value = `${amount.value}${d}`
}

function toPin() {
  emit('action', `enter-amount:${Number(amount.value || 0)}`)
  pin.value = ''
  view.value = 'pin'
}

function pinKey(d) {
  if (d === 'back') return (pin.value = pin.value.slice(0, -1))
  if (pin.value.length >= 4) return
  pin.value += d
}

function confirmPin() {
  if (pin.value.length !== 4) return
  reference.value = `PK${Math.floor(100000 + Math.random() * 899999)}`
  props.world.payments.unshift({
    to: payee.value.name,
    amount: Number(amount.value),
    time: 'now',
  })
  props.world.sentTo = payee.value.id
  view.value = 'done'
  emit('action', 'enter-pin')
}

function home() {
  view.value = 'home'
  payee.value = null
  amount.value = ''
  pin.value = ''
}

watch(
  () => props.backTick,
  () => {
    if (view.value === 'done') return home()
    if (view.value === 'pin') return (view.value = 'amount')
    if (view.value === 'amount') return (view.value = 'payees')
    if (view.value === 'payees') return (view.value = 'home')
    emit('exit')
  },
)
</script>

<template>
  <div class="scr pay">
    <!-- home -->
    <template v-if="view === 'home'">
      <header class="pay__head">
        <div class="pay__hi">
          <span class="pay__avatar"><AppIcon name="wallet" :size="15" /></span>
          <div>
            <p class="pay__hello">Assalam-o-Alaikum</p>
            <p class="pay__name">Ayesha Khan</p>
          </div>
        </div>
        <span class="pay__lock"><AppIcon name="lock" :size="12" /> Demo balance</span>
        <div class="pay__balance">
          <p class="pay__amount">Rs 4,250<span>.00</span></p>
          <p class="pay__walletno">Wallet · •••• 4411</p>
        </div>
      </header>

      <div class="scr__body pay__body">
        <div class="pay__actions">
          <button type="button" class="pay__action pay__action--main" @click="openPayees">
            <span class="pay__actionico"><AppIcon name="send" :size="17" /></span>
            <span>Pay anyone</span>
          </button>
          <span class="pay__action is-off">
            <span class="pay__actionico"><AppIcon name="qr" :size="17" /></span>
            <span>Scan</span>
          </span>
          <span class="pay__action is-off">
            <span class="pay__actionico"><AppIcon name="phone" :size="17" /></span>
            <span>Top-up</span>
          </span>
        </div>

        <p class="p-label pay__label">Recent</p>
        <ul class="pay__recent">
          <li v-for="(p, i) in world.payments.slice(0, 3)" :key="i" class="pay__recentrow">
            <span class="p-row__icon"><AppIcon name="send" :size="14" /></span>
            <span class="p-row__text">
              <span class="p-row__title">{{ p.to }}</span>
              <span class="p-row__sub">{{ p.time }}</span>
            </span>
            <span class="pay__recentamt">− Rs {{ Number(p.amount).toLocaleString('en-PK') }}</span>
          </li>
        </ul>
        <p class="pay__note"><AppIcon name="shield" :size="12" /> A pretend wallet. No real money moves.</p>
      </div>
    </template>

    <!-- payees -->
    <template v-else-if="view === 'payees'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back" @click="view = 'home'">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">Pay anyone</h3>
          <p class="scr__sub">Choose a saved contact</p>
        </div>
      </header>
      <div class="scr__body">
        <button v-for="p in payees" :key="p.id" type="button" class="pay__payee" @click="choosePayee(p)">
          <span class="pay__payeeavatar">{{ p.initials }}</span>
          <span class="p-row__text">
            <span class="p-row__title">{{ p.name }}</span>
            <span class="p-row__sub">{{ p.handle }}</span>
          </span>
          <AppIcon name="chevron-right" :size="14" />
        </button>
        <p class="pay__note"><AppIcon name="info" :size="12" /> Always check the name before you send money.</p>
      </div>
    </template>

    <!-- amount -->
    <template v-else-if="view === 'amount'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back" @click="view = 'payees'">
          <AppIcon name="back" :size="17" />
        </button>
        <h3 class="scr__title">Send money</h3>
      </header>
      <div class="scr__body pay__amountbody">
        <div class="pay__to">
          <span class="pay__payeeavatar pay__payeeavatar--sm">{{ payee?.initials }}</span>
          <div>
            <p class="p-small p-muted">To</p>
            <p class="pay__topayee">{{ payee?.name }}</p>
          </div>
        </div>
        <div class="pay__display">
          <span class="pay__currency">Rs</span>
          <span class="pay__digits" :class="{ 'is-zero': !amount }">{{ amountLabel }}</span>
        </div>
        <p class="pay__amounthint">Type the amount you want to send.</p>
        <div class="pay__keypad" role="group" aria-label="Amount keypad">
          <button v-for="d in ['1', '2', '3', '4', '5', '6', '7', '8', '9']" :key="d" type="button" class="pay__key" @click="key(d)">{{ d }}</button>
          <button type="button" class="pay__key" @click="key('00')">00</button>
          <button type="button" class="pay__key" @click="key('0')">0</button>
          <button type="button" class="pay__key pay__key--icon" aria-label="Delete digit" @click="key('back')">
            <AppIcon name="backspace" :size="17" />
          </button>
        </div>
      </div>
      <div class="scr__foot">
        <button type="button" class="p-btn" :disabled="!amount" @click="toPin">Continue</button>
      </div>
    </template>

    <!-- pin -->
    <template v-else-if="view === 'pin'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Change amount" @click="view = 'amount'">
          <AppIcon name="back" :size="17" />
        </button>
        <h3 class="scr__title">Enter your PIN</h3>
      </header>
      <div class="scr__body pay__pinbody">
        <p class="pay__pinsum">Rs {{ amountLabel }} to {{ payee?.name }}</p>
        <div class="pay__dots" aria-label="PIN entry">
          <span v-for="(filled, i) in pinDots" :key="i" class="pay__dot" :class="{ 'is-filled': filled }" />
        </div>
        <p class="pay__pinhint"><AppIcon name="lock" :size="11" /> Never share this PIN with anyone, even someone claiming to be from the bank.</p>
        <div class="pay__keypad" role="group" aria-label="PIN keypad">
          <button v-for="d in ['1', '2', '3', '4', '5', '6', '7', '8', '9']" :key="d" type="button" class="pay__key" @click="pinKey(d)">{{ d }}</button>
          <span class="pay__key pay__key--empty" />
          <button type="button" class="pay__key" @click="pinKey('0')">0</button>
          <button type="button" class="pay__key pay__key--icon" aria-label="Delete digit" @click="pinKey('back')">
            <AppIcon name="backspace" :size="17" />
          </button>
        </div>
      </div>
      <div class="scr__foot">
        <button type="button" class="p-btn p-btn--green" :disabled="pin.length !== 4" @click="confirmPin">
          <AppIcon name="lock" :size="14" /> Confirm payment
        </button>
      </div>
    </template>

    <!-- done -->
    <template v-else>
      <div class="scr__body pay__done">
        <span class="pay__check"><AppIcon name="check" :size="26" /></span>
        <p class="pay__dtitle">Payment sent</p>
        <p class="pay__damount">Rs {{ amountLabel }}</p>
        <p class="p-small p-muted">to {{ payee?.name }}</p>
        <div class="pay__receipt">
          <div><span>Reference</span><strong>{{ reference }}</strong></div>
          <div><span>From</span><strong>Wallet •••• 4411</strong></div>
          <div><span>Fee</span><strong>Rs 0</strong></div>
        </div>

        <div class="pay__offer">
          <span class="pay__offericon"><AppIcon name="sparkles" :size="15" /></span>
          <div>
            <p class="pay__offertitle">Rs 500 cashback unlocked!</p>
            <p class="pay__offertext">Claim before midnight at <b>pay-cashback.win</b></p>
          </div>
        </div>
        <p class="pay__offernote">Did anyone really promise you money after a payment? Decide what to do in the guide.</p>

        <button type="button" class="p-btn p-btn--soft" @click="home">Back to wallet</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pay {
  background: #fff;
}

.pay__head {
  flex: none;
  padding: 0.45rem 0.85rem 0.9rem;
  color: #fff;
  background:
    radial-gradient(90% 90% at 90% 0%, rgba(52, 211, 153, 0.4), transparent 60%),
    linear-gradient(150deg, #0f5f57, #0b3d39);
  border-radius: 0 0 1.2rem 1.2rem;
}

.pay__hi {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.pay__avatar {
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
}

.pay__hello {
  font-size: 0.54rem;
  color: rgba(255, 255, 255, 0.7);
}

.pay__name {
  font-size: 0.72rem;
  font-weight: 700;
}

.pay__lock {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  float: right;
  margin-top: -1.5rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 0.52rem;
  color: rgba(255, 255, 255, 0.85);
}

.pay__balance {
  margin-top: 1rem;
}

.pay__amount {
  font-size: 1.65rem;
  font-weight: 750;
  letter-spacing: -0.03em;
  line-height: 1;
}

.pay__amount span {
  font-size: 0.8rem;
  opacity: 0.65;
}

.pay__walletno {
  margin-top: 0.25rem;
  font-size: 0.56rem;
  color: rgba(255, 255, 255, 0.65);
}

.pay__body {
  padding-top: 0.65rem;
}

.pay__actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
}

.pay__action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 0.2rem;
  border-radius: 0.75rem;
  border: 1px solid var(--line);
  background: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--ink-soft);
}

.pay__action.is-off {
  opacity: 0.45;
}

.pay__action--main {
  border-color: transparent;
  background: linear-gradient(150deg, #0f766e, #14968b);
  color: #fff;
  box-shadow: 0 10px 20px -14px rgba(15, 118, 110, 0.9);
}

.pay__actionico {
  display: grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  background: var(--mint-100);
  color: var(--teal-700);
}

.pay__action--main .pay__actionico {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.pay__label {
  margin: 0.8rem 0 0.2rem;
}

.pay__recentrow {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--line);
}

.pay__recentamt {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--ink-soft);
}

.pay__note {
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
  margin-top: 0.75rem;
  font-size: 0.56rem;
  line-height: 1.4;
  color: var(--muted);
}

.pay__payee {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.6rem 0.1rem;
  border-bottom: 1px solid var(--line);
  text-align: left;
}

.pay__payeeavatar {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #34d399, #059669);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 750;
  flex: none;
}

.pay__payeeavatar--sm {
  width: 1.9rem;
  height: 1.9rem;
  font-size: 0.6rem;
}

.pay__amountbody {
  display: flex;
  flex-direction: column;
  padding-top: 0.35rem;
}

.pay__to {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  border-radius: 0.7rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
}

.pay__topayee {
  font-size: 0.74rem;
  font-weight: 700;
}

.pay__display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 1rem;
}

.pay__currency {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--muted);
}

.pay__digits {
  font-size: 2.1rem;
  font-weight: 750;
  letter-spacing: -0.03em;
  line-height: 1;
}

.pay__digits.is-zero {
  color: var(--line-strong);
}

.pay__amounthint {
  margin: 0.3rem 0 0.5rem;
  text-align: center;
  font-size: 0.58rem;
  color: var(--muted);
}

.pay__keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.3rem;
  margin-top: auto;
}

.pay__key {
  display: grid;
  place-items: center;
  min-height: 2.5rem;
  border-radius: 0.65rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
  font-size: 1rem;
  font-weight: 650;
  color: var(--ink);
}

.pay__key:hover {
  background: var(--mint-100);
}

.pay__key--icon {
  color: var(--teal-700);
}

.pay__key--empty {
  visibility: hidden;
}

.pay__pinbody {
  display: flex;
  flex-direction: column;
  padding-top: 0.6rem;
}

.pay__pinsum {
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.pay__dots {
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin: 0.9rem 0;
}

.pay__dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
}

.pay__dot.is-filled {
  background: var(--teal-600);
  border-color: var(--teal-600);
  transform: scale(1.05);
}

.pay__pinhint {
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
  padding: 0.4rem 0.5rem;
  border-radius: 0.55rem;
  background: var(--warn-bg);
  border: 1px solid var(--warn-line);
  color: var(--warn);
  font-size: 0.56rem;
  line-height: 1.4;
  margin-bottom: 0.7rem;
}

.pay__done {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 1.4rem;
}

.pay__check {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #34d399, #059669);
  color: #fff;
  box-shadow: 0 16px 30px -16px rgba(5, 150, 105, 0.9);
}

.pay__dtitle {
  margin-top: 0.6rem;
  font-size: 1rem;
  font-weight: 750;
}

.pay__damount {
  margin-top: 0.15rem;
  font-size: 1.5rem;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.pay__receipt {
  width: 100%;
  margin-top: 0.8rem;
  padding: 0.55rem 0.7rem;
  border-radius: 0.7rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
}

.pay__receipt div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.22rem 0;
  font-size: 0.62rem;
  color: var(--muted);
}

.pay__receipt strong {
  color: var(--ink);
  font-weight: 700;
}

.pay__offer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 0.7rem;
  padding: 0.55rem 0.6rem;
  border-radius: 0.7rem;
  background: var(--warn-bg);
  border: 1px dashed var(--warn-line);
  text-align: left;
}

.pay__offericon {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #fdecc8;
  color: var(--warn);
  flex: none;
}

.pay__offertitle {
  font-size: 0.68rem;
  font-weight: 750;
  color: #7c3f00;
}

.pay__offertext {
  font-size: 0.56rem;
  color: var(--warn);
  line-height: 1.3;
}

.pay__offertext b {
  font-weight: 750;
}

.pay__offernote {
  margin: 0.35rem 0 0.8rem;
  font-size: 0.55rem;
  line-height: 1.4;
  color: var(--muted);
}
</style>
