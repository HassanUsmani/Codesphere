<script setup>
import AppIcon from '@/components/AppIcon.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import { modules } from '@/data/modules'
import { goToSection, navigate, prefersReducedMotion, route } from '@/lib/router'

function openModule(id) {
  if (route.name === 'practice') goToSection(id)
  else navigate('practice', { section: id })
}

function scrollHome() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  window.history.replaceState(null, '', '#/practice')
  route.params.section = ''
}

function goHome() {
  if (route.name === 'practice') scrollHome()
  else navigate('practice')
}

function backToTop() {
  goHome()
}
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <a class="footer__brand" href="#/practice" aria-label="Tech Guide home" @click.prevent="goHome">
        <BrandLogo :size="34" />
      </a>

      <nav class="footer__links" aria-label="Modules">
        <a
          v-for="module in modules"
          :key="module.id"
          :href="`#/practice?section=${module.id}`"
          @click.prevent="openModule(module.id)"
        >
          {{ module.name }}
        </a>
        <a href="#/progress">Progress</a>
      </nav>

      <button type="button" class="footer__top" @click="backToTop">
        Back to top
        <AppIcon name="arrow-up" :size="14" />
      </button>

      <p class="footer__legal">
        Everyday phone skills, practised on a pretend phone. Fictional places, people and payments —
        nothing here reaches a real app, account or bank. Progress stays in this browser.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 2rem;
  padding: clamp(2rem, 4vw, 3rem) 0 clamp(2.2rem, 4vw, 3rem);
  border-top: 1px solid var(--line);
  background: var(--paper);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem 2rem;
}

.footer__brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: var(--ink);
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.1rem;
  flex: 1;
}

.footer__links a {
  font-size: var(--step--1);
  font-weight: 600;
  color: var(--ink-soft);
  text-decoration: none;
}

.footer__links a:hover {
  color: var(--teal-700);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.footer__top {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2.4rem;
  padding: 0 0.9rem;
  border-radius: var(--r-pill);
  border: 1px solid var(--line-strong);
  font-size: var(--step--1);
  font-weight: 700;
  color: var(--teal-700);
  transition: background 200ms var(--ease), border-color 200ms var(--ease);
}

.footer__top:hover {
  background: var(--mint-100);
  border-color: var(--teal-400);
}

.footer__legal {
  flex-basis: 100%;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
  font-size: var(--step--2);
  color: var(--muted);
  max-width: 80ch;
  line-height: 1.6;
}

@media (max-width: 40rem) {
  .footer__links {
    order: 3;
    flex-basis: 100%;
  }

  .footer__top {
    margin-left: auto;
  }
}
</style>
