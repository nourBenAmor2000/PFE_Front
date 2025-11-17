<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLogements } from '@/composables/useLogements'
import { useCategories } from '@/composables/useCategories'
import { useAgencies } from '@/composables/useAgencies'
import { useRouter } from 'vue-router'
import { Home, Building2, Tag, MapPin, Square, Layers, DollarSign, Save, ArrowLeft, Loader } from 'lucide-vue-next'

// ✅ shadcn-vue components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()
const logementStore = useLogements()
const categoryStore = useCategories()
const agencyStore = useAgencies()
const isLoading = ref(false)
const isSubmitting = ref(false)

const { categories, fetchCategories } = categoryStore
const { agencies, fetchAgencies } = agencyStore

const logement = ref({
  title: '',
  description: '',
  price: '',
  category_id: '',
  agency_id: '',
  latitude: '',
  longitude: '',
  location: '',
  surface: '',
  floor: '',
  free: false
})

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([fetchCategories(), fetchAgencies()])
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    isLoading.value = false
  }
})

const submit = async () => {
  isSubmitting.value = true
  try {
    await logementStore.addLogement(logement.value)
    router.push('/logements')
  } catch (error) {
    console.error('Error creating logement:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Computed properties for validation
const isFormValid = computed(() => {
  return logement.value.title && 
         logement.value.description && 
         logement.value.price && 
         logement.value.category_id && 
         logement.value.agency_id
})

// Format price display
const formattedPrice = computed(() => {
  if (!logement.value.price) return '0'
  return parseInt(logement.value.price).toLocaleString('fr-FR')
})
</script>

<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <Button 
            variant="ghost" 
            @click="router.push('/logements')" 
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft :size="16" />
            Retour aux logements
          </Button>
          
          <div class="flex items-center gap-3">
            <Home :size="32" class="text-blue-600" />
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Nouveau Logement</h1>
              <p class="text-gray-600 mt-1">Ajoutez un nouveau logement au système</p>
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
              <Home :size="20" class="text-blue-600" />
              Informations du logement
            </CardTitle>
          </CardHeader>
          
          <CardContent class="p-6 bg-white">
            <form @submit.prevent="submit" class="space-y-6">
              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Title -->
                <div class="space-y-2 md:col-span-2">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Home :size="16" />
                    Titre du logement *
                  </Label>
                  <Input 
                    v-model="logement.title" 
                    placeholder="Ex: Appartement moderne centre-ville" 
                    required
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- Description -->
                <div class="space-y-2 md:col-span-2">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    Description *
                  </Label>
                  <textarea
                    v-model="logement.description"
                    placeholder="Décrivez le logement en détail..."
                    required
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <!-- Price -->
                <div class="space-y-2">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <DollarSign :size="16" />
                    Prix (TND) *
                  </Label>
                  <Input 
                    v-model="logement.price" 
                    type="number" 
                    placeholder="Prix mensuel" 
                    required
                    min="0"
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                  <p v-if="logement.price" class="text-sm text-green-600 font-medium">
                    {{ formattedPrice }} TND / mois
                  </p>
                </div>

                <!-- Surface -->
                <div class="space-y-2">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Square :size="16" />
                    Surface (m²)
                  </Label>
                  <Input 
                    v-model="logement.surface" 
                    type="number" 
                    placeholder="Surface en m²" 
                    min="0"
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Category and Agency -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Category -->
                <div class="space-y-2">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Tag :size="16" />
                    Catégorie *
                  </Label>
                  <Select v-model="logement.category_id" required>
                    <SelectTrigger class="w-full transition-colors focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="cat in categories"
                        :key="cat._id"
                        :value="cat._id"
                      >
                        <div class="flex items-center gap-2">
                          <Tag :size="14" class="text-gray-500" />
                          {{ cat.name }}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p class="text-xs text-gray-500">
                    {{ categories.length }} catégorie(s) disponible(s)
                  </p>
                </div>

                <!-- Agency -->
                <div class="space-y-2">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Building2 :size="16" />
                    Agence *
                  </Label>
                  <Select v-model="logement.agency_id" required>
                    <SelectTrigger class="w-full transition-colors focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Sélectionner une agence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="agency in agencies"
                        :key="agency._id"
                        :value="agency._id"
                      >
                        <div class="flex items-center gap-2">
                          <Building2 :size="14" class="text-gray-500" />
                          {{ agency.name }}
                          <span class="text-gray-500 text-xs">({{ agency.city }})</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p class="text-xs text-gray-500">
                    {{ agencies.length }} agence(s) disponible(s)
                  </p>
                </div>
              </div>

              <!-- Location Information -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Location -->
                <div class="space-y-2 md:col-span-3">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin :size="16" />
                    Localisation
                  </Label>
                  <Input 
                    v-model="logement.location" 
                    placeholder="Ville, adresse ou région" 
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- Latitude -->
                <div class="space-y-2">
                  <Label class="text-sm font-medium text-gray-700">
                    Latitude
                  </Label>
                  <Input 
                    v-model="logement.latitude" 
                    placeholder="ex: 36.8065" 
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- Longitude -->
                <div class="space-y-2">
                  <Label class="text-sm font-medium text-gray-700">
                    Longitude
                  </Label>
                  <Input 
                    v-model="logement.longitude" 
                    placeholder="ex: 10.1815" 
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- Floor -->
                <div class="space-y-2">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Layers :size="16" />
                    Étage
                  </Label>
                  <Input 
                    v-model="logement.floor" 
                    type="number" 
                    placeholder="Numéro d'étage" 
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Availability -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    Disponibilité
                  </Label>
                  <p class="text-xs text-gray-500 mt-1">
                    Le logement est-il disponible à la location ?
                  </p>
                </div>
                <Switch v-model:checked="logement.free" />
              </div>

              <!-- Status Indicator -->
              <div v-if="logement.free" class="p-3 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-center gap-2 text-sm">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-green-700 font-medium">Le logement est marqué comme disponible</span>
                </div>
              </div>
              <div v-else class="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div class="flex items-center gap-2 text-sm">
                  <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span class="text-orange-700 font-medium">Le logement est marqué comme non disponible</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  variant="outline" 
                  @click="router.push('/logements')"
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
                  <span v-if="isSubmitting">Création en cours...</span>
                  <span v-else>Créer le logement</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <!-- Form Tips -->
        <div v-if="!isLoading" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <Home :size="20" class="text-blue-600 mt-0.5" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-blue-900">Conseils</h3>
              <ul class="mt-1 text-sm text-blue-700 space-y-1">
                <li>• Les champs marqués d'un * sont obligatoires</li>
                <li>• Fournissez une description détaillée pour attirer plus de locataires</li>
                <li>• Les coordonnées GPS permettent l'affichage sur une carte</li>
                <li>• Marquez comme "Disponible" uniquement si le logement est libre</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>