<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Our Expert Agents</h1>
        <p class="text-gray-600 text-lg">Meet our professional real estate agents ready to help you</p>
      </div>
    </section>

    <!-- Agents Grid -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div
            v-for="agent in agents"
            :key="agent.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            @click="goToAgent(agent.id)"
          >
            <!-- Agent Photo -->
            <div class="relative">
              <img :src="agent.photo" :alt="agent.name" class="w-full h-64 object-cover" />
              <div class="absolute bottom-4 left-4 bg-white rounded-lg p-2 shadow-md">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="text-sm font-medium">{{ agent.rating }}</span>
                </div>
              </div>
            </div>
            
            <!-- Agent Details -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-1">{{ agent.name }}</h3>
              <p class="text-orange-500 font-medium mb-2">{{ agent.role }}</p>
              <p class="text-gray-600 text-sm mb-4">{{ agent.experience }} years experience</p>
              
              <!-- Contact Info -->
              <div class="space-y-2">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  {{ agent.phone }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {{ agent.email }}
                </div>
              </div>
              
              <!-- Properties Sold -->
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ agent.propertiesSold }}</div>
                  <div class="text-sm text-gray-600">Properties Sold</div>
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

// Mock agents data
const agents = ref([
  {
    id: 1,
    name: "Ralph Johnson",
    role: "Senior Agent",
    experience: 8,
    rating: 4.9,
    phone: "(555) 123-4567",
    email: "ralph@homez.com",
    propertiesSold: 127,
    photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 2,
    name: "Lori Ramos",
    role: "Marketing Specialist",
    experience: 5,
    rating: 4.8,
    phone: "(555) 234-5678",
    email: "lori@homez.com",
    propertiesSold: 89,
    photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 3,
    name: "Jack Graham",
    role: "Property Consultant",
    experience: 12,
    rating: 4.9,
    phone: "(555) 345-6789",
    email: "jack@homez.com",
    propertiesSold: 203,
    photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 4,
    name: "Augusta Silva",
    role: "Team Leader",
    experience: 15,
    rating: 5.0,
    phone: "(555) 456-7890",
    email: "augusta@homez.com",
    propertiesSold: 312,
    photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  }
])

const goToAgent = (id) => {
  router.push(`/agents/${id}`)
}
</script>
