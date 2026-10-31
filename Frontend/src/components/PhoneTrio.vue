<script setup>
import AppIcon from '@/components/AppIcon.vue'
import PhotoScene from '@/components/phone/PhotoScene.vue'
import { foodCategories, restaurants } from '@/data/phoneWorld'
</script>

<template>
  <div class="trio">
    <span class="trio__glow trio__glow--a" aria-hidden="true" />
    <span class="trio__glow trio__glow--b" aria-hidden="true" />
    <p class="sr-only">
      Three pretend phone screens: taking a photo, booking a ride and ordering food.
    </p>

    <div class="trio__col" aria-hidden="true">
      <div class="phone phone--mini trio__phone trio__phone--left">
        <div class="phone__frame">
          <div class="phone__screen">
            <div class="phone__status is-dark">
              <span>9:41</span>
              <span class="phone__status-right">
                <AppIcon name="signal" :size="9" />
                <AppIcon name="wifi" :size="9" />
                <span class="phone__batt" />
              </span>
            </div>
            <span class="phone__island" />
            <div class="phone__body trio-cam__body">
              <div class="trio-cam">
                <div class="trio-cam__view">
                  <PhotoScene scene="garden" />
                  <span class="trio-cam__grid" />
                  <span class="trio-cam__tag">Balcony garden</span>
                </div>
                <div class="trio-cam__ctrl">
                  <span class="trio-cam__thumb"><PhotoScene scene="tea" /></span>
                  <span class="trio-cam__shutter" />
                  <span class="trio-cam__flip"><AppIcon name="restart" :size="11" /></span>
                </div>
                <p class="trio-cam__mode">Photo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="trio__label">Take a photo</p>
    </div>

    <div class="trio__col trio__col--center" aria-hidden="true">
      <div class="phone phone--mini trio__phone trio__phone--center">
        <div class="phone__frame">
          <div class="phone__screen">
            <div class="phone__status">
              <span>9:41</span>
              <span class="phone__status-right">
                <AppIcon name="signal" :size="9" />
                <AppIcon name="wifi" :size="9" />
                <span class="phone__batt" />
              </span>
            </div>
            <span class="phone__island" />
            <div class="phone__body">
              <div class="trio-ride">
                <div class="trio-ride__map">
                  <span class="trio-ride__road" />
                  <span class="trio-ride__road trio-ride__road--b" />
                  <span class="trio-ride__route" />
                  <span class="trio-ride__brand">Ride</span>
                </div>
                <div class="trio-ride__card">
                  <span class="trio-ride__grip" />
                  <p class="trio-ride__title">Where to?</p>
                  <p class="trio-ride__field"><span class="trio-ride__dot" /> Gulshan-e-Iqbal</p>
                  <p class="trio-ride__field"><span class="trio-ride__dot trio-ride__dot--end" /> Bahadurabad</p>
                  <div class="trio-ride__car">
                    <span class="trio-ride__carico"><AppIcon name="car" :size="14" /></span>
                    <span class="trio-ride__cartext">Car<em>6 min away · 4 seats</em></span>
                    <b>Rs 350</b>
                  </div>
                  <span class="trio-ride__btn">Confirm demo booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="trio__label trio__label--strong">Book a ride</p>
    </div>

    <div class="trio__col" aria-hidden="true">
      <div class="phone phone--mini trio__phone trio__phone--right">
        <div class="phone__frame">
          <div class="phone__screen">
            <div class="phone__status">
              <span>9:41</span>
              <span class="phone__status-right">
                <AppIcon name="signal" :size="9" />
                <AppIcon name="wifi" :size="9" />
                <span class="phone__batt" />
              </span>
            </div>
            <span class="phone__island" />
            <div class="phone__body">
              <div class="trio-food">
                <div class="trio-food__head">
                  <span>Food Delivery</span>
                  <span class="trio-food__avatar">AK</span>
                </div>
                <p class="trio-food__search"><AppIcon name="search" :size="9" /> Search restaurants</p>
                <div class="trio-food__cats">
                  <span v-for="c in foodCategories.slice(0, 4)" :key="c.id" class="trio-food__cat">
                    <span><AppIcon :name="c.icon" :size="11" /></span>
                    {{ c.name }}
                  </span>
                </div>
                <div
                  v-for="r in restaurants.slice(0, 2)"
                  :key="r.id"
                  class="trio-food__rest"
                >
                  <span class="trio-food__art" :class="`tint-${r.tint}`"><AppIcon name="bowl" :size="13" /></span>
                  <span class="trio-food__text">{{ r.name }}<em>{{ r.minutes }} · Rs {{ r.fee }} fee</em></span>
                  <AppIcon name="chevron-right" :size="10" />
                </div>
                <div class="trio-food__cart"><AppIcon name="bag" :size="10" /> View cart · Rs 480</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="trio__label">Order food</p>
    </div>
  </div>
