<template>
  <div class="fixed inset-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden"
       :class="{ 'pointer-events-none': !show }" :style="{ opacity: show ? 1 : 0 }">
    <div class="container mx-auto px-4 py-8 h-full flex flex-col">
      <h2 class="text-3xl font-bold mb-6 text-center">Welcome to Shortcut Organizer</h2>
      <p class="mb-6 text-center">Choose an application to get started</p>
      <div ref="scrollContainer" class="flex-grow overflow-hidden" @mouseenter="pauseScroll"
           @mouseleave="resumeScroll" @wheel="handleWheel">
        <div ref="scrollContent" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-2">
          <button v-for="app in apps" :key="app.id" @click="selectApp(app)"
                  class="flex flex-col items-center p-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:bg-blue-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <i :class="['iconfont','text-4xl mb-2']">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#' + app.icon"></use>
              </svg>
            </i>
            <span class="text-sm font-medium">{{ app.name }}</span>
          </button>
        </div>
      </div>
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer" @click="hideOverlay"
           @mousedown="startDrag" @touchstart="startDrag">
        <svg xmlns="http://www.w3.org/2000/svg"
             class="h-6 w-10 text-gray-600 hover:text-gray-800 transition-colors duration-200" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  show: Boolean,
  apps: Array,
})

const emit = defineEmits(['select-app', 'hide'])

const scrollContainer = ref(null)
const scrollContent = ref(null)
let scrollInterval = null
let scrollPaused = false
let autoScrolling = false
let scrollDirection = 1 // 1 for down, -1 for up

const selectApp = (app) => {
  emit('select-app', app)
  emit('hide')
}

const startScroll = () => {
  if (!scrollContainer.value) return

  scrollInterval = setInterval(() => {
    if (!scrollPaused && !autoScrolling) {
      autoScrolling = true
      const container = scrollContainer.value
      const content = scrollContent.value
      const scrollStep = 1 * scrollDirection // Scroll speed

      if (scrollDirection === 1 && container.scrollTop + container.clientHeight >= content.scrollHeight) {
        // Change direction to up when reaching the bottom
        scrollDirection = -1
      } else if (scrollDirection === -1 && container.scrollTop <= 0) {
        // Change direction to down when reaching the top
        scrollDirection = 1
      }

      container.scrollTop += scrollStep
      autoScrolling = false
    }
  }, 50)
}

const pauseScroll = () => {
  scrollPaused = true
}

const resumeScroll = () => {
  scrollPaused = false
}

const handleWheel = (event) => {
  if (scrollContainer.value) {
    scrollPaused = true
    scrollContainer.value.scrollTop += event.deltaY
    clearTimeout(scrollContainer.value.wheelTimeout)
    scrollContainer.value.wheelTimeout = setTimeout(() => {
      scrollPaused = false
    }, 1000) // Resume auto-scroll after 1 second of inactivity
  }
}

const hideOverlay = () => {
  emit('hide')
}

const startDrag = (event) => {
  event.preventDefault()
  const startY = event.clientY || event.touches[0].clientY
  const threshold = 50 // Minimum drag distance to hide overlay

  const handleMove = (moveEvent) => {
    const currentY = moveEvent.clientY || moveEvent.touches[0].clientY
    const dragDistance = startY - currentY

    if (dragDistance > threshold) {
      hideOverlay()
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchend', handleEnd)
    }
  }

  const handleEnd = () => {
    window.removeEventListener('mousemove', handleMove)
    window.removeEventListener('touchmove', handleMove)
    window.removeEventListener('mouseup', handleEnd)
    window.removeEventListener('touchend', handleEnd)
  }

  window.addEventListener('mousemove', handleMove)
  window.addEventListener('touchmove', handleMove)
  window.addEventListener('mouseup', handleEnd)
  window.addEventListener('touchend', handleEnd)
}

onMounted(() => {
  nextTick(() => {
    if (scrollContainer.value && scrollContent.value) {
      const containerHeight = scrollContainer.value.clientHeight
      const contentHeight = scrollContent.value.scrollHeight

      // Ensure the content has a minimum height
      if (contentHeight < containerHeight) {
        scrollContent.value.style.minHeight = `${containerHeight}px`
      }

      startScroll()
    }
  })
})

onUnmounted(() => {
  if (scrollInterval) {
    clearInterval(scrollInterval)
  }
})
</script>

<style scoped>
.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.overflow-hidden {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.overflow-hidden::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari and Opera */
}
</style>