import type { Note } from './NoteService'

export type SortBy = 'date' | 'title'
export type SortOrder = 'asc' | 'desc'

export function searchNotes(notes: Note[], query: string): Note[] {
  if (!query.trim()) return notes
  const lowerQuery = query.toLowerCase()
  return notes.filter(
    note =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
  )
}

export function sortNotes(notes: Note[], sortBy: SortBy, order: SortOrder): Note[] {
  const sorted = [...notes]

  if (sortBy === 'date') {
    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateA - dateB
    })
  } else if (sortBy === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title))
  }

  return order === 'desc' ? sorted.reverse() : sorted
}

export function filterByDateRange(notes: Note[], startDate?: string, endDate?: string): Note[] {
  return notes.filter(note => {
    const noteDate = new Date(note.createdAt)
    if (startDate && noteDate < new Date(startDate)) return false
    if (endDate && noteDate > new Date(endDate)) return false
    return true
  })
}
