<template>
  <section class="relative bg-gray-50 py-16 lg:py-24">
    <div class="container mx-auto px-4">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="space-y-8">
          <!-- Main Heading -->
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Discover a place you'll love to live
          </h1>

          <!-- Search Section -->
          <div class="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <!-- Tabs -->
            <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                v-for="tab in tabs"
                :key="tab"
                @click="activeTab = tab"
                :class="[
                  'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                {{ tab }}
              </button>
            </div>

            <!-- Search Input -->
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21l-7-7m0 0l-7-7m7 7l7-7m-7 7v11" />
                  </svg>
                </div>
                <input
                  v-model="searchKeyword"
                  type="text"
                  placeholder="Enter Keyword"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <button
                @click="toggleAdvanced"
                class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Advanced
              </button>
              
              <button
                @click="handleSearch"
                class="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Statistics -->
          <div class="grid grid-cols-3 gap-8">
            <div v-for="stat in stats" :key="stat.label" class="text-center lg:text-left">
              <div class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {{ stat.value }}
              </div>
              <div class="text-gray-600 text-sm">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Image -->
        <div class="relative">
          <div class="relative overflow-hidden rounded-2xl">
            <img
              :src="currentImage"
              :alt="`Modern house ${currentImageIndex + 1}`"
              class="w-full h-96 lg:h-[500px] object-cover transition-opacity duration-500"
            />
            
            <!-- Image Navigation Dots -->
            <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <button
                v-for="(image, index) in images"
                :key="index"
                @click="currentImageIndex = index"
                :class="[
                  'w-3 h-3 rounded-full transition-colors',
                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Reactive data
const activeTab = ref('All')
const searchKeyword = ref('')
const showAdvanced = ref(false)
const currentImageIndex = ref(0)

// Static data
const tabs = ['All', 'For Sale', 'For Rent']

const stats = [
  { value: '154', label: 'Award Winning' },
  { value: '6K+', label: 'Happy Customer' },
  { value: '558+', label: 'Property Ready' }
]

const images = [
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
  'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg',
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'
]

// Computed properties
const currentImage = computed(() => images[currentImageIndex.value])

// Methods
const handleSearch = () => {
  console.log('Searching for:', searchKeyword.value, 'in', activeTab.value)
}

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

// Auto-rotate images
let imageInterval: NodeJS.Timeout

onMounted(() => {
  imageInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length
  }, 4000)
})

onUnmounted(() => {
  if (imageInterval) {
    clearInterval(imageInterval)
  }
})
</script>
