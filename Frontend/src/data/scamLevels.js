/* Scam Simulator content. Each message is a realistic artefact the learner can
   inspect segment by segment, then judge: safe / verify / scam. */

export const levels = [
  {
    id: 'scam',
    title: 'Scam Simulator',
    description: 'Practice spotting pressure tactics, impersonation and genuine messages.',
    minutes: 8,
    xp: 160,
  },
]

export const messages = [
  {
    id: 'b-bank-call',
    level: 'scam',
    channel: 'call',
    app: 'Phone',
    time: 'Call · 2:31',
    senderLabel: 'Incoming call',
    sender: {
      id: 'sender',
      text: 'Unknown caller · +92 321 118 4407',
      inspect: 'A mobile number. Your bank calls from its own published helpline, printed on your card.',
      suspicious: true,
      why: 'Anyone can claim to be from a bank. The number proves nothing.',
    },
    body: [
      '“Assalam-o-Alaikum sir, ',
      {
        id: 'claim',
        text: 'I am calling from the bank’s head office',
        suspicious: true,
        inspect: 'He has not given a single detail you can check.',
        why: 'A caller who leads with authority and no verifiable detail is a red flag.',
      },
      '. ',
      {
        id: 'threat',
        text: 'Your account will be blocked today',
        suspicious: true,
        inspect: 'A deadline of “today”, with no letter, email or app notification.',
        why: 'Urgency is the most common pressure tactic. Banks do not lock accounts by phone call.',
      },
      ' unless you confirm the account. ',
      {
        id: 'otp',
        text: 'Please read me the code that just arrived on your phone',
        suspicious: true,
        inspect: 'An OTP message just arrived. It says: never share this code.',
        why: 'No bank, ever, asks for an OTP over a call. The code is the key to your money.',
      },
      '”',
    ],
    isScam: true,
    verdict: 'Fake bank call',
    explanation:
      'Fraudsters pose as bank staff and invent a problem so you hand over the OTP. The OTP is what lets them move your money.',
    whatToDo: [
      'Hang up. Do not share the code.',
      'Call the number printed on the back of your card if you are worried.',
      'Block and report the caller.',
    ],
  },
  {
    id: 'b-courier',
    level: 'scam',
    channel: 'sms',
    app: 'Messages',
    time: '4:18 PM',
    senderLabel: 'Unknown sender',
    sender: {
      id: 'sender',
      text: 'VK-PRCLDL',
      inspect: 'A sender ID is easy to fake. Here it does not match any courier you have used.',
      suspicious: true,
      why: 'A sender name is not proof of identity.',
    },
    body: [
      'Your parcel is on hold because of an ',
      {
        id: 'address',
        text: 'incomplete address',
        suspicious: true,
        inspect: 'You gave a complete address when you ordered. Nothing is missing.',
        why: 'Inventing a small problem is how these texts start a conversation.',
      },
      '. Pay Rs. 25 here: ',
      {
        id: 'link',
        text: 'parcel-redelivery.in-track.co/pay',
        suspicious: true,
        inspect: 'The address is not the courier’s own website. It borrows the courier’s name inside a longer address.',
        why: 'Look at the part just before the slash. That is the real website.',
      },
      '. Within 12 hours or the parcel returns.',
    ],
    isScam: true,
    verdict: 'Fake delivery fee',
    explanation:
      'A tiny fee is the bait; the card details you type are the prize. The deadline stops you from checking.',
    whatToDo: [
      'Do not open the link or pay.',
      'Track the parcel in the courier’s own app or website.',
      'Block and report the message.',
    ],
  },

  {
    id: 'i-new-number',
    level: 'scam',
    channel: 'whatsapp',
    app: 'WhatsApp',
    time: '9:47 PM',
    senderLabel: 'Unknown contact',
    sender: {
      id: 'sender',
      text: '+92 301 ••• 5802',
      inspect: 'Not saved in your contacts. A different number from the family member’s saved one.',
      suspicious: true,
      why: 'A “new number” is the standard opening for impersonation scams.',
    },
    body: [
      '“Hi, it’s your cousin Sana. ',
      {
        id: 'new',
        text: 'I changed my number yesterday',
        suspicious: true,
        inspect: 'You were never told about a new number by any other route.',
        why: 'A real change of number reaches you through the old number too, or in person.',
      },
      '. Please don’t call the old one, it’s switched off. ',
      {
        id: 'money',
        text: 'Can you send Rs. 85,000 today?',
        suspicious: true,
        inspect: 'A large amount, needed immediately, on a brand-new number.',
        why: 'Urgent money on a new number is the most common family-impersonation pattern.',
      },
      ' I’ll return it tomorrow, and ',
      {
        id: 'secret',
        text: 'please don’t tell anyone yet',
        suspicious: true,
        inspect: 'Being asked to keep it secret from the family.',
        why: 'Secrecy protects the scammer from the one check that would expose them.',
      },
      '.”',
    ],
    isScam: true,
    verdict: 'Family impersonation',
    explanation:
      'The story is engineered so you cannot check it: new number, old one off, urgent money, keep it quiet.',
    whatToDo: [
      'Call the saved number, or ask another family member.',
      'Do not send money.',
      'Block and report the number.',
    ],
  },

  {
    id: 'a-genuine-bank',
    level: 'scam',
    channel: 'sms',
    app: 'Messages',
    time: '7:40 PM',
    senderLabel: 'Business sender',
    sender: {
      id: 'sender',
      text: 'MYBANK',
      inspect: 'The short code matches the one printed on your statement.',
      suspicious: false,
      why: 'This sender matches the bank’s registered code.',
    },
    body: [
      'Rs. 2,000 was ',
      {
        id: 'credit',
        text: 'credited to your account ending 4411',
        suspicious: false,
        inspect: 'The last four digits match your own account.',
        why: 'It names your real account and matches your balance.',
      },
      ' on 28 Sep. It does not ask for a code, a PIN or a link.',
    ],
    isScam: false,
    verdict: 'Genuine notice',
    explanation:
      'A genuine bank alert states what happened to your account. It never asks you to do anything, and never includes a link to type details into.',
    whatToDo: [
      'Nothing to do. Check the balance in your own banking app if you want.',
      'Keep ignoring messages that ask for a PIN or OTP.',
    ],
  },
  {
    id: 'a-genuine-courier',
    level: 'scam',
    channel: 'sms',
    app: 'Messages',
    time: '10:15 AM',
    senderLabel: 'Business sender',
    sender: {
      id: 'sender',
      text: 'COURIER',
      inspect: 'Matches the sender you received earlier delivery messages from, and the tracking number matches your order.',
      suspicious: false,
      why: 'The sender and the tracking number both match what you already have.',
    },
    body: [
      'Your parcel ',
      {
        id: 'track',
        text: '#PK28841 will be delivered today between 2 PM and 6 PM',
        suspicious: false,
        inspect: 'This is the tracking number from your own order email.',
        why: 'It matches an order you actually placed.',
      },
      '. No payment or personal details are needed.',
    ],
    isScam: false,
    verdict: 'Genuine delivery update',
    explanation:
      'Genuine delivery updates carry your real tracking number and never require card details or a fee through a link.',
    whatToDo: [
      'Nothing to do. Be home to receive it.',
      'If a fee is ever demanded by link, stop and check in the courier’s app.',
    ],
  },
]

export const messagesByLevel = (level) => messages.filter((m) => m.level === level)
