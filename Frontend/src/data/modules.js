/* Tech Guide module content.
   Written as original, general guidance. No statistics, no legal claims and no
   organisation names are introduced here. Practice entries point at material
   that already exists; they never change how those missions or tools work. */

export const modules = [
  {
    id: 'whatsapp',
    index: '01',
    name: 'WhatsApp',
    kicker: 'Messaging',
    icon: 'message',
    tone: 'green',
    summary:
      'Messages from family, friends and strangers all arrive here — including the ones that pretend to be family.',
    intro:
      'WhatsApp is where most everyday conversations happen, and that is exactly why it is used to start scams. A stranger can copy a name and a photo, then ask for money before you have a chance to think.',
    scams: [
      {
        title: 'The new number',
        example: 'A message claims to be a relative on a new phone, then asks for an urgent transfer.',
      },
      {
        title: 'The verification code',
        example: 'Someone asks you to read out a six-digit code so they can “fix” your account.',
      },
      {
        title: 'The fake job offer',
        example: 'A stranger offers easy work, then asks for a registration fee or bank details.',
      },
      {
        title: 'The look-alike business',
        example: 'An account copies a shop or wallet name and asks for a PIN in the chat.',
      },
    ],
    tactics: [
      'Sending messages from numbers that are not in your contacts, often with a borrowed profile photo.',
      'Copying a name or picture so the account looks familiar at a glance.',
      'Adding you to a group where several accounts repeat the same story.',
      'Creating urgency or asking for secrecy so you act before checking.',
    ],
    avoid: [
      'Sending money to a number you have not saved and confirmed.',
      'Reading out a code or PIN in a chat.',
      'Treating a profile photo or display name as proof of identity.',
      'Forwarding a message that asks others to pay or click.',
    ],
    redFlags: [
      'The number is new, unknown or different from the one you have saved.',
      'The message is urgent, secret, or both.',
      'You are asked for money, a code or a photo of your ID.',
      'The account wants to move the conversation somewhere else.',
      'The writing does not match the person you know.',
    ],
    safety: [
      'Save and label the people you actually message.',
      'Call the saved number before acting on a money request.',
      'Turn on two-step verification in the app’s settings.',
      'Review who can see your profile photo and last seen.',
    ],
    after: [
      'Stop replying and do not send more money.',
      'Block and report the account inside the chat.',
      'If money left, call the bank’s number on your card the same day.',
      'Tell the person being impersonated so they can warn others.',
    ],
    practice: [
      { type: 'mission', id: 'whatsapp-photo' },
      { type: 'mission', id: 'whatsapp-new-number' },
      {
        type: 'link',
        href: '#/scam?level=scam',
        icon: 'shield-alert',
        label: 'Scam Simulator',
        text: 'Messages that copy real people and companies.',
        meta: '5 messages · 8 min · 160 XP',
      },
      {
        type: 'link',
        href: '#/safety',
        icon: 'lightbulb',
        label: 'Build a safety plan',
        text: 'Four steps for a message that worries you.',
        meta: 'Offline · rule-based',
      },
    ],
  },
  {
    id: 'banking',
    index: '02',
    name: 'Banking',
    kicker: 'Money',
    icon: 'wallet',
    tone: 'teal',
    summary:
      'Paying from an app is fast. The scams around it are built to steal a PIN, a code or card details.',
    intro:
      'A banking or wallet app moves real money in seconds. That speed is what a scammer relies on: one code, one tap, and the transfer cannot be undone.',
    scams: [
      {
        title: 'The cashback message',
        example: 'A text says a payment won a prize and asks you to reply with your PIN.',
      },
      {
        title: 'The “blocked account” call',
        example: 'A caller claims to be from the bank and needs the code that just arrived.',
      },
      {
        title: 'The KYC link',
        example: 'A message says the account closes today and links to a page that asks for card details.',
      },
      {
        title: 'The fake support chat',
        example: 'A look-alike account asks for a PIN to “reverse” a transaction.',
      },
    ],
    tactics: [
      'Pretending to be the bank, a wallet or a support agent.',
      'Inventing a problem — a blocked account, a transaction you did not make.',
      'Asking for the one thing that unlocks money: a PIN, an OTP or card details.',
      'Setting a deadline of today so you do not call the real number.',
    ],
    avoid: [
      'Typing a PIN or code outside the app’s own screens.',
      'Entering card details after opening a link.',
      'Paying a fee to “release” money or a prize.',
      'Trusting a caller because the number looks local.',
    ],
    redFlags: [
      'Someone asks for your PIN, OTP or full card number.',
      'The message creates a deadline of today.',
      'A link contains extra words around the bank’s name.',
      'The sender name matches, but the number or address does not.',
      'You are told not to discuss it with anyone.',
    ],
    safety: [
      'Lock the phone with a PIN, pattern or fingerprint.',
      'Check the payee name before every transfer.',
      'Start payments from the app yourself, never from a link.',
      'Keep the bank’s printed number where you can find it.',
    ],
    after: [
      'Call the bank’s number printed on your card and ask them to flag the transfer.',
      'Change the PIN or password you shared.',
      'Keep screenshots of the messages and the payment.',
      'Report the fraud to the cyber crime helpline the same day.',
    ],
    practice: [
      { type: 'mission', id: 'pay-someone' },
      { type: 'mission', id: 'settings-safety' },
      {
        type: 'link',
        href: '#/scam?level=scam',
        icon: 'shield-alert',
        label: 'Scam Simulator',
        text: 'A fake bank call, a family impersonation and a delivery update.',
        meta: '5 messages · 8 min · 160 XP',
      },
      {
        type: 'link',
        href: '#/safety',
        icon: 'lightbulb',
        label: 'Check a worrying message',
        text: 'Describe it and get a calm four-step plan.',
        meta: 'Offline · rule-based',
      },
    ],
  },
  {
    id: 'fraud-detection',
    index: '03',
    name: 'Fraud Detection',
    kicker: 'Every app',
    icon: 'shield-alert',
    tone: 'deep',
    summary:
      'Learn the patterns behind most scams, then use them to judge any message, in any app.',
    intro:
      'Fraud detection is a habit, not a list of tricks. Read the sender, the request and the deadline. If any of them is designed to rush you, slow down.',
    scams: [
      {
        title: 'Prize and lottery',
        example: 'You “win” a draw you never entered, then pay a fee to claim it.',
      },
      {
        title: 'Delivery problem',
        example: 'A small fee and a link that borrows a courier’s name.',
      },
      {
        title: 'Family emergency',
        example: 'A new number, urgent money and a request for secrecy.',
      },
      {
        title: 'Fake job or joining fee',
        example: 'Work you never applied for, with a payment needed before you start.',
      },
      {
        title: 'Threatening call',
        example: 'A caller claims to be police or the courts and demands money to close a case.',
      },
    ],
    tactics: [
      'Using a deadline: today, within the hour, before the account closes.',
      'Using authority: a bank, a courier, an employer, a police officer.',
      'Asking for secrecy so nobody else can warn you.',
      'Making a small fee or a short link feel routine.',
    ],
    avoid: [
      'Clicking a link in an unexpected message.',
      'Calling the number printed in the message.',
      'Paying any fee to receive money or a parcel.',
      'Staying on the line while someone “checks” your account.',
    ],
    redFlags: [
      'You did not expect this message or call.',
      'There is a deadline, a threat or a fee.',
      'You are asked for a code, a PIN or a payment.',
      'The link or number is almost right, not exactly right.',
      'You are asked to keep it secret.',
      'Payment is wanted outside the normal app.',
    ],
    safety: [
      'Verify through a route you chose: the app, the card, a saved number.',
      'Read the address of a link before the first slash.',
      'Use the four-step habit: stop, check, verify, act.',
      'Tell someone you trust before you pay.',
    ],
    after: [
      'Write down what happened, when, and from which number or account.',
      'Contact your bank the same day and ask them to flag the payment.',
      'Report it to the cyber crime helpline; the sooner you call, the better.',
      'Change any code or password you shared and warn family.',
    ],
    practice: [
      {
        type: 'link',
        href: '#/scam?level=scam',
        icon: 'shield-alert',
        label: 'Scam Simulator',
        text: 'Pressure tactics, impersonation and genuine messages.',
        meta: '5 messages · 8 min · 160 XP',
      },
      { type: 'mission', id: 'sms-delivery-link' },
      {
        type: 'link',
        href: '#/safety',
        icon: 'lightbulb',
        label: 'Open the safety check',
        text: 'Build a plan for anything that feels wrong.',
        meta: 'Offline · rule-based',
      },
    ],
  },
  {
    id: 'ride-hailing',
    index: '04',
    name: 'Ride Hailing',
    kicker: 'Getting around',
    icon: 'car',
    tone: 'mint',
    summary:
      'Booking a ride is simple. Checking the car, the plate and the fare keeps it safe.',
    intro:
      'A ride app takes a few taps to use. The safety habits take a few seconds more: confirm the car, keep the payment in the app, and let someone know where you are going.',
    scams: [
      {
        title: 'Cancel and pay directly',
        example: 'A caller says the app is down and asks you to cancel, then pay cash or transfer.',
      },
      {
        title: 'The advance deposit',
        example: 'A “driver” asks for money before accepting the trip.',
      },
      {
        title: 'The fake receipt',
        example: 'A message after the trip links to a page that asks for card details.',
      },
      {
        title: 'The wrong car',
        example: 'A car arrives with a different plate or driver from the one shown in the app.',
      },
    ],
    tactics: [
      'Calling right after you book, while you are still waiting for the app to update.',
      'Claiming the app is broken so the payment moves outside it.',
      'Copying a driver name and photo for a different car.',
      'Adding a charge at the end and asking for it in cash.',
    ],
    avoid: [
      'Cancelling the trip to pay outside the app.',
      'Sharing a code or PIN with the driver or a caller.',
      'Getting into a car whose plate and driver do not match.',
      'Agreeing to extra cash charges that are not shown in the app.',
    ],
    redFlags: [
      'The driver calls to cancel the booking.',
      'The plate or driver name does not match the app.',
      'You are asked for a code or a payment before the trip.',
      'The route changes without a reason.',
      'An extra charge appears outside the app.',
    ],
    safety: [
      'Check the driver’s name and plate before opening the door.',
      'Sit in the back and keep the app open during the trip.',
      'Share your trip with someone you trust.',
      'Confirm the fare in the app before you book.',
    ],
    after: [
      'End the trip safely and report the ride in the app.',
      'Keep the booking, fare and driver details.',
      'If card details were entered, call the bank’s number on your card.',
      'Tell someone you trust where you are and what happened.',
    ],
    practice: [
      { type: 'mission', id: 'book-a-ride' },
      { type: 'mission', id: 'maps-directions' },
      {
        type: 'link',
        href: '#/safety',
        icon: 'lightbulb',
        label: 'Plan before you travel',
        text: 'Turn a worrying message into four clear steps.',
        meta: 'Offline · rule-based',
      },
      {
        type: 'link',
        href: '#/progress',
        icon: 'bolt',
        label: 'See your progress',
        text: 'Every mission, level and point collected on this device.',
        meta: 'Saved in this browser',
      },
    ],
  },
  {
    id: 'foodpanda',
    index: '05',
    name: 'Food Delivery',
    kicker: 'Food delivery',
    icon: 'food',
    tone: 'leaf',
    summary:
      'Ordering food should stay inside the app: order, pay and track it there.',
    intro:
      'A food delivery app connects you to a restaurant and a rider. Keep the order, the payment and the conversation inside the app, and most problems stay small.',
    scams: [
      {
        title: 'The advance payment',
        example: 'A caller claiming to be the rider asks for a deposit before delivery.',
      },
      {
        title: 'The refund link',
        example: 'A message says the order was cancelled and links to a form that asks for card details.',
      },
      {
        title: 'Payment outside the app',
        example: 'The restaurant asks for a direct transfer before preparing the food.',
      },
      {
        title: 'The order code',
        example: 'Someone asks for the code sent to your phone to “confirm” the order.',
      },
    ],
    tactics: [
      'Calling from an unknown number after the order is placed.',
      'Asking you to move the conversation to a chat app.',
      'Sending a refund or payment link that copies the app’s look.',
      'Rushing you at the door with a new fee.',
    ],
    avoid: [
      'Paying a rider or restaurant outside the app.',
      'Sharing a code sent to your phone.',
      'Opening a refund link from a message.',
      'Ignoring a listing that looks copied or has no real details.',
    ],
    redFlags: [
      'A payment is requested before delivery, outside the app.',
      'The caller cannot describe your order.',
      'A link arrives from an unknown number.',
      'The app shows no rider assigned yet.',
      'You are hurried into paying a new fee.',
    ],
    safety: [
      'Keep the order, payment and messages inside the app.',
      'Check the restaurant’s details before ordering.',
      'Track the order in the app, not through texts.',
      'Meet the rider with the order details ready.',
    ],
    after: [
      'Report the order or rider in the app.',
      'If card details were entered, call the bank’s number on your card.',
      'Block the number that sent the link.',
      'Keep the order screenshots until the issue is closed.',
    ],
    practice: [
      { type: 'mission', id: 'order-food' },
      {
        type: 'link',
        href: '#/scam?level=scam',
        icon: 'shield-alert',
        label: 'Scam Simulator',
        text: 'Includes the fake delivery fee text.',
        meta: '5 messages · 8 min · 160 XP',
      },
      {
        type: 'link',
        href: '#/safety',
        icon: 'lightbulb',
        label: 'Check an order message',
        text: 'A four-step plan for a message that does not feel right.',
        meta: 'Offline · rule-based',
      },
      {
        type: 'link',
        href: '#/progress',
        icon: 'bolt',
        label: 'Your progress',
        text: 'See what you have finished and what is left.',
        meta: 'Saved in this browser',
      },
    ],
  },
]

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m]))
