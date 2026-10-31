<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { foodCategories, restaurants, restaurantById } from '@/data/phoneWorld'

const props = defineProps({
  world: { type: Object, required: true },
  backTick: { type: Number, default: 0 },
})
const emit = defineEmits(['action', 'exit'])

const stage = ref('home')
const activeRestaurant = ref(null)
const activeDish = ref(null)

const deliveryFee = 60
const platformFee = 15

const category = computed(() => props.world.foodCategory)
const filtered = computed(() => {
  if (!category.value) return restaurants
  const match = restaurants.filter((r) => r.categories.includes(category.value))
  return match.length ? match : restaurants
})
const cart = computed(() => props.world.foodCart)
const cartRestaurant = computed(() => (cart.value ? restaurantById[cart.value.restaurantId] : null))
const cartDish = computed(() => {
  if (!cart.value || !cartRestaurant.value) return null
  return cartRestaurant.value.menu.find((d) => d.id === cart.value.dishId) || null
})
const subtotal = computed(() => (cartDish.value ? cartDish.value.price * cart.value.qty : 0))
const total = computed(() => (cart.value ? subtotal.value + (cartRestaurant.value?.fee ?? deliveryFee) + platformFee : 0))
const qty = computed(() => props.world.foodQty)

function pickCategory(c) {
  props.world.foodCategory = c.id
  emit('action', `select-category:${c.id}`)
}

function openRestaurant(r) {
  activeRestaurant.value = r
  stage.value = 'restaurant'
  emit('action', `select-restaurant:${r.id}`)
}

function openDish(d) {
  activeDish.value = d
  props.world.foodQty = 1
  stage.value = 'dish'
  emit('action', `select-dish:${d.id}`)
}

function setQty(next) {
  props.world.foodQty = Math.min(9, Math.max(1, next))
  emit('action', `select-qty:${props.world.foodQty}`)
}

function addToCart() {
  props.world.foodCart = {
    restaurantId: activeRestaurant.value.id,
    dishId: activeDish.value.id,
    qty: props.world.foodQty,
  }
  stage.value = 'restaurant'
  emit('action', 'tap:food-add')
}

function openCart() {
  stage.value = 'cart'
  emit('action', 'tap:food-cart')
}

function choosePayment(id) {
  props.world.foodPayment = id
  emit('action', `select-payment:${id}`)
}

function placeOrder() {
  props.world.foodOrder = { id: `FD${Math.floor(10000 + Math.random() * 89999)}`, total: total.value }
  stage.value = 'done'
  emit('action', 'tap:food-confirm')
}

function back() {
  if (stage.value === 'restaurant') return (stage.value = 'home')
  if (stage.value === 'dish') return (stage.value = 'restaurant')
  if (stage.value === 'cart') return (stage.value = 'restaurant')
  if (stage.value === 'checkout') return (stage.value = 'cart')
  if (stage.value === 'done') return (stage.value = 'home')
  emit('exit')
}

watch(
  () => props.backTick,
  () => back(),
)
</script>

