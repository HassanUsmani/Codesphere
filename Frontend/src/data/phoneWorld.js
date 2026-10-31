/* Seed data for the simulated phone. Every value is fictional. */

export const homeApps = [
  { id: 'camera', name: 'Camera', icon: 'camera', tone: 'teal' },
  { id: 'gallery', name: 'Gallery', icon: 'image', tone: 'green' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'message', tone: 'mint' },
  { id: 'maps', name: 'Maps', icon: 'map', tone: 'deep' },
  { id: 'pay', name: 'Pay', icon: 'wallet', tone: 'green' },
  { id: 'settings', name: 'Settings', icon: 'settings', tone: 'slate' },
  { id: 'messages', name: 'Messages', icon: 'chat', tone: 'teal' },
  { id: 'browser', name: 'Browser', icon: 'globe', tone: 'deep' },
  { id: 'ride', name: 'Ride', icon: 'car', tone: 'teal', isNew: true },
  { id: 'food', name: 'Food Delivery', icon: 'food', tone: 'green', isNew: true },
]

export const photos = [
  { id: 'garden', scene: 'garden', label: 'Balcony garden' },
  { id: 'tea', scene: 'tea', label: 'Morning tea' },
  { id: 'family', scene: 'family', label: 'Family dinner' },
  { id: 'temple', scene: 'shrine', label: 'Shrine visit' },
]

export const chats = {
  ammi: {
    id: 'ammi',
    name: 'Ammi',
    initials: 'A',
    about: 'online',
    messages: [
      { from: 'me', text: 'The roses have opened! 🌹', time: '9:48' },
      { from: 'them', text: 'Beta, send me a photo of the garden 🌸', time: '10:02' },
    ],
  },
  family: {
    id: 'family',
    name: 'Family 🏡',
    initials: 'F',
    about: 'Group · 8 members',
    messages: [{ from: 'them', text: 'Bilal: Happy Sunday everyone!', time: 'Yesterday' }],
  },
  bilal: {
    id: 'bilal',
    name: 'Bilal (Nephew)',
    initials: 'B',
    about: 'Hey there! I am using WhatsApp.',
    messages: [{ from: 'them', text: 'See you at Eid! 🎉', time: 'Mon' }],
  },
  unknown: {
    id: 'unknown',
    name: '+92 301 ••• 5802',
    initials: '?',
    unknown: true,
    about: 'Not in your contacts',
    messages: [
      {
        from: 'them',
        text: 'Assalam-o-Alaikum uncle, this is Bilal. New number, please save it. I need Rs. 40,000 urgently, send it today.',
        time: 'now',
      },
    ],
  },
}

export const chatOrder = ['unknown', 'ammi', 'family', 'bilal']

export const sms = {
  parcel: {
    id: 'parcel',
    sender: 'VK-PRCLDL',
    text: 'Your parcel #PK28841 is on hold due to an incomplete address. Pay Rs. 25 re-delivery fee within 12 hrs:',
    link: 'parcel-redelivery.in-track.co/pay',
    href: 'https://parcel-redelivery.in-track.co/pay',
    time: 'now',
  },
  bank: {
    id: 'bank',
    sender: 'MYBANK',
    text: 'Rs. 2,000 credited to A/c XX4411 on 28 Sep. Never share your OTP, PIN or password with anyone.',
    time: 'Sat',
  },
  otp: {
    id: 'otp',
    sender: 'VM-LOGINS',
    text: '553201 is your one-time password to log in. Do not share it with anyone.',
    time: 'Fri',
  },
}

export const smsOrder = ['parcel', 'bank', 'otp']

export const payees = [
  { id: 'rashid', name: 'Rashid Vegetables', handle: 'rashid.s@wallet', initials: 'RV' },
  { id: 'ayesha', name: 'Ayesha Khan', handle: 'ayesha.k@wallet', initials: 'AK' },
]

export const places = [
  { id: 'market', name: 'Empress Market', area: 'Saddar', km: 1.2 },
  { id: 'hospital', name: 'City Hospital', area: 'Clifton', km: 2.8 },
  { id: 'station', name: 'Karachi Cantt Station', area: 'Cantt', km: 1.9 },
]

export const locationPermissions = [
  { app: 'maps', name: 'Maps', icon: 'map', value: 'while' },
  { app: 'camera', name: 'Camera', icon: 'camera', value: 'while' },
  { app: 'weather', name: 'Weather', icon: 'cloud', value: 'while' },
  { app: 'flashlight', name: 'Flashlight', icon: 'flashlight', value: 'always' },
]

export const rideLocations = [
  { id: 'gulshan', name: 'Gulshan-e-Iqbal', area: 'Block 13-D', popular: true },
  { id: 'bahadurabad', name: 'Bahadurabad', area: 'Near Alamgir Road', popular: true },
  { id: 'saddar', name: 'Saddar', area: 'Empress Market side' },
  { id: 'clifton', name: 'Clifton', area: 'Block 2' },
  { id: 'dha', name: 'DHA Phase 6', area: 'Khayaban-e-Bukhari' },
]

export const vehicles = [
  {
    id: 'bike',
    name: 'Bike',
    fare: 120,
    eta: '3 min',
    seats: '1 rider',
    description: 'Fastest through traffic. Helmet provided.',
    icon: 'bike',
  },
  {
    id: 'rickshaw',
    name: 'Rickshaw',
    fare: 220,
    eta: '5 min',
    seats: 'Up to 3',
    description: 'Open-air and cheap for short trips.',
    icon: 'rickshaw',
  },
  {
    id: 'car',
    name: 'Car',
    fare: 350,
    eta: '6 min',
    seats: 'Up to 4',
    description: 'Air-conditioned, metered, everyday choice.',
    icon: 'car',
  },
  {
    id: 'premium',
    name: 'Premium Car',
    fare: 550,
    eta: '8 min',
    seats: 'Up to 4',
    description: 'Newer cars, top-rated drivers.',
    icon: 'car-premium',
  },
]

