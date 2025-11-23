<template>
  <div
    class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    style="min-height: calc(100vh - 300px);"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Mot de passe oublié
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Entrez votre adresse email et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <!-- Erreur -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>

        <!-- Succès -->
        <div v-if="success" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">{{ success }}</h3>
            </div>
          </div>
        </div>

        <!-- Type de compte -->
        <div>
          <label for="accountType" class="block text-sm font-medium text-gray-700 mb-2">
            Type de compte
          </label>
          <select
            id="accountType"
            v-model="selectedUserType"
            name="accountType"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
          >
            <option value="client">Client</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- Email -->
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Adresse email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
              placeholder="Adresse email"
            />
          </div>
        </div>

        <!-- Bouton envoyer -->
        <div>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">Envoi en cours...</span>
            <span v-else>Envoyer le lien de réinitialisation</span>
          </button>
        </div>

        <div class="text-center space-y-2">
          <router-link
            :to="{ path: '/login', query: { type: userType } }"
            class="font-medium text-teal-600 hover:text-teal-500"
          >
            Retour à la connexion
          </router-link>
          <div v-if="success" class="text-sm text-gray-500 mt-2">
            Vous allez être redirigé dans quelques secondes...
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()

const { requestPasswordEmail, isLoading } = useAuth()

const email = ref('')
const error = ref('')
const success = ref('')
const localLoading = ref(false)

// type de compte depuis l'URL, sinon "client"
const selectedUserType = ref(route.query.type || 'client')
const userType = computed(() => selectedUserType.value)

// loading global + local
const isSubmitting = computed(() => localLoading.value || isLoading.value)

onMounted(() => {
  console.log('ForgotPassword mounted, type =', userType.value)
})

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  if (!email.value) {
    error.value = 'Veuillez entrer votre adresse email.'
    return
  }

  try {
    localLoading.value = true
    const result = await requestPasswordEmail(email.value, userType.value)

    if (result && result.success) {
      success.value =
        result.message ||
        'Un lien de réinitialisation a été envoyé à votre adresse email.'
      email.value = ''

      // redirection vers login après 3s
      setTimeout(() => {
        router.push({ path: '/login', query: { type: userType.value } })
      }, 3000)
    } else {
      error.value =
        (result && result.error) ||
        'Une erreur est survenue. Veuillez réessayer.'
    }
  } catch (err) {
    console.error('Error submitting forgot password:', err)
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    localLoading.value = false
  }
}
</script>