<template>
  <div class="scr food">
    <!-- home -->
    <template v-if="stage === 'home'">
      <header class="food__head">
        <div>
          <p class="food__deliver">Deliver to</p>
          <p class="food__address"><AppIcon name="pin" :size="11" /> Gulshan-e-Iqbal, Block 13-D</p>
        </div>
        <span class="spacer" />
        <span class="food__cartbadge" aria-hidden="true"><AppIcon name="bag" :size="15" /></span>
        <span class="food__profile">AK</span>
      </header>
      <div class="scr__body">
        <p class="p-field food__search"><AppIcon name="search" :size="14" /> Search restaurants or dishes</p>
        <div class="food__promo">
          <div>
            <p class="food__promotitle">Dinner sorted</p>
            <p class="food__promosub">Free delivery on your first demo order</p>
          </div>
          <span class="food__promoicon"><AppIcon name="bowl" :size="22" /></span>
        </div>

        <p class="p-label food__label">What are you craving?</p>
        <div class="food__cats">
          <button
            v-for="c in foodCategories"
            :key="c.id"
            type="button"
            class="food__cat"
            :class="{ 'is-on': category === c.id }"
            :aria-pressed="category === c.id"
            @click="pickCategory(c)"
          >
            <span class="food__catico"><AppIcon :name="c.icon" :size="17" /></span>
            <span>{{ c.name }}</span>
          </button>
        </div>

        <p class="p-label food__label">Restaurants near you</p>
        <button
          v-for="r in filtered"
          :key="r.id"
          type="button"
          class="food__rest"
          @click="openRestaurant(r)"
        >
          <span class="food__banner" :class="`tint-${r.tint}`">
            <AppIcon :name="r.categories.includes('pizza') ? 'pizza' : r.categories.includes('burgers') ? 'burger' : r.categories.includes('bbq') ? 'skewer' : r.categories.includes('chinese') ? 'noodles' : 'bowl'" :size="26" />
          </span>
          <span class="food__resttext">
            <span class="food__resttop">
              <span class="food__restname">{{ r.name }}</span>
              <span class="food__rating"><AppIcon name="star" :size="9" /> {{ r.rating }}</span>
            </span>
            <span class="food__restsub">{{ r.cuisine }}</span>
            <span class="food__restmeta">{{ r.minutes }} · Rs {{ r.fee }} delivery</span>
          </span>
          <AppIcon name="chevron-right" :size="14" />
        </button>
        <p class="food__legal"><AppIcon name="shield" :size="11" /> Demo restaurants. Nothing is ordered or delivered.</p>
      </div>
    </template>

    <!-- restaurant menu -->
    <template v-else-if="stage === 'restaurant' && activeRestaurant">
      <header class="scr__head food__resthead">
        <button type="button" class="scr__back" aria-label="Back to restaurants" @click="back">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">{{ activeRestaurant.name }}</h3>
          <p class="scr__sub">{{ activeRestaurant.minutes }} · Rs {{ activeRestaurant.fee }} delivery</p>
        </div>
      </header>
      <div class="scr__body">
        <div class="food__banner food__banner--wide" :class="`tint-${activeRestaurant.tint}`">
          <div>
            <p class="food__bannername">{{ activeRestaurant.name }}</p>
            <p class="food__bannersub">{{ activeRestaurant.cuisine }} · <AppIcon name="star" :size="9" /> {{ activeRestaurant.rating }}</p>
          </div>
          <AppIcon name="bowl" :size="30" />
        </div>
        <p class="p-label food__label">Menu</p>
        <button v-for="d in activeRestaurant.menu" :key="d.id" type="button" class="food__dish" @click="openDish(d)">
          <span class="food__dishart" :class="`tint-${activeRestaurant.tint}`"><AppIcon name="pot" :size="19" /></span>
          <span class="food__resttext">
            <span class="food__dishname">{{ d.name }}</span>
            <span class="food__restsub">{{ d.note }}</span>
            <span class="food__dishprice">Rs {{ d.price }}</span>
          </span>
          <span class="food__dishadd" aria-hidden="true"><AppIcon name="plus" :size="13" /></span>
        </button>
      </div>
      <div v-if="cart" class="food__cartbar">
        <button type="button" class="p-btn food__cartbtn" @click="openCart">
          <AppIcon name="bag" :size="14" />
          <span>View cart · {{ cart.qty }} item{{ cart.qty > 1 ? 's' : '' }}</span>
          <span class="food__carttotal">Rs {{ subtotal + (cartRestaurant?.fee ?? deliveryFee) + platformFee }}</span>
        </button>
      </div>
    </template>

    <!-- dish detail -->
    <template v-else-if="stage === 'dish' && activeDish && activeRestaurant">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to menu" @click="back">
          <AppIcon name="back" :size="17" />
        </button>
        <h3 class="scr__title">Dish details</h3>
      </header>
      <div class="scr__body">
        <div class="food__dishhero" :class="`tint-${activeRestaurant.tint}`">
          <AppIcon name="pot" :size="46" />
        </div>
        <h4 class="food__dishherotitle">{{ activeDish.name }}</h4>
        <p class="food__restsub">{{ activeDish.note }}</p>
        <p class="food__dishheroprice">Rs {{ activeDish.price }}</p>
        <p class="food__legal"><AppIcon name="info" :size="11" /> Serves one. Made fresh when you order.</p>

        <div class="food__qty">
          <span>
            <span class="p-label">Quantity</span>
            <span class="food__qtyhint">How many do you need?</span>
          </span>
          <span class="food__stepper">
            <button type="button" aria-label="Decrease quantity" :disabled="qty <= 1" @click="setQty(qty - 1)">−</button>
            <span class="food__qtynum" aria-live="polite">{{ qty }}</span>
            <button type="button" aria-label="Increase quantity" @click="setQty(qty + 1)">+</button>
          </span>
        </div>
      </div>
      <div class="scr__foot">
        <button type="button" class="p-btn" @click="addToCart">
          <AppIcon name="bag" :size="14" /> Add to cart · Rs {{ activeDish.price * qty }}
        </button>
      </div>
    </template>

    <!-- cart -->
    <template v-else-if="stage === 'cart' && cart">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to menu" @click="back">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">Your cart</h3>
          <p class="scr__sub">{{ cartRestaurant?.name }}</p>
        </div>
      </header>
      <div class="scr__body">
        <div class="food__cartitem">
          <span class="food__dishart" :class="`tint-${cartRestaurant?.tint}`"><AppIcon name="pot" :size="19" /></span>
          <span class="food__resttext">
            <span class="food__dishname">{{ cartDish?.name }}</span>
            <span class="food__restsub">Rs {{ cartDish?.price }} each</span>
          </span>
          <span class="food__cartqty">× {{ cart.qty }}</span>
        </div>
        <div class="food__bill">
          <div><span>Subtotal</span><strong>Rs {{ subtotal }}</strong></div>
          <div><span>Delivery fee</span><strong>Rs {{ cartRestaurant?.fee }}</strong></div>
          <div><span>Platform fee</span><strong>Rs {{ platformFee }}</strong></div>
          <div class="food__billtotal"><span>Total</span><strong>Rs {{ total }}</strong></div>
        </div>
        <p class="food__legal"><AppIcon name="info" :size="11" /> Check the total before you pay. Small fees add up.</p>
      </div>
      <div class="scr__foot">
        <button type="button" class="p-btn p-btn--green" @click="stage = 'checkout'">Go to checkout</button>
      </div>
    </template>

    <!-- checkout -->
    <template v-else-if="stage === 'checkout' && cart">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to cart" @click="back">
          <AppIcon name="back" :size="17" />
        </button>
        <h3 class="scr__title">Checkout</h3>
      </header>
      <div class="scr__body">
        <p class="p-label food__label">Deliver to</p>
        <div class="food__addrcard">
          <span class="p-row__icon"><AppIcon name="home" :size="15" /></span>
          <div>
            <p class="food__dishname">Home · Block 13-D</p>
            <p class="food__restsub">Gulshan-e-Iqbal, Karachi</p>
          </div>
        </div>
        <p class="p-label food__label">Payment</p>
        <button
          v-for="m in [
            { id: 'wallet', label: 'Wallet', sub: 'Balance •••• 4411' },
            { id: 'cod', label: 'Cash on delivery', sub: 'Pay the rider when it arrives' },
            { id: 'card', label: 'Card', sub: 'Visa •••• 2048' },
          ]"
          :key="m.id"
          type="button"
          class="food__pay"
          :class="{ 'is-on': world.foodPayment === m.id }"
          :aria-pressed="world.foodPayment === m.id"
          @click="choosePayment(m.id)"
        >
          <span class="food__radio" :class="{ 'is-on': world.foodPayment === m.id }" />
          <span class="food__resttext">
            <span class="food__dishname">{{ m.label }}</span>
            <span class="food__restsub">{{ m.sub }}</span>
          </span>
        </button>
        <div class="food__bill food__bill--tight">
          <div class="food__billtotal"><span>Total to pay</span><strong>Rs {{ total }}</strong></div>
        </div>
        <p class="food__legal"><AppIcon name="shield" :size="11" /> Demo checkout. No payment is taken.</p>
      </div>
      <div class="scr__foot">
        <button type="button" class="p-btn p-btn--green" :disabled="!world.foodPayment" @click="placeOrder">Place demo order · Rs {{ total }}</button>
      </div>
    </template>

    <!-- done -->
    <template v-else-if="stage === 'done'">
      <div class="scr__body food__done">
        <span class="food__check"><AppIcon name="check" :size="24" /></span>
        <p class="food__donetitle">Order placed (demo)</p>
        <p class="p-small p-muted">Order {{ world.foodOrder?.id }} · {{ cartRestaurant?.name }}</p>
        <div class="food__timeline">
          <div class="food__step is-on">
            <span class="food__stepdot"><AppIcon name="check" :size="9" /></span>
            <span><b>Order placed</b><span>Just now</span></span>
          </div>
          <div class="food__step">
            <span class="food__stepdot" />
            <span><b>Restaurant preparing</b><span>About 10 min</span></span>
          </div>
          <div class="food__step">
            <span class="food__stepdot" />
            <span><b>Rider on the way</b><span>About 25 min</span></span>
          </div>
          <div class="food__step">
            <span class="food__stepdot" />
            <span><b>Delivered</b><span>Enjoy your meal</span></span>
          </div>
        </div>
        <div class="food__bill">
          <div><span>{{ cartDish?.name }} × {{ cart?.qty }}</span><strong>Rs {{ subtotal }}</strong></div>
          <div><span>Delivery + platform</span><strong>Rs {{ (cartRestaurant?.fee ?? 0) + platformFee }}</strong></div>
          <div class="food__billtotal"><span>Paid by {{ world.foodPayment === 'cod' ? 'cash' : world.foodPayment }}</span><strong>Rs {{ world.foodOrder?.total }}</strong></div>
        </div>
        <p class="food__legal"><AppIcon name="info" :size="11" /> This is a simulation. No restaurant has received an order.</p>
        <button type="button" class="p-btn p-btn--soft" @click="stage = 'home'">Order something else</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.food {
  background: #fff;
}

