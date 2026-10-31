<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { rideLocations, vehicles } from '@/data/phoneWorld'

const props = defineProps({
  world: { type: Object, required: true },
  backTick: { type: Number, default: 0 },
})
const emit = defineEmits(['action', 'exit'])

const stage = ref('search')
const pickMode = ref('pickup')

const pickup = computed(() => rideLocations.find((l) => l.id === props.world.ridePickup) || null)
const destination = computed(() => rideLocations.find((l) => l.id === props.world.rideDestination) || null)
const vehicle = computed(() => vehicles.find((v) => v.id === props.world.rideVehicle) || null)

function openLocations(mode) {
  pickMode.value = mode
  stage.value = 'locations'
  if (mode === 'pickup') emit('action', 'tap:ride-pickup')
}

function choosePlace(place) {
  if (pickMode.value === 'pickup') {
    props.world.ridePickup = place.id
    emit('action', `select-ride-place:${place.id}`)
    if (!props.world.rideDestination) {
      pickMode.value = 'destination'
      return
    }
    stage.value = props.world.rideDestination ? 'vehicles' : 'locations'
    return
  }
  props.world.rideDestination = place.id
  emit('action', `select-ride-place:${place.id}`)
  stage.value = 'vehicles'
}

function chooseVehicle(v) {
  props.world.rideVehicle = v.id
  emit('action', `select-vehicle:${v.id}`)
  stage.value = 'summary'
}

function confirmRide() {
  emit('action', 'tap:ride-confirm')
  stage.value = 'booked'
}

function startOver() {
  props.world.ridePickup = null
  props.world.rideDestination = null
  props.world.rideVehicle = null
  stage.value = 'search'
}

function goBack() {
  if (stage.value === 'locations') stage.value = 'search'
  else if (stage.value === 'vehicles') {
    stage.value = 'locations'
    pickMode.value = 'destination'
  } else if (stage.value === 'summary') stage.value = 'vehicles'
  else if (stage.value === 'booked') stage.value = 'search'
  else emit('exit')
}

watch(
  () => props.backTick,
  () => {
    if (stage.value === 'booked') return (stage.value = 'search')
    goBack()
  },
)
</script>

