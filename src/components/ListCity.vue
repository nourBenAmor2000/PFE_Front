<template>
  <div class="city-locations">    
    <!-- Swiper Container -->
    <div class="swiper-container">
      <swiper
        :slides-per-view="1"
        :space-between="20"
        :pagination="{clickable: true}"
        :breakpoints="{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }"
        :modules="modules"
        class="city-swiper"
      >
        <swiper-slide v-for="city in cities" :key="city.id">
          <div class="city-card" @click="navigateToCity(city.id)">
            <!-- City Map Background -->
            <div class="city-map">
              <img :src="city.mapImage" :alt="`${city.name} map`" />
              <div class="city-icon">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            
            <!-- City Details -->
            <div class="city-details">
              <h3 class="city-name">{{ city.name }}</h3>
              <p class="property-count">{{ city.propertyCount }} {{ city.propertyCount === 1 ? 'Property' : 'Properties' }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Swiper modules
const modules = [Pagination]

// City interface
interface City {
  id: number
  name: string
  propertyCount: number
  mapImage: string
}

// Mock city data
const cities = ref<City[]>([
  {
    id: 1,
    name: "Los Angeles",
    propertyCount: 2,
    mapImage: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg"
  },
  {
    id: 2,
    name: "San Francisco",
    propertyCount: 1,
    mapImage: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg"
  },
  {
    id: 3,
    name: "New York",
    propertyCount: 10,
    mapImage: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg"
  },
  {
    id: 4,
    name: "Chicago",
    propertyCount: 1,
    mapImage: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg"
  },
  {
    id: 5,
    name: "Miami",
    propertyCount: 5,
    mapImage: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg"
  },
  {
    id: 6,
    name: "Seattle",
    propertyCount: 3,
    mapImage: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg"
  },
  {
    id: 7,
    name: "Austin",
    propertyCount: 7,
    mapImage: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg"
  },
  {
    id: 8,
    name: "Denver",
    propertyCount: 4,
    mapImage: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg"
  }
])

// Methods
const navigateToCity = (cityId: number) => {
  console.log(`Navigate to city ${cityId}`)
}
</script>

<style scoped>
.city-locations {
  @apply py-16 px-4;
}

.swiper-container {
  @apply mt-12;
}

.city-swiper {
  @apply pb-12;
}

.city-card {
  @apply bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1;
}

.city-map {
  @apply relative h-48;
}

.city-map img {
  @apply w-full h-full object-cover;
}

.city-icon {
  @apply absolute inset-0 flex items-center justify-center;
}

.city-icon svg {
  @apply text-white bg-gray-900 bg-opacity-70 rounded-full p-3 w-16 h-16;
}

.city-details {
  @apply p-6 text-center;
}

.city-name {
  @apply text-xl font-bold text-gray-900 mb-2;
}

.property-count {
  @apply text-gray-600 text-sm;
}

/* Swiper custom styles */
:deep(.swiper-pagination-bullet) {
  @apply bg-gray-400;
}

:deep(.swiper-pagination-bullet-active) {
  @apply bg-red-500;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  @apply text-red-500;
}
</style>
