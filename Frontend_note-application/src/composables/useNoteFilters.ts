import { ref, computed, type Ref } from 'vue'
import type { Note } from '../services/NoteService'
import {
  searchNotes,
  sortNotes,
  filterByDateRange,
  type SortBy,
  type SortOrder,
} from '../services/NoteFilterService'

export function useNoteFilters(notes: Ref<Note[]>) {
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

  function handleSearch(query: string) {
    searchQuery.value = query
  }

  function handleSort(by: SortBy, order: SortOrder) {
    sortBy.value = by
    sortOrder.value = order
  }

  function handleDateFilter(start: string, end: string) {
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
    searchQuery,
    sortBy,
    sortOrder,
    startDate,
    endDate,
    filteredAndSortedNotes,
    handleSearch,
    handleSort,
    handleDateFilter,
    clearFilters,
  }
}
