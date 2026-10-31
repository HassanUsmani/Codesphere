/* Guided smartphone missions.
   Action tokens are emitted by the simulated phone, e.g. "open:camera",
   "tap:wa-attach", "select-photo:garden". A step advances when one of its
   `expect` tokens arrives; `wrong` gives a targeted correction. */

export const missions = [
  {
    id: 'camera-gallery',
    pathway: 'digital',
    title: 'Take and find a photo',
    story: 'Your balcony garden is in full bloom. Take a photo of it, then find the photo by yourself.',
    icon: 'camera',
    app: 'camera',
    minutes: 3,
    xp: 60,
    steps: [
      {
        id: 'open-camera',
        instruction: 'Open the Camera app.',
        hint: 'On the home screen, tap the Camera icon.',
        expect: ['open:camera'],
      },
      {
        id: 'shutter',
        instruction: 'Hold the phone steady and press the big white circle.',
        hint: 'The shutter is the large white circle at the bottom of the screen.',
        expect: ['tap:camera-shutter'],
        done: 'Click! The photo is saved.',
      },
      {
        id: 'open-gallery',
        instruction: 'Now find your photo. Open the Gallery.',
        hint: 'Tap the small photo in the corner of the camera, or go Home and open Gallery.',
        expect: ['open:gallery'],
      },
      {
        id: 'view-photo',
        instruction: 'Tap your new photo to look at it.',
        hint: 'It is the first photo in the grid, marked “New”.',
        expect: ['view:photo-new'],
        wrong: {
          'view:tea': 'That is the tea photo. Your new one is first in the grid, marked “New”.',
          'view:family': 'That is an older photo. Look for the one marked “New”.',
          'view:temple': 'That is an older photo. Look for the one marked “New”.',
        },
      },
    ],
    success: {
      title: 'Photo taken and found',
      message:
        'You opened the camera, took a photo and found it in the gallery. Tip: wipe the lens before you shoot.',
    },
  },
  {
    id: 'whatsapp-photo',
    pathway: 'digital',
    title: 'Send a photo on WhatsApp',
    story: 'Ammi wants to see your garden. Send her the new photo on WhatsApp.',
    icon: 'message',
    app: 'whatsapp',
    minutes: 3,
    xp: 60,
    steps: [
      {
        id: 'open-whatsapp',
        instruction: 'Open WhatsApp.',
        hint: 'Tap the WhatsApp icon on the home screen.',
        expect: ['open:whatsapp'],
      },
      {
        id: 'open-chat',
        instruction: 'Open your chat with Ammi.',
        hint: 'Tap “Ammi” in the list of chats.',
        expect: ['open-chat:ammi'],
        wrong: {
          'open-chat:bilal': 'That is your nephew’s chat. Go back and open Ammi’s.',
          'open-chat:family': 'That is the family group. Go back and open Ammi’s own chat.',
        },
      },
      {
        id: 'attach',
        instruction: 'Tap the + button beside the message box.',
        hint: 'It sits at the bottom left, next to where you type.',
        expect: ['tap:wa-attach'],
      },
      {
        id: 'photos',
        instruction: 'In the menu that opened, choose Photos.',
        hint: 'The first option in the attach menu.',
        expect: ['tap:wa-attach-photos'],
      },
      {
        id: 'pick',
        instruction: 'Pick the garden photo.',
        hint: 'Look for the photo with flowers.',
        expect: ['select-photo:garden'],
        wrong: {
          'select-photo:tea': 'That is the tea photo. Go back and pick the garden with flowers.',
          'select-photo:family': 'That is the family photo. Go back and pick the garden.',
          'select-photo:temple': 'That is the temple photo. Go back and pick the garden.',
        },
      },
      {
        id: 'send',
        instruction: 'Add a caption if you like, then tap the send arrow.',
        hint: 'The round send button is at the bottom right.',
        expect: ['tap:wa-send-photo'],
        done: 'Sent. Two ticks mean it reached Ammi.',
      },
    ],
    success: {
      title: 'Photo sent',
      message:
        'Ammi can see your garden. The same + button also sends videos, documents and your live location.',
    },
  },
  {
    id: 'maps-directions',
    pathway: 'digital',
    title: 'Get directions in Maps',
    story: 'You want to walk to Empress Market. Let Maps show you the way.',
    icon: 'map',
    app: 'maps',
    minutes: 3,
    xp: 60,
    steps: [
      {
        id: 'open-maps',
        instruction: 'Open Maps.',
        hint: 'Tap the Maps icon on the home screen.',
        expect: ['open:maps'],
      },
      {
        id: 'directions',
        instruction: 'Tap Directions.',
        hint: 'The Directions button sits at the bottom of the map.',
        expect: ['tap:maps-directions'],
      },
      {
        id: 'destination',
        instruction: 'Tap “Choose destination”.',
        hint: 'It is the second box at the top, under “Your location”.',
        expect: ['tap:maps-destination'],
      },
      {
        id: 'place',
        instruction: 'Pick Empress Market from the list.',
        hint: 'It is the first place in the list.',
        expect: ['select-place:market'],
        wrong: {
          'select-place:hospital': 'That is the hospital. Pick Empress Market.',
          'select-place:station': 'That is the railway station. Pick Empress Market.',
        },
      },
      {
        id: 'mode',
        instruction: 'Choose walking as how you will travel.',
        hint: 'Tap the walking person above the route.',
        expect: ['select-mode:walk'],
      },
      {
        id: 'start',
        instruction: 'Press Start.',
        hint: 'The Start button is at the bottom of the screen.',
        expect: ['tap:maps-start'],
        done: 'Navigation started. Tap the speaker for spoken directions.',
      },
    ],
    success: {
      title: 'Route started',
      message:
        'You searched a place, chose how to travel and started. Maps will speak each turn if you turn on voice.',
    },
  },
  {
    id: 'pay-someone',
    pathway: 'digital',
    title: 'Send money with the Pay app',
    story: 'You bought vegetables from Rashid for Rs. 1,500. Pay him with the Pay app.',
    icon: 'wallet',
    app: 'pay',
    minutes: 3,
    xp: 60,
    steps: [
      {
        id: 'open-pay',
        instruction: 'Open the Pay app.',
        hint: 'Tap the Pay icon on the home screen.',
        expect: ['open:pay'],
      },
      {
        id: 'pay-anyone',
        instruction: 'Tap “Pay anyone”.',
        hint: 'It is the first button under the balance card.',
        expect: ['tap:pay-anyone'],
      },
      {
        id: 'payee',
        instruction: 'Choose Rashid Vegetables.',
        hint: 'Check the name carefully, then tap it.',
        expect: ['select-payee:rashid'],
        wrong: {
          'select-payee:ayesha': 'That is a different person. Check the name, then pick Rashid Vegetables.',
        },
      },
      {
        id: 'amount',
        instruction: 'Type 1500 and tap Pay.',
        hint: 'Type 1, 5, 0, 0 on the keypad, then tap Pay.',
        expect: ['enter-amount:1500'],
      },
      {
        id: 'pin',
        instruction: 'Enter a 6-digit PIN and tap the tick. This is practice, so use any 6 digits.',
        hint: 'Tap six numbers, then the tick button. Never type your real PIN here.',
        expect: ['enter-pin'],
        done: 'Paid Rs. 1,500 to Rashid Vegetables.',
      },
      {
        id: 'cashback',
        instruction: 'A new message has arrived. Decide what to do.',
        hint: 'Think about when a PIN is actually needed.',
        decision: {
          prompt: 'A message says your payment won a Rs. 5,000 cashback. It asks you to reply with your PIN. What do you do?',
          options: [
            {
              id: 'ignore',
              label: 'Ignore and delete it',
              detail: 'A real cashback never asks for your PIN.',
              correct: true,
              feedback: 'Correct. Money arrives on its own. Nobody needs your PIN to give you money.',
            },
            {
              id: 'reply',
              label: 'Send the PIN',
              detail: 'The message looks official.',
              correct: false,
              feedback: 'No. Sharing a PIN hands over your account, even if the message looks official.',
            },
            {
              id: 'call',
              label: 'Call the number in the message',
              detail: 'Ask them to confirm.',
              correct: false,
              feedback: 'Not that number. Scammers staff those lines. Use the number on your card or the app’s own help page.',
            },
          ],
        },
      },
    ],
    success: {
      title: 'Payment complete',
      message:
        'You sent money and kept your PIN private. Rule of thumb: a PIN is only ever typed into the app itself.',
    },
  },
  {
    id: 'settings-safety',
    pathway: 'digital',
    title: 'Secure your phone',
    story: 'Anyone who picks up this phone can open it. Add a screen lock, then check which apps can see your location.',
    icon: 'settings',
    app: 'settings',
    minutes: 3,
    xp: 60,
    steps: [
      {
        id: 'open-settings',
        instruction: 'Open Settings.',
        hint: 'Tap the gear icon on the home screen.',
        expect: ['open:settings'],
      },
      {
        id: 'security',
        instruction: 'Tap Security.',
        hint: 'Scroll the list if you need to. Security has a lock icon.',
        expect: ['tap:settings-security'],
      },
      {
        id: 'screen-lock',
        instruction: 'Tap Screen lock.',
        hint: 'It is the first option, currently set to “None”.',
        expect: ['tap:settings-screen-lock'],
      },
      {
        id: 'lock-type',
        instruction: 'Choose a lock type. PIN is a good place to start.',
        hint: 'Tap PIN.',
        expect: ['select-lock:pin', 'select-lock:pattern', 'select-lock:fingerprint'],
        wrong: {
          'select-lock:none': '“None” leaves your phone open to anyone. Choose PIN, Pattern or Fingerprint.',
        },
      },
      {
        id: 'set-pin',
        instruction: 'Type a 4-digit PIN, tap Next, then type it again and confirm.',
        hint: 'Pick four numbers you will remember but others cannot guess. Not 1234, not your birth year.',
        expect: ['set-lock'],
        done: 'Screen lock set. The phone now asks for your PIN.',
      },
      {
        id: 'privacy',
        instruction: 'Go back to Settings and open Privacy.',
        hint: 'Press the back button until you see the main Settings list, then tap Privacy.',
        expect: ['tap:settings-privacy'],
        wrong: {
          'tap:settings-wifi': 'That is Wi-Fi. Go back to the main list and tap Privacy.',
          'tap:settings-sound': 'That is Sound. Go back to the main list and tap Privacy.',
        },
      },
      {
        id: 'permissions',
        instruction: 'Tap Permission manager.',
        hint: 'It is the first option in Privacy.',
        expect: ['tap:settings-permissions'],
      },
      {
        id: 'location',
        instruction: 'Tap Location to see which apps can use it.',
        hint: 'Location has a map-pin icon.',
        expect: ['open-permission:location'],
      },
      {
        id: 'deny',
        instruction: 'The Flashlight app can see where you are. Open it and choose “Don’t allow”.',
        hint: 'Tap Flashlight in the list, then choose “Don’t allow”.',
        expect: ['set-permission:flashlight:deny'],
        wrong: {
          'set-permission:flashlight:allow': 'A flashlight has no reason to know where you are. Choose “Don’t allow”.',
        },
        done: 'Flashlight can no longer see your location.',
      },
    ],
    success: {
      title: 'Phone secured',
      message:
        'A screen lock stops someone who finds your phone. Location permission should match what the app actually does.',
    },
  },
  {
    id: 'whatsapp-new-number',
    pathway: 'safety',
    title: '“Hi, I changed my number”',
    story: 'A WhatsApp message arrives from a number you do not know. It says it is your nephew Bilal.',
    icon: 'shield-alert',
    app: 'whatsapp',
    minutes: 3,
    xp: 60,
    steps: [
      {
        id: 'read',
        instruction: 'A new message has arrived. Tap it to read it.',
        hint: 'Tap the notification at the top, or open WhatsApp and tap the new chat.',
        expect: ['open-chat:unknown'],
      },
      {
        id: 'decide',
        instruction: 'Decide what to do.',
        hint: 'Is there a way to check with the real Bilal?',
        decision: {
          prompt: '“Assalam-o-Alaikum uncle, this is Bilal. New number, please save it. I need Rs. 40,000 urgently, send it today.”',
          options: [
            {
              id: 'send',
              label: 'Send the money',
              detail: 'He says he is your nephew.',
              correct: false,
              feedback: 'Not yet. Anyone can type “this is your nephew”. Sending money is the one step you cannot undo.',
            },
            {
              id: 'call-old',
              label: 'Call Bilal on his saved number',
              detail: 'Check before doing anything.',
              correct: true,
              feedback: 'Exactly. Calling the number you already saved is the check that costs you nothing.',
            },
            {
              id: 'ask',
              label: 'Ask a question only Bilal would know',
              detail: 'Test the person on the other end.',
              correct: true,
              feedback: 'Good thinking. A private question is a fair check. A call to the saved number is even stronger.',
            },
          ],
        },
      },
      {
        id: 'call',
        instruction: 'Go back to Chats, open “Bilal (Nephew)” and tap the phone icon to call him.',
        hint: 'Press back to reach the chat list. Bilal’s saved chat is further down.',
        expect: ['call:bilal'],
        done: 'Bilal says: “I never changed my number. That message is not from me.”',
      },
      {
        id: 'info',
        instruction: 'End the call. Open the unknown number’s chat and tap the number at the top.',
        hint: 'After ending the call, go back to Chats, open +92 301 ••• 5802, then tap its name at the top.',
        expect: ['contact-info:unknown'],
      },
      {
        id: 'block',
        instruction: 'Tap “Block and report”, then confirm.',
        hint: 'Scroll down on the contact page. “Block and report” is in the list.',
        expect: ['confirm-block:unknown'],
        done: 'Blocked. This number can no longer message or call you.',
      },
    ],
    traps: {
      'tap:wa-send-photo': 'Sending a photo does not check who this is. Call the saved number first.',
    },
    success: {
      title: 'Scam stopped',
      message:
        'You checked on a number you already trusted, then blocked the sender. Pressure plus a new number is the classic pattern.',
    },
  },
  {
    id: 'sms-delivery-link',
    pathway: 'safety',
    title: 'Fake delivery text',
    story: 'You are expecting a parcel. A text message says there is a problem with the delivery.',
    icon: 'link',
    app: 'messages',
    minutes: 3,
    xp: 60,
    steps: [
      {
        id: 'read',
        instruction: 'A text about your parcel has arrived. Open it.',
        hint: 'Tap the notification, or open Messages and tap the parcel text.',
        expect: ['open-sms:parcel'],
      },
      {
        id: 'open-link',
        instruction: 'The text has a link. Tap it to see where it goes. This is a simulation, so it is safe.',
        hint: 'Tap the underlined link inside the message.',
        expect: ['tap:sms-link'],
        done: 'A page opened inside the phone.',
      },
      {
        id: 'address',
        instruction: 'Before typing anything, tap the address bar at the top to read the full address.',
        hint: 'The address bar is the box at the very top of the page.',
        expect: ['tap:browser-address'],
        done: 'The real address is parcel-redelivery.in-track.co, not the courier’s own site.',
      },
      {
        id: 'decide',
        instruction: 'Decide what to do.',
        hint: 'Would the real courier send you to this address?',
        decision: {
          prompt: 'The page asks for Rs. 250 and your card number to “reschedule” the delivery.',
          options: [
            {
              id: 'pay',
              label: 'Pay Rs. 250',
              detail: 'It is a small amount.',
              correct: false,
              feedback: 'The amount is small on purpose. Your card number is what they are after.',
            },
            {
              id: 'close',
              label: 'Close the page and report the text',
              detail: 'Check the sender through the courier’s own app.',
              correct: true,
              feedback: 'Correct. Close it, then block and report. Check any delivery in the courier’s own app.',
            },
            {
              id: 'enter',
              label: 'Type only the card number, not the PIN',
              detail: 'Partial information is safer.',
              correct: false,
              feedback: 'A card number and expiry are enough to charge you online. Never type them into a link.',
            },
          ],
        },
      },
      {
        id: 'close',
        instruction: 'Close this page with the X beside the address.',
        hint: 'The X is at the top right of the page.',
        expect: ['tap:browser-close'],
      },
      {
        id: 'report',
        instruction: 'Go back to the text in Messages and report it as junk.',
        hint: 'Open the parcel text, tap the ⋮ menu, choose “Block and report junk”, then confirm.',
        expect: ['confirm-report:parcel'],
        done: 'Reported and blocked.',
      },
    ],
    success: {
      title: 'Link checked',
      message:
        'You read the address before typing anything, then closed and reported it. The address is the tell.',
    },
  },

  /* ---------------- Mission 8: ride booking ---------------- */
  {
    id: 'book-a-ride',
    pathway: 'digital',
    title: 'Learn to Book a Ride',
    story:
      'You need to get from Gulshan-e-Iqbal to Bahadurabad. Book a demo ride and see the fare before you confirm.',
    icon: 'car',
    app: 'ride',
    minutes: 5,
    xp: 80,
    isNew: true,
    steps: [
      {
        id: 'open-ride',
        instruction: 'Open the Ride app.',
        hint: 'Tap the Ride icon on the home screen.',
        expect: ['open:ride'],
      },
      {
        id: 'pickup',
        instruction: 'Set where you are leaving from. Tap the pickup box.',
        hint: 'The pickup box is at the top with a green dot beside it.',
        expect: ['tap:ride-pickup'],
      },
      {
        id: 'pickup-place',
        instruction: 'Choose Gulshan-e-Iqbal.',
        hint: 'It is the first place in the list under “Nearby”.',
        expect: ['select-ride-place:gulshan'],
        wrong: {
          'select-ride-place:bahadurabad': 'That is your destination. Pick Gulshan-e-Iqbal as the pickup.',
        },
        done: 'Pickup set. Now the app asks for a destination.',
      },
      {
        id: 'destination',
        instruction: 'Choose Bahadurabad as your destination.',
        hint: 'Tap Bahadurabad in the list.',
        expect: ['select-ride-place:bahadurabad'],
        wrong: {
          'select-ride-place:gulshan': 'That is where you are starting from. Pick Bahadurabad.',
        },
      },
      {
        id: 'vehicle',
        instruction: 'Compare the four vehicles and choose Car.',
        hint: 'Look at the fares first: Bike, Rickshaw, Car, Premium Car. Then tap Car.',
        expect: ['select-vehicle:car'],
        wrong: {
          'select-vehicle:bike': 'A bike is cheapest, but you asked for a car for this trip. Tap Car.',
          'select-vehicle:premium': 'Premium Car costs more than you need. Choose Car.',
        },
        done: 'Car selected. Check the fare on the next screen.',
      },
      {
        id: 'confirm',
        instruction: 'Review the fare, then tap “Confirm demo booking”.',
        hint: 'The fare is shown in the summary. Nothing is really booked.',
        expect: ['tap:ride-confirm'],
        done: 'Demo booking confirmed.',
      },
    ],
    success: {
      title: 'Ride booked (demo)',
      message:
        'You picked a pickup and destination, compared fares and confirmed. In a real app you would now see the driver’s name and number.',
    },
  },

  /* ---------------- Mission 9: food ordering ---------------- */
  {
    id: 'order-food',
    pathway: 'digital',
    title: 'Learn to Order Food Online',
    story: 'Dinner for two. Order chicken biryani from a restaurant you have not tried before.',
    icon: 'food',
    app: 'food',
    minutes: 6,
    xp: 90,
    isNew: true,
    steps: [
      {
        id: 'open-food',
        instruction: 'Open the Food Delivery app.',
        hint: 'Tap the Food Delivery icon on the home screen.',
        expect: ['open:food'],
      },
      {
        id: 'category',
        instruction: 'Choose the Biryani category.',
        hint: 'The categories are in the row of cards at the top.',
        expect: ['select-category:biryani'],
      },
      {
        id: 'restaurant',
        instruction: 'Choose Karachi Biryani House.',
        hint: 'It is the first restaurant in the list.',
        expect: ['select-restaurant:kbh'],
        wrong: {
          'select-restaurant:burger': 'That is a burger place. Pick Karachi Biryani House.',
          'select-restaurant:pizza': 'That is a pizza place. Pick Karachi Biryani House.',
        },
      },
      {
        id: 'browse',
        instruction: 'Browse the menu and open Chicken Biryani.',
        hint: 'Tap the Chicken Biryani row to see its details.',
        expect: ['select-dish:chicken'],
      },
      {
        id: 'quantity',
        instruction: 'Set the quantity to 2.',
        hint: 'Tap + once in the quantity stepper.',
        expect: ['select-qty:2'],
      },
      {
        id: 'add',
        instruction: 'Add it to the cart.',
        hint: 'The “Add to cart” button is at the bottom of the dish screen.',
        expect: ['tap:food-add'],
        done: 'Added. The cart now holds 2 × Chicken Biryani.',
      },
      {
        id: 'cart',
        instruction: 'Open the cart and review the total.',
        hint: 'Tap the cart button at the bottom of the screen.',
        expect: ['tap:food-cart'],
        done: 'Check the subtotal, delivery fee and total before paying.',
      },
      {
        id: 'payment',
        instruction: 'Choose “Cash on delivery”.',
        hint: 'It is the second payment option on the checkout screen.',
        expect: ['select-payment:cod'],
      },
      {
        id: 'confirm',
        instruction: 'Place the demo order.',
        hint: 'The confirm button is at the bottom. Nothing is really ordered.',
        expect: ['tap:food-confirm'],
        done: 'Demo order placed.',
      },
    ],
    success: {
      title: 'Order placed (demo)',
      message:
        'You chose a category, a restaurant, a dish and a payment method, and checked the total before confirming.',
    },
  },
]

export const missionById = Object.fromEntries(missions.map((m) => [m.id, m]))

export const missionGroups = [
  {
    id: 'simulator',
    title: 'Smartphone Simulator',
    description: 'Missions on a pretend phone. Nothing you tap here reaches a real app or account.',
    kind: 'Phone simulator',
    items: missions.filter((m) => m.app !== 'ride' && m.app !== 'food'),
  },
  {
    id: 'new',
    title: 'New: everyday services',
    description: 'Two new guided missions: booking a ride and ordering food, step by step.',
    kind: 'Phone simulator',
    items: missions.filter((m) => m.app === 'ride' || m.app === 'food'),
  },
]
