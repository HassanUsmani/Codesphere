<script setup>
import { computed, reactive } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { tutorialGroups } from '@/data/governmentTutorials'

defineProps({
  module: { type: Object, required: true },
  alt: { type: Boolean, default: false },
})

const playingVideos = reactive({})
const playingPlaylists = reactive({})
const thumbErrors = reactive({})
const expandedGroups = reactive({})

function playVideo(id) {
  playingVideos[id] = true
}

function playPlaylist(groupId) {
  playingPlaylists[groupId] = true
}

function toggleExpand(groupId) {
  expandedGroups[groupId] = !expandedGroups[groupId]
}

function isExpanded(groupId) {
  return Boolean(expandedGroups[groupId])
}

const activeGroups = computed(() =>
  tutorialGroups
    .map((group) => ({
      ...group,
      videos: (group.videos || []).filter((v) => Boolean(v.youtubeId && v.youtubeId.trim())),
    }))
    .filter((group) => Boolean(group.playlistId || group.videos.length > 0)),
)

function visibleVideos(group) {
  if (isExpanded(group.id) || group.videos.length <= 6) {
    return group.videos
  }
  return group.videos.slice(0, 6)
}
</script>

<template>
  <section
    :id="module.id"
    class="module-sec"
    :class="[`tone--${module.tone}`, { 'is-alt': alt }]"
    :data-spy="module.id"
    :aria-labelledby="`${module.id}-title`"
  >
    <div class="container">
      <!-- Header: index + kicker, title, intro -->
      <header class="module-sec__head">
        <div class="module-sec__intro">
          <p class="eyebrow">
            <span class="module-sec__num">{{ module.index }}</span>
            {{ module.kicker }}
          </p>
          <h2 :id="`${module.id}-title`" class="h2 module-sec__title">{{ module.name }}</h2>
          <p class="module-sec__lead">{{ module.intro }}</p>
        </div>

        <div class="module-sec__badge">
          <span class="module-sec__icon" aria-hidden="true">
            <AppIcon :name="module.icon" :size="24" />
          </span>
          <p class="module-sec__badgeText">{{ module.summary }}</p>
        </div>
      </header>

      <!-- Safety note card -->
      <aside class="gov-safety" role="note" aria-label="Official services safety advice">
        <div class="gov-safety__head">
          <span class="gov-safety__icon" aria-hidden="true">
            <AppIcon name="lock" :size="20" />
          </span>
          <h3 class="gov-safety__title">Important safety advice for official services</h3>
        </div>
        <div class="gov-safety__body">
          <p class="gov-safety__text">
            Only install government applications obtained directly from the official mobile app store or verified official government portals. Never reveal one-time security codes (OTPs), account passwords, or identity document photographs to anyone who contacts you unexpectedly via call, message, or email.
          </p>
          <p class="gov-safety__disclaimer">
            These video guides are third-party educational tutorials designed to explain digital processes and are not official government material.
          </p>
        </div>
      </aside>

      <!-- Tutorial Groups -->
      <div class="gov-groups">
        <section
          v-for="group in activeGroups"
          :key="group.id"
          class="gov-group"
          :aria-labelledby="`group-heading-${group.id}`"
        >
          <div class="gov-group__header">
            <h3 :id="`group-heading-${group.id}`" class="gov-group__title h3">
              {{ group.title }}
            </h3>
            <p v-if="group.intro && !group.playlistId" class="gov-group__intro">
              {{ group.intro }}
            </p>
          </div>

          <!-- Click-to-play playlist player card (if group has playlistId) -->
          <article v-if="group.playlistId" class="video-card playlist-card">
            <div class="video-card__help">
              <span class="video-card__label">What this video helps you do</span>
              <p class="video-card__purpose">{{ group.intro }}</p>
            </div>

            <div class="video-card__media">
              <div v-if="playingPlaylists[group.id]" class="video-frame-wrapper">
                <iframe
                  :src="`https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(group.playlistId)}`"
                  :title="group.title"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowfullscreen
                  class="video-frame"
                />
              </div>
              <button
                v-else
                type="button"
                class="video-thumb-btn playlist-thumb-btn"
                :aria-label="`Play playlist: ${group.title}`"
                @click="playPlaylist(group.id)"
              >
                <div class="playlist-placeholder">
                  <span class="playlist-placeholder__badge">Official playlist</span>
                  <span class="playlist-placeholder__title">{{ group.title }}</span>
                </div>
                <span class="play-badge" aria-hidden="true">
                  <svg class="play-icon" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            </div>

            <div class="video-card__info">
              <span class="video-card__app">NADRA</span>
              <h4 class="video-card__title">{{ group.title }}</h4>
              <a
                :href="`https://www.youtube.com/playlist?list=${encodeURIComponent(group.playlistId)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="video-card__yt-link"
              >
                Open playlist on YouTube
                <AppIcon name="arrow-right" :size="14" />
              </a>
            </div>
          </article>

          <!-- Video cards responsive grid -->
          <div v-if="group.videos.length > 0" class="gov-grid">
            <article
              v-for="video in visibleVideos(group)"
              :key="video.youtubeId"
              class="video-card"
            >
              <div class="video-card__help">
                <span class="video-card__label">What this video helps you do</span>
                <p class="video-card__purpose">{{ video.purpose }}</p>
              </div>

              <div class="video-card__media">
                <div v-if="playingVideos[video.youtubeId]" class="video-frame-wrapper">
                  <iframe
                    :src="`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1`"
                    :title="video.title"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowfullscreen
                    class="video-frame"
                  />
                </div>
                <button
                  v-else
                  type="button"
                  class="video-thumb-btn"
                  :aria-label="`Play video: ${video.title}`"
                  @click="playVideo(video.youtubeId)"
                >
                  <img
                    v-if="!thumbErrors[video.youtubeId]"
                    :src="`https://i.ytimg.com/vi/${encodeURIComponent(video.youtubeId)}/hqdefault.jpg`"
                    :alt="video.title"
                    class="video-thumb"
                    loading="lazy"
                    @error="thumbErrors[video.youtubeId] = true"
                  />
                  <div v-else class="video-thumb video-thumb--fallback" aria-hidden="true">
                    <span class="video-thumb__fallback-title">{{ video.title }}</span>
                  </div>
                  <span class="play-badge" aria-hidden="true">
                    <svg class="play-icon" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              </div>

              <div class="video-card__info">
                <span class="video-card__app">{{ video.appName }}</span>
                <h4 class="video-card__title">{{ video.title }}</h4>
                <a
                  :href="`https://www.youtube.com/watch?v=${encodeURIComponent(video.youtubeId)}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="video-card__yt-link"
                >
                  Watch on YouTube
                  <AppIcon name="arrow-right" :size="14" />
                </a>
              </div>
            </article>
          </div>

          <!-- Expand / collapse button if more than 6 videos -->
          <div v-if="group.videos.length > 6" class="gov-group__more">
            <button
              type="button"
              class="btn btn--soft"
              :aria-expanded="isExpanded(group.id)"
              @click="toggleExpand(group.id)"
            >
              {{ isExpanded(group.id) ? 'Show fewer videos' : `Show all ${group.videos.length} videos` }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.module-sec {
  padding-block: var(--section-y);
  border-top: 1px solid var(--line);
  scroll-margin-top: 5.5rem;
}

.module-sec.is-alt {
  background: var(--surface-soft);
}

/* ---------- head ---------- */
.module-sec__head {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(15rem, 0.8fr);
  gap: var(--card-gap);
  align-items: start;
  margin-bottom: var(--space-lg);
}

.module-sec__num {
  display: inline-grid;
  place-items: center;
  min-width: 1.6rem;
  height: 1.6rem;
  margin-right: 0.45rem;
  padding: 0 0.35rem;
  border-radius: 7px;
  background: var(--mint-100);
  color: var(--teal-700);
  font-size: 0.68rem;
  letter-spacing: 0;
}

.module-sec__title {
  margin-top: 0.5rem;
}

.module-sec__lead {
  margin-top: 0.75rem;
  max-width: 60ch;
  font-size: var(--step-0);
  line-height: 1.65;
  color: var(--ink-soft);
}

.module-sec__badge {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: var(--card-pad);
  border-radius: var(--r-xl);
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-xs);
}

