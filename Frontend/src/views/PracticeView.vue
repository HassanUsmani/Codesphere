<script setup>
import { computed, nextTick, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import A11yToolbar from '@/components/A11yToolbar.vue'
import ModuleCard from '@/components/ModuleCard.vue'
import ModuleSection from '@/components/ModuleSection.vue'
import GovernmentSection from '@/components/GovernmentSection.vue'
import PhoneTrio from '@/components/PhoneTrio.vue'
import { modules } from '@/data/modules'
import { missions } from '@/data/missions'
import { progress } from '@/composables/useProgress'
import { route, scrollToId } from '@/lib/router'

const missionCount = computed(() => missions.length)

watch(
  () => route.params.section,
  (id) => {
    if (!id) return
    nextTick(() => requestAnimationFrame(() => scrollToId(id)))
  },
  { immediate: true },
)
</script>

<template>
  <div class="home">
    <section id="home" class="hero" data-spy="home" aria-labelledby="home-title">
      <span class="hero__orb hero__orb--a" aria-hidden="true" />
      <span class="hero__orb hero__orb--b" aria-hidden="true" />
      <div class="container hero__inner">
        <div class="hero__copy rise">
          <p class="eyebrow eyebrow--onhero">Tech Guide · Everyday phone skills</p>
          <h1 id="home-title" class="display hero__title">
            A guide for everyday phone skills — and the scams that target them.
          </h1>
          <p class="lead hero__sub">
            Learn messaging, banking, rides and food ordering on a pretend phone. Then use the same habits
            to judge a real message before you reply, pay or tap.
          </p>

          <div class="hero__actions">
            <a class="btn btn--onhero btn--lg" href="#modules" @click.prevent="scrollToId('modules')">
              Explore the modules
              <AppIcon name="arrow-right" :size="16" />
            </a>
            <a class="btn hero__ghost" href="#/simulator">Try the phone simulator</a>
          </div>

          <ul class="hero__facts">
            <li><AppIcon name="grid" :size="14" /> {{ modules.length }} modules</li>
            <li><AppIcon name="check" :size="14" /> {{ missionCount }} guided missions</li>
            <li><AppIcon name="bolt" :size="14" /> {{ progress.xp }} XP collected</li>
            <li><AppIcon name="lock" :size="14" /> Saved on this device only</li>
          </ul>
        </div>

        <div class="hero__visual rise">
          <PhoneTrio />
        </div>
      </div>
    </section>

    <div class="container comfort">
      <A11yToolbar />
    </div>

    <section id="modules" class="modules container" data-spy="modules" aria-labelledby="modules-title">
      <div class="modules__head">
        <div>
          <p class="eyebrow">Start here</p>
          <h2 id="modules-title" class="h2">Choose the app you use most</h2>
          <p class="modules__lead">
            Each module explains the scams around that app, the red flags to check and the habits that keep
            you safe — with guided practice you can open in a tap.
          </p>
        </div>
        <p class="modules__note">{{ modules.length }} modules</p>
      </div>

      <div class="modules__list">
        <ModuleCard
          v-for="module in modules"
          :key="module.id"
          :module="module"
          @select="scrollToId"
        />
      </div>
    </section>

    <template v-for="(module, index) in modules" :key="module.id">
      <GovernmentSection
        v-if="module.type === 'tutorials'"
        :module="module"
        :alt="index % 2 === 1"
      />
      <ModuleSection
        v-else
        :module="module"
        :alt="index % 2 === 1"
      />
    </template>
  </div>
</template>

<style scoped>
/* ---------- hero ---------- */
.hero {
  position: relative;
  overflow: clip;
  padding: clamp(1.8rem, 4vw, 3.4rem) 0 clamp(3rem, 6vw, 4.5rem);
  background: var(--hero);
  color: #fff;
  scroll-margin-top: 0;
}

.hero__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}

.hero__orb--a {
  width: 34rem;
  height: 34rem;
  top: -16rem;
  right: -8rem;
  background: rgba(52, 211, 153, 0.22);
}

.hero__orb--b {
  width: 24rem;
  height: 24rem;
  bottom: -13rem;
  left: -7rem;
  background: rgba(20, 150, 139, 0.32);
}

.hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: clamp(1.5rem, 4vw, 3rem);
}

.hero__title {
  margin-top: 0.6rem;
  max-width: 19ch;
  color: #fff;
}

.hero__sub {
  margin-top: 1.1rem;
  max-width: 48ch;
  color: rgba(236, 253, 247, 0.86);
}

.hero__actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-top: 1.7rem;
}

.hero__ghost {
  min-height: 3.1rem;
  padding: 0 1.35rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
}

.hero__ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.7);
}

.hero__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin-top: 1.7rem;
  padding: 0;
  list-style: none;
}

.hero__facts li {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--step--1);
  font-weight: 650;
  color: rgba(236, 253, 247, 0.82);
}

.hero__facts :deep(svg) {
  color: #6ee7b7;
}

.hero__visual {
  display: flex;
  justify-content: center;
}

/* ---------- comfort bar ---------- */
.comfort {
  margin-top: -1.4rem;
  position: relative;
  z-index: 2;
}

.comfort :deep(.a11y-bar) {
  box-shadow: var(--shadow-md);
}

/* ---------- module cards ---------- */
.modules {
  padding-block: var(--section-y);
  scroll-margin-top: 5.5rem;
}

.modules__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.9rem;
  margin-bottom: var(--space-lg);
}

.modules__lead {
  margin-top: 0.55rem;
  max-width: 60ch;
  font-size: var(--step--1);
  line-height: 1.6;
  color: var(--muted);
}

.modules__note {
  padding: 0.35rem 0.8rem;
  border-radius: var(--r-pill);
  background: var(--mint-100);
  color: var(--teal-700);
  font-size: var(--step--2);
  font-weight: 700;
  white-space: nowrap;
}

.modules__list {
  display: flex;
  flex-direction: column;
  gap: var(--card-gap);
}

@media (max-width: 63.99rem) {
  .hero__inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero__title {
    max-width: 24ch;
  }

  .hero__visual {
    margin-top: 0.5rem;
  }
}

@media (max-width: 40rem) {
  .hero__facts {
    gap: 0.45rem 0.95rem;
  }
}
</style>
