<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div v-if="!isVerifying && !verificationResult">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Vérification de l'email
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Vérification en cours...
        </p>
      </div>

      <div v-if="isVerifying" class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        <p class="mt-4 text-sm text-gray-600">Vérification de votre email en cours...</p>
      </div>

      <div v-if="verificationResult && verificationResult.success" class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Email vérifié avec succès!</h3>
        <p class="mt-2 text-sm text-gray-600">{{ verificationResult.message }}</p>
        <div class="mt-6">
          <router-link
            to="/login"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            Se connecter
          </router-link>
        </div>
      </div>

      <div v-if="verificationResult && !verificationResult.success" class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Échec de la vérification</h3>
        <p class="mt-2 text-sm text-gray-600">{{ verificationResult.error }}</p>
        <div class="mt-6 space-y-3">
          <button
            v-if="canResend"
            @click="handleResend"
            :disabled="isResending"
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
          >
            <span v-if="isResending">Envoi en cours...</span>
            <span v-else>Renvoyer l'email de vérification</span>
          </button>
          <router-link
            to="/login"
            class="block text-center text-sm font-medium text-teal-600 hover:text-teal-500"
          >
            Retour à la connexion
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { verifyEmail, resendVerificationEmail, isLoading: authLoading } = useAuth()

const isVerifying = ref(false)
const verificationResult = ref(null)
const isResending = ref(false)
const canResend = ref(false)

// Get parameters from route
const userId = computed(() => route.params.id || route.query.id || '')
const hash = computed(() => route.params.hash || route.query.hash || '')
const userType = computed(() => route.query.type || 'client')

const handleVerify = async () => {
  if (!userId.value || !hash.value) {
    verificationResult.value = {
      success: false,
      error: 'Paramètres de vérification manquants'
    }
    return
  }

  isVerifying.value = true
  verificationResult.value = null

  const result = await verifyEmail(userId.value, hash.value, userType.value)

  isVerifying.value = false
  verificationResult.value = result

  if (!result.success) {
    canResend.value = true
  }
}

const handleResend = async () => {
  isResending.value = true
  const result = await resendVerificationEmail(userType.value)
  isResending.value = false

  if (result.success) {
    alert(result.message || 'Email de vérification renvoyé avec succès')
    canResend.value = false
  } else {
    alert(result.error || 'Échec de l\'envoi de l\'email de vérification')
  }
}

onMounted(() => {
  handleVerify()
})
</script>