.module-sec__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  flex: none;
  border-radius: 14px;
  color: #fff;
}

.tone--deep .module-sec__icon {
  background: linear-gradient(145deg, var(--teal-900), var(--teal-600));
}

.module-sec__badgeText {
  font-size: var(--step--1);
  line-height: 1.6;
  color: var(--muted);
}

/* ---------- safety card ---------- */
.gov-safety {
  padding: var(--card-pad);
  border-radius: var(--r-xl);
  background: var(--paper);
  border: 1px solid var(--line-strong);
  box-shadow: var(--shadow-xs);
  margin-bottom: var(--space-xl);
}

.gov-safety__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
}

.gov-safety__icon {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  flex: none;
  border-radius: 10px;
  background: var(--mint-100);
  color: var(--teal-700);
}

.gov-safety__title {
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-weight: 750;
  color: var(--ink);
}

.gov-safety__body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.gov-safety__text {
  font-size: var(--step-0);
  line-height: 1.6;
  color: var(--ink-soft);
}

.gov-safety__disclaimer {
  font-size: var(--step--1);
  line-height: 1.5;
  color: var(--muted);
}

/* ---------- groups ---------- */
.gov-groups {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.gov-group__header {
  margin-bottom: var(--space-md);
}

.gov-group__title {
  font-family: var(--font-display);
  font-size: var(--step-2);
  font-weight: 750;
  color: var(--ink);
}

.gov-group__intro {
  margin-top: 0.4rem;
  font-size: var(--step-0);
  color: var(--muted);
  max-width: 65ch;
  line-height: 1.55;
}

/* ---------- playlist card ---------- */
.playlist-card {
  max-width: 48rem;
  margin-bottom: var(--card-gap);
}

.playlist-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--teal-950), var(--teal-800));
  color: #fff;
  text-align: center;
}

