<template>
  <div class="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
       style="min-height: calc(100vh - 300px);">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Réinitialiser le mot de passe
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Entrez votre nouveau mot de passe.
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <p class="text-sm font-medium text-red-800">{{ error }}</p>
        </div>

        <div v-if="success" class="rounded-md bg-green-50 p-4">
          <p class="text-sm font-medium text-green-800">{{ success }}</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-md w-full px-3 py-2 border border-gray-300
                     placeholder-gray-500 text-gray-900 focus:outline-none
                     focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              v-model="passwordConfirmation"
              type="password"
              required
              class="appearance-none rounded-md w-full px-3 py-2 border border-gray-300
                     placeholder-gray-500 text-gray-900 focus:outline-none
                     focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent
                 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Réinitialisation...</span>
          <span v-else>Réinitialiser le mot de passe</span>
        </button>

        <div class="text-center">
          <router-link to="/login" class="text-sm text-teal-600 hover:text-teal-500">
            Retour à la connexion
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const API_BASE =
  (import.meta.env.VITE_BACKEND_URL && import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")) ||
  "http://localhost:8000/api"

const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const isSubmitting = computed(() => loading.value)

const token = computed(() => route.query.token || '')
const email = computed(() => route.query.email || '')

onMounted(() => {
  console.log('ResetPassword mounted with token=', token.value, 'email=', email.value)
})

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  if (!token.value || !email.value) {
    error.value = 'Lien de réinitialisation invalide.'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  try {
    loading.value = true
    const { data } = await axios.post(`${API_BASE}/client/password/reset`, {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    if (data && data.success) {
      success.value = data.message || 'Mot de passe réinitialisé avec succès.'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      error.value = data.message || 'Impossible de réinitialiser le mot de passe.'
    }
  } catch (e) {
    console.error(e)
    error.value =
      e?.response?.data?.message ||
      'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>
