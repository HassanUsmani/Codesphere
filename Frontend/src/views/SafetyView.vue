<script setup>
import AppIcon from '@/components/AppIcon.vue'
import SafetyCheckTool from '@/components/SafetyCheckTool.vue'
import { helpline } from '@/data/safetyScenarios'
import { progress } from '@/composables/useProgress'
</script>

<template>
  <div class="safety-view">
    <section class="safety-hero">
      <div class="container">
        <p class="eyebrow">Practice · Safety check</p>
        <div class="safety-hero__row">
          <div>
            <h1 class="h1 safety-hero__title">A calm plan for a confusing message.</h1>
            <p class="lead safety-hero__lead">
              Describe what happened, or pick a situation. You get four short steps — stop, check, verify,
              act — built from rules on this device. No account, no upload, no advice from a stranger.
            </p>
          </div>
          <div class="safety-hero__side card">
            <span class="safety-hero__icon"><AppIcon name="lightbulb" :size="20" /></span>
            <p class="safety-hero__sideTitle">
              {{ progress.safetyPlan ? 'A plan is saved' : 'No plan saved yet' }}
            </p>
            <p class="tiny muted">
              {{
                progress.safetyPlan
                  ? 'Your last plan is marked complete in your progress.'
                  : 'Build one now — it takes a sentence.'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <SafetyCheckTool />

      <section class="helpline" aria-labelledby="helpline-title">
        <div class="helpline__copy">
          <p class="eyebrow eyebrow--onhero">If money has already gone</p>
          <h2 id="helpline-title" class="h3 helpline__title">Report the same day, through official channels.</h2>
          <p class="helpline__text">
            Call the cyber crime helpline and your bank’s number printed on your card. Do not pay anyone who
            offers to “reverse” the transfer for a fee — that is a second scam.
          </p>
        </div>
        <div class="helpline__card">
          <p class="helpline__label">Cyber crime helpline</p>
          <p class="helpline__number">
            <AppIcon name="phone" :size="18" />
            {{ helpline.number }}
          </p>
          <p class="helpline__note">{{ helpline.note }}</p>
          <a
            class="helpline__link"
            :href="helpline.portal"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ helpline.portalLabel }}
            <AppIcon name="arrow-right" :size="13" />
          </a>
        </div>
      </section>

      <p class="safety-foot">
        <AppIcon name="info" :size="12" />
        This is general guidance, not legal or financial advice. The tool only matches keywords you type.
      </p>
    </div>
  </div>
</template>

<style scoped>
.safety-view {
  padding-bottom: 4rem;
}

.safety-hero {
  padding: clamp(2rem, 5vw, 3.25rem) 0 1.5rem;
}

.safety-hero__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
}

.safety-hero__title {
  max-width: 22ch;
}

.safety-hero__lead {
  margin-top: 0.6rem;
  max-width: 54ch;
}

.safety-hero__side {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 16rem;
  padding: 0.9rem 1rem;
}

.safety-hero__icon {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: var(--mint-100);
  color: var(--teal-700);
  margin-bottom: 0.25rem;
}

.safety-hero__sideTitle {
  font-size: 0.95rem;
  font-weight: 750;
}

/* ---------- helpline ---------- */
.helpline {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr);
  gap: 1.25rem;
  margin-top: 2.4rem;
  padding: clamp(1.3rem, 3vw, 2rem);
  border-radius: var(--r-xl);
  background: var(--hero);
  color: #fff;
}

.helpline__title {
  margin-top: 0.35rem;
  color: #fff;
  max-width: 24ch;
}

.helpline__text {
  margin-top: 0.6rem;
  max-width: 52ch;
  font-size: var(--step--1);
  line-height: 1.6;
  color: rgba(236, 253, 247, 0.82);
}

.helpline__card {
  align-self: center;
  padding: 1rem 1.1rem;
  border-radius: var(--r-lg);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(8px);
}

.helpline__label {
  font-size: var(--step--2);
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #a9e8d4;
}

.helpline__number {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.3rem;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.3rem);
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #fff;
  line-height: 1.1;
}

.helpline__note {
  margin-top: 0.4rem;
  font-size: var(--step--2);
  line-height: 1.5;
  color: rgba(236, 253, 247, 0.75);
}

.helpline__link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.6rem;
  font-size: var(--step--1);
  font-weight: 700;
  color: #a9e8d4;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.helpline__link:hover {
  color: #fff;
}

.safety-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 2rem;
  font-size: var(--step--2);
  color: var(--muted);
  text-align: center;
}

@media (max-width: 56rem) {
  .helpline {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
