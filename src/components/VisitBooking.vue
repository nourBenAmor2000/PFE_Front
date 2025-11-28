<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-7">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Planifier une visite</h3>
        <p class="text-sm text-gray-500 mt-1">
          Choisissez la date, l’horaire et le type de visite qui vous conviennent.
        </p>
      </div>
      <div class="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-orange-50">
        <svg
          class="w-5 h-5 text-orange-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>

    <form @submit.prevent="handleBooking" class="space-y-4">
      <!-- Messages d’erreur / succès -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
      >
        {{ error }}
      </div>

      <div
        v-if="success"
        class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm"
      >
        {{ success }}
      </div>

      <!-- Date -->
      <div>
        <label for="visitDate" class="block text-sm font-medium text-gray-700 mb-2">
          Date souhaitée
        </label>
        <input
          id="visitDate"
          v-model="form.date"
          type="date"
          :min="minDate"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
        />
      </div>

      <!-- Heure -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Horaire souhaité
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="time in availableTimes"
            :key="time"
            type="button"
            @click="selectTime(time)"
            :class="[
              'px-3 py-2 text-sm rounded-lg border transition-colors',
              form.time === time
                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-600'
            ]"
          >
            {{ time }}
          </button>
        </div>
      </div>

      <!-- Type de visite -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Type de visite
        </label>
        <select
          v-model="form.type"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
        >
          <option value="">Sélectionner le type de visite</option>
          <option value="in-person">Visite sur place</option>
          <option value="virtual">Visite virtuelle</option>
        </select>
      </div>

      <!-- Message -->
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
          Message (optionnel)
        </label>
        <textarea
          id="message"
          v-model="form.message"
          rows="3"
          placeholder="Précisez vos questions ou besoins particuliers..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
        ></textarea>
      </div>

      <!-- Infos contact (si non connecté) -->
      <div v-if="!isAuthenticated" class="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 class="font-medium text-gray-900 text-sm">
          Informations de contact
        </h4>
        <p class="text-xs text-gray-500 mb-1">
          Ces informations seront utilisées par l’agence pour vous confirmer la visite.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="guestName" class="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              id="guestName"
              v-model="form.guestName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
          <div>
            <label for="guestEmail" class="block text-sm font-medium text-gray-700 mb-1">
              Adresse e-mail
            </label>
            <input
              id="guestEmail"
              v-model="form.guestEmail"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
          <div class="md:col-span-2">
            <label for="guestPhone" class="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
            </label>
            <input
              id="guestPhone"
              v-model="form.guestPhone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Bouton de soumission -->
      <button
        type="submit"
        :disabled="isLoading || !form.date || !form.time || !form.type"
        class="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg
          v-if="isLoading"
          class="animate-spin h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
          ></path>
        </svg>
        <span>
          {{ isLoading ? 'Enregistrement de votre demande...' : 'Réserver une visite' }}
        </span>
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

// Créneaux horaires disponibles (format 24h, plus adapté au FR)
const availableTimes = [
  '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00'
]

// Date minimale : demain
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
    // TODO: remplacer ce mock par l’appel réel à votre API de réservation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const bookingData = {
      propertyId: props.propertyId,
      agentId: props.agentId,
      clientId: user.value?.id || null,
      date: form.value.date,
      time: form.value.time,
      type: form.value.type,
      message: form.value.message,
      status: 'pending',
      // Infos invité pour les utilisateurs non authentifiés
      guestInfo: !isAuthenticated.value
        ? {
            name: form.value.guestName,
            email: form.value.guestEmail,
            phone: form.value.guestPhone
          }
        : null
    }

    console.log('Demande de réservation :', bookingData)

    success.value =
      'Votre demande de visite a été enregistrée. L’agence vous contactera pour confirmer le créneau.'
    
    // Réinitialiser le formulaire
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
    console.error(err)
    error.value =
      'Impossible de planifier la visite pour le moment. Veuillez réessayer ultérieurement.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Pré-remplir les infos si l’utilisateur est connecté
  if (isAuthenticated.value && user.value) {
    form.value.guestName = user.value.name
    form.value.guestEmail = user.value.email
    form.value.guestPhone = user.value.phone || ''
  }
})
</script>
