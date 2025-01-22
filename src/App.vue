<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar :apps="apps" :selectedApp="selectedApp" @select-app="selectApp" @reorder-apps="reorderApps" />
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <div class="absolute top-0 left-0 right-0 h-8 z-20 flex items-center justify-center"
           @mouseenter="showDropdownIcon = true" @mouseleave="showDropdownIcon = false">
        <div v-if="showDropdownIcon"
             class=" bg-opacity-50 rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110"
             @click="toggleWelcomeOverlay">
          <svg xmlns="http://www.w3.org/2000/svg"
               class="h-6 w-10 text-gray-600 hover:text-gray-800 transition-colors duration-200" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <header class="bg-white shadow-sm z-10">
        <div class="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
          <input v-model="searchQuery" type="text" placeholder="Search shortcuts..."
                 class="flex-grow px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 aria-label="Search shortcuts" />
        </div>
      </header>
      <main class="flex-1 overflow-y-auto bg-gray-200 scrollbar-hide">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <div v-if="selectedApp" class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold">{{ selectedApp.chineseName ? selectedApp.chineseName :selectedApp.name }} Shortcuts</h1>
            <div class="flex items-center space-x-3">
              <button @click="toggleOS" :class="[
                  'p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200',
                  //currentOS === 'Windows' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  currentOS === 'Windows' ? 'bg-blue-200 text-white' : 'bg-blue-200 text-white'
                ]" :aria-label="currentOS === 'Windows' ? 'Switch to Mac' : 'Switch to Windows'">
                <!-- <img :src="currentOS === 'Windows' ? 'assets/svg/windows.svg' : 'assets/svg/mac.svg'" alt=""
                class="w-6 h-6" /> -->
                <svg class="w-6 h-6 os-icon" aria-hidden="true">
                  <use :xlink:href="currentOS === 'Windows' ? '#icon-windows' : '#icon-mac'"></use>
                </svg>
              </button>
              <!-- <span class="text-sm font-medium text-gray-700">{{ currentOS }}</span> -->
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-xl text-gray-600">Please select an application from the sidebar.</p>
          </div>
          <ShortcutList v-if="selectedApp" :shortcuts="shortcuts" :selectedApp="selectedApp" :searchQuery="searchQuery"
                        :loading="loading" :currentOS="currentOS" />
        </div>
      </main>
    </div>
    <WelcomeOverlay :show="showWelcomeOverlay" :apps="apps" @select-app="selectApp" @hide="showWelcomeOverlay = false" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useHead } from '@vueuse/head'
import Sidebar from './components/Sidebar.vue'
import ShortcutList from './components/ShortcutList.vue'
import WelcomeOverlay from './components/WelcomeOverlay.vue'
import './assets/icons/iconfont.js'

const defaultApps = [
  { id: 1, name: 'windows', icon: 'icon-windows' },
  { id: 2, name: 'mac', icon: 'icon-mac' },
  { id: 3, name: 'word', icon: 'icon-word' },
  { id: 4, name: 'PPT', icon: 'icon-ppt' },
  { id: 5, name: 'EXCEL', icon: 'icon-Excel' },
  { id: 6, name: 'VS Code', icon: 'icon-vscode' },
  { id: 7, name: 'Idea', icon: 'icon-idea' },
  { id: 8, name: 'Sublime Text', icon: 'icon-Sublime' },
  { id: 9, name: 'Typora', icon: 'icon-Typora' },
  { id: 10, name: 'Edge', icon: 'icon-Edge' },
  { id: 11, name: 'Chrome', icon: 'icon-Chrome' },
  { id: 12, name: 'Firefox', icon: 'icon-Firefox' },
  { id: 13, name: 'Safari', icon: 'icon-safari' },
  { id: 14, name: 'ComfyUI', icon: 'icon-ComfyUI' },
  { id: 15, name: 'PotPlayer', icon: 'icon-PotPlayer' },
  { id: 16, name: 'drawio', icon: 'icon-drawio' },
  { id: 17, name: 'xmind', icon: 'icon-xmind' },
  { id: 18, name: 'capcut',chineseName:'剪映', icon: 'icon-capcut' },
  { id: 19, name: 'AutoCAD', icon: 'icon-AutoCAD' },
  { id: 20, name: 'Adobe Ps', icon: 'icon-AdobePs' },
  // { id: 21, name: 'Adobe Ai', icon: 'icon-AdobeAi' },
  // { id: 22, name: 'Adobe Ae', icon: 'icon-AdobeAe' },
]

