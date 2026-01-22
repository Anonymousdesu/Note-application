<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signup } from '../services/AuthService'
import axios from 'axios'

const showPassword = ref(false)
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

async function handleSignup(e: Event) {
  e.preventDefault()
  error.value = ''
  success.value = ''
  try {
    await signup({ UserName: username.value, Password: password.value })
    success.value = 'Account created successfully! Redirecting to login...'
    setTimeout(() => {
      router.push('/Login')
    }, 1500)
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || 'Signup failed'
    } else {
      error.value = 'Signup failed'
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6 bg-slate-900">
    <div
      class="w-full max-w-xl border border-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row bg-slate-800"
    >
      <div class="w-full p-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-white">Create Account</h1>
        </div>

        <div
          v-if="error"
          class="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm"
        >
          {{ error }}
        </div>

        <div
          v-if="success"
          class="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm"
        >
          {{ success }}
        </div>

        <form class="space-y-6" @submit="handleSignup">
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            class="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="w-full px-4 py-2 rounded-lg bg-slate-900 text-white border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-300 focus:outline-none pr-10"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              tabindex="-1"
            >
              <span v-if="showPassword">hide</span>
              <span v-else>show</span>
            </button>
          </div>

          <button
            type="submit"
            class="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Create Account
          </button>

          <div class="text-center text-slate-400">
            Already have an account?
            <button
              type="button"
              @click="router.push('/Login')"
              class="text-blue-400 hover:text-blue-300"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
