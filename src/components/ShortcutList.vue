<template>
  <div v-if="loading" class="flex justify-center items-center h-64" aria-live="polite">
    <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
    <span class="sr-only">Loading shortcuts...</span>
  </div>
  <div v-else-if="error" class="text-red-500 text-center py-4" role="alert">
    {{ error }}
  </div>
  <section v-else aria-label="Shortcut list" class="printable">
    <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <li v-for="shortcut in filteredShortcuts" :key="shortcut.id"
          class="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105">

        <div class="absolute top-0 right-0 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-bl-lg">
          {{ shortcut.category }}
        </div>

        <div class="p-6">
          <div class="flex flex-wrap gap-2 mb-3">
            <span v-for="(key, index) in getShortcutKeys(shortcut)" :key="index"
                  class="inline-flex items-center justify-center bg-gray-100 rounded-md px-3 py-1.5 text-sm font-medium text-gray-800 border border-gray-300">
              {{ key }}
            </span>
          </div>
          <!-- <h2 class="text-lg font-semibold mb-3 text-gray-800">{{ shortcut.description }}</h2> -->
          <p class="text-sm font-semibold text-gray-600">{{ shortcut.description }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps(['shortcuts', 'selectedApp', 'searchQuery', 'loading', 'currentOS'])

const error = ref(null)

const getShortcutKeys = (shortcut) => {
  if (!shortcut || !shortcut[props.currentOS]) {
    error.value = `Invalid shortcut data for ${props.currentOS} OS`
    return []
  }
  return shortcut[props.currentOS].split('+')
}

const filteredShortcuts = computed(() => {
  error.value = null
  return props.shortcuts.filter(shortcut => {
    try {
      const osKeys = shortcut[props.currentOS]
      if (!osKeys) {
        console.warn(`Missing ${props.currentOS} keys for shortcut:`, shortcut)
        return false
      }
      return osKeys.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
          shortcut.description.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
          shortcut.category.toLowerCase().includes(props.searchQuery.toLowerCase())
    } catch (err) {
      console.error('Error processing shortcut:', shortcut, err)
      return false
    }
  })
})
</script>

<style scoped>
.printable {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>