<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">Property Contract</h3>
    
    <form @submit.prevent="handleContractSubmission" class="space-y-6">
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>
      
      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
        {{ success }}
      </div>
      
      <!-- Contract Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
        <select
          v-model="form.type"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">Select contract type</option>
          <option value="purchase">Purchase Agreement</option>
          <option value="rental">Rental Agreement</option>
          <option value="lease">Lease Agreement</option>
        </select>
      </div>
      
      <!-- Contract Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            id="startDate"
            v-model="form.startDate"
            type="date"
            :min="minDate"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div v-if="form.type === 'rental' || form.type === 'lease'">
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            id="endDate"
            v-model="form.endDate"
            type="date"
            :min="form.startDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
      
      <!-- Financial Terms -->
      <div class="space-y-4">
        <h4 class="font-medium text-gray-900">Financial Terms</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
              {{ form.type === 'purchase' ? 'Purchase Price' : 'Monthly Amount' }} ($)
            </label>
            <input
              id="amount"
              v-model.number="form.amount"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div v-if="form.type === 'purchase'">
            <label for="downPayment" class="block text-sm font-medium text-gray-700 mb-2">Down Payment ($)</label>
            <input
              id="downPayment"
              v-model.number="form.downPayment"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div v-if="form.type === 'rental' || form.type === 'lease'">
            <label for="securityDeposit" class="block text-sm font-medium text-gray-700 mb-2">Security Deposit ($)</label>
            <input
              id="securityDeposit"
              v-model.number="form.securityDeposit"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
      
      <!-- Payment Schedule -->
      <div v-if="form.type !== 'purchase'">
        <label class="block text-sm font-medium text-gray-700 mb-2">Payment Schedule</label>
        <select
          v-model="form.paymentSchedule"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
        </select>
      </div>
      
      <!-- Special Terms -->
      <div>
        <label for="specialTerms" class="block text-sm font-medium text-gray-700 mb-2">Special Terms & Conditions</label>
        <textarea
          id="specialTerms"
          v-model="form.specialTerms"
          rows="4"
          placeholder="Enter any special terms, conditions, or notes..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        ></textarea>
      </div>
      
      <!-- Digital Signature -->
      <div class="border-t border-gray-200 pt-6">
        <h4 class="font-medium text-gray-900 mb-4">Digital Signature</h4>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <input
              id="agreeTerms"
              v-model="form.agreeTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label for="agreeTerms" class="ml-2 block text-sm text-gray-900">
              I agree to the terms and conditions of this contract
            </label>
          </div>
          
          <div class="flex items-center">
            <input
              id="digitalSignature"
              v-model="form.digitalSignature"
              type="checkbox"
              required
              class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label for="digitalSignature" class="ml-2 block text-sm text-gray-900">
              I hereby digitally sign this contract on {{ new Date().toLocaleDateString() }}
            </label>
          </div>
        </div>
      </div>
      
      <div class="flex space-x-4">
        <button
          type="button"
          @click="saveDraft"
          class="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          :disabled="isLoading || !form.agreeTerms || !form.digitalSignature"
          class="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Processing...' : 'Submit Contract' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const { user } = useAuth()

const form = ref({
  type: '',
  startDate: '',
  endDate: '',
  amount: 0,
  downPayment: 0,
  securityDeposit: 0,
  paymentSchedule: 'monthly',
  specialTerms: '',
  agreeTerms: false,
  digitalSignature: false
})

const error = ref('')
const success = ref('')
const isLoading = ref(false)

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const saveDraft = async () => {
  isLoading.value = true
  try {
    // Mock API call to save draft
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const draftData = {
      ...form.value,
      propertyId: props.propertyId,
      agentId: props.agentId,
      clientId: user.value?.id,
      status: 'draft',
      createdAt: new Date().toISOString()
    }
    
    console.log('Draft saved:', draftData)
    success.value = 'Contract draft saved successfully!'
    
    setTimeout(() => {
      success.value = ''
    }, 3000)
    
  } catch (err) {
    error.value = 'Failed to save draft. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleContractSubmission = async () => {
  error.value = ''
  success.value = ''
  isLoading.value = true
  
  try {
    // Mock API call to submit contract
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const contractData = {
      ...form.value,
      propertyId: props.propertyId,
      agentId: props.agentId,
      clientId: user.value?.id,
      status: 'pending_approval',
      submittedAt: new Date().toISOString(),
      signedAt: new Date().toISOString()
    }
    
    console.log('Contract submitted:', contractData)
    success.value = 'Contract submitted successfully! You will receive a confirmation email shortly.'
    
    // Reset form
    form.value = {
      type: '',
      startDate: '',
      endDate: '',
      amount: 0,
      downPayment: 0,
      securityDeposit: 0,
      paymentSchedule: 'monthly',
      specialTerms: '',
      agreeTerms: false,
      digitalSignature: false
    }
    
  } catch (err) {
    error.value = 'Failed to submit contract. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
