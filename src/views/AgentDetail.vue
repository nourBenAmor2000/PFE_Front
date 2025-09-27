<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Agent Hero Section -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Agent Photo and Basic Info -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-lg p-6 text-center">
              <img :src="agent.photo" :alt="agent.name" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ agent.name }}</h1>
              <p class="text-orange-500 font-medium mb-4">{{ agent.role }}</p>
              
              <!-- Rating -->
              <div class="flex items-center justify-center mb-4">
                <div class="flex items-center space-x-1">
                  <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= agent.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span class="ml-2 text-sm text-gray-600">({{ agent.reviews }} reviews)</span>
              </div>
              
              <!-- Contact Buttons -->
              <div class="space-y-3">
                <button class="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                  Contact Agent
                </button>
                <button class="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-500 hover:text-white transition-colors font-medium">
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
          
          <!-- Agent Details -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">About {{ agent.name }}</h2>
              <p class="text-gray-600 leading-relaxed mb-6">{{ agent.bio }}</p>
              
              <!-- Stats -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">{{ agent.experience }}</div>
                  <div class="text-sm text-gray-600">Years Experience</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">{{ agent.propertiesSold }}</div>
                  <div class="text-sm text-gray-600">Properties Sold</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">{{ agent.activeListings }}</div>
                  <div class="text-sm text-gray-600">Active Listings</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-gray-900">${{ agent.avgSalePrice }}K</div>
                  <div class="text-sm text-gray-600">Avg Sale Price</div>
                </div>
              </div>
              
              <!-- Contact Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span class="text-gray-700">{{ agent.phone }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-gray-700">{{ agent.email }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Agent's Properties -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">{{ agent.name }}'s Listings</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="property in agent.properties"
            :key="property.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img :src="property.image" :alt="property.title" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="font-bold text-gray-900 mb-2">{{ property.title }}</h3>
              <p class="text-gray-600 text-sm mb-2">{{ property.address }}</p>
              <div class="text-xl font-bold text-orange-500">${{ property.price.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const agent = ref({})

// Mock agent data
const mockAgent = {
  id: 1,
  name: "Ralph Johnson",
  role: "Senior Real Estate Agent",
  experience: 8,
  rating: 4.9,
  reviews: 127,
  phone: "(555) 123-4567",
  email: "ralph@homez.com",
  propertiesSold: 127,
  activeListings: 15,
  avgSalePrice: 650,
  photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  bio: "Ralph Johnson is a dedicated real estate professional with over 8 years of experience in the Los Angeles market. Known for his attention to detail and commitment to client satisfaction, Ralph has helped hundreds of families find their dream homes. His expertise in market analysis and negotiation ensures the best outcomes for both buyers and sellers.",
  properties: [
    {
      id: 1,
      title: "Modern Downtown Loft",
      address: "123 Main St, Los Angeles",
      price: 750000,
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
    },
    {
      id: 2,
      title: "Family Home in Beverly Hills",
      address: "456 Oak Ave, Beverly Hills",
      price: 1200000,
      image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg"
    },
    {
      id: 3,
      title: "Cozy Cottage",
      address: "789 Pine St, Santa Monica",
      price: 850000,
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
    }
  ]
}

onMounted(() => {
  // In a real app, fetch agent data based on route.params.id
  agent.value = mockAgent
})
</script>
