/* Tech Guide Assistant — placeholder service.
   This is the only boundary the chat UI talks to. When a real assistant is
   available, replace the placeholder below with that request; the widget does
   not need to change. No endpoint is invented here and nothing leaves the page. */

const REPLY_DELAY = 650

function buildReply(message) {
  const text = message.toLowerCase()
  let pointer =
    'You can read any module on the home page and open its guided practice from the “Practise this module” strip.'

  if (text.includes('whatsapp') || text.includes('message')) {
    pointer =
      'The WhatsApp module covers new-number scams, code requests and fake job offers. Try the photo and new-number missions from that section.'
  } else if (text.includes('bank') || text.includes('pay') || text.includes('pin') || text.includes('cash')) {
    pointer =
      'The Banking module covers PIN, OTP and fake-bank-call patterns. The Safety check turns a worrying message into four steps.'
  } else if (text.includes('ride') || text.includes('car') || text.includes('driver') || text.includes('travel')) {
    pointer =
      'The Ride-Hailing module covers cancel-and-pay-directly calls and plate checks. The ride booking mission walks through the app.'
  } else if (text.includes('food') || text.includes('order') || text.includes('delivery') || text.includes('parcel')) {
    pointer =
      'The foodpanda and Fraud Detection modules cover advance-payment, refund-link and fake delivery tricks.'
  } else if (text.includes('scam') || text.includes('fraud') || text.includes('safe')) {
    pointer =
      'Start with the red-flag checklist in each module, then try the Scam Simulator or build a plan in the Safety check.'
  }

  return `This is a placeholder reply — no live assistant is connected yet. ${pointer}`
}

/**
 * Send a message to the Tech Guide Assistant.
 *
 * @param {string} message - the text the visitor typed.
 * @param {Array<{role: 'user'|'assistant', text: string}>} history - earlier turns.
 * @returns {Promise<{text: string, label: string}>} reply text plus a visible label.
 *
 * TODO: replace the placeholder below with the real assistant request, e.g.
 *   const response = await fetch('/api/chat', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ message, history }),
 *   })
 *   if (!response.ok) throw new Error('The assistant could not reply.')
 *   return response.json()
 * Do not point this at the Backend project until an endpoint exists and is agreed.
 */
export async function sendMessage(message, history = []) {
  const text = String(message ?? '').trim()
  if (!text) throw new Error('Please type a message first.')

  await new Promise((resolve) => setTimeout(resolve, REPLY_DELAY))
  void history

  return { text: buildReply(text), label: 'Demo reply' }
}
