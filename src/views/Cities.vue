<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Explore Cities</h1>
        <p class="text-gray-600 text-lg">Discover properties in your favorite locations</p>
      </div>
    </section>

    <!-- Cities Grid -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div
            v-for="city in cities"
            :key="city.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            @click="exploreCity(city.id)"
          >
            <!-- City Image -->
            <div class="relative h-48">
              <img :src="city.image" :alt="city.name" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div class="text-center text-white">
                  <h3 class="text-2xl font-bold mb-2">{{ city.name }}</h3>
                  <p class="text-sm">{{ city.state }}</p>
                </div>
              </div>
            </div>
            
            <!-- City Details -->
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ city.propertyCount }}</div>
                  <div class="text-sm text-gray-600">Properties Available</div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-semibold text-orange-500">${{ city.avgPrice }}K</div>
                  <div class="text-sm text-gray-600">Avg Price</div>
                </div>
              </div>
              
              <!-- Popular Areas -->
              <div class="mb-4">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Popular Areas:</h4>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="area in city.popularAreas.slice(0, 3)"
                    :key="area"
                    class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {{ area }}
                  </span>
                </div>
              </div>
              
              <!-- City Stats -->
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-lg font-bold text-gray-900">{{ city.forSale }}</div>
                  <div class="text-xs text-gray-600">For Sale</div>
                </div>
                <div>
                  <div class="text-lg font-bold text-gray-900">{{ city.forRent }}</div>
                  <div class="text-xs text-gray-600">For Rent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock cities data
const cities = ref([
  {
    id: 1,
    name: "Los Angeles",
    state: "California",
    propertyCount: 1247,
    avgPrice: 850,
    forSale: 892,
    forRent: 355,
    image: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg",
    popularAreas: ["Hollywood", "Beverly Hills", "Santa Monica", "Downtown"]
  },
  {
    id: 2,
    name: "San Francisco",
    state: "California",
    propertyCount: 856,
    avgPrice: 1200,
    forSale: 623,
    forRent: 233,
    image: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg",
    popularAreas: ["Mission District", "SOMA", "Castro", "Nob Hill"]
  },
  {
    id: 3,
    name: "New York",
    state: "New York",
    propertyCount: 2134,
    avgPrice: 950,
    forSale: 1456,
    forRent: 678,
    image: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg",
    popularAreas: ["Manhattan", "Brooklyn", "Queens", "Bronx"]
  },
  {
    id: 4,
    name: "Chicago",
    state: "Illinois",
    propertyCount: 967,
    avgPrice: 420,
    forSale: 712,
    forRent: 255,
    image: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg",
    popularAreas: ["Loop", "Lincoln Park", "Wicker Park", "River North"]
  },
  {
    id: 5,
    name: "Miami",
    state: "Florida",
    propertyCount: 743,
    avgPrice: 680,
    forSale: 534,
    forRent: 209,
    image: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg",
    popularAreas: ["South Beach", "Brickell", "Wynwood", "Coral Gables"]
  },
  {
    id: 6,
    name: "Seattle",
    state: "Washington",
    propertyCount: 612,
    avgPrice: 750,
    forSale: 445,
    forRent: 167,
    image: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg",
    popularAreas: ["Capitol Hill", "Ballard", "Fremont", "Queen Anne"]
  }
])

const exploreCity = (cityId) => {
  router.push(`/properties?city=${cityId}`)
}
</script>
