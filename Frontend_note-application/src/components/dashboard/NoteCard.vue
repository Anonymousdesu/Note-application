<script setup lang="ts">
import { ref } from 'vue'
import { deleteNote, type Note } from '../../services/NoteService'
import DeleteConfirmation from '../pop_up/DeleteConfirmation.vue'

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  select: [note: Note]
  deleted: [id: number]
}>()

const showDeleteConfirm = ref(false)

function handleClick() {
  emit('select', props.note)
}

function showDeleteDialog(event: Event) {
  event.stopPropagation()
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  try {
    await deleteNote(props.note.id)
    emit('deleted', props.note.id)
    showDeleteConfirm.value = false
  } catch (error: unknown) {
    console.error('Failed to delete note:', error)
    alert('Failed to delete note')
  }
}

function cancelDelete() {
  showDeleteConfirm.value = false
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div
    @click="handleClick"
    class="bg-slate-800 border border-slate-700 rounded-xl p-5 cursor-pointer hover:bg-slate-750 hover:border-slate-600 hover:shadow-xl transition-all group relative"
  >
    <button
      @click="showDeleteDialog"
      class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-400"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <h3
      class="font-semibold text-white mb-2 text-lg group-hover:text-blue-400 transition pr-8 truncate"
      style="max-width: 90%;"
    >
      {{ note.title }}
    </h3>

    <p class="text-slate-400 text-sm mb-3 line-clamp-3 break-words">
      {{ note.content || 'No content' }}
    </p>

    <p class="text-xs text-slate-500">{{ formatDate(note.createdAt) }}</p>
  </div>

  <DeleteConfirmation
    v-if="showDeleteConfirm"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