.food__head {
  flex: none;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.8rem 0.55rem;
}

.food__deliver {
  font-size: 0.48rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--green-600);
}

.food__address {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.7rem;
  font-weight: 700;
}

.food__cartbadge {
  display: grid;
  place-items: center;
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 50%;
  background: var(--mint-50);
  color: var(--teal-700);
}

.food__profile {
  display: grid;
  place-items: center;
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #0f766e, #059669);
  color: #fff;
  font-size: 0.52rem;
  font-weight: 750;
}

.food__search {
  margin-top: 0.1rem;
}

.food__promo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.55rem;
  padding: 0.6rem 0.7rem;
  border-radius: 0.85rem;
  color: #fff;
  background:
    radial-gradient(80% 120% at 90% 0%, rgba(52, 211, 153, 0.55), transparent 60%),
    linear-gradient(135deg, #0f5f57, #0b3d39);
}

.food__promotitle {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.food__promosub {
  font-size: 0.56rem;
  color: rgba(255, 255, 255, 0.72);
}

.food__promoicon {
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  margin-left: auto;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
}

.food__label {
  margin: 0.8rem 0 0.35rem;
}

.food__cats {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  padding-bottom: 0.2rem;
  scrollbar-width: none;
}

.food__cats::-webkit-scrollbar {
  display: none;
}

.food__cat {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 3.1rem;
  padding: 0.35rem 0.1rem;
  border-radius: 0.65rem;
  border: 1px solid var(--line);
  background: #fff;
  font-size: 0.5rem;
  font-weight: 650;
  color: var(--ink-soft);
  line-height: 1.15;
  text-align: center;
}

.food__cat.is-on {
  background: var(--mint-100);
  border-color: var(--teal-500);
  color: var(--teal-800);
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.12);
}

