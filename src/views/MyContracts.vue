<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Contracts</h1>
        <p class="text-gray-600 mt-2">Manage your property contracts and payments</p>
      </div>
      
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-wrap gap-4">
          <select
            v-model="filters.status"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            v-model="filters.type"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Types</option>
            <option value="purchase">Purchase</option>
            <option value="rental">Rental</option>
            <option value="lease">Lease</option>
          </select>
          
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search properties..."
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
      
      <!-- Contracts List -->
      <div class="space-y-6">
        <div
          v-for="contract in filteredContracts"
          :key="contract.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div class="flex-1">
                <div class="flex items-start space-x-4">
                  <img
                    :src="contract.property.image"
                    :alt="contract.property.title"
                    class="w-20 h-20 rounded-lg object-cover"
                  />
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">{{ contract.property.title }}</h3>
                      <span :class="getStatusClass(contract.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ formatStatus(contract.status) }}
                      </span>
                    </div>
                    
                    <p class="text-gray-600 text-sm mb-3">{{ contract.property.address }}</p>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span class="text-gray-500">Type:</span>
                        <span class="ml-1 font-medium capitalize">{{ contract.type }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Amount:</span>
                        <span class="ml-1 font-medium">${{ contract.amount.toLocaleString() }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Start Date:</span>
                        <span class="ml-1 font-medium">{{ formatDate(contract.startDate) }}</span>
                      </div>
                      <div v-if="contract.endDate">
                        <span class="text-gray-500">End Date:</span>
                        <span class="ml-1 font-medium">{{ formatDate(contract.endDate) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                <button
                  v-if="contract.status === 'draft'"
                  @click="editContract(contract)"
                  class="px-4 py-2 text-sm border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Edit Draft
                </button>
                
                <button
                  v-if="contract.status === 'active' && contract.nextPaymentDue"
                  @click="makePayment(contract)"
                  class="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Make Payment
                </button>
                
                <button
                  @click="viewContract(contract)"
                  class="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
            
            <!-- Payment Status -->
            <div v-if="contract.status === 'active'" class="mt-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900">Payment Status</h4>
                <span :class="getPaymentStatusClass(contract.paymentStatus)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ contract.paymentStatus }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Next Payment:</span>
                  <span class="ml-1 font-medium">${{ contract.nextPaymentAmount?.toLocaleString() || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Due Date:</span>
                  <span class="ml-1 font-medium">{{ contract.nextPaymentDue ? formatDate(contract.nextPaymentDue) : 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Total Paid:</span>
                  <span class="ml-1 font-medium">${{ contract.totalPaid?.toLocaleString() || '0' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredContracts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No contracts found</h3>
          <p class="mt-1 text-sm text-gray-500">Start by creating a contract for a property you're interested in.</p>
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
    
    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold">Make Payment</h3>
          <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-4">
          <PaymentProcessor
            v-if="selectedContract"
            :amount="selectedContract.nextPaymentAmount"
            :payment-type="`${selectedContract.type} Payment`"
            :contract-id="selectedContract.id"
            @payment-success="handlePaymentSuccess"
            @payment-error="handlePaymentError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import PaymentProcessor from '../components/PaymentProcessor.vue'

const { user } = useAuth()

const contracts = ref([])
const filters = ref({
  status: '',
  type: '',
  search: ''
})

const showPaymentModal = ref(false)
const selectedContract = ref(null)

// Mock contracts data
const mockContracts = [
  {
    id: 1,
    property: {
      id: 1,
      title: "House on the Hollywood",
      address: "374 Johnson Ave, Los Angeles, CA",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
    },
    type: "rental",
    status: "active",
    amount: 2500,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    paymentStatus: "current",
    nextPaymentAmount: 2500,
    nextPaymentDue: "2024-02-01",
    totalPaid: 2500
  },
  {
    id: 2,
    property: {
      id: 2,
      title: "Modern Downtown Apartment",
      address: "123 Main St, Los Angeles, CA",
      image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg"
    },
    type: "purchase",
    status: "pending_approval",
    amount: 450000,
    startDate: "2024-02-15",
    paymentStatus: "pending",
    totalPaid: 45000
  }
]

const filteredContracts = computed(() => {
  return contracts.value.filter(contract => {
    if (filters.value.status && contract.status !== filters.value.status) return false
    if (filters.value.type && contract.type !== filters.value.type) return false
    if (filters.value.search && !contract.property.title.toLowerCase().includes(filters.value.search.toLowerCase())) return false
    return true
  })
})

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    pending_approval: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusClass = (status) => {
  const classes = {
    current: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatStatus = (status) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const editContract = (contract) => {
  // Navigate to contract editing page
  console.log('Edit contract:', contract.id)
}

const viewContract = (contract) => {
  // Navigate to contract details page
  console.log('View contract:', contract.id)
}

const makePayment = (contract) => {
  selectedContract.value = contract
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedContract.value = null
}

const handlePaymentSuccess = (paymentData) => {
  console.log('Payment successful:', paymentData)
  
  // Update contract payment status
  if (selectedContract.value) {
    selectedContract.value.totalPaid += selectedContract.value.nextPaymentAmount
    selectedContract.value.nextPaymentDue = getNextPaymentDate(selectedContract.value.nextPaymentDue)
  }
  
  closePaymentModal()
}

const handlePaymentError = (error) => {
  console.error('Payment failed:', error)
}

const getNextPaymentDate = (currentDue) => {
  const date = new Date(currentDue)
  date.setMonth(date.getMonth() + 1)
  return date.toISOString().split('T')[0]
}

onMounted(() => {
  // In a real app, fetch contracts for the current user
  contracts.value = mockContracts
})
</script>
