<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-6">Payment Information</h3>
    
    <form @submit.prevent="handlePayment" class="space-y-6">
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ error }}
      </div>
      
      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
        {{ success }}
      </div>
      
      <!-- Payment Summary -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 mb-3">Payment Summary</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">{{ paymentType }}</span>
            <span class="font-medium">${{ amount.toLocaleString() }}</span>
          </div>
          <div v-if="processingFee > 0" class="flex justify-between">
            <span class="text-gray-600">Processing Fee</span>
            <span class="font-medium">${{ processingFee.toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-200 pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${{ totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Payment Method -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
        <div class="space-y-3">
          <div class="flex items-center">
            <input
              id="credit-card"
              v-model="form.paymentMethod"
              type="radio"
              value="credit-card"
              class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
            />
            <label for="credit-card" class="ml-2 flex items-center text-sm text-gray-900">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
              Credit/Debit Card
            </label>
          </div>
          
          <div class="flex items-center">
            <input
              id="bank-transfer"
              v-model="form.paymentMethod"
              type="radio"
              value="bank-transfer"
              class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
            />
            <label for="bank-transfer" class="ml-2 flex items-center text-sm text-gray-900">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10 3L8 21l5-18h2l5 18-2-18z"/>
              </svg>
              Bank Transfer
            </label>
          </div>
          
          <div class="flex items-center">
            <input
              id="paypal"
              v-model="form.paymentMethod"
              type="radio"
              value="paypal"
              class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
            />
            <label for="paypal" class="ml-2 flex items-center text-sm text-gray-900">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.421c-.315-.178-.7-.284-1.139-.284H12.12l-.98 6.28h2.426c2.738 0 4.704-1.007 5.404-4.688.12-.632.168-1.252.252-1.887z"/>
              </svg>
              PayPal
            </label>
          </div>
        </div>
      </div>
      
      <!-- Credit Card Details -->
      <div v-if="form.paymentMethod === 'credit-card'" class="space-y-4">
        <div>
          <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
          <input
            id="cardNumber"
            v-model="form.cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            @input="formatCardNumber"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              id="expiryDate"
              v-model="form.expiryDate"
              type="text"
              placeholder="MM/YY"
              maxlength="5"
              @input="formatExpiryDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label for="cvv" class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
            <input
              id="cvv"
              v-model="form.cvv"
              type="text"
              placeholder="123"
              maxlength="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        
        <div>
          <label for="cardholderName" class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
          <input
            id="cardholderName"
            v-model="form.cardholderName"
            type="text"
            placeholder="John Doe"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
      
      <!-- Bank Transfer Details -->
      <div v-if="form.paymentMethod === 'bank-transfer'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="font-medium text-blue-900 mb-2">Bank Transfer Instructions</h4>
        <div class="text-sm text-blue-800 space-y-1">
          <p><strong>Account Name:</strong> Casaheb Real Estate</p>
          <p><strong>Account Number:</strong> 1234567890</p>
          <p><strong>Routing Number:</strong> 987654321</p>
          <p><strong>Reference:</strong> Contract #{{ contractId }}</p>
        </div>
      </div>
      
      <!-- Security Notice -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
          <div class="text-sm text-gray-700">
            <p class="font-medium">Secure Payment</p>
            <p>Your payment information is encrypted and secure. We never store your card details.</p>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        :disabled="isLoading || !form.paymentMethod"
        class="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Processing Payment...' : `Pay $${totalAmount.toFixed(2)}` }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  paymentType: {
    type: String,
    default: 'Payment'
  },
  contractId: {
    type: [String, Number],
    default: '12345'
  }
})

const emit = defineEmits(['payment-success', 'payment-error'])

const form = ref({
  paymentMethod: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: ''
})

const error = ref('')
const success = ref('')
const isLoading = ref(false)

const processingFee = computed(() => {
  return props.amount * 0.029 // 2.9% processing fee
})

const totalAmount = computed(() => {
  return props.amount + processingFee.value
})

const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  form.value.cardNumber = formattedValue
}

const formatExpiryDate = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  form.value.expiryDate = value
}

const handlePayment = async () => {
  error.value = ''
  success.value = ''
  isLoading.value = true
  
  try {
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const paymentData = {
      amount: totalAmount.value,
      method: form.value.paymentMethod,
      contractId: props.contractId,
      timestamp: new Date().toISOString(),
      transactionId: `txn_${Date.now()}`
    }
    
    console.log('Payment processed:', paymentData)
    
    success.value = 'Payment processed successfully!'
    emit('payment-success', paymentData)
    
    // Reset form
    form.value = {
      paymentMethod: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    }
    
  } catch (err) {
    error.value = 'Payment failed. Please check your information and try again.'
    emit('payment-error', err)
  } finally {
    isLoading.value = false
  }
}
</script>
