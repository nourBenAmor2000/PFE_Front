<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Visits</h1>
        <p class="text-gray-600 mt-2">Manage your property visit appointments</p>
      </div>
      
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-wrap gap-4">
          <select
            v-model="filters.status"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            v-model="filters.type"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Types</option>
            <option value="in-person">In-Person</option>
            <option value="virtual">Virtual</option>
          </select>
          
          <input
            v-model="filters.date"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
      
      <!-- Visits List -->
      <div class="space-y-4">
        <div
          v-for="visit in filteredVisits"
          :key="visit.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div class="flex-1">
              <div class="flex items-start space-x-4">
                <img
                  :src="visit.property.image"
                  :alt="visit.property.title"
                  class="w-20 h-20 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ visit.property.title }}</h3>
                  <p class="text-gray-600 text-sm">{{ visit.property.address }}</p>
                  
                  <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      {{ formatDate(visit.date) }}
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {{ visit.time }}
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                      {{ visit.type === 'virtual' ? 'Virtual Tour' : 'In-Person Tour' }}
                    </div>
                  </div>
                  
                  <div class="mt-3 flex items-center space-x-3">
                    <span :class="getStatusClass(visit.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ visit.status.charAt(0).toUpperCase() + visit.status.slice(1) }}
                    </span>
                    
                    <div class="flex items-center text-sm text-gray-600">
                      <img
                        :src="visit.agent.photo"
                        :alt="visit.agent.name"
                        class="w-6 h-6 rounded-full mr-2"
                      />
                      {{ visit.agent.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
              <button
                v-if="visit.status === 'pending'"
                @click="cancelVisit(visit.id)"
                class="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                v-if="visit.status === 'confirmed' && visit.type === 'virtual'"
                @click="joinVirtualTour(visit)"
                class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Join Tour
              </button>
              
              <router-link
                :to="`/properties/${visit.property.id}`"
                class="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                View Property
              </router-link>
            </div>
          </div>
          
          <div v-if="visit.message" class="mt-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-700"><strong>Message:</strong> {{ visit.message }}</p>
          </div>
        </div>
        
        <div v-if="filteredVisits.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No visits found</h3>
          <p class="mt-1 text-sm text-gray-500">Start by scheduling a visit to a property you're interested in.</p>
          <div class="mt-6">
            <router-link
              to="/properties"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Browse Properties
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

const visits = ref([])
const filters = ref({
  status: '',
  type: '',
  date: ''
})

// Mock visits data
const mockVisits = [
  {
    id: 1,
    property: {
      id: 1,
      title: "House on the Hollywood",
      address: "374 Johnson Ave, Los Angeles, CA",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
    },
    agent: {
      name: "Sarah Johnson",
      photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
    },
    date: "2024-01-15",
    time: "2:00 PM",
    type: "in-person",
    status: "confirmed",
    message: "Looking forward to seeing the property!"
  },
  {
    id: 2,
    property: {
      id: 2,
      title: "Modern Downtown Apartment",
      address: "123 Main St, Los Angeles, CA",
      image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg"
    },
    agent: {
      name: "Mike Davis",
      photo: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
    },
    date: "2024-01-20",
    time: "10:00 AM",
    type: "virtual",
    status: "pending",
    message: ""
  }
]

const filteredVisits = computed(() => {
  return visits.value.filter(visit => {
    if (filters.value.status && visit.status !== filters.value.status) return false
    if (filters.value.type && visit.type !== filters.value.type) return false
    if (filters.value.date && visit.date !== filters.value.date) return false
    return true
  })
})

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const cancelVisit = async (visitId) => {
  if (confirm('Are you sure you want to cancel this visit?')) {
    // Mock API call
    const visit = visits.value.find(v => v.id === visitId)
    if (visit) {
      visit.status = 'cancelled'
    }
  }
}

const joinVirtualTour = (visit) => {
  // Mock virtual tour functionality
  alert(`Joining virtual tour for ${visit.property.title}. In a real app, this would open the virtual tour interface.`)
}

onMounted(() => {
  // In a real app, fetch visits for the current user
  visits.value = mockVisits
})
</script>
