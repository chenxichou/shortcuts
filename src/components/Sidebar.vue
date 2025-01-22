<template>
  <aside class="bg-gray-800 text-white w-18 flex-shrink-0 flex flex-col h-screen">
    <nav class="flex-1 overflow-y-auto scrollbar-hide py-6">
      <draggable
          v-model="localApps"
          item-key="id"
          @end="onDragEnd"
          :animation="200"
          ghost-class="ghost"
          class="flex flex-col items-center"
      >
        <template #item="{ element }">
          <button
              @click="selectApp(element)"
              :class="[
                'w-12 h-12 flex items-center justify-center rounded-lg mb-4 transition-colors duration-200',
                element.id === selectedApp.id ? 'bg-gray-700' : 'hover:bg-gray-700'
              ]"
              :aria-label="element.name"
          >
            <i :title="element.name">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#' + element.icon"></use>
              </svg>
            </i>
          </button>
        </template>
      </draggable>
    </nav>
    <div class="pb-2">
      <button
          @click="showContactModal = true"
          class="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-700 transition-colors duration-200 mx-auto"
          aria-label="Contact Author"
      >
        <svg class="icon fill:'240,85,66'" aria-hidden="true">
          <use xlink:href="#icon-youxiang"></use>
        </svg>
      </button>
    </div>
    <teleport to="body">
      <div v-if="showContactModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-sm w-full">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-2xl font-bold text-gray-800">Contact Author</h2>
            <button
                @click="showContactModal = false"
                class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p class="mb-2 text-gray-600">Email: keymaps@foxmail.com</p>
        </div>
      </div>
    </teleport>
  </aside>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps(['apps', 'selectedApp'])
const emit = defineEmits(['select-app', 'reorder-apps'])

const showContactModal = ref(false)

const localApps = computed({
  get: () => props.apps,
  set: (value) => emit('reorder-apps', value)
})

const selectApp = (app) => {
  emit('select-app', app)
}

const onDragEnd = () => {
  emit('reorder-apps', localApps.value)
}
</script>

<style scoped>
.iconfont {
  font-size: 28px;
}
.icon {
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>