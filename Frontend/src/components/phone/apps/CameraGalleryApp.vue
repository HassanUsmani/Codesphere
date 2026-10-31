<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import PhotoScene from '@/components/phone/PhotoScene.vue'

const props = defineProps({
  world: { type: Object, required: true },
  backTick: { type: Number, default: 0 },
})
const emit = defineEmits(['action', 'exit'])

const mode = ref('camera')
const viewing = ref(null)
const flash = ref(false)
const justShot = ref(false)
const lens = ref(1)

const gallery = computed(() => {
  const shots = props.world.photos.map((p) => ({ ...p, isNew: false }))
  if (props.world.newPhotoTaken) {
    shots.unshift({ id: 'new', scene: 'garden', label: 'Garden', isNew: true })
  }
  return shots
})

function shoot() {
  props.world.newPhotoTaken = true
  flash.value = true
  justShot.value = true
  setTimeout(() => (flash.value = false), 180)
  setTimeout(() => (justShot.value = false), 1600)
  emit('action', 'tap:camera-shutter')
}

function openGallery() {
  mode.value = 'gallery'
  emit('action', 'open:gallery')
}

function view(photo) {
  viewing.value = photo
  emit('action', photo.isNew ? 'view:photo-new' : `view:${photo.id}`)
}

watch(
  () => props.backTick,
  () => {
    if (viewing.value) viewing.value = null
    else if (mode.value === 'gallery') mode.value = 'camera'
    else emit('exit')
  },
)
</script>

<template>
  <div class="scr cam">
    <template v-if="mode === 'camera'">
      <div class="cam__view">
        <PhotoScene scene="garden" />
        <div class="cam__grid" aria-hidden="true" />
        <div class="cam__top">
          <span class="cam__pill"><AppIcon name="bolt" :size="12" /> Auto</span>
          <span class="cam__pill"><AppIcon name="settings" :size="12" /></span>
        </div>
        <p class="cam__hint">Point at your garden and press the white circle</p>
        <div v-if="flash" class="cam__flash" />
      </div>

      <p v-if="justShot" class="cam__saved" role="status">
        <AppIcon name="check" :size="12" /> Photo saved to Gallery
      </p>

      <div class="cam__ctrl">
        <button
          type="button"
          class="cam__thumb"
          :class="{ 'is-on': world.newPhotoTaken }"
          aria-label="Open Gallery"
          @click="openGallery"
        >
          <PhotoScene :scene="world.newPhotoTaken ? 'garden' : 'tea'" />
          <span v-if="world.newPhotoTaken" class="cam__thumb-badge">New</span>
        </button>
        <button type="button" class="cam__shutter" aria-label="Take a photo" @click="shoot">
          <span />
        </button>
        <button type="button" class="cam__flip" aria-label="Switch camera" @click="lens = lens === 1 ? 2 : 1">
          <AppIcon name="restart" :size="17" />
          <span>{{ lens }}×</span>
        </button>
      </div>

      <div class="cam__modes" aria-hidden="true">
        <span>Video</span><span class="is-on">Photo</span><span>Portrait</span>
      </div>
    </template>

    <template v-else>
      <header class="scr__head gal__head">
        <button type="button" class="scr__back" aria-label="Back to camera" @click="mode = 'camera'">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <h3 class="scr__title">Gallery</h3>
          <p class="scr__sub">{{ gallery.length }} photos · on this phone</p>
        </div>
      </header>
      <div class="scr__body">
        <p class="gal__day">Today</p>
        <ul class="gal__grid">
          <li v-for="photo in gallery" :key="photo.id">
            <button type="button" class="gal__tile" :aria-label="`Open photo: ${photo.label}`" @click="view(photo)">
              <PhotoScene :scene="photo.scene" />
              <span v-if="photo.isNew" class="gal__new">New</span>
            </button>
          </li>
        </ul>
        <p class="gal__day">Earlier</p>
        <div class="gal__empty">Older photos stay in the cloud — this demo keeps four.</div>
      </div>
    </template>

    <div v-if="viewing" class="cam-viewer">
      <div class="cam-viewer__photo">
        <PhotoScene :scene="viewing.scene" />
      </div>
      <div class="cam-viewer__bar">
        <button type="button" class="scr__back" aria-label="Close photo" @click="viewing = null">
          <AppIcon name="back" :size="17" />
        </button>
        <div>
          <p class="cam-viewer__title">{{ viewing.label }}</p>
          <p class="cam-viewer__sub">{{ viewing.isNew ? 'Just now' : 'Earlier' }} · 12 MP</p>
        </div>
        <span class="spacer" />
        <span class="cam-viewer__ico"><AppIcon name="heart" :size="15" /></span>
        <span class="cam-viewer__ico"><AppIcon name="send" :size="15" /></span>
        <span class="cam-viewer__ico"><AppIcon name="trash" :size="15" /></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cam {
  background: #04211f;
  color: #fff;
}

