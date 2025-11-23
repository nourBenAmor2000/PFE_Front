<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h1 class="text-xl font-semibold text-gray-900">
        Vérification de votre email
      </h1>

      <p class="text-sm text-gray-600">
        Un code à 6 chiffres a été envoyé à
        <span class="font-semibold">{{ email }}</span>.
        Entrez-le ci-dessous pour activer votre compte.
      </p>

      <p v-if="error" class="text-sm text-red-600">
        {{ error }}
      </p>
      <p v-if="success" class="text-sm text-green-600">
        {{ success }}
      </p>

      <form class="space-y-4" @submit.prevent="submit">
        <input
          v-model="code"
          maxlength="6"
          inputmode="numeric"
          autocomplete="one-time-code"
          class="w-full h-11 rounded-xl border border-gray-300 px-3.5 text-[15px]
                 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Code à 6 chiffres"
          required
        />

        <button
          type="submit"
          :disabled="loading || code.length !== 6"
          class="w-full h-11 rounded-xl bg-teal-600 text-white font-semibold
                 flex items-center justify-center gap-2
                 disabled:opacity-60 hover:bg-teal-700 transition"
        >
          <span v-if="!loading">Valider le code</span>
          <span v-else class="inline-flex items-center gap-2">
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"></span>
            Vérification…
          </span>
        </button>
      </form>

      <button
        type="button"
        class="text-sm text-gray-500 hover:text-teal-600"
        @click="goBack"
      >
        Revenir à la page de connexion
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

// email passé dans l’URL: /verify-email?email=xxx
const email = ref<string>((route.query.email as string) || '')

const code = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const API_BASE =
  ((import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/+$/, '') ||
    'http://localhost:8000/api')

const submit = async () => {
  error.value = ''
  success.value = ''

  if (!email.value) {
    error.value = "Email manquant. Retournez à l'inscription."
    return
  }

  if (code.value.length !== 6) {
    error.value = 'Le code doit contenir 6 chiffres.'
    return
  }

  loading.value = true
  try {
    const { data } = await axios.post(
      `${API_BASE}/agent/verify-code`,
      {
        email: email.value,   // ⚠️ bien envoyer email
        code: code.value      // ⚠️ bien envoyer code
      },
      { headers: { Accept: 'application/json' } }
    )

    if (data.success) {
      success.value = data.message || 'Email vérifié avec succès.'
      // redirection vers login après un petit délai
      setTimeout(() => router.push('/login'), 1200)
    } else {
      error.value = data.message || 'Code invalide ou expiré.'
    }
  } catch (err: any) {
    console.error('Verify code error:', err?.response?.data || err?.message)
    // récupérer le message Laravel en 422
    error.value =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      'Code invalide ou expiré.'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/login')
}
</script>
