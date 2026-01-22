<script setup lang="ts">
import { onMounted } from 'vue'
import { useNoteStore } from '../stores/noteStore'
import NoteInput from '../components/dashboard/NoteInput.vue'
import NoteCard from '../components/dashboard/NoteCard.vue'
import NoteModal from '../components/dashboard/NoteView.vue'
import NoteFilters from '../components/dashboard/NoteFilters.vue'

const noteStore = useNoteStore()

onMounted(() => {
  noteStore.loadNotes()
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">My Notes</h1>
        <p class="text-slate-400">Manage your Notes</p>
      </div>

      <NoteInput @add-note="noteStore.addNote" />

      <NoteFilters
        @search="noteStore.setSearchQuery"
        @sort="noteStore.setSort"
        @filter-date="noteStore.setDateFilter"
        @clear-filters="noteStore.clearFilters"
      />

      <div v-if="noteStore.isLoading" class="text-center mt-20">
        <p class="text-slate-400">Loading notes...</p>
      </div>

      <div v-else-if="noteStore.filteredAndSortedNotes.length > 0" class="mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <NoteCard
            v-for="note in noteStore.filteredAndSortedNotes"
            :key="note.id"
            :note="note"
            @select="noteStore.selectNote"
            @deleted="noteStore.deleteNoteById"
          />
        </div>
      </div>

      <div v-else class="text-center mt-20">
        <p class="text-slate-500 text-lg">
          {{ noteStore.notes.length === 0 ? 'No notes yet' : 'No notes match your filters' }}
        </p>
        <p class="text-slate-600 text-sm mt-1">
          {{
            noteStore.notes.length === 0
              ? 'Click "Take a note..." to create your first note'
              : 'Try adjusting your search or filters'
          }}
        </p>
      </div>

      <NoteModal
        v-if="noteStore.selectedNote"
        :note="noteStore.selectedNote"
        @close="noteStore.closeNote"
        @updated="noteStore.updateNote"
      />
    </div>
  </div>
</template>
