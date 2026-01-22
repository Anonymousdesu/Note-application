import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { getNotes, type Note } from '../services/NoteService'
import {
  searchNotes,
  sortNotes,
  filterByDateRange,
  type SortBy,
  type SortOrder,
} from '../services/NoteFilterService'

export const useNoteStore = defineStore('notes', () => {
  const router = useRouter()

  const notes = ref<Note[]>([])
  const selectedNote = ref<Note | null>(null)
  const isLoading = ref(false)

  const searchQuery = ref('')
  const sortBy = ref<SortBy>('date')
  const sortOrder = ref<SortOrder>('desc')
  const startDate = ref('')
  const endDate = ref('')

  const filteredAndSortedNotes = computed(() => {
    let result = notes.value

    if (searchQuery.value) {
      result = searchNotes(result, searchQuery.value)
    }

    if (startDate.value || endDate.value) {
      result = filterByDateRange(result, startDate.value, endDate.value)
    }

    result = sortNotes(result, sortBy.value, sortOrder.value)

    return result
  })

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

  async function addNote() {
    await refreshNotes()
  }

  async function deleteNoteById(id: number) {
    await refreshNotes()
    if (selectedNote.value?.id === id) {
      selectedNote.value = null
    }
  }

  async function updateNote() {
    await refreshNotes()
    if (selectedNote.value) {
      selectedNote.value = notes.value.find(n => n.id === selectedNote.value?.id) || null
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setSort(by: SortBy, order: SortOrder) {
    sortBy.value = by
    sortOrder.value = order
  }

  function setDateFilter(start: string, end: string) {
    startDate.value = start
    endDate.value = end
  }

  function clearFilters() {
    searchQuery.value = ''
    sortBy.value = 'date'
    sortOrder.value = 'desc'
    startDate.value = ''
    endDate.value = ''
  }

  return {

    notes,
    selectedNote,
    isLoading,
    searchQuery,
    sortBy,
    sortOrder,
    startDate,
    endDate,

    filteredAndSortedNotes,

    loadNotes,
    refreshNotes,
    selectNote,
    closeNote,
    addNote,
    deleteNoteById,
    updateNote,
    setSearchQuery,
    setSort,
    setDateFilter,
    clearFilters,
  }
})
