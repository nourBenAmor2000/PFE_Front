<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Property Hero Section -->
    <section class="bg-white">
      <div class="container mx-auto px-4 py-8">
        <!-- Breadcrumb -->
        <nav class="mb-6">
          <ol class="flex items-center space-x-2 text-sm text-gray-600">
            <li><router-link to="/" class="hover:text-orange-500">Home</router-link></li>
            <li>/</li>
            <li><router-link to="/properties" class="hover:text-orange-500">Properties</router-link></li>
            <li>/</li>
            <li class="text-gray-900">{{ property.title }}</li>
          </ol>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Property Images -->
          <div class="lg:col-span-2">
            <div class="relative mb-4">
              <img :src="property.mainImage" :alt="property.title" class="w-full h-96 object-cover rounded-lg" />
              <div class="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium">
                {{ property.status }}
              </div>
            </div>
            
            <!-- Image Gallery -->
            <div class="grid grid-cols-4 gap-2">
              <img 
                v-for="(image, index) in property.gallery" 
                :key="index"
                :src="image" 
                :alt="`Property image ${index + 1}`"
                class="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
              />
            </div>
          </div>

          <!-- Property Info -->
          <div class="space-y-6">
            <div class="bg-white p-6 rounded-lg shadow-lg">
              <div class="mb-6">
                <div class="text-3xl font-bold text-gray-900 mb-2">${{ property.price.toLocaleString() }}</div>
                <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ property.title }}</h1>
                <p class="text-gray-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ property.address }}
                </p>
              </div>

              <!-- Property Features -->
              <div class="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ property.beds }}</div>
                  <div class="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ property.baths }}</div>
                  <div class="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ property.sqft }}</div>
                  <div class="text-sm text-gray-600">Sq Ft</div>
                </div>
              </div>

              <!-- Agent Info -->
              <div class="p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <img :src="property.agent.photo" :alt="property.agent.name" class="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div class="font-semibold text-gray-900">{{ property.agent.name }}</div>
                    <div class="text-sm text-gray-600">{{ property.agent.phone }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Added visit booking component -->
            <VisitBooking 
              :property-id="property.id" 
              :agent-id="property.agent.id"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Property Description -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p class="text-gray-600 leading-relaxed mb-6">{{ property.description }}</p>
            
            <h3 class="text-xl font-bold text-gray-900 mb-4">Property Features</h3>
            <div class="grid grid-cols-2 gap-4">
              <ul class="space-y-2">
                <li v-for="feature in property.features.slice(0, Math.ceil(property.features.length / 2))" :key="feature" class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
              <ul class="space-y-2">
                <li v-for="feature in property.features.slice(Math.ceil(property.features.length / 2))" :key="feature" class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Interactive Map -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Location</h3>
            </div>
            <PropertyMap
              :properties="[property]"
              :center="[property.latitude, property.longitude]"
              :zoom="15"
              height="300px"
            />
            <div class="p-4">
              <p class="text-sm text-gray-600">{{ property.address }}</p>
              <div class="mt-3 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Walk Score</span>
                  <span class="font-medium text-gray-900">{{ property.walkScore || 'N/A' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Transit Score</span>
                  <span class="font-medium text-gray-900">{{ property.transitScore || 'N/A' }}</span>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PropertyMap from '../components/PropertyMap.vue'
import VisitBooking from '../components/VisitBooking.vue'

const route = useRoute()
const property = ref({})

const mockProperty = {
  id: 1,
  title: "House on the Hollywood",
  address: "374 Johnson Ave, Los Angeles, CA",
  price: 4600,
  beds: 6,
  baths: 2,
  sqft: 2000,
  status: "For Sale",
  latitude: 34.0928,
  longitude: -118.3287,
  walkScore: 85,
  transitScore: 72,
  mainImage: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
  gallery: [
    "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
  ],
  description: "This stunning property offers modern living in the heart of Hollywood. With spacious rooms, updated fixtures, and a prime location, this home is perfect for those seeking luxury and convenience.",
  features: [
    "Central Air Conditioning",
    "Hardwood Floors",
    "Updated Kitchen",
    "Walk-in Closets",
    "Private Parking",
    "Garden/Patio",
    "Security System",
    "High-Speed Internet"
  ],
  agent: {
    id: 1,
    name: "Sarah Johnson",
    phone: "(555) 123-4567",
    photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  }
}

onMounted(() => {
  // In a real app, fetch property data based on route.params.id
  property.value = mockProperty
})
</script>
