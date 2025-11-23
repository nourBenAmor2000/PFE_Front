<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center">
          <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/login" class="font-medium text-orange-600 hover:text-orange-500">
            sign in to your existing account
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- Added error display and role selection -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ error }}
        </div>
        
        <div class="space-y-4">
          <!-- Username field (only for clients) -->
          <div v-if="!showAgentFields">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              :required="!showAgentFields"
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Username"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First name</label>
              <input
                id="firstName"
                v-model="form.firstName"
                name="firstName"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="First name"
              />
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last name</label>
              <input
                id="lastName"
                v-model="form.lastName"
                name="lastName"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Last name"
              />
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone number</label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your phone number"
            />
          </div>
          
          <!-- Added role selection -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Account Type</label>
            <select
              id="role"
              v-model="form.role"
              name="role"
              required
              class="mt-1 block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select account type</option>
              <option value="client">Client - Looking for properties</option>
              <option value="agent">Agent - Real estate professional</option>
            </select>
          </div>
          
          <!-- Agency selection (only for agents) -->
          <div v-if="showAgentFields">
            <label for="agency_id" class="block text-sm font-medium text-gray-700">Agency *</label>
            <select
              id="agency_id"
              v-model="form.agency_id"
              name="agency_id"
              :required="showAgentFields"
              class="mt-1 block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select an agency</option>
              <option
                v-for="agency in agencies"
                :key="agency._id || agency.id"
                :value="agency._id || agency.id"
              >
                {{ agency.name }} {{ agency.city ? `(${agency.city})` : '' }}
              </option>
            </select>
            <p v-if="agencies.length === 0" class="mt-1 text-xs text-gray-500">
              No agencies available. Please contact administrator.
            </p>
          </div>
          
          <!-- Agent role selection (only for agents) -->
          <div v-if="showAgentFields">
            <label for="agent_role" class="block text-sm font-medium text-gray-700">Agent Role *</label>
            <select
              id="agent_role"
              v-model="form.agent_role"
              name="agent_role"
              :required="showAgentFields"
              class="mt-1 block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="agent">Agent Personnel</option>
              <option value="rh">RH (Human Resources)</option>
              <option value="admin_agence">Admin Agence</option>
            </select>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Create a password"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="agree-terms"
            v-model="form.agreeTerms"
            name="agree-terms"
            type="checkbox"
            required
            class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <a href="#" class="text-orange-600 hover:text-orange-500">Terms and Conditions</a>
            and
            <a href="#" class="text-orange-600 hover:text-orange-500">Privacy Policy</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="mr-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAgencies } from '@/composables/useAgencies'

const router = useRouter()
const { register, isLoading } = useAuth()
const agenciesStore = useAgencies()

const form = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  agency_id: '',
  agent_role: 'agent', // Default agent role
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const error = ref('')
const agencies = ref([])

// Load agencies when component mounts
onMounted(async () => {
  try {
    await agenciesStore.fetchAgencies()
    agencies.value = agenciesStore.agencies || []
  } catch (err) {
    console.error('Failed to load agencies:', err)
  }
})

// Show agency and agent role fields only when role is 'agent'
const showAgentFields = computed(() => form.value.role === 'agent')

const handleRegister = async () => {
  error.value = ''
  
  // Basic validation
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (form.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }
  
  // Determine user type based on role selection
  const userType = form.value.role === 'agent' ? 'agent' : 'client'
  
  // Validation for agent registration
  if (userType === 'agent') {
    if (!form.value.agency_id) {
      error.value = 'Please select an agency'
      return
    }
    if (!form.value.agent_role) {
      error.value = 'Please select an agent role'
      return
    }
  }
  
  // Prepare registration data based on user type
  const registrationData = userType === 'agent' 
    ? {
        name: `${form.value.firstName} ${form.value.lastName}`,
        email: form.value.email,
        phone: form.value.phone,
        password: form.value.password,
        password_confirmation: form.value.confirmPassword,
        agency_id: form.value.agency_id,
        role: form.value.agent_role // Use selected agent role
      }
    : {
        username: form.value.username,
        name: `${form.value.firstName} ${form.value.lastName}`,
        email: form.value.email,
        phone: form.value.phone,
        password: form.value.password,
        password_confirmation: form.value.confirmPassword
      }
  
  const result = await register(registrationData, userType)
  
  if (result.success) {
    // IMPORTANT: Always redirect to email verification page
    // User must verify email before accessing their account
    // No auto-login after registration
    router.push({ 
      path: '/verify-email', 
      query: { 
        type: userType,
        email: form.value.email,
        message: result.message || 'Registration successful! Please check your email for the verification code.'
      } 
    })
  } else {
    error.value = result.error || 'Registration failed. Please try again.'
  }
}
</script>