export const foodCategories = [
  { id: 'biryani', name: 'Biryani', icon: 'bowl' },
  { id: 'burgers', name: 'Burgers', icon: 'burger' },
  { id: 'pizza', name: 'Pizza', icon: 'pizza' },
  { id: 'fastfood', name: 'Fast Food', icon: 'fries' },
  { id: 'bbq', name: 'BBQ', icon: 'skewer' },
  { id: 'chinese', name: 'Chinese', icon: 'noodles' },
  { id: 'pakistani', name: 'Pakistani Food', icon: 'pot' },
  { id: 'desserts', name: 'Desserts', icon: 'cake' },
]

export const restaurants = [
  {
    id: 'kbh',
    name: 'Karachi Biryani House',
    cuisine: 'Biryani · Pakistani',
    rating: 4.6,
    minutes: '25–35 min',
    fee: 60,
    categories: ['biryani', 'pakistani'],
    tint: 'biryani',
    menu: [
      { id: 'chicken', name: 'Chicken Biryani', price: 420, note: 'Long-grain rice, raita, salad' },
      { id: 'beef', name: 'Beef Pulao', price: 480, note: 'Slow-cooked, served with shorba' },
      { id: 'veg', name: 'Vegetable Biryani', price: 350, note: 'Seasonal vegetables, mild spice' },
    ],
  },
  {
    id: 'burger',
    name: 'Burger Junction',
    cuisine: 'Burgers · Fast Food',
    rating: 4.3,
    minutes: '20–30 min',
    fee: 80,
    categories: ['burgers', 'fastfood'],
    tint: 'burger',
    menu: [
      { id: 'zinger', name: 'Zinger Burger', price: 390, note: 'Crispy fillet, mayo, lettuce' },
      { id: 'beef-burger', name: 'Beef Cheese Burger', price: 460, note: 'Grilled patty, cheddar' },
      { id: 'fries', name: 'Loaded Fries', price: 260, note: 'Cheese sauce, jalapeños' },
    ],
  },
  {
    id: 'pizza',
    name: 'Pizza Street',
    cuisine: 'Pizza · Italian',
    rating: 4.1,
    minutes: '30–40 min',
    fee: 100,
    categories: ['pizza', 'fastfood'],
    tint: 'pizza',
    menu: [
      { id: 'margherita', name: 'Margherita (Medium)', price: 750, note: 'Tomato, mozzarella, basil' },
      { id: 'tikka', name: 'Chicken Tikka Pizza', price: 950, note: 'Tikka chunks, onion, capsicum' },
      { id: 'garlic', name: 'Garlic Bread', price: 220, note: 'Four pieces, dip included' },
    ],
  },
  {
    id: 'bbq',
    name: 'Lahore BBQ Corner',
    cuisine: 'BBQ · Pakistani',
    rating: 4.7,
    minutes: '35–45 min',
    fee: 70,
    categories: ['bbq', 'pakistani'],
    tint: 'bbq',
    menu: [
      { id: 'seekh', name: 'Seekh Kabab (4 pcs)', price: 380, note: 'Charcoal grilled, mint chutney' },
      { id: 'tikka', name: 'Chicken Tikka', price: 520, note: 'Half chicken, lemon and salad' },
      { id: 'naan', name: 'Roghni Naan', price: 90, note: 'Fresh from the tandoor' },
    ],
  },
  {
    id: 'wok',
    name: 'Chinese Wok',
    cuisine: 'Chinese · Asian',
    rating: 4.2,
    minutes: '25–35 min',
    fee: 90,
    categories: ['chinese'],
    tint: 'wok',
    menu: [
      { id: 'chowmein', name: 'Chicken Chowmein', price: 430, note: 'Wok-tossed noodles' },
      { id: 'manchurian', name: 'Chicken Manchurian', price: 560, note: 'With egg fried rice' },
      { id: 'soup', name: 'Hot & Sour Soup', price: 240, note: 'Serves one' },
    ],
  },
]

export const restaurantById = Object.fromEntries(restaurants.map((r) => [r.id, r]))

export function createWorld(missionId) {
  return {
    missionId,
    photos: photos.map((p) => ({ ...p })),
    newPhotoTaken: false,
    chats: JSON.parse(JSON.stringify(chats)),
    sms: JSON.parse(JSON.stringify(sms)),
    lock: 'none',
    lockTried: false,
    permissions: Object.fromEntries(locationPermissions.map((p) => [p.app, p.value])),
    payments: [
      { to: 'Ayesha Khan', amount: 500, time: '24 Sep' },
      { to: 'Electricity bill', amount: 1240, time: '20 Sep' },
    ],
    paymentAmount: '',
    sentTo: null,
    callState: null,
    ridePickup: null,
    rideDestination: null,
    rideVehicle: null,
    rideStage: 'search',
    foodCategory: null,
    foodRestaurant: null,
    foodDish: null,
    foodQty: 1,
    foodCart: null,
    foodPayment: null,
    foodStage: 'home',
    browserOpen: false,
    reportDone: false,
    blocked: {},
    message: null,
  }
}
