<script setup>
import { computed, ref, watch } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import ChatbotWidget from '@/components/ChatbotWidget.vue'
import PracticeView from '@/views/PracticeView.vue'
import SimulatorView from '@/views/SimulatorView.vue'
import ScamView from '@/views/ScamView.vue'
import SafetyView from '@/views/SafetyView.vue'
import ProgressView from '@/views/ProgressView.vue'
import { prefersReducedMotion, route } from '@/lib/router'

const views = {
  practice: PracticeView,
  simulator: SimulatorView,
  scam: ScamView,
  safety: SafetyView,
  progress: ProgressView,
}

const titles = {
  practice: 'Everyday phone skills',
  simulator: 'Smartphone Simulator',
  scam: 'Scam Simulator',
  safety: 'Safety check',
  progress: 'Progress',
}

const view = computed(() => views[route.name] || PracticeView)
const main = ref(null)

function skipToMain(event) {
  event.preventDefault()
  const el = main.value
  if (!el) return
  el.focus({ preventScroll: true })
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

watch(
  () => route.name,
  (name) => {
    document.title = `${titles[name] || 'Everyday phone skills'} · Tech Guide`
    window.scrollTo({ top: 0, behavior: 'auto' })
  },
  { immediate: true },
)
</script>

<template>
  <a class="skip-link" href="#main" @click="skipToMain">Skip to content</a>
  <AppHeader />
  <main id="main" ref="main" class="app-main" tabindex="-1">
    <component :is="view" />
  </main>
  <SiteFooter />
  <ChatbotWidget />
</template>

<style scoped>
.app-main {
  outline: none;
  min-height: 60vh;
  scroll-margin-top: 5rem;
}
</style>