.cam__view {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  margin: 0.35rem 0.55rem 0;
  border-radius: 1.15rem;
  background: #0b3d39;
}

.cam__view .scene {
  position: absolute;
  inset: 0;
}

.cam__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.22) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 1px, transparent 1px);
  background-size: 33.33% 33.33%;
  opacity: 0.5;
  pointer-events: none;
}

.cam__top {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  display: flex;
  justify-content: space-between;
}

.cam__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(4, 33, 31, 0.45);
  color: #fff;
  font-size: 0.58rem;
  font-weight: 650;
  backdrop-filter: blur(6px);
}

.cam__hint {
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
  bottom: 0.55rem;
  padding: 0.3rem 0.5rem;
  border-radius: 0.5rem;
  background: rgba(4, 33, 31, 0.5);
  font-size: 0.58rem;
  line-height: 1.35;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
}

.cam__flash {
  position: absolute;
  inset: 0;
  background: #fff;
  animation: cam-flash 180ms ease-out both;
}

@keyframes cam-flash {
  from {
    opacity: 0.9;
  }
  to {
    opacity: 0;
  }
}

.cam__saved {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  margin-top: 0.35rem;
  font-size: 0.6rem;
  font-weight: 650;
  color: #a9e8d4;
}

.cam__ctrl {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.4rem 1.1rem 0.25rem;
}

.cam__thumb {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.6rem;
  overflow: hidden;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
}

.cam__thumb.is-on {
  border-color: #34d399;
  box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.35);
}

.cam__thumb-badge {
  position: absolute;
  left: 50%;
  bottom: 0.12rem;
  transform: translateX(-50%);
  padding: 0 0.2rem;
  border-radius: 999px;
  background: #059669;
  color: #fff;
  font-size: 0.42rem;
  font-weight: 800;
}

.cam__shutter {
  display: grid;
  place-items: center;
  width: 3.9rem;
  height: 3.9rem;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.95);
}

.cam__shutter span {
  width: 3.1rem;
  height: 3.1rem;
  border-radius: 50%;
  background: #fff;
  transition: transform 120ms ease;
}

.cam__shutter:active span {
  transform: scale(0.9);
}

.cam__flip {
  justify-self: end;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.5rem;
  font-weight: 700;
}

.cam__modes {
  display: flex;
  justify-content: center;
  gap: 0.9rem;
  padding: 0.15rem 0 0.45rem;
  font-size: 0.6rem;
  font-weight: 650;
  color: rgba(255, 255, 255, 0.5);
}

.cam__modes .is-on {
  color: #fbbf24;
}

.gal__head {
  background: #fff;
  color: var(--ink);
  border-bottom: 1px solid var(--line);
  padding-bottom: 0.6rem;
}

.gal__day {
  margin: 0.55rem 0.1rem 0.35rem;
  font-size: 0.62rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.gal__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
}

.gal__tile {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 0.4rem;
  overflow: hidden;
  background: var(--mint-100);
}

.gal__new {
  position: absolute;
  left: 0.2rem;
  bottom: 0.2rem;
  padding: 0 0.28rem;
  border-radius: 999px;
  background: #059669;
  color: #fff;
  font-size: 0.45rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.gal__empty {
  padding: 0.6rem 0.8rem;
  border-radius: 0.6rem;
  background: var(--mint-50);
  border: 1px dashed var(--line-strong);
  color: var(--muted);
  font-size: 0.63rem;
  text-align: center;
}

.cam-viewer {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  background: #04211f;
  animation: fade-in 200ms ease both;
}

.cam-viewer__photo {
  flex: 1;
  min-height: 0;
  padding: 0.5rem;
}

.cam-viewer__photo .scene {
  border-radius: 0.8rem;
}

.cam-viewer__bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.7rem 0.8rem;
  color: #fff;
}

.cam-viewer__title {
  font-size: 0.72rem;
  font-weight: 700;
}

.cam-viewer__sub {
  font-size: 0.58rem;
  color: rgba(255, 255, 255, 0.6);
}

.cam-viewer__ico {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
}
</style>