<template>
  <div class="scr ride">
    <!-- search -->
    <template v-if="stage === 'search'">
      <div class="ride__map">
        <span class="ride__road ride__road--a" />
        <span class="ride__road ride__road--b" />
        <span class="ride__block ride__block--a" />
        <span class="ride__block ride__block--b" />
        <span class="ride__me"><span /></span>
        <span class="ride__car"><AppIcon name="car" :size="15" /></span>
        <span class="ride__car ride__car--b"><AppIcon name="rickshaw" :size="13" /></span>
        <span class="ride__brand">Ride</span>
      </div>
      <div class="ride__sheet">
        <span class="ride__grip" />
        <h4 class="ride__hello">Where are you going?</h4>
        <button type="button" class="ride__field" aria-label="Set pickup location" @click="openLocations('pickup')">
          <span class="ride__dot" />
          <span class="ride__fieldtext">
            <span class="ride__fieldlabel">Pickup</span>
            <span class="ride__fieldvalue">{{ pickup ? pickup.name : 'Your current location' }}</span>
          </span>
          <AppIcon name="chevron-right" :size="13" />
        </button>
        <button type="button" class="ride__field" aria-label="Set destination" @click="openLocations('destination')">
          <span class="ride__dot ride__dot--end" />
          <span class="ride__fieldtext">
            <span class="ride__fieldlabel">Destination</span>
            <span class="ride__fieldvalue" :class="{ 'is-empty': !destination }">{{ destination ? destination.name : 'Choose a destination' }}</span>
          </span>
          <AppIcon name="chevron-right" :size="13" />
        </button>
        <div class="ride__saved">
          <span class="ride__savedlabel">Saved</span>
          <span class="ride__chip"><AppIcon name="home" :size="11" /> Home</span>
          <span class="ride__chip"><AppIcon name="wallet" :size="11" /> Work</span>
        </div>
        <p class="ride__note"><AppIcon name="shield" :size="11" /> Demo app · no real driver is called.</p>
      </div>
    </template>

    <!-- locations -->
    <template v-else-if="stage === 'locations'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back" @click="goBack">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">{{ pickMode === 'pickup' ? 'Set pickup' : 'Where to?' }}</h3>
          <p class="scr__sub">{{ pickup && pickMode === 'destination' ? `From ${pickup.name}` : 'Choose a place' }}</p>
        </div>
      </header>
      <div class="scr__body">
        <p class="p-field"><AppIcon name="search" :size="14" /> Search for a place</p>
        <p class="p-label ride__label">{{ pickMode === 'pickup' ? 'Nearby' : 'Popular destinations' }}</p>
        <button v-for="l in rideLocations" :key="l.id" type="button" class="p-row" @click="choosePlace(l)">
          <span class="p-row__icon"><AppIcon name="pin" :size="15" /></span>
          <span class="p-row__text">
            <span class="p-row__title">{{ l.name }}</span>
            <span class="p-row__sub">{{ l.area }}</span>
          </span>
          <span v-if="l.popular" class="p-badge">Popular</span>
          <AppIcon name="chevron-right" :size="13" />
        </button>
        <p class="ride__note"><AppIcon name="info" :size="11" /> Locations in this demo are typed, not read from GPS.</p>
      </div>
    </template>

    <!-- vehicles -->
    <template v-else-if="stage === 'vehicles'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to locations" @click="goBack">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">Choose a ride</h3>
          <p class="scr__sub">{{ pickup?.name }} → {{ destination?.name }}</p>
        </div>
      </header>
      <div class="scr__body">
        <div class="ride__route">
          <span class="ride__dot" />
          <span class="ride__routeline" />
          <span class="ride__dot ride__dot--end" />
          <p class="ride__routekm">About 12 km · 25 min in traffic</p>
        </div>
        <div class="ride__vehicles">
          <button
            v-for="v in vehicles"
            :key="v.id"
            type="button"
            class="ride__vehicle"
            :class="{ 'is-on': world.rideVehicle === v.id }"
            :aria-pressed="world.rideVehicle === v.id"
            @click="chooseVehicle(v)"
          >
            <span class="ride__vehicleico"><AppIcon :name="v.icon" :size="20" /></span>
            <span class="ride__vehicletext">
              <span class="ride__vehiclename">{{ v.name }}<span class="ride__eta">{{ v.eta }}</span></span>
              <span class="ride__vehiclesub">{{ v.seats }} · {{ v.description }}</span>
            </span>
            <span class="ride__fare">Rs {{ v.fare }}</span>
          </button>
        </div>
        <p class="ride__note"><AppIcon name="info" :size="11" /> Compare the fare before you tap. Prices here are fixed examples.</p>
      </div>
    </template>

    <!-- summary -->
    <template v-else-if="stage === 'summary'">
      <header class="scr__head">
        <button type="button" class="scr__back" aria-label="Back to vehicles" @click="goBack">
          <AppIcon name="back" :size="17" />
        </button>
        <h3 class="scr__title">Booking summary</h3>
      </header>
      <div class="scr__body">
        <div class="ride__summarymap">
          <span class="ride__road ride__road--a" />
          <span class="ride__road ride__road--b" />
          <span class="ride__routepath" />
        </div>
        <div class="ride__sumcard">
          <div class="ride__sumrow">
            <span class="ride__dot" />
            <p><span class="ride__fieldlabel">Pickup</span><span class="ride__sumvalue">{{ pickup?.name }}</span></p>
          </div>
          <div class="ride__sumrow">
            <span class="ride__dot ride__dot--end" />
            <p><span class="ride__fieldlabel">Destination</span><span class="ride__sumvalue">{{ destination?.name }}</span></p>
          </div>
        </div>
        <div class="ride__sumcard ride__sumcard--vehicle">
          <span class="ride__vehicleico"><AppIcon :name="vehicle?.icon || 'car'" :size="20" /></span>
          <div>
            <p class="ride__vehiclename">{{ vehicle?.name }}</p>
            <p class="ride__vehiclesub">Arrives in {{ vehicle?.eta }} · {{ vehicle?.seats }}</p>
          </div>
          <span class="spacer" />
          <span class="ride__fare">Rs {{ vehicle?.fare }}</span>
        </div>
        <div class="ride__bill">
          <div><span>Base fare</span><strong>Rs {{ vehicle?.fare }}</strong></div>
          <div><span>Booking fee</span><strong>Rs 0</strong></div>
          <div class="ride__billtotal"><span>Total</span><strong>Rs {{ vehicle?.fare }}</strong></div>
          <div><span>Payment</span><strong>Cash</strong></div>
        </div>
        <p class="ride__note"><AppIcon name="shield" :size="11" /> In a real app, check the driver’s name and number before you get in.</p>
      </div>
      <div class="scr__foot">
        <button type="button" class="p-btn" @click="confirmRide">Confirm demo booking</button>
      </div>
    </template>

    <!-- booked -->
    <template v-else>
      <div class="scr__body ride__booked">
        <span class="ride__check"><AppIcon name="check" :size="24" /></span>
        <p class="ride__bookedtitle">Ride booked (demo)</p>
        <p class="p-small p-muted">{{ vehicle?.name }} · arriving in {{ vehicle?.eta }}</p>
        <div class="ride__driver">
          <span class="ride__driverphoto">I</span>
          <div>
            <p class="ride__drivername">Imran Yousuf</p>
            <p class="ride__driversub">Suzuki Alto · <b>KHI-2841</b></p>
            <p class="ride__driverrating"><AppIcon name="star" :size="10" /> 4.9 · 2,104 trips</p>
          </div>
          <span class="ride__plate">KHI-2841</span>
        </div>
        <div class="ride__pin">
          <span class="p-label">Share this PIN with the driver</span>
          <p class="ride__pinnum">4 8 2 0</p>
        </div>
        <div class="ride__sumcard ride__sumcard--vehicle">
          <span class="ride__vehicleico"><AppIcon :name="vehicle?.icon || 'car'" :size="18" /></span>
          <div>
            <p class="ride__vehiclename">{{ pickup?.name }} → {{ destination?.name }}</p>
            <p class="ride__vehiclesub">Total Rs {{ vehicle?.fare }} · cash</p>
          </div>
        </div>
        <p class="ride__note"><AppIcon name="info" :size="11" /> This is a simulation. No driver has been contacted.</p>
        <button type="button" class="p-btn p-btn--soft" @click="startOver">Book another ride</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ride {
  background: #fff;
}

