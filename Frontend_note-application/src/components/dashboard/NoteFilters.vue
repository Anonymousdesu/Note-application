<script setup lang="ts">
import { ref } from 'vue'
import type { SortBy, SortOrder } from '../../services/NoteFilterService'

const emit = defineEmits<{
  search: [query: string]
  sort: [sortBy: SortBy, order: SortOrder]
  filterDate: [startDate: string, endDate: string]
  clearFilters: []
}>()

const searchQuery = ref('')
const sortBy = ref<SortBy>('date')
const sortOrder = ref<SortOrder>('desc')
const startDate = ref('')
const endDate = ref('')
const showFilters = ref(false)

function handleSearch() {
  emit('search', searchQuery.value)
}

function handleSort() {
  emit('sort', sortBy.value, sortOrder.value)
}

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  handleSort()
}

function handleDateFilter() {
  emit('filterDate', startDate.value, endDate.value)
}

function clearAllFilters() {
  searchQuery.value = ''
  sortBy.value = 'date'
  sortOrder.value = 'desc'
  startDate.value = ''
  endDate.value = ''
  emit('clearFilters')
}
</script>

<template>
  <div class="mb-6 space-y-4">
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Search notes by title or content..."
        class="w-full p-3 pl-10 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
      />
      <svg
        class="absolute left-3 top-3.5 w-5 h-5 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <div class="flex flex-wrap gap-3 items-center">
      <select
        v-model="sortBy"
        @change="handleSort"
        class="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
      >
        <option value="date">Sort by Date</option>
        <option value="title">Sort by Title</option>
      </select>
      <button
        @click="toggleSortOrder"
        class="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="sortOrder === 'asc'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
          />
        </svg>
        {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
      </button>
      <button
        @click="showFilters = !showFilters"
        class="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-slate-700 transition"
      >
        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      </button>
      <button
        @click="clearAllFilters"
        class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
      >
        Clear All
      </button>
    </div>
    <div v-if="showFilters" class="p-4 bg-slate-800 rounded-lg border border-slate-700">
      <h3 class="text-white font-semibold mb-3">Filter by Date Range</h3>
      <div class="flex flex-wrap gap-3">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-slate-400 text-sm mb-1">Start Date</label>
          <input
            v-model="startDate"
            @change="handleDateFilter"
            type="date"
            class="w-full p-2 bg-slate-900 text-white rounded border border-slate-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="block text-slate-400 text-sm mb-1">End Date</label>
          <input
            v-model="endDate"
            @change="handleDateFilter"
            type="date"
            class="w-full p-2 bg-slate-900 text-white rounded border border-slate-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  </div>
</template>
