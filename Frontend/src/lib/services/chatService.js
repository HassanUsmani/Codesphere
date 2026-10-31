
const API_URL = 'http://127.0.0.1:8000/api/chat'

export async function sendMessage(message, history = []) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        history
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.detail || 'The assistant could not reply.'
      )
    }

    return {
      text: data.text,
      label: data.label
    }

  } catch (error) {
    console.error('Chatbot API error:', error)
    throw error
  }
}
