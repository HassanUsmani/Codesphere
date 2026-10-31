<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, i) in shape.paths" :key="'p' + i" :d="d" :fill="shape.fill || 'none'" />
    <circle
      v-for="(c, i) in shape.circles || []"
      :key="'c' + i"
      :cx="c[0]"
      :cy="c[1]"
      :r="c[2]"
      :fill="c[3] || 'none'"
    />
    <rect
      v-for="(r, i) in shape.rects || []"
      :key="'r' + i"
      :x="r[0]"
      :y="r[1]"
      :width="r[2]"
      :height="r[3]"
      :rx="r[4] || 0"
      :fill="r[5] || 'none'"
    />
    <line
      v-for="(l, i) in shape.lines || []"
      :key="'l' + i"
      :x1="l[0]"
      :y1="l[1]"
      :x2="l[2]"
      :y2="l[3]"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 20 },
})

const icons = {
  camera: {
    paths: ['M4 8h3l1.5-2.2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z'],
    circles: [[12, 13, 3.2]],
  },
  image: {
    rects: [[3, 4, 18, 16, 2.5]],
    circles: [[8.5, 9.5, 1.4]],
    paths: ['M4 17.5l4.5-5 3.8 3.8 2.7-3.2 5 5.4'],
  },
  message: {
    paths: ['M20.5 11.7a7.4 7.4 0 0 1-7.4 7.4H8.6L4 22v-5a7.4 7.4 0 0 1 4.6-12.1h4.5a7.4 7.4 0 0 1 7.4 6.8Z'],
    lines: [[8.5, 9.5, 15.5, 9.5], [8.5, 13.5, 13, 13.5]],
  },
  chat: {
    rects: [[3.5, 4.5, 17, 12, 3]],
    paths: ['M9 16.5v3.2l3.6-3.2'],
    lines: [[7, 8.5, 17, 8.5], [7, 12, 13, 12]],
  },
  map: {
    paths: ['M9 4 3.5 6.2v13.6L9 17.6l6 2.2 5.5-2.2V4L15 6.2 9 4Z', 'M9 4v13.6M15 6.2v13.6'],
  },
  wallet: {
    rects: [[3, 6, 18, 13, 3]],
    paths: ['M3 10h18'],
    circles: [[17, 14.5, 1.15, 'currentColor']],
  },
  settings: {
    circles: [[12, 12, 3.1]],
    paths: ['M12 2.8v3M12 18.2v3M4.4 7l2.6 1.5M17 15.5l2.6 1.5M4.4 17l2.6-1.5M17 8.5l2.6-1.5'],
  },
  globe: {
    circles: [[12, 12, 8.8]],
    paths: ['M3.4 12h17.2'],
    lines: [],
  },
  car: {
    paths: ['M4 15.5v-3.2L6.2 6.6h11.6L20 12.3v3.2', 'M4 15.5h16', 'M6.5 9.6h11'],
    circles: [[7.4, 17.2, 1.7], [16.6, 17.2, 1.7]],
  },
  'car-premium': {
    paths: ['M4 15.5v-3.2L6.2 6.6h11.6L20 12.3v3.2', 'M4 15.5h16', 'M6.5 9.6h11'],
    circles: [[7.4, 17.2, 1.7], [16.6, 17.2, 1.7]],
    lines: [[12, 2.6, 12.9, 4.4], [12, 2.6, 11.1, 4.4]],
  },
  bike: {
    circles: [[6, 17, 3], [18, 17, 3]],
    paths: ['M6 17l4.4-7.4h4.2L18 17', 'M10.4 9.6 8.6 6.6H6'],
  },
  rickshaw: {
    paths: ['M3.2 16.4V8.6h8.6l4 4.4h4.8v3.4', 'M3.2 16.4h1.6M13.6 16.4h1.6'],
    circles: [[7, 17.4, 2], [17.2, 17.4, 2]],
  },
  food: {
    paths: ['M7 3.2v7.4a2 2 0 0 0 4 0V3.2', 'M9 10.6V21', 'M17.6 3.4c-2.1 1.8-2.1 5 0 6.8V21'],
  },
  bowl: {
    paths: ['M3 11.2h18a9 9 0 0 1-18 0Z', 'M7.5 18.6c1.2 1 2.8 1.5 4.5 1.5s3.3-.5 4.5-1.5'],
    circles: [[9, 8, 0.7, 'currentColor'], [13.4, 7.2, 0.7, 'currentColor']],
  },
  burger: {
    paths: ['M4 10.2a8 8 0 0 1 16 0Z', 'M4.2 13h15.6', 'M4.6 16.2h14.8a2 2 0 0 1-2 2H6.6a2 2 0 0 1-2-2Z'],
  },
  pizza: {
    paths: ['M12 3.4 20.6 20 3.4 20Z', 'M3.4 20a20 20 0 0 1 17.2 0'],
    circles: [[10, 12.4, 0.9, 'currentColor'], [14, 15.6, 0.9, 'currentColor'], [11.4, 17.6, 0.9, 'currentColor']],
  },
  fries: {
    paths: ['M6.6 9.4 7.6 20h8.8l1-10.6', 'M9 9.4V5M12 9.4V4.2M15 9.4V5'],
  },
  skewer: {
    lines: [[3, 17.4, 21, 7.4]],
    circles: [[8.4, 15, 1.9], [12.4, 12.4, 1.9], [16.4, 9.8, 1.9]],
  },
  noodles: {
    paths: ['M3.4 11.6h17.2a8.6 8.6 0 0 1-17.2 0Z', 'M8 8.4c0-1.4 1.2-2.2 1.2-3.6M12 8.4c0-2 1.6-2.6 1.6-4.2M16 8.4c0-1.4 1-2.2 1-3.4'],
  },
  pot: {
    rects: [[3.6, 9.6, 16.8, 10.4, 3]],
    paths: ['M5 9.6 6.2 6h11.6l1.2 3.6', 'M8 6V4.6h8V6'],
  },
  cake: {
    rects: [[3.6, 12.4, 16.8, 7.6, 2]],
    paths: ['M3.6 16.4h16.8', 'M7.6 12.4V9.6M12 12.4V9.6M16.4 12.4V9.6'],
    circles: [[7.6, 8.4, 0.67, 'currentColor'], [12, 8.4, 0.67, 'currentColor'], [16.4, 8.4, 0.67, 'currentColor']],
  },
  cloud: {
    paths: ['M7.4 18.4h9.8a3.9 3.9 0 0 0 .4-7.8 5.6 5.6 0 0 0-10.7-1.2 4.5 4.5 0 0 0 .5 9Z'],
  },
  flashlight: {
    paths: ['M9 3.4h6l-1 5.2H10L9 3.4Z', 'M10 8.6h4V20a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V8.6Z'],
  },
  home: {
    paths: ['M3.6 10.8 12 3.8l8.4 7V20a1 1 0 0 1-1 1h-4.6v-6.2H9.2V21H4.6a1 1 0 0 1-1-1Z'],
  },
  bag: {
    paths: ['M5.8 8h12.4l1.1 12.2H4.7L5.8 8Z', 'M9 8V6.4a3 3 0 0 1 6 0V8'],
  },
  back: { paths: ['M15 4.8 7.6 12 15 19.2'] },
  'chevron-right': { paths: ['M9 4.8 16.4 12 9 19.2'] },
  'chevron-down': { paths: ['M5.6 9.2 12 15.6l6.4-6.4'] },
  check: { paths: ['M4.6 12.6 9.4 17.4 19.6 6.8'] },
  x: { paths: ['M6 6l12 12M18 6 6 18'] },
  clock: { circles: [[12, 12, 8.8]], paths: ['M12 7.2V12l3.4 2.2'] },
  bolt: { paths: ['M13.4 2.8 5.4 14h5.6L11 21.2 19 10h-5.6l1-7.2Z'] },
  shield: { paths: ['M12 3 20 6v6c0 4.8-3.4 7.9-8 9-4.6-1.1-8-4.2-8-9V6l8-3Z'] },
  'shield-alert': {
    paths: ['M12 3 20 6v6c0 4.8-3.4 7.9-8 9-4.6-1.1-8-4.2-8-9V6l8-3Z', 'M12 8.4v4.2'],
    circles: [[12, 15.8, 0.78, 'currentColor']],
  },
  link: {
    paths: [
      'M10.2 13.4a4.2 4.2 0 0 0 5.9 0l2.4-2.4a4.2 4.2 0 0 0-5.9-5.9l-1.2 1.2',
      'M13.8 10.6a4.2 4.2 0 0 0-5.9 0l-2.4 2.4a4.2 4.2 0 0 0 5.9 5.9l1.2-1.2',
    ],
  },
  lightbulb: {
    paths: ['M12 3.2a6.2 6.2 0 0 1 3.6 11.2V17H8.4v-2.6A6.2 6.2 0 0 1 12 3.2Z', 'M9.4 20h5.2M10.2 17h3.6'],
  },
  restart: { paths: ['M20.4 12a8.4 8.4 0 1 1-2.5-6', 'M20.6 3.8v5h-5'] },
  search: { circles: [[11, 11, 6.8]], paths: ['M16 16l4.4 4.4'] },
  mic: {
    rects: [[9.2, 3, 5.6, 10.6, 2.8]],
    paths: ['M5.4 11.4a6.6 6.6 0 0 0 13.2 0', 'M12 18v3'],
  },
  send: { paths: ['M4 11.8 20.4 3.6 13.6 20.4l-2.8-6-6.8-2.6Z'] },
  plus: { paths: ['M12 5v14M5 12h14'] },
  lock: { rects: [[4.8, 10.6, 14.4, 9.8, 2.4]], paths: ['M8.2 10.6V8a3.8 3.8 0 0 1 7.6 0v2.6'] },
  wifi: {
    paths: ['M3.6 8.8a13.6 13.6 0 0 1 16.8 0', 'M6.8 12.4a9 9 0 0 1 10.4 0', 'M10 16a4.2 4.2 0 0 1 4 0'],
    circles: [[12, 19, 0.9, 'currentColor']],
  },
  battery: { rects: [[2.6, 7.8, 16.4, 8.4, 2.2]], paths: ['M21.4 10.6v2.8', 'M5.2 10.4h6.4v3.2H5.2Z'] },
  signal: { paths: ['M4.6 18.4V15M9.6 18.4v-5.2M14.6 18.4V9.6M19.4 18.4V5.6'] },
  phone: {
    paths: ['M6.2 3.4h3l1.9 4.7-2.1 1.4a12.4 12.4 0 0 0 5.5 5.5l1.4-2.1 4.7 1.9v3a2 2 0 0 1-2.1 2A17 17 0 0 1 4.2 5.5a2 2 0 0 1 2-2.1Z'],
  },
  ban: { circles: [[12, 12, 8.8]], paths: ['M5.8 5.8l12.4 12.4'] },
  flag: { paths: ['M6 21V3.8', 'M6 4h9.6l-1.4 4 1.4 4H6'] },
  qr: {
    rects: [[3.6, 3.6, 6.6, 6.6, 1.6], [13.8, 3.6, 6.6, 6.6, 1.6], [3.6, 13.8, 6.6, 6.6, 1.6]],
    circles: [[17.1, 17.1, 1.5], [12, 5, 0.8, 'currentColor'], [5, 12, 0.8, 'currentColor']],
  },
  pin: {
    paths: ['M12 21.2s7-6.6 7-11.2a7 7 0 1 0-14 0c0 4.6 7 11.2 7 11.2Z'],
    circles: [[12, 10, 2.4]],
  },
  walk: {
    circles: [[13.4, 4.4, 1.8]],
    paths: ['M11 21l2.2-6-3.4-2.2 1.2-4 3.2 2.2 2.4 2.4', 'M9.6 12.2 11.8 8.8'],
  },
  star: { paths: ['M12 3.4l2.7 5.6 6.1.8-4.5 4.2 1.2 6-5.5-3-5.5 3 1.2-6L3.2 9.8l6.1-.8L12 3.4Z'] },
  trash: { paths: ['M3.8 6.6h16.4', 'M9.2 6.6V4.2h5.6v2.4', 'M6 6.6l1 13.4h10l1-13.4'] },
  menu: { paths: ['M4 7h16M4 12h16M4 17h16'] },
  'text-size': { paths: ['M3 19l4.6-12L12.2 19', 'M4.6 15.2h6', 'M15.4 19V8.6', 'M15.4 12.4c4.8-1.6 6 1 5.2 3.4-.6 1.8-2.8 3-5.2 3.2'] },
  contrast: { circles: [[12, 12, 8.8]], paths: ['M12 3.2a8.8 8.8 0 0 0 0 17.6Z'], fill: 'none' },
  motion: { paths: ['M2.8 12h3.6l2.8-7 4 14 2.8-7h5.2'] },
  sun: {
    circles: [[12, 12, 4.2]],
    lines: [
      [12, 2.4, 12, 4.6],
      [12, 19.4, 12, 21.6],
      [2.4, 12, 4.6, 12],
      [19.4, 12, 21.6, 12],
      [5.2, 5.2, 6.8, 6.8],
      [17.2, 17.2, 18.8, 18.8],
      [5.2, 18.8, 6.8, 17.2],
      [17.2, 6.8, 18.8, 5.2],
    ],
  },
  moon: { paths: ['M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.8 8.8 0 1 0 11 11Z'] },
  'arrow-up': { paths: ['M12 20V4M6 10l6-6 6 6'] },
  accessibility: {
    circles: [[12, 4.4, 1.8]],
    paths: ['M4.2 8.8h15.6', 'M12 8.8v6', 'M8.4 21l3.6-6 3.6 6'],
  },
  info: { circles: [[12, 12, 8.8]], paths: ['M12 11v6'] },
  alert: { paths: ['M12 3.6 21.4 20H2.6L12 3.6Z', 'M12 9.4v4.2'], circles: [[12, 16.9, 0.8, 'currentColor']] },
  users: {
    circles: [[9.4, 8.4, 3.2], [16.8, 9.6, 2.4]],
    paths: ['M3.4 20a6 6 0 0 1 12 0'],
  },
  eye: { paths: ['M2.6 12S6 6.2 12 6.2 21.4 12 21.4 12 18 17.8 12 17.8 2.6 12 2.6 12Z'], circles: [[12, 12, 2.6]] },
  calendar: { rects: [[3.6, 5.2, 16.8, 15.4, 2.4]], paths: ['M3.6 9.8h16.8', 'M8.4 3.4v3.4M15.6 3.4v3.4'] },
  'arrow-right': { paths: ['M4 12h16M14 6l6 6-6 6'] },
  'arrow-left': { paths: ['M20 12H4M10 6l-6 6 6 6'] },
  more: { circles: [[12, 5.4, 1.1, 'currentColor'], [12, 12, 1.1, 'currentColor'], [12, 18.6, 1.1, 'currentColor']] },
  sparkles: { paths: ['M12 3.2l1.7 4.6 4.6 1.7-4.6 1.7L12 15.8l-1.7-4.6L5.7 9.5l4.6-1.7L12 3.2Z', 'M18.4 15.4l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9Z'] },
  grid: {
    rects: [[3.8, 3.8, 7, 7, 2], [13.2, 3.8, 7, 7, 2], [3.8, 13.2, 7, 7, 2], [13.2, 13.2, 7, 7, 2]],
  },
  volume: { paths: ['M4 9.6h3.4L12 5.6v12.8L7.4 14.4H4V9.6Z', 'M15.4 9a4.4 4.4 0 0 1 0 6', 'M18 6.4a8 8 0 0 1 0 11.2'] },
  heart: { paths: ['M12 20.2S3.6 15 3.6 9.4A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.4 2.8c0 5.6-8.4 10.8-8.4 10.8Z'] },
  backspace: { paths: ['M9 6h11v12H9L3.6 12 9 6Z', 'M12.6 9.4l4 5.2M16.6 9.4l-4 5.2'] },
}

const shape = computed(() => {
  const icon = icons[props.name] || icons.info
  return { paths: icon.paths || [], circles: icon.circles || [], rects: icon.rects || [], lines: icon.lines || [], fill: icon.fill }
})
</script>