.food__catico {
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  background: var(--mint-50);
  color: var(--teal-700);
}

.food__cat.is-on .food__catico {
  background: #fff;
}

.food__rest {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.45rem 0.1rem;
  border-bottom: 1px solid var(--line);
  text-align: left;
}

.food__banner {
  display: grid;
  place-items: center;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 0.7rem;
  color: #fff;
  flex: none;
  overflow: hidden;
}

.tint-biryani {
  background: linear-gradient(145deg, #f59e0b, #b45309);
}

.tint-burger {
  background: linear-gradient(145deg, #84cc16, #4d7c0f);
}

.tint-pizza {
  background: linear-gradient(145deg, #ef4444, #991b1b);
}

.tint-bbq {
  background: linear-gradient(145deg, #d97706, #78350f);
}

.tint-wok {
  background: linear-gradient(145deg, #10b981, #065f46);
}

.food__resttext {
  flex: 1;
  min-width: 0;
}

.food__resttop {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.food__restname {
  font-size: 0.74rem;
  font-weight: 750;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.food__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.1rem;
  padding: 0.02rem 0.25rem;
  border-radius: 999px;
  background: var(--success-bg);
  color: #04624f;
  font-size: 0.5rem;
  font-weight: 750;
  flex: none;
}

.food__restsub {
  display: block;
  font-size: 0.56rem;
  line-height: 1.35;
  color: var(--muted);
}

.food__restmeta {
  display: block;
  margin-top: 0.1rem;
  font-size: 0.54rem;
  font-weight: 600;
  color: var(--ink-soft);
}

.food__legal {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  margin: 0.7rem 0 0.2rem;
  font-size: 0.54rem;
  line-height: 1.4;
  color: var(--muted);
}

.food__resthead {
  border-bottom: 1px solid var(--line);
}

.food__banner--wide {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: auto;
  padding: 0.7rem;
  border-radius: 0.9rem;
  margin: 0.1rem 0 0.2rem;
}

.food__bannername {
  font-size: 0.86rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.food__bannersub {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.58rem;
  color: rgba(255, 255, 255, 0.8);
}

.food__dish {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.5rem 0.1rem;
  border-bottom: 1px solid var(--line);
  text-align: left;
}

.food__dishart {
  display: grid;
  place-items: center;
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 0.6rem;
  color: #fff;
  flex: none;
}

.food__dishname {
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.3;
}

.food__dishprice {
  display: block;
  margin-top: 0.1rem;
  font-size: 0.66rem;
  font-weight: 750;
  color: var(--teal-800);
}

.food__dishadd {
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 1px solid var(--teal-500);
  color: var(--teal-700);
  flex: none;
}

.food__cartbar {
  flex: none;
  padding: 0.5rem 0.8rem 0.65rem;
  border-top: 1px solid var(--line);
  background: #fff;
}

.food__cartbtn {
  justify-content: space-between;
  gap: 0.4rem;
}

.food__carttotal {
  font-weight: 800;
}

.food__dishhero {
  display: grid;
  place-items: center;
  height: 7.2rem;
  border-radius: 0.9rem;
  color: #fff;
  margin-bottom: 0.55rem;
}

.food__dishherotitle {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.food__dishheroprice {
  margin-top: 0.2rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--teal-800);
}

.food__qty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  margin-top: 0.75rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.75rem;
  border: 1px solid var(--line);
  background: var(--mint-50);
}

.food__qtyhint {
  display: block;
  margin-top: 0.1rem;
  font-size: 0.58rem;
  color: var(--muted);
}

.food__stepper {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.15rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
}

.food__stepper button {
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  color: var(--teal-700);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
}

.food__stepper button:hover {
  background: var(--mint-100);
}

.food__stepper button:disabled {
  opacity: 0.35;
  pointer-events: none;
}

.food__qtynum {
  min-width: 1.6rem;
  text-align: center;
  font-size: 0.82rem;
  font-weight: 750;
}

.food__cartitem {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.1rem 0.7rem;
  border-bottom: 1px solid var(--line);
}

.food__cartqty {
  font-size: 0.66rem;
  font-weight: 750;
  color: var(--teal-800);
}

.food__bill {
  margin-top: 0.55rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.7rem;
  background: var(--mint-50);
  border: 1px solid var(--line);
}

.food__bill--tight {
  margin-top: 0.6rem;
}

.food__bill div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.16rem 0;
  font-size: 0.62rem;
  color: var(--muted);
}

.food__bill strong {
  color: var(--ink);
  font-weight: 700;
}

.food__billtotal {
  border-top: 1px solid var(--line-strong);
  margin-top: 0.2rem;
  padding-top: 0.35rem !important;
  font-size: 0.78rem !important;
  color: var(--ink) !important;
  font-weight: 750;
}

.food__billtotal strong {
  font-size: 0.9rem;
  font-weight: 800;
}

.food__addrcard {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.55rem;
  border-radius: 0.65rem;
  border: 1px solid var(--line);
  background: #fff;
}

.food__pay {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.5rem 0.55rem;
  margin-bottom: 0.35rem;
  border-radius: 0.65rem;
  border: 1px solid var(--line);
  text-align: left;
  background: #fff;
}

.food__pay.is-on {
  border-color: var(--teal-500);
  background: var(--mint-50);
}

.food__radio {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
  flex: none;
}

.food__radio.is-on {
  border-color: var(--teal-600);
  background: var(--teal-600);
  box-shadow: inset 0 0 0 2px #fff;
}

.food__done {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 1.1rem;
}

.food__check {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #34d399, #059669);
  color: #fff;
  box-shadow: 0 16px 30px -16px rgba(5, 150, 105, 0.9);
}

.food__donetitle {
  margin-top: 0.45rem;
  font-size: 1rem;
  font-weight: 800;
}

.food__timeline {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.6rem 0.65rem;
  border-radius: 0.8rem;
  border: 1px solid var(--line);
  background: #fff;
  text-align: left;
}

.food__step {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  position: relative;
  padding-bottom: 0.65rem;
}

.food__step:last-child {
  padding-bottom: 0;
}

.food__stepdot {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
  background: #fff;
  flex: none;
  margin-top: 0.05rem;
}

.food__step.is-on .food__stepdot {
  background: var(--green-500);
  border-color: var(--green-500);
  color: #fff;
}

.food__step b {
  display: block;
  font-size: 0.66rem;
  font-weight: 700;
}

.food__step span span {
  display: block;
  font-size: 0.55rem;
  color: var(--muted);
}

.food__done .food__bill {
  width: 100%;
  margin-top: 0.6rem;
}

.food__done .food__legal {
  justify-content: center;
  text-align: left;
}

.food__done .p-btn {
  margin-top: 0.55rem;
}
</style>
