<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Agency Hero Section -->
    <section class="bg-gradient-to-r from-orange-400 to-red-400 py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <!-- Agency Logo -->
          <div class="bg-white rounded-lg p-6 shadow-lg">
            <img :src="agency.logo" :alt="agency.name" class="w-24 h-24 object-contain" />
          </div>
          
          <!-- Agency Info -->
          <div class="text-white text-center md:text-left flex-1">
            <h1 class="text-4xl font-bold mb-2">{{ agency.name }}</h1>
            <p class="text-xl opacity-90 mb-4">{{ agency.location }}</p>
            
            <!-- Rating and Stats -->
            <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <div class="flex items-center space-x-2">
                <div class="flex items-center space-x-1">
                  <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= agency.rating ? 'text-yellow-300' : 'text-white/30'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span class="font-medium">{{ agency.rating }} ({{ agency.reviewCount }} reviews)</span>
              </div>
              
              <div class="flex space-x-6 text-center md:text-left">
                <div>
                  <div class="text-2xl font-bold">{{ agency.agentCount }}</div>
                  <div class="text-sm opacity-90">Agents</div>
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ agency.propertyCount }}</div>
                  <div class="text-sm opacity-90">Properties</div>
                </div>
                <div>
                  <div class="text-2xl font-bold">{{ agency.yearsInBusiness }}</div>
                  <div class="text-sm opacity-90">Years</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contact Button -->
          <div class="flex flex-col space-y-3">
            <button class="bg-white text-orange-500 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Contact Agency
            </button>
            <button class="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-500 transition-colors">
              Visit Website
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Agency Details -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- About Section -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">About {{ agency.name }}</h2>
              <p class="text-gray-600 leading-relaxed mb-6">{{ agency.description }}</p>
              
              <!-- Specialties -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Our Specialties</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="specialty in agency.specialties"
                    :key="specialty"
                    class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ specialty }}
                  </span>
                </div>
              </div>
              
              <!-- Services -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Services We Offer</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div v-for="service in agency.services" :key="service" class="flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-gray-700">{{ service }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Our Agents -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Our Agents</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="agent in agency.agents"
                  :key="agent.id"
                  class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  @click="goToAgent(agent.id)"
                >
                  <img :src="agent.photo" :alt="agent.name" class="w-16 h-16 rounded-full object-cover" />
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">{{ agent.name }}</h3>
                    <p class="text-sm text-orange-500 font-medium">{{ agent.role }}</p>
                    <p class="text-sm text-gray-600">{{ agent.experience }} years experience</p>
                    <div class="flex items-center mt-1">
                      <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span class="text-sm text-gray-600 ml-1">{{ agent.rating }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Properties -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Recent Properties</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="property in agency.recentProperties"
                  :key="property.id"
                  class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  @click="goToProperty(property.id)"
                >
                  <img :src="property.image" :alt="property.title" class="w-full h-32 object-cover" />
                  <div class="p-4">
                    <h3 class="font-semibold text-gray-900 mb-1">{{ property.title }}</h3>
                    <p class="text-sm text-gray-600 mb-2">{{ property.address }}</p>
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-bold text-orange-500">${{ property.price.toLocaleString() }}</span>
                      <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{{ property.status }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Contact Info -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-gray-700">{{ agency.address }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span class="text-gray-700">{{ agency.phone }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-gray-700">{{ agency.email }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
                  </svg>
                  <a :href="agency.website" class="text-orange-500 hover:text-orange-600">{{ agency.website }}</a>
                </div>
              </div>
            </div>

            <!-- Office Hours -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Office Hours</h3>
              <div class="space-y-2">
                <div v-for="(hours, day) in agency.officeHours" :key="day" class="flex justify-between">
                  <span class="text-gray-600">{{ day }}</span>
                  <span class="text-gray-900 font-medium">{{ hours }}</span>
                </div>
              </div>
            </div>

            <!-- Awards -->
            <div v-if="agency.awards && agency.awards.length" class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Awards & Recognition</h3>
              <div class="space-y-3">
                <div v-for="award in agency.awards" :key="award.title" class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <div>
                    <div class="font-medium text-gray-900">{{ award.title }}</div>
                    <div class="text-sm text-gray-600">{{ award.year }}</div>
                  </div>
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
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const agency = ref({})

// Mock agency data
const mockAgency = {
  id: 1,
  name: "Premium Real Estate Group",
  location: "Los Angeles, CA",
  rating: 4.9,
  reviewCount: 127,
  agentCount: 25,
  propertyCount: 342,
  yearsInBusiness: 15,
  phone: "(555) 123-4567",
  email: "info@premiumrealestate.com",
  website: "www.premiumrealestate.com",
  address: "123 Sunset Boulevard, Los Angeles, CA 90028",
  logo: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
  description: "Premium Real Estate Group has been serving the Los Angeles area for over 15 years, establishing itself as the premier choice for luxury real estate transactions. Our team of experienced professionals is dedicated to providing exceptional service and achieving outstanding results for our clients.",
  specialties: ["Luxury Homes", "Commercial Properties", "Investment Properties", "First-Time Buyers", "Property Management"],
  services: [
    "Residential Sales",
    "Commercial Leasing",
    "Property Management",
    "Investment Consulting",
    "Market Analysis",
    "Staging Services",
    "Relocation Assistance",
    "Legal Support"
  ],
  officeHours: {
    "Monday": "9:00 AM - 6:00 PM",
    "Tuesday": "9:00 AM - 6:00 PM",
    "Wednesday": "9:00 AM - 6:00 PM",
    "Thursday": "9:00 AM - 6:00 PM",
    "Friday": "9:00 AM - 6:00 PM",
    "Saturday": "10:00 AM - 4:00 PM",
    "Sunday": "Closed"
  },
  awards: [
    { title: "Top Real Estate Agency 2023", year: "2023" },
    { title: "Excellence in Customer Service", year: "2022" },
    { title: "Best Luxury Home Sales", year: "2021" }
  ],
  agents: [
    {
      id: 1,
      name: "Ralph Johnson",
      role: "Senior Agent",
      experience: 8,
      rating: 4.9,
      photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    {
      id: 2,
      name: "Lori Ramos",
      role: "Marketing Specialist",
      experience: 5,
      rating: 4.8,
      photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    {
      id: 3,
      name: "Jack Graham",
      role: "Property Consultant",
      experience: 12,
      rating: 4.9,
      photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    {
      id: 4,
      name: "Augusta Silva",
      role: "Team Leader",
      experience: 15,
      rating: 5.0,
      photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    }
  ],
  recentProperties: [
    {
      id: 1,
      title: "Modern Downtown Loft",
      address: "123 Main St, Los Angeles",
      price: 750000,
      status: "For Sale",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
    },
    {
      id: 2,
      title: "Family Home in Beverly Hills",
      address: "456 Oak Ave, Beverly Hills",
      price: 1200000,
      status: "Sold",
      image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg"
    }
  ]
}

onMounted(() => {
  // In a real app, fetch agency data based on route.params.id
  agency.value = mockAgency
})

const goToAgent = (id) => {
  router.push(`/agents/${id}`)
}

const goToProperty = (id) => {
  router.push(`/properties/${id}`)
}
</script>
