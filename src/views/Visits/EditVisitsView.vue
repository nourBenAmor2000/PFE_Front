<script setup>
import { ref, onMounted, computed } from 'vue'
import { useVisits } from '@/composables/useVisits'
import { useClients } from '@/composables/useClient'
import { useLogements } from '@/composables/useLogements'
import { useRouter, useRoute } from 'vue-router'
import { Calendar, User, Home, Save, ArrowLeft, Loader, MapPin, Phone, Edit } from 'lucide-vue-next'

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import AdminLayout from '@/layouts/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const visitStore = useVisits()
const clientStore = useClients()
const logementStore = useLogements()
const isLoading = ref(false)
const isSubmitting = ref(false)

const visit = ref({ 
  client_id: '', 
  logement_id: '', 
  visit_date: '' 
})

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      visitStore.fetchVisits(),
      clientStore.fetchClients(),
      logementStore.fetchLogements()
    ])
    
    const v = visitStore.visits.find(v => v._id === route.params.id || v.id === route.params.id)
    if (v) {
      // Format date for datetime-local input
      const visitDate = v.visit_date ? new Date(v.visit_date).toISOString().slice(0, 16) : ''
      visit.value = { 
        ...v,
        visit_date: visitDate
      }
    } else {
      alert('Visite non trouvée')
      router.push('/admin/visits')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    alert('Erreur lors du chargement: ' + (error.message || 'Erreur inconnue'))
  } finally {
    isLoading.value = false
  }
})