const apps = ref([])
const selectedApp = ref(null)
const searchQuery = ref('')
const shortcuts = ref([])
const loading = ref(false)
const currentOS = ref(localStorage.getItem('preferredOS') || 'Windows')
const showWelcomeOverlay = ref(false)
const showDropdownIcon = ref(false)

const pageTitle = computed(() => `${selectedApp.value?.name || 'App'} 快捷键 (${currentOS.value}) - Shortcut Organizer`)
const pageDescription = computed(() => `Explore and learn ${selectedApp.value?.name || 'app'} 快捷键/shortcuts for ${currentOS.value}. Boost your productivity with our comprehensive shortcut guide.`)

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
  ],
})

const getShortcuts = async (appName) => {
  if (!appName) {
    console.warn('No app name provided to getShortcuts')
    return []
  }

  loading.value = true
  try {
    const module = await import(`./data/${appName.toLowerCase().replace(' ', '')}.js`)
    const shortcutsData = module.default || module[`${appName.toLowerCase().replace(' ', '')}Shortcuts`]
    return shortcutsData.map(shortcut => ({
      ...shortcut,
      Windows: shortcut.Windows || shortcut.key,
      Mac: shortcut.Mac || shortcut.key
    }))
  } catch (error) {
    console.error(`Failed to load shortcuts for ${appName}:`, error)
    return []
  } finally {
    loading.value = false
  }
}

const selectApp = async (app) => {
  if (!app) {
    console.warn('Attempted to select a null or undefined app')
    return
  }
  selectedApp.value = app
  shortcuts.value = await getShortcuts(app.name)
}

const toggleOS = () => {
  currentOS.value = currentOS.value === 'Windows' ? 'Mac' : 'Windows'
  localStorage.setItem('preferredOS', currentOS.value)
}

const reorderApps = (newOrder) => {
  // Filter out any apps that are not in the default list
  const filteredOrder = newOrder.filter(app => defaultApps.some(defaultApp => defaultApp.id === app.id))
  apps.value = filteredOrder
  // Save only the IDs of the apps
  localStorage.setItem('appOrder', JSON.stringify(filteredOrder.map(app => app.id)))
}

const loadApps = () => {
  const savedAppIds = JSON.parse(localStorage.getItem('appOrder') || '[]')

  // Filter out any saved app IDs that are not in the default list
  const filteredAppIds = savedAppIds.filter(id =>
      defaultApps.some(defaultApp => defaultApp.id === id)
  )

  // Create a new array of apps based on the filtered IDs
  const loadedApps = filteredAppIds.map(id => defaultApps.find(app => app.id === id))

  // Add any default apps that are not in the loaded apps
  defaultApps.forEach(defaultApp => {
    if (!loadedApps.some(app => app.id === defaultApp.id)) {
      loadedApps.push(defaultApp)
    }
  })

  apps.value = loadedApps

  if (apps.value.length > 0) {
    selectApp(apps.value[0])
  }
}

const toggleWelcomeOverlay = () => {
  showWelcomeOverlay.value = !showWelcomeOverlay.value
}

onMounted(() => {
  loadApps()
  const welcomeShown = localStorage.getItem('welcomeShown')
  if (!welcomeShown) {
    showWelcomeOverlay.value = true
    localStorage.setItem('welcomeShown', 'true')
  }
})

watch(selectedApp, (newApp) => {
  if (newApp) {
    selectApp(newApp)
  } else {
    shortcuts.value = []
  }
})
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.os-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

@media print {
  body * {
    visibility: hidden;
  }

  .printable,
  .printable * {
    visibility: visible;
  }

  .printable {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>