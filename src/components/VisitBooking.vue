<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Schedule a Visit</h3>
    
    <form @submit.prevent="handleBooking" class="space-y-4">
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>
      
      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
        {{ success }}
      </div>
      
      <!-- Date Selection -->
      <div>
        <label for="visitDate" class="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
        <input
          id="visitDate"
          v-model="form.date"
          type="date"
          :min="minDate"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      
      <!-- Time Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="time in availableTimes"
            :key="time"
            type="button"
            @click="selectTime(time)"
            :class="[
              'px-3 py-2 text-sm rounded-lg border transition-colors',
              form.time === time
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
            ]"
          >
            {{ time }}
          </button>
        </div>
      </div>
      
      <!-- Visit Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Visit Type</label>
        <select
          v-model="form.type"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Select visit type</option>
          <option value="in-person">In-Person Tour</option>
          <option value="virtual">Virtual Tour</option>
        </select>
      </div>
      
      <!-- Message -->
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
        <textarea
          id="message"
          v-model="form.message"
          rows="3"
          placeholder="Any specific requirements or questions..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        ></textarea>
      </div>
      
      <!-- Contact Info (for non-authenticated users) -->
      <div v-if="!isAuthenticated" class="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h4 class="font-medium text-gray-900">Contact Information</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="guestName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="guestName"
              v-model="form.guestName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label for="guestEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="guestEmail"
              v-model="form.guestEmail"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div class="md:col-span-2">
            <label for="guestPhone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              id="guestPhone"
              v-model="form.guestPhone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        :disabled="isLoading || !form.date || !form.time || !form.type"
        class="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Booking...' : 'Book Visit' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  propertyId: {
    type: [String, Number],
    required: true
  },
  agentId: {
    type: [String, Number],
    required: true
  }
})

const { user, isAuthenticated } = useAuth()

const form = ref({
  date: '',
  time: '',
  type: '',
  message: '',
  guestName: '',
  guestEmail: '',
  guestPhone: ''
})

const error = ref('')
const success = ref('')
const isLoading = ref(false)

const availableTimes = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM'
]

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const selectTime = (time) => {
  form.value.time = time
}

const handleBooking = async () => {
  error.value = ''
  success.value = ''
  isLoading.value = true
  
  try {
    // Mock API call - replace with actual booking API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const bookingData = {
      propertyId: props.propertyId,
      agentId: props.agentId,
      clientId: user.value?.id || null,
      date: form.value.date,
      time: form.value.time,
      type: form.value.type,
      message: form.value.message,
      status: 'pending',
      // Guest info for non-authenticated users
      guestInfo: !isAuthenticated.value ? {
        name: form.value.guestName,
        email: form.value.guestEmail,
        phone: form.value.guestPhone
      } : null
    }
    
    console.log('Booking request:', bookingData)
    
    success.value = 'Visit scheduled successfully! The agent will contact you to confirm.'
    
    // Reset form
    form.value = {
      date: '',
      time: '',
      type: '',
      message: '',
      guestName: '',
      guestEmail: '',
      guestPhone: ''
    }
    
  } catch (err) {
    error.value = 'Failed to schedule visit. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Pre-fill user info if authenticated
  if (isAuthenticated.value && user.value) {
    form.value.guestName = user.value.name
    form.value.guestEmail = user.value.email
    form.value.guestPhone = user.value.phone || ''
  }
})
</script>
