<script setup lang="ts">
import { ref } from 'vue'
import { createNote, type Note } from '../../services/NoteService'

const emit = defineEmits<{
  addNote: [note: Note]
}>()

const isExpanded = ref(false)
const newTitle = ref('')
const newContent = ref('')

function expandInput() {
  isExpanded.value = true
}

async function handleAdd() {
  if (!newTitle.value.trim()) return

  const newNote = await createNote({ title: newTitle.value, content: newContent.value })

  emit('addNote', newNote)
  newTitle.value = ''
  newContent.value = ''
  isExpanded.value = false
}

function closeInput() {
  isExpanded.value = false
  newTitle.value = ''
  newContent.value = ''
}
</script>

<template>
  <div class="mb-10 flex justify-center">
    <div class="w-full max-w-3xl">
      <div
        v-if="!isExpanded"
        @click="expandInput"
        class="bg-slate-800 border border-slate-700 rounded-full px-6 py-4 cursor-text hover:bg-slate-750 hover:border-slate-600 transition-all shadow-lg">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span class="text-slate-400">Take a note...</span>
        </div>
      </div>

      <div
        v-else
        class="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 transition-all">
        <input
          v-model="newTitle"
          type="text"
          placeholder="Title"
          class="w-full mb-4 text-xl font-semibold bg-transparent text-white placeholder-slate-500 outline-none"
          autofocus/>

        <textarea
          v-model="newContent"
          placeholder="Take a note..."
          rows="4"
          class="w-full bg-transparent text-slate-300 placeholder-slate-500 outline-none resize-none">
        </textarea>

        <div class="flex justify-end gap-3 mt-4">
          <button
            @click="closeInput"
            class="px-5 py-2 text-slate-400 hover:bg-slate-700 rounded-lg transition">
            Cancel
          </button>

          <button
            @click="handleAdd"
            class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Save
          </button>

        </div>
      </div>
    </div>
  </div>
</template>