const submit = async () => {
  isSubmitting.value = true
  try {
    // Format date for backend (ISO string)
    const payload = {
      ...visit.value,
      visit_date: visit.value.visit_date ? new Date(visit.value.visit_date).toISOString() : null
    }
    await visitStore.updateVisit(route.params.id, payload)
    router.push('/admin/visits')
  } catch (error) {
    const errorMsg = visitStore.error || error.message || 'Erreur lors de la mise à jour'
    alert('Erreur: ' + errorMsg)
    console.error('Error updating visit:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Computed properties for validation
const isFormValid = computed(() => {
  return visit.value.client_id && 
         visit.value.logement_id && 
         visit.value.visit_date
})

// Get selected client and logement details
const selectedClient = computed(() => {
  return clientStore.clients.find(c => c._id === visit.value.client_id)
})

const selectedLogement = computed(() => {
  return logementStore.logements.find(l => l._id === visit.value.logement_id)
})

// Format date for display
const formattedDate = computed(() => {
  if (!visit.value.visit_date) return ''
  return new Date(visit.value.visit_date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Check if visit is in the past
const isPastVisit = computed(() => {
  if (!visit.value.visit_date) return false
  return new Date(visit.value.visit_date) < new Date()
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
            @click="router.push('/admin/visits')" 
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft :size="16" />
            Retour aux visites
          </Button>
          
          <div class="flex items-center gap-3">
            <Calendar :size="32" class="text-blue-600" />
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Modifier la Visite</h1>
              <p class="text-gray-600 mt-1">Mettez à jour les informations de la visite</p>
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
              <Edit :size="20" class="text-blue-600" />
              Modifier la visite
              <span v-if="selectedClient && selectedLogement" class="text-gray-500 font-normal text-sm">
                - {{ selectedClient.name }} / {{ selectedLogement.title }}
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
                <Select v-model="visit.client_id" required>
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
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">{{ client.name }}</p>
                          <p class="text-xs text-gray-500 truncate">{{ client.email }}</p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p class="text-xs text-gray-500">
                  {{ clientStore.clients.length }} client(s) disponible(s)
                </p>
              </div>

              <!-- Client Details Preview -->
              <div v-if="selectedClient" class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 class="text-sm font-medium text-blue-900 mb-2">Informations du client</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div class="flex items-center gap-2">
                    <User :size="14" class="text-blue-600" />
                    <span class="text-blue-700">{{ selectedClient.name }}</span>
                  </div>
                  <div v-if="selectedClient.phone" class="flex items-center gap-2">
                    <Phone :size="14" class="text-blue-600" />
                    <span class="text-blue-700">{{ selectedClient.phone }}</span>
                  </div>
                  <div v-if="selectedClient.email" class="md:col-span-2 flex items-center gap-2">
                    <span class="text-blue-700">{{ selectedClient.email }}</span>
                  </div>
                </div>
              </div>

              <!-- Logement Selection -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Home :size="16" />
                  Logement *
                </label>
                <Select v-model="visit.logement_id" required>
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
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">{{ logement.title }}</p>
                          <div class="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin :size="12" />
                            <span class="truncate">{{ logement.location }}</span>
                            <span>•</span>
                            <span>{{ logement.price }} TND/mois</span>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p class="text-xs text-gray-500">
                  {{ logementStore.logements.length }} logement(s) disponible(s)
                </p>
              </div>

              <!-- Logement Details Preview -->
              <div v-if="selectedLogement" class="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 class="text-sm font-medium text-green-900 mb-2">Informations du logement</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div class="flex items-center gap-2">
                    <Home :size="14" class="text-green-600" />
                    <span class="text-green-700 font-medium">{{ selectedLogement.title }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <MapPin :size="14" class="text-green-600" />
                    <span class="text-green-700">{{ selectedLogement.location }}</span>
                  </div>
                  <div v-if="selectedLogement.surface" class="flex items-center gap-2">
                    <span class="text-green-700">{{ selectedLogement.surface }} m²</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-green-700 font-bold">{{ selectedLogement.price }} TND/mois</span>
                  </div>
                </div>
                <p v-if="selectedLogement.description" class="text-xs text-green-600 mt-2 line-clamp-2">
                  {{ selectedLogement.description }}
                </p>
              </div>

              <!-- Visit Date -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar :size="16" />
                  Date de la visite *
                </label>
                <Input 
                  type="datetime-local" 
                  v-model="visit.visit_date" 
                  required
                  class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                />
                <p v-if="formattedDate" class="text-sm font-medium" :class="isPastVisit ? 'text-orange-600' : 'text-blue-600'">
                  {{ formattedDate }}
                  <span v-if="isPastVisit" class="text-orange-500 text-xs ml-2">(Visite passée)</span>
                  <span v-else class="text-green-500 text-xs ml-2">(Visite future)</span>
                </p>
              </div>

              <!-- Visit Status -->
              <div v-if="isPastVisit" class="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div class="flex items-center gap-2 text-sm">
                  <Calendar :size="16" class="text-orange-600" />
                  <span class="text-orange-700 font-medium">Cette visite est déjà passée</span>
                </div>
                <p class="text-xs text-orange-600 mt-1">
                  La modification des visites passées peut affecter les statistiques historiques.
                </p>
              </div>

              <!-- Visit Summary -->
              <div v-if="selectedClient && selectedLogement && visit.visit_date" 
                   class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 class="text-sm font-medium text-purple-900 mb-3">Récapitulatif de la visite</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-purple-700">Client:</span>
                    <span class="text-purple-900 font-medium">{{ selectedClient.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-purple-700">Logement:</span>
                    <span class="text-purple-900 font-medium">{{ selectedLogement.title }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-purple-700">Date:</span>
                    <span class="text-purple-900 font-medium">{{ formattedDate }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-purple-700">Statut:</span>
                    <span class="text-purple-900 font-medium" :class="isPastVisit ? 'text-orange-600' : 'text-green-600'">
                      {{ isPastVisit ? 'Terminée' : 'Planifiée' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  variant="outline" 
                  @click="router.push('/admin/visits')"
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
              <Calendar :size="20" class="text-blue-600 mt-0.5" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-blue-900">Conseils</h3>
              <ul class="mt-1 text-sm text-blue-700 space-y-1">
                <li>• Les champs marqués d'un * sont obligatoires</li>
                <li>• Toutes les modifications seront appliquées immédiatement</li>
                <li>• Pour les visites passées, vérifiez l'exactitude des informations</li>
                <li>• Informez le client des changements de date si nécessaire</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>