.ride__map {
  position: relative;
  flex: none;
  height: 38%;
  overflow: hidden;
  background:
    radial-gradient(70% 60% at 70% 18%, rgba(52, 211, 153, 0.35), transparent 60%),
    #e3f7ef;
}

.ride__road {
  position: absolute;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 95, 87, 0.08);
}

.ride__road--a {
  width: 150%;
  height: 0.5rem;
  top: 44%;
  left: -20%;
  transform: rotate(-12deg);
}

.ride__road--b {
  width: 0.5rem;
  height: 150%;
  top: -20%;
  left: 40%;
  transform: rotate(10deg);
}

.ride__block {
  position: absolute;
  border-radius: 0.3rem;
  background: #d7eae4;
}

.ride__block--a {
  width: 24%;
  height: 22%;
  top: 18%;
  left: 16%;
}

.ride__block--b {
  width: 20%;
  height: 18%;
  bottom: 12%;
  right: 14%;
  background: #b7ecd8;
}

.ride__me {
  position: absolute;
  top: 52%;
  left: 38%;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  background: var(--teal-700);
  border: 2px solid #fff;
  box-shadow: 0 0 0 6px rgba(15, 118, 110, 0.18);
}

.ride__car {
  position: absolute;
  top: 34%;
  right: 22%;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  background: #fff;
  color: var(--teal-700);
  box-shadow: 0 8px 16px -10px rgba(4, 33, 31, 0.5);
}

.ride__car--b {
  top: 64%;
  right: 46%;
  width: 1.7rem;
  height: 1.7rem;
  color: var(--green-600);
}

.ride__brand {
  position: absolute;
  top: calc(var(--sb) + 0.4rem);
  left: 0.7rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--teal-800);
  box-shadow: 0 8px 16px -10px rgba(4, 33, 31, 0.5);
}

.ride__sheet {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-top: -1rem;
  z-index: 4;
  padding: 0.4rem 0.8rem 0.8rem;
  border-radius: 1.2rem 1.2rem 0 0;
  background: #fff;
}

.ride__grip {
  display: block;
  width: 2.2rem;
  height: 0.24rem;
  margin: 0 auto 0.5rem;
  border-radius: 999px;
  background: var(--line-strong);
}

.ride__hello {
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.ride__field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.6rem;
  margin-bottom: 0.4rem;
  border-radius: 0.7rem;
  border: 1px solid var(--line);
  background: var(--mint-50);
  text-align: left;
}

.ride__field:last-of-type {
  background: #fff;
}

.ride__dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--green-500);
  flex: none;
}

.ride__dot--end {
  border-radius: 2px;
  background: var(--teal-700);
}

.ride__fieldtext {
  flex: 1;
  min-width: 0;
}

.ride__fieldlabel {
  display: block;
  font-size: 0.48rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.ride__fieldvalue {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ride__fieldvalue.is-empty {
  color: var(--muted);
  font-weight: 600;
}

.ride__saved {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.55rem;
  flex-wrap: wrap;
}

.ride__savedlabel {
  font-size: 0.55rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.ride__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 0.6rem;
  font-weight: 650;
  color: var(--ink-soft);
}

.ride__note {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  margin-top: 0.65rem;
  font-size: 0.55rem;
  line-height: 1.4;
  color: var(--muted);
}

.ride__label {
  margin: 0.65rem 0 0.15rem;
}

.ride__route {
  position: relative;
  padding: 0.3rem 0 0.3rem 1rem;
  margin-bottom: 0.55rem;
}

.ride__routeline {
  position: absolute;
  left: 0.24rem;
  top: 0.85rem;
  bottom: 0.85rem;
  width: 1px;
  background: repeating-linear-gradient(to bottom, var(--line-strong) 0 3px, transparent 3px 6px);
}

.ride__route .ride__dot {
  position: absolute;
  left: 0;
  top: 0.25rem;
}

.ride__route .ride__dot--end {
  top: auto;
  bottom: 0.25rem;
}

.ride__routekm {
  font-size: 0.6rem;
  color: var(--muted);
}

.ride__vehicles {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.ride__vehicle {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.55rem;
  border: 1px solid var(--line);
  border-radius: 0.8rem;
  background: #fff;
  text-align: left;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.ride__vehicle.is-on {
  border-color: var(--teal-500);
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.14);
  background: var(--mint-50);
}

.ride__vehicleico {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.7rem;
  background: var(--mint-100);
  color: var(--teal-700);
  flex: none;
}

.ride__vehicletext {
  flex: 1;
  min-width: 0;
}

.ride__vehiclename {
  display: block;
  font-size: 0.75rem;
  font-weight: 750;
}

.ride__eta {
  margin-left: 0.3rem;
  font-size: 0.52rem;
  font-weight: 650;
  color: var(--green-600);
}

.ride__vehiclesub {
  display: block;
  font-size: 0.56rem;
  line-height: 1.35;
  color: var(--muted);
}

.ride__fare {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--ink);
  flex: none;
}

.ride__summarymap {
  position: relative;
  height: 5.2rem;
  border-radius: 0.9rem;
  overflow: hidden;
  background: #e3f7ef;
  margin-bottom: 0.55rem;
}

.ride__routepath {
  position: absolute;
  left: 22%;
  top: 66%;
  width: 52%;
  height: 0.3rem;
  border-radius: 999px;
  background: linear-gradient(90deg, #0f766e, #10b981);
  transform: rotate(-20deg);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.16);
}

.ride__sumcard {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: 0.7rem;
  margin-bottom: 0.45rem;
  background: #fff;
}

.ride__sumrow {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
  padding: 0.15rem 0;
}

.ride__sumrow p {
  min-width: 0;
}

.ride__sumvalue {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.25;
}

.ride__sumcard--vehicle {
  background: var(--mint-50);
}

.ride__bill {
  padding: 0.55rem 0.65rem;
  border-radius: 0.7rem;
  border: 1px dashed var(--line-strong);
  background: var(--mint-50);
}

.ride__bill div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.18rem 0;
  font-size: 0.63rem;
  color: var(--muted);
}

.ride__bill strong {
  color: var(--ink);
  font-weight: 700;
}

.ride__billtotal {
  border-top: 1px solid var(--line);
  margin-top: 0.2rem;
  padding-top: 0.35rem !important;
  font-size: 0.8rem !important;
  color: var(--ink) !important;
  font-weight: 750;
}

.ride__billtotal strong {
  font-size: 0.95rem;
  font-weight: 800;
}

.ride__booked {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 1.2rem;
}

.ride__check {
  display: grid;
  place-items: center;
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #34d399, #059669);
  color: #fff;
  box-shadow: 0 16px 30px -16px rgba(5, 150, 105, 0.9);
}

.ride__bookedtitle {
  margin-top: 0.5rem;
  font-size: 1.02rem;
  font-weight: 800;
}

.ride__driver {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  margin-top: 0.7rem;
  padding: 0.6rem;
  border-radius: 0.8rem;
  border: 1px solid var(--line);
  text-align: left;
}

.ride__driverphoto {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: linear-gradient(145deg, #0f766e, #059669);
  color: #fff;
  font-weight: 750;
  flex: none;
}

.ride__drivername {
  font-size: 0.76rem;
  font-weight: 750;
}

.ride__driversub {
  font-size: 0.58rem;
  color: var(--muted);
}

.ride__driverrating {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  margin-top: 0.1rem;
  font-size: 0.55rem;
  font-weight: 650;
  color: var(--warn);
}

.ride__plate {
  align-self: flex-start;
  padding: 0.15rem 0.4rem;
  border-radius: 0.3rem;
  background: var(--teal-900);
  color: #fff;
  font-size: 0.52rem;
  font-weight: 750;
  letter-spacing: 0.04em;
}

.ride__pin {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.7rem;
  border: 1px dashed var(--teal-400);
  background: var(--mint-50);
}

.ride__pinnum {
  margin-top: 0.15rem;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.35em;
  color: var(--teal-800);
}

.ride__sumcard--vehicle {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.ride__booked .ride__note {
  justify-content: center;
  margin-bottom: 0.7rem;
}
</style>
