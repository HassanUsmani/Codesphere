<template>
  <main class="container">
    <h1>Codesphere Connection Test</h1>
    
    <!-- The Trigger Button -->
    <button @click="fetchBackendData" :disabled="loading">
      {{ loading ? 'Calling API...' : 'Ping Backend API' }}
    </button>

    <!-- Visual Feedback States -->
    <div v-if="responseMessage" class="box success">
      <h3>Response from Server:</h3>
      <pre>{{ responseMessage }}</pre>
    </div>

    <div v-if="errorMessage" class="box error">
      <h3>Error connecting:</h3>
      <p>{{ errorMessage }}</p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

// Reactive state variables
const responseMessage = ref(null)
const errorMessage = ref(null)
const loading = ref(false)

// Function to call the API
async function fetchBackendData() {
  loading.value = true
  responseMessage.value = null
  errorMessage.value = null

  try {
    const response = await fetch('http://localhost:8000/')
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`)
    }
    const data = await response.json()
    responseMessage.value = data
  } catch (error) {
    console.error("API Error:", error)
    errorMessage.value = error.message || "Failed to reach the backend server."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  font-family: sans-serif;
  max-width: 500px;
  margin: 50px auto;
  text-align: center;
}

button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #42b883; /* Vue Green */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.box {
  margin-top: 25px;
  padding: 15px;
  border-radius: 6px;
  text-align: left;
}

.success {
  background-color: #ecfdf5;
  border: 1px solid #10b981;
  color: #065f46;
}

.error {
  background-color: #fef2f2;
  border: 1px solid #ef4444;
  color: #991b1b;
}

pre {
  background: #f3f4f6;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