</template>

<style scoped>
.trio {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: clamp(0.6rem, 2vw, 1.4rem);
  padding: 1rem 0 0;
}

.trio__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(46px);
  pointer-events: none;
}

.trio__glow--a {
  width: 60%;
  height: 55%;
  left: 6%;
  top: 4%;
  background: rgba(52, 211, 153, 0.32);
}

.trio__glow--b {
  width: 46%;
  height: 46%;
  right: 4%;
  bottom: 6%;
  background: rgba(20, 150, 139, 0.4);
}

.trio__col {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}

.trio__phone {
  width: auto;
  height: clamp(12.5rem, 23vw, 16.5rem);
  font-size: 0.5rem;
  --sb: 1.35rem;
  --nav-h: 0;
  z-index: 1;
}

.trio__phone--center {
  height: clamp(14.5rem, 26vw, 19rem);
  z-index: 2;
  transform: translateY(-1.35rem);
}

.trio__phone--left {
  transform: rotate(-5deg) translateY(0.4rem);
}

.trio__phone--right {
  transform: rotate(5deg) translateY(0.4rem);
}

.trio__col--center {
  z-index: 2;
}

.trio__label {
  font-size: var(--step--2);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

.trio__label--strong {
  color: #a9e8d4;
}

.trio__phone .phone__frame {
  padding: 0.3rem;
  border-radius: 1.8rem;
}

.trio__phone .phone__screen {
  border-radius: 1.55rem;
}

.trio__phone .phone__island {
  height: 0.6rem;
  top: 0.3rem;
  max-width: 3.2rem;
}

.trio__phone .phone__island::after {
  width: 0.16rem;
  height: 0.16rem;
}

.trio__phone .phone__status {
  padding: 0.36rem 0.6rem 0;
  font-size: 0.42rem;
  height: 1.35rem;
}

.trio__phone .phone__batt {
  width: 0.8rem;
  height: 0.4rem;
  border-width: 1px;
}

.trio__phone .phone__body {
  padding-top: 1.35rem;
}

/* camera mini */
.trio-cam__body {
  background: #04211f;
}

.trio-cam {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 0.3rem 0.35rem;
}

.trio-cam__view {
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: 0.6rem;
  overflow: hidden;
}

.trio-cam__view .scene {
  position: absolute;
  inset: 0;
}

.trio-cam__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 1px, transparent 1px);
  background-size: 33.33% 33.33%;
  opacity: 0.5;
}

.trio-cam__tag {
  position: absolute;
  left: 0.3rem;
  top: 0.3rem;
  padding: 0.05rem 0.3rem;
  border-radius: 999px;
  background: rgba(4, 33, 31, 0.5);
  color: #fff;
  font-size: 0.36rem;
  font-weight: 650;
}

.trio-cam__ctrl {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0.6rem 0;
}

