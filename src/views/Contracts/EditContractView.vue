<script setup>
import { ref, onMounted, computed } from 'vue'
import { useContracts } from '@/composables/useContrats'
import { useClients } from '@/composables/useClient'
import { useLogements } from '@/composables/useLogements'
import { useRouter, useRoute } from 'vue-router'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Save, ArrowLeft, User, Home, Calendar, DollarSign, FileText, Loader } from 'lucide-vue-next'
import AdminLayout from '@/layouts/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const contractStore = useContracts()
const clientStore = useClients()
const logementStore = useLogements()
const isLoading = ref(false)
const isSubmitting = ref(false)

const contract = ref({
  client_id: '',
  logement_id: '',
  start_date: '',
  end_date: '',
  amount: ''
})

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      clientStore.fetchClients(), 
      logementStore.fetchLogements(), 
      contractStore.fetchContracts()
    ])

    const existing = contractStore.contracts.find(c => c._id === route.params.id)
    if (existing) {
      contract.value = { ...existing }
    }
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
})

const submit = async () => {
  isSubmitting.value = true
  try {
    await contractStore.updateContract(route.params.id, contract.value)
    router.push('/contracts')
  } catch (error) {
    console.error('Error updating contract:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Computed properties for validation
const isFormValid = computed(() => {
  return contract.value.client_id && 
         contract.value.logement_id && 
         contract.value.start_date && 
         contract.value.end_date && 
         contract.value.amount
})

// Calculate minimum end date (start date + 1 day)
const minEndDate = computed(() => {
  if (!contract.value.start_date) return ''
  const startDate = new Date(contract.value.start_date)
  startDate.setDate(startDate.getDate() + 1)
  return startDate.toISOString().split('T')[0]
})

// Calculate contract duration
const contractDuration = computed(() => {
  if (!contract.value.start_date || !contract.value.end_date) return 0
  
  const start = new Date(contract.value.start_date)
  const end = new Date(contract.value.end_date)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// Get current client and logement details
const currentClient = computed(() => {
  return clientStore.clients.find(c => c._id === contract.value.client_id)
})

const currentLogement = computed(() => {
  return logementStore.logements.find(l => l._id === contract.value.logement_id)
})
</script>

<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <Button 
            variant="ghost" 
            @click="router.push('/contracts')" 
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft :size="16" />
            Retour aux contrats
          </Button>
          
          <div class="flex items-center gap-3">
            <FileText :size="32" class="text-blue-600" />
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Modifier le Contrat</h1>
              <p class="text-gray-600 mt-1">Mettez à jour les informations du contrat</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
          <Loader class="animate-spin text-blue-600 mb-4" :size="32" />
          <p class="text-gray-600">Chargement des données...</p>
        </div>

        <!-- Form Card -->
        <Card v-else class="shadow-lg border-0">
          <CardHeader class="border-b border-gray-200 bg-white">
            <CardTitle class="flex items-center gap-2 text-xl">
              <FileText :size="20" class="text-blue-600" />
              Modifier le contrat
              <span v-if="currentClient && currentLogement" class="text-gray-500 font-normal text-sm">
                - {{ currentClient.name }} / {{ currentLogement.title }}
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent class="p-6 bg-white">
            <form @submit.prevent="submit" class="space-y-6">
              <!-- Client Selection -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User :size="16" />
                  Client *
                </label>
                <Select v-model="contract.client_id" required>
                  <SelectTrigger class="w-full transition-colors focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="client in clientStore.clients"
                      :key="client._id"
                      :value="client._id"
                    >
                      <div class="flex items-center gap-2">
                        <User :size="14" class="text-gray-500" />
                        {{ client.name }}
                        <span v-if="client.email" class="text-gray-500 text-xs">
                          ({{ client.email }})
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p class="text-xs text-gray-500">
                  {{ clientStore.clients.length }} client(s) disponible(s)
                </p>
              </div>

              <!-- Logement Selection -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Home :size="16" />
                  Logement *
                </label>
                <Select v-model="contract.logement_id" required>
                  <SelectTrigger class="w-full transition-colors focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Sélectionner un logement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="logement in logementStore.logements"
                      :key="logement._id"
                      :value="logement._id"
                    >
                      <div class="flex items-center gap-2">
                        <Home :size="14" class="text-gray-500" />
                        {{ logement.title }}
                        <span v-if="logement.price" class="text-blue-600 text-xs font-medium">
                          {{ logement.price }} TND
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p class="text-xs text-gray-500">
                  {{ logementStore.logements.length }} logement(s) disponible(s)
                </p>
              </div>

              <!-- Dates -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Start Date -->
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar :size="16" />
                    Date de début *
                  </label>
                  <Input 
                    type="date" 
                    v-model="contract.start_date" 
                    required
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- End Date -->
                <div class="space-y-2">
                  <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar :size="16" />
                    Date de fin *
                  </label>
                  <Input 
                    type="date" 
                    v-model="contract.end_date" 
                    required
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                    :min="minEndDate"
                  />
                </div>
              </div>

              <!-- Duration Info -->
              <div v-if="contractDuration > 0" class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-blue-700 font-medium">Durée du contrat:</span>
                  <span class="text-blue-900 font-bold">{{ contractDuration }} jours</span>
                </div>
              </div>

              <!-- Amount -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <DollarSign :size="16" />
                  Montant mensuel *
                </label>
                <Input 
                  type="number" 
                  v-model="contract.amount" 
                  placeholder="Montant du loyer mensuel"
                  required
                  min="0"
                  step="0.01"
                  class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-xs text-gray-500">Montant en TND (Dinars Tunisiens)</p>
              </div>

              <!-- Total Amount Preview -->
              <div v-if="contract.amount && contractDuration > 0" class="p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-green-900">Montant total du contrat</p>
                    <p class="text-xs text-green-700">
                      {{ Math.ceil(contractDuration / 30) }} mois × {{ contract.amount }} TND
                    </p>
                  </div>
                  <span class="text-lg font-bold text-green-700">
                    {{ (contract.amount * Math.ceil(contractDuration / 30)).toFixed(2) }} TND
                  </span>
                </div>
              </div>

              <!-- Contract Status -->
              <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Statut du contrat</h4>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Début:</span>
                  <span class="font-medium">{{ new Date(contract.start_date).toLocaleDateString('fr-FR') }}</span>
                </div>
                <div class="flex items-center justify-between text-sm mt-1">
                  <span class="text-gray-600">Fin:</span>
                  <span class="font-medium">{{ new Date(contract.end_date).toLocaleDateString('fr-FR') }}</span>
                </div>
                <div class="flex items-center justify-between text-sm mt-1">
                  <span class="text-gray-600">Statut:</span>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': new Date(contract.end_date) > new Date(),
                      'bg-red-100 text-red-800': new Date(contract.end_date) <= new Date()
                    }"
                  >
                    {{ new Date(contract.end_date) > new Date() ? 'Actif' : 'Expiré' }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  variant="outline" 
                  @click="router.push('/contracts')"
                  class="flex-1 flex items-center justify-center gap-2"
                  :disabled="isSubmitting"
                >
                  <ArrowLeft :size="16" />
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  variant="default" 
                  class="flex-1 flex items-center justify-center gap-2"
                  :disabled="isSubmitting || !isFormValid"
                >
                  <Save :size="16" />
                  <span v-if="isSubmitting">Mise à jour...</span>
                  <span v-else>Mettre à jour</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <!-- Form Tips -->
        <div v-if="!isLoading" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <FileText :size="20" class="text-blue-600 mt-0.5" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-blue-900">Conseils</h3>
              <ul class="mt-1 text-sm text-blue-700 space-y-1">
                <li>• Les champs marqués d'un * sont obligatoires</li>
                <li>• La date de fin doit être postérieure à la date de début</li>
                <li>• Toutes les modifications seront appliquées immédiatement</li>
                <li>• Vérifiez la disponibilité du logement avant de modifier</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>