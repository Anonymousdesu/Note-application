<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { login } from '../services/AuthService'

const router = useRouter()
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''

  isLoading.value = true

  try {
    const response = await login({ UserName: username.value, Password: password.value })
    const token = response.data?.token
    if (token) {
      localStorage.setItem('token', token)
      router.push('/dashboard')
    } else {
      errorMessage.value = 'Login failed. No token received.'
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || 'Login failed.'
    } else {
      errorMessage.value = 'Login failed.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
      <h2 class="text-3xl font-bold text-white mb-6 text-center">Login</h2>

      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm"
      >
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-slate-300 mb-2">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            class="w-full p-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
            :disabled="isLoading"
          />
        </div>

        <div>
          <label class="block text-slate-300 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full p-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
            :disabled="isLoading"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="text-slate-400 text-center mt-4">
        Don't have an account?
        <button
          type="button"
          @click="router.push('/Signup')"
          class="text-blue-400 hover:text-blue-300"
        >
          Signup
        </button>
      </p>
    </div>
  </div>
</template>
