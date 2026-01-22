<script setup lang="ts">
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700">
      <h2 class="text-xl font-bold text-white mb-4">Delete Note?</h2>
      <p class="text-slate-300 mb-6">
        Are you sure you want to delete this note? This action cannot be undone.
      </p>
      <div class="flex gap-3 justify-end">
        <button
          @click="emit('cancel')"
          class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
        >
          No, Keep It
        </button>
        <button
          @click="emit('confirm')"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