.playlist-placeholder__badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.15);
  font-size: var(--step--2);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.playlist-placeholder__title {
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-weight: 750;
  max-width: 32ch;
  line-height: 1.3;
}

/* ---------- video cards grid ---------- */
.gov-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--card-gap);
}

.video-card {
  display: flex;
  flex-direction: column;
  padding: var(--card-pad);
  border-radius: var(--r-xl);
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-xs);
  transition: transform 200ms var(--ease), box-shadow 200ms var(--ease), border-color 200ms var(--ease);
}

.video-card:hover {
  border-color: var(--teal-400);
  box-shadow: var(--shadow-sm);
}

.video-card__help {
  margin-bottom: 0.85rem;
}

.video-card__label {
  display: block;
  font-size: 0.72rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--teal-600);
  margin-bottom: 0.3rem;
}

.video-card__purpose {
  font-size: var(--step--1);
  line-height: 1.45;
  color: var(--ink-soft);
  min-height: 2.6rem;
}

.video-card__media {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--r-md);
  overflow: hidden;
  background: var(--teal-950);
  margin-bottom: 0.9rem;
}

.video-frame-wrapper {
  width: 100%;
  height: 100%;
}

.video-frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.video-thumb-btn {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.video-thumb-btn:focus-visible {
  outline: 3px solid var(--teal-500);
  outline-offset: 2px;
}

.video-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 220ms var(--ease);
}

.video-thumb-btn:hover .video-thumb {
  transform: scale(1.03);
}

.video-thumb--fallback {
  display: grid;
  place-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, var(--teal-900), var(--teal-700));
  color: #fff;
  text-align: center;
}

.video-thumb__fallback-title {
  font-size: var(--step--1);
  font-weight: 650;
  line-height: 1.35;
}

.play-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: rgba(6, 48, 45, 0.85);
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  transition: transform 200ms var(--ease), background 200ms var(--ease);
}

.video-thumb-btn:hover .play-badge {
  background: var(--teal-600);
  transform: translate(-50%, -50%) scale(1.08);
}

.video-card__info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.video-card__app {
  font-size: 0.72rem;
  font-weight: 750;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--teal-600);
  margin-bottom: 0.25rem;
}

.video-card__title {
  font-family: var(--font-display);
  font-size: var(--step-0);
  font-weight: 750;
  line-height: 1.3;
  color: var(--ink);
  margin-bottom: 0.85rem;
}

.video-card__yt-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: auto;
  font-size: var(--step--1);
  font-weight: 700;
  color: var(--teal-700);
  text-decoration: none;
  transition: color 180ms var(--ease), gap 180ms var(--ease);
}

.video-card__yt-link:hover {
  color: var(--teal-500);
  gap: 0.5rem;
}

.video-card__yt-link:focus-visible {
  outline: 2px solid var(--teal-500);
  outline-offset: 2px;
  border-radius: var(--r-xs);
}

.gov-group__more {
  display: flex;
  justify-content: center;
  margin-top: var(--space-lg);
}

/* ---------- responsive ---------- */
@media (max-width: 63.99rem) {
  .gov-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .module-sec__head {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 41.99rem) {
  .gov-grid {
    grid-template-columns: 1fr;
  }

  .playlist-card {
    max-width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .video-card:hover,
  .video-thumb-btn:hover .video-thumb,
  .video-thumb-btn:hover .play-badge {
    transform: none;
  }
}
</style>
