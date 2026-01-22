import { apiClient } from '../api/axiosConfig'

export interface NotePayload {
  title: string
  content: string
}

export interface Note {
  id: number
  title: string
  content: string
  userId: number
  createdAt: string
  updatedAt: string
}
interface BackendNote {
  noteId: number
  title: string
  content: string
  userId: number
  createdAt: string
  updatedAt: string
}

function convertNote(noteFromBackend: BackendNote): Note {
  return {
    id: noteFromBackend.noteId,
    title: noteFromBackend.title,
    content: noteFromBackend.content,
    userId: noteFromBackend.userId,
    createdAt: noteFromBackend.createdAt,
    updatedAt: noteFromBackend.updatedAt,
  }
}
export async function createNote(note: NotePayload): Promise<Note> {
  const response = await apiClient.post('/api/Notes/CreateNote', note)
  return convertNote(response.data)
}

export async function getNotes(): Promise<Note[]> {
  const response = await apiClient.get('/api/Notes/GetNotes')
  return response.data.map(convertNote)
}

export async function updateNote(id: number, note: Partial<NotePayload>): Promise<Note> {
  const response = await apiClient.put(`/api/Notes/UpdateNote/${id}`, note)
  return convertNote(response.data)
}

export async function deleteNote(id: number): Promise<void> {
  await apiClient.delete(`/api/Notes/DeleteNote/${id}`)
}
