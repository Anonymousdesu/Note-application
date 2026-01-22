import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { getNotes, type Note } from '../services/NoteService'

export function useNotes() {
  const router = useRouter()
  const notes = ref<Note[]>([])
  const selectedNote = ref<Note | null>(null)
  const isLoading = ref(false)

  async function loadNotes() {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
      return
    }

    isLoading.value = true
    try {
      notes.value = await getNotes()
    } catch (error: unknown) {
      console.error('Failed to load notes:', error)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      }
    } finally {
      isLoading.value = false
    }
  }

  async function refreshNotes() {
    try {
      notes.value = await getNotes()
    } catch (error: unknown) {
      console.error('Failed to refresh notes:', error)
    }
  }

  function selectNote(note: Note) {
    selectedNote.value = note
  }

  function closeNote() {
    selectedNote.value = null
  }

  async function handleNoteAdded() {
    await refreshNotes()
  }

  async function handleNoteDeleted(id: number) {
    await refreshNotes()
    if (selectedNote.value?.id === id) {
      selectedNote.value = null
    }
  }

  async function handleNoteUpdated() {
    await refreshNotes()
    if (selectedNote.value) {
      selectedNote.value = notes.value.find(n => n.id === selectedNote.value?.id) || null
    }
  }

  return {
    notes,
    selectedNote,
    isLoading,
    loadNotes,
    refreshNotes,
    selectNote,
    closeNote,
    handleNoteAdded,
    handleNoteDeleted,
    handleNoteUpdated,
  }
}
