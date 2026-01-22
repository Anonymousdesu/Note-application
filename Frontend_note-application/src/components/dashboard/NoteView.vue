<script setup lang="ts">
import { ref, watch } from 'vue'
import { updateNote, type Note } from '../../services/NoteService'

const props = defineProps<{
  note: Note | null
}>()

const emit = defineEmits<{
  close: []
  updated: [note: Note]
}>()

const isEditingTitle = ref(false)
const isEditingContent = ref(false)
const editTitle = ref('')
const editContent = ref('')

watch(
  () => props.note,
  (newNote) => {
    if (newNote) {
      editTitle.value = newNote.title
      editContent.value = newNote.content
    }
  },
  { immediate: true },
)

function startEditTitle() {
  isEditingTitle.value = true
}

function startEditContent() {
  isEditingContent.value = true
}

async function saveTitle() {
  if (!props.note || !editTitle.value.trim()) return
  try {
    const updated = await updateNote(props.note.id, {
      title: editTitle.value,
      content: editContent.value
    })
    emit('updated', updated)
    isEditingTitle.value = false
  } catch (error) {
    console.error('Failed to update note:', error)
  }
}

async function saveContent() {
  if (props.note) {
    try {
      const updated = await updateNote(props.note.id, {
        title: editTitle.value,
        content: editContent.value
      })
      emit('updated', updated)
    } catch (error) {
      console.error('Failed to update note:', error)
    }
  }
  isEditingContent.value = false
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString()
}
</script>

<template>
  <div
    v-if="note"
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
    @click="emit('close')"
  >
    <div
      @click.stop
      class="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-2xl w-full overflow-x-hidden"
    >
      <div class="flex justify-between items-start mb-6">
        <div v-if="!isEditingTitle" @click="startEditTitle" class="flex-1 cursor-text">
          <h2 class="text-3xl font-bold text-white hover:text-blue-400 transition break-words break-all">
            {{ editTitle }}
          </h2>
        </div>
        <div v-else @click.stop class="flex-1">
          <input
            v-model="editTitle"
            @blur="saveTitle"
            @keyup.enter="saveTitle"
            @keyup.esc="isEditingTitle = false"
            class="w-full text-3xl font-bold bg-slate-700 text-white px-2 py-1 rounded outline-none focus:ring-2 focus:ring-blue-500 break-words break-all"
            autofocus
          />
        </div>

        <button
          @click="emit('close')"
          class="text-slate-400 hover:text-white text-3xl transition ml-4"
        >
          &times;
        </button>
      </div>

      <div v-if="!isEditingContent" @click="startEditContent" class="cursor-text mb-6">
        <p
          class="text-slate-300 whitespace-pre-wrap leading-relaxed hover:text-white transition break-words break-all"
        >
          {{ editContent || 'No content available. Click to add.' }}
        </p>
      </div>
      <div v-else @click.stop class="mb-6">
        <textarea
          v-model="editContent"
          @blur="saveContent"
          @keyup.esc="isEditingContent = false"
          rows="6"
          class="w-full bg-slate-700 text-slate-300 px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500 resize-none break-words break-all"
          autofocus
        >
        </textarea>
      </div>

      <div class="border-t border-slate-700 pt-4 flex justify-between text-sm text-slate-500">
        <div><strong class="text-slate-400">Created:</strong> {{ formatDate(note.createdAt) }}</div>
        <div><strong class="text-slate-400">Updated:</strong> {{ formatDate(note.updatedAt) }}</div>
      </div>
    </div>
  </div>
</template>
