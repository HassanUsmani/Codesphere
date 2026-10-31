/* Rule-based safety plans. Everything stays on the device — no network. */

export const phases = [
  { id: 'stop', label: 'Stop', hint: 'Don’t click, reply or pay.' },
  { id: 'check', label: 'Check', hint: 'Look at the sender, message and link.' },
  { id: 'verify', label: 'Verify', hint: 'Confirm through an official source.' },
  { id: 'act', label: 'Act', hint: 'Block, report, delete.' },
]

export const scenarios = [
  {
    id: 'prize',
    chip: 'I “won” a prize',
    title: 'A prize, lottery or giveaway message',
    summary: 'Prizes you never entered are bait. The “fee” or the link is the scam.',
    keywords: ['prize', 'lottery', 'won', 'winner', 'claim', 'lucky draw', 'giveaway', 'reward', 'fee'],
    steps: {
      stop: [
        'Don’t tap the link and don’t reply.',
        'Don’t pay any processing or delivery fee.',
      ],
      check: [
        'Did you actually enter this draw? If not, you cannot have won.',
        'Is the sender an unknown number or an unofficial account?',
      ],
      verify: ['Open the company’s own website or app and look for the offer there.'],
      act: ['Delete the message.', 'Block and report the sender.', 'Warn family if it arrived in a group.'],
    },
    related: { label: 'Practise in the Scam Simulator', route: 'scam', params: { level: 'scam' } },
  },
  {
    id: 'otp',
    chip: 'Someone wants my OTP',
    title: 'Someone is asking for an OTP or PIN',
    summary: 'An OTP is the key to your account. Whoever asks for it wants in.',
    keywords: ['otp', 'pin', 'code', 'cvv', 'password', 'verification code', 'share code'],
    steps: {
      stop: ['Don’t read out or forward the code, even to “bank staff”.'],
      check: [
        'Read the OTP message: it almost always says do not share.',
        'Did you start this login or payment yourself? If not, someone else did.',
      ],
      verify: ['Call the number printed on your card or in the app, never the number in the message.'],
      act: ['Change that account’s password.', 'Block and report whoever asked.'],
    },
    related: { label: 'Walk through “Secure your phone”', route: 'simulator', params: { mission: 'settings-safety' } },
  },
  {
    id: 'new-number',
    chip: '“I changed my number”, needs money',
    title: 'A “new number” asking for money',
    summary: 'Scammers pretend to be family on a new number, then need money urgently.',
    keywords: ['changed my number', 'new number', 'changed number', 'send money', 'urgent money', 'cousin', 'nephew', 'uncle', 'aunty', 'friend'],
    steps: {
      stop: ['Don’t send money and don’t reply yet.'],
      check: [
        'Is the number saved in your phone?',
        'Is the story urgent, or secret, or both?',
      ],
      verify: [
        'Call the person on their old, saved number.',
        'Or ask something only the real person would know.',
        'Check with another family member.',
      ],
      act: ['If it is not them, block and report the number.', 'Tell the family so nobody else pays.'],
    },
    related: { label: 'Try the “Hi, I changed my number” mission', route: 'simulator', params: { mission: 'whatsapp-new-number' } },
  },
  {
    id: 'bank-call',
    chip: 'My “bank” called about KYC',
    title: 'A call claiming to be your bank',
    summary: 'Pressure, a deadline and a request for a code — the standard script.',
    keywords: ['bank', 'kyc', 'account blocked', 'card blocked', 'head office', 'customer care called'],
    steps: {
      stop: ['Hang up. Don’t share a code or a PIN.'],
      check: ['Did the caller give any detail you can actually check?', 'Is there a deadline of “today”?'],
      verify: ['Call the number on the back of your card, or open the bank’s own app.'],
      act: ['Report the call.', 'Block the number.', 'Check your account in the app.'],
    },
    related: { label: 'See the fake bank call in the Scam Simulator', route: 'scam', params: { level: 'scam' } },
  },
  {
    id: 'police',
    chip: '“Police” say I’m under arrest',
    title: 'A call threatening arrest',
    summary: 'Real police do not demand money over a call or hold you on video.',
    keywords: ['police', 'arrest', 'fir', 'case filed', 'court', 'legal action', 'cbi', 'fia'],
    steps: {
      stop: ['Don’t pay anything and don’t stay on a video call.'],
      check: ['Are you being told to keep it secret?', 'Are they asking for money, gift cards or a transfer?'],
      verify: ['Visit the nearest police station in person, or call the official helpline.'],
      act: ['Save the number and report it.', 'Tell a family member straight away.'],
    },
    related: { label: 'Get a plan for another situation', route: 'safety', params: {} },
  },
  {
    id: 'parcel',
    chip: 'Parcel text with a link',
    title: 'A delivery message with a payment link',
    summary: 'The tiny fee is bait. The card details are the target.',
    keywords: ['parcel', 'delivery', 'courier', 'redelivery', 'tracking', 'shipment', 'package'],
    steps: {
      stop: ['Don’t open the link and don’t pay.'],
      check: [
        'Read the address before typing: the real website is the part just before the first slash.',
        'Do you even have a parcel on the way?',
      ],
      verify: ['Track it inside the courier’s own app, from an order you placed yourself.'],
      act: ['Block and report the message.', 'Delete it.'],
    },
    related: { label: 'Try the fake delivery mission', route: 'simulator', params: { mission: 'sms-delivery-link' } },
  },
  {
    id: 'hacked',
    chip: 'My account was hacked',
    title: 'An account has been taken over',
    summary: 'Act quickly, but only through the service’s own recovery route.',
    keywords: ['hacked', 'account taken', 'someone logged in', 'password changed', 'locked out'],
    urgent: true,
    steps: {
      stop: ['Don’t pay anyone who offers to “recover” the account for a fee.'],
      check: ['Which account exactly, and what still works?', 'Did you reuse that password anywhere else?'],
      verify: ['Use the app’s own “forgot password” or support page, typed by you.'],
      act: [
        'Change the password and sign out other devices.',
        'Turn on two-step verification.',
        'Tell contacts that messages from the account may be fake.',
      ],
    },
    related: { label: 'Ask about protecting accounts', route: 'safety', params: {} },
  },
  {
    id: 'sent-money',
    chip: 'I already sent money',
    title: 'Money has already gone',
    summary: 'Speed matters. Report through official channels, not through the scammer.',
    keywords: ['sent money', 'transferred', 'paid already', 'lost money', 'debited'],
    urgent: true,
    steps: {
      stop: ['Stop all contact with the sender. Don’t pay a “reversal fee”.'],
      check: ['Keep the receipt, the number and every message.'],
      verify: ['Call your bank’s official helpline and ask them to flag the transfer.'],
      act: [
        'Report it to the cyber crime helpline the same day.',
        'Change any password or PIN you shared.',
        'Tell family so they can watch for the same approach.',
      ],
    },
    related: { label: 'Practise spotting the signs', route: 'scam', params: { level: 'scam' } },
  },
  {
    id: 'family-voice',
    chip: 'A “family” call sounded real',
    title: 'A voice call that sounded like family',
    summary: 'Voices can be copied. Agree on an in-family check phrase.',
    keywords: ['voice', 'sounded like', 'call sounded', 'deepfake', 'recording', 'grandson called'],
    steps: {
      stop: ['Don’t send money because a voice sounded right.'],
      check: ['Did they avoid questions only the real person could answer?', 'Were you told not to tell anyone?'],
      verify: ['Hang up and call the person back on their saved number.'],
      act: ['Agree a family check phrase for money requests.', 'Report the call.'],
    },
    related: { label: 'See the family impersonation example', route: 'scam', params: { level: 'scam' } },
  },
]

export const helpline = {
  number: '1930',
  note: 'Pakistan’s cyber crime helpline for financial fraud. The sooner you call, the better chance of a freeze.',
  portal: 'https://complaint.fia.gov.pk',
  portalLabel: 'complaint.fia.gov.pk',
}

export function planFor(text) {
  const value = text.toLowerCase()
  const scored = scenarios
    .map((scenario) => ({
      scenario,
      score: scenario.keywords.reduce((total, word) => (value.includes(word) ? total + word.length : total), 0),
    }))
    .sort((a, b) => b.score - a.score)

  return scored[0].score > 0 ? scored[0].scenario : null
}

export const fallbackPlan = {
  id: 'general',
  title: 'A general plan for anything that feels wrong',
  summary: 'When the situation is unclear, these four steps still hold.',
  steps: {
    stop: ['Pause. Don’t click, reply or pay until you have checked.'],
    check: ['Write down who contacted you, what they want, and how they want it.'],
    verify: ['Contact the organisation using a number or app you already have.'],
    act: ['Block, report and tell someone you trust.'],
  },
}