.trio-cam__thumb {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.25rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.trio-cam__shutter {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  border: 2px solid #fff;
  background: radial-gradient(circle, #fff 0 62%, transparent 63%);
}

.trio-cam__flip {
  color: rgba(255, 255, 255, 0.8);
}

.trio-cam__mode {
  text-align: center;
  font-size: 0.36rem;
  font-weight: 650;
  color: #fbbf24;
  padding: 0.15rem 0 0.1rem;
}

/* ride mini */
.trio-ride {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.trio-ride__map {
  position: relative;
  flex: 1.05;
  overflow: hidden;
  background: #e3f7ef;
}

.trio-ride__road {
  position: absolute;
  width: 140%;
  height: 0.3rem;
  top: 42%;
  left: -20%;
  transform: rotate(-13deg);
  background: #fff;
}

.trio-ride__road--b {
  width: 0.3rem;
  height: 140%;
  top: -20%;
  left: 58%;
  transform: rotate(12deg);
}

.trio-ride__route {
  position: absolute;
  left: 24%;
  top: 60%;
  width: 48%;
  height: 0.22rem;
  border-radius: 999px;
  background: linear-gradient(90deg, #0f766e, #34d399);
  transform: rotate(-20deg);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.18);
}

.trio-ride__brand {
  position: absolute;
  top: 0.3rem;
  left: 0.35rem;
  padding: 0.05rem 0.3rem;
  border-radius: 999px;
  background: #fff;
  color: var(--teal-800);
  font-size: 0.36rem;
  font-weight: 800;
}

.trio-ride__card {
  flex: 1.25;
  margin-top: -0.55rem;
  z-index: 2;
  padding: 0.3rem 0.4rem 0.4rem;
  border-radius: 0.7rem 0.7rem 0 0;
  background: #fff;
}

.trio-ride__grip {
  display: block;
  width: 1rem;
  height: 0.12rem;
  margin: 0 auto 0.25rem;
  border-radius: 999px;
  background: var(--line-strong);
}

.trio-ride__title {
  font-size: 0.5rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.trio-ride__field {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.2rem;
  padding: 0.15rem 0.3rem;
  border-radius: 0.35rem;
  border: 1px solid var(--line);
  background: var(--mint-50);
  font-size: 0.4rem;
  font-weight: 650;
  color: var(--ink-soft);
}

.trio-ride__dot {
  width: 0.24rem;
  height: 0.24rem;
  border-radius: 50%;
  background: var(--green-500);
  flex: none;
}

.trio-ride__dot--end {
  border-radius: 1px;
  background: var(--teal-700);
}

.trio-ride__car {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.22rem 0.3rem;
  border-radius: 0.35rem;
  border: 1px solid var(--teal-400);
  background: var(--mint-50);
}

.trio-ride__carico {
  display: grid;
  place-items: center;
  width: 0.95rem;
  height: 0.95rem;
  border-radius: 0.22rem;
  background: var(--teal-600);
  color: #fff;
}

.trio-ride__cartext {
  flex: 1;
  font-size: 0.4rem;
  font-weight: 750;
  line-height: 1.2;
}

.trio-ride__cartext em {
  display: block;
  font-style: normal;
  font-size: 0.32rem;
  font-weight: 600;
  color: var(--muted);
}

.trio-ride__car b {
  font-size: 0.42rem;
  font-weight: 800;
  color: var(--ink);
}

.trio-ride__btn {
  display: block;
  margin-top: 0.25rem;
  padding: 0.25rem;
  border-radius: 0.35rem;
  background: linear-gradient(135deg, #0f766e, #14968b);
  color: #fff;
  font-size: 0.36rem;
  font-weight: 750;
  text-align: center;
}

/* food mini */
.trio-food {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0.4rem 0.3rem;
  gap: 0.25rem;
  min-height: 0;
}

.trio-food__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.52rem;
  font-weight: 800;
}

.trio-food__avatar {
  display: grid;
  place-items: center;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  background: var(--teal-700);
  color: #fff;
  font-size: 0.3rem;
}

.trio-food__search {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.15rem 0.3rem;
  border-radius: 999px;
  background: var(--mint-50);
  border: 1px solid var(--line);
  font-size: 0.34rem;
  color: var(--muted);
}

.trio-food__cats {
  display: flex;
  gap: 0.25rem;
}

.trio-food__cat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  padding: 0.15rem 0.05rem;
  border-radius: 0.3rem;
  border: 1px solid var(--line);
  font-size: 0.3rem;
  font-weight: 650;
  text-align: center;
  color: var(--ink-soft);
  white-space: nowrap;
  overflow: hidden;
}

.trio-food__cat span {
  display: grid;
  place-items: center;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  background: var(--mint-100);
  color: var(--teal-700);
}

.trio-food__rest {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem;
  border-radius: 0.35rem;
  border: 1px solid var(--line);
}

.trio-food__art {
  display: grid;
  place-items: center;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 0.28rem;
  color: #fff;
  flex: none;
}

.tint-biryani {
  background: linear-gradient(145deg, #f59e0b, #b45309);
}

.tint-burger {
  background: linear-gradient(145deg, #84cc16, #4d7c0f);
}

.trio-food__text {
  flex: 1;
  min-width: 0;
  font-size: 0.4rem;
  font-weight: 700;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.trio-food__text em {
  display: block;
  font-style: normal;
  font-size: 0.32rem;
  font-weight: 600;
  color: var(--muted);
}

.trio-food__cart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  margin-top: auto;
  padding: 0.25rem;
  border-radius: 0.35rem;
  background: linear-gradient(135deg, #059669, #10b981);
  color: #fff;
  font-size: 0.36rem;
  font-weight: 750;
}

@media (max-width: 60rem) {
  .trio__col:not(.trio__col--center) {
    display: none;
  }

  .trio__phone--center {
    height: clamp(15rem, 56vw, 18.5rem);
    transform: none;
  }

  .trio {
    padding-top: 0.5rem;
  }
}
</style>
