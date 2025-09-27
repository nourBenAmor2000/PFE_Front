<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Real Estate Agencies</h1>
        <p class="text-gray-600 text-lg">Discover top-rated agencies in your area</p>
      </div>
    </section>

    <!-- Search and Filters -->
    <section class="py-8 bg-white border-b">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-1 max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search agencies..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div class="flex gap-4">
            <select
              v-model="selectedCity"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">All Cities</option>
              <option value="los-angeles">Los Angeles</option>
              <option value="san-francisco">San Francisco</option>
              <option value="new-york">New York</option>
              <option value="chicago">Chicago</option>
            </select>
            <select
              v-model="sortBy"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="agents">Most Agents</option>
              <option value="properties">Most Properties</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Agencies Grid -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="agency in filteredAgencies"
            :key="agency.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            @click="goToAgency(agency.id)"
          >
            <!-- Agency Header -->
            <div class="relative h-48 bg-gradient-to-r from-orange-400 to-red-400">
              <div class="absolute inset-0 bg-black bg-opacity-20"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <div class="flex items-center space-x-3">
                  <img :src="agency.logo" :alt="agency.name" class="w-16 h-16 rounded-lg bg-white p-2 object-contain" />
                  <div class="text-white">
                    <h3 class="text-xl font-bold">{{ agency.name }}</h3>
                    <p class="text-sm opacity-90">{{ agency.location }}</p>
                  </div>
                </div>
              </div>
              <!-- Rating Badge -->
              <div class="absolute top-4 right-4 bg-white rounded-lg px-3 py-1 shadow-md">
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="text-sm font-medium text-gray-900">{{ agency.rating }}</span>
                </div>
              </div>
            </div>
            
            <!-- Agency Details -->
            <div class="p-6">
              <!-- Stats -->
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ agency.agentCount }}</div>
                  <div class="text-sm text-gray-600">Agents</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ agency.propertyCount }}</div>
                  <div class="text-sm text-gray-600">Properties</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ agency.yearsInBusiness }}</div>
                  <div class="text-sm text-gray-600">Years</div>
                </div>
              </div>
              
              <!-- Description -->
              <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ agency.description }}</p>
              
              <!-- Specialties -->
              <div class="mb-4">
                <h4 class="text-sm font-semibold text-gray-900 mb-2">Specialties:</h4>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="specialty in agency.specialties.slice(0, 3)"
                    :key="specialty"
                    class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded"
                  >
                    {{ specialty }}
                  </span>
                </div>
              </div>
              
              <!-- Contact Info -->
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  {{ agency.phone }}
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {{ agency.email }}
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const selectedCity = ref('')
const sortBy = ref('rating')

// Mock agencies data
const agencies = ref([
  {
    id: 1,
    name: "Premium Real Estate Group",
    location: "Los Angeles, CA",
    rating: 4.9,
    agentCount: 25,
    propertyCount: 342,
    yearsInBusiness: 15,
    phone: "(555) 123-4567",
    email: "info@premiumrealestate.com",
    logo: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    description: "Leading real estate agency in Los Angeles with over 15 years of experience. We specialize in luxury homes, commercial properties, and investment opportunities.",
    specialties: ["Luxury Homes", "Commercial", "Investment Properties", "First-Time Buyers"],
    city: "los-angeles"
  },
  {
    id: 2,
    name: "Golden Gate Properties",
    location: "San Francisco, CA",
    rating: 4.8,
    agentCount: 18,
    propertyCount: 256,
    yearsInBusiness: 12,
    phone: "(555) 234-5678",
    email: "contact@goldengate.com",
    logo: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    description: "San Francisco's premier real estate agency focusing on residential and commercial properties in the Bay Area.",
    specialties: ["Residential", "Condos", "Tech District", "Waterfront"],
    city: "san-francisco"
  },
  {
    id: 3,
    name: "Empire State Realty",
    location: "New York, NY",
    rating: 4.7,
    agentCount: 42,
    propertyCount: 578,
    yearsInBusiness: 20,
    phone: "(555) 345-6789",
    email: "hello@empirestaterealty.com",
    logo: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    description: "New York's most trusted real estate agency with two decades of experience in Manhattan and surrounding boroughs.",
    specialties: ["Manhattan", "Brooklyn", "Luxury Condos", "Penthouses"],
    city: "new-york"
  },
  {
    id: 4,
    name: "Windy City Properties",
    location: "Chicago, IL",
    rating: 4.6,
    agentCount: 15,
    propertyCount: 189,
    yearsInBusiness: 8,
    phone: "(555) 456-7890",
    email: "info@windycityprops.com",
    logo: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    description: "Chicago's fastest-growing real estate agency specializing in downtown and suburban properties.",
    specialties: ["Downtown", "Suburban", "New Construction", "Rentals"],
    city: "chicago"
  }
])

const filteredAgencies = computed(() => {
  let filtered = agencies.value.filter(agency => {
    const matchesSearch = !searchQuery.value || 
      agency.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      agency.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCity = !selectedCity.value || agency.city === selectedCity.value
    
    return matchesSearch && matchesCity
  })
  
  // Sort agencies
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'rating':
        return b.rating - a.rating
      case 'agents':
        return b.agentCount - a.agentCount
      case 'properties':
        return b.propertyCount - a.propertyCount
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
  
  return filtered
})

const goToAgency = (id) => {
  router.push(`/agencies/${id}`)
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
