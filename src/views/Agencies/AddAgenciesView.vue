<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAgencies } from '@/composables/useAgencies'
import { Building2, User, MapPin, Phone, Image, Navigation, Save, ArrowLeft } from 'lucide-vue-next'

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Label from '@/components/ui/label/Label.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()
const agencyStore = useAgencies()
const isLoading = ref(false)

const agency = ref({
  name: '',
  username: '',
  address: '',
  phone: '',
  logo: '',
  location: '',
  city: ''
})

const submit = async () => {
  isLoading.value = true
  try {
    await agencyStore.addAgency(agency.value)
    router.push('/agencies')
  } catch (error) {
    console.error('Error adding agency:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <Button 
            variant="ghost" 
            @click="router.push('/agencies')" 
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft :size="16" />
            Retour aux agences
          </Button>
          
          <div class="flex items-center gap-3">
            <Building2 :size="32" class="text-blue-600" />
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Ajouter une Agence</h1>
              <p class="text-gray-600 mt-1">Créez une nouvelle agence dans le système</p>
            </div>
          </div>
        </div>

        <!-- Form Card -->
        <Card class="shadow-lg border-0">
          <CardHeader class="border-b border-gray-200 bg-white">
            <CardTitle class="flex items-center gap-2 text-xl">
              <Building2 :size="20" class="text-blue-600" />
              Informations de l'agence
            </CardTitle>
          </CardHeader>
          
          <CardContent class="p-6 bg-white">
            <form @submit.prevent="submit" class="space-y-6">
              <!-- Agency Name -->
              <div class="space-y-2">
                <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building2 :size="16" />
                  Nom de l'agence *
                </Label>
                <Input 
                  v-model="agency.name"
                  placeholder="Entrez le nom de l'agence"
                  required
                  class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Username -->
              <div class="space-y-2">
                <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User :size="16" />
                  Nom d'utilisateur *
                </Label>
                <Input 
                  v-model="agency.username"
                  placeholder="Entrez le nom d'utilisateur"
                  required
                  class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Contact Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Phone -->
                <div class="space-y-2">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone :size="16" />
                    Téléphone
                  </Label>
                  <Input 
                    v-model="agency.phone"
                    placeholder="Numéro de téléphone"
                    type="tel"
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- City -->
                <div class="space-y-2">
                  <Label class="text-sm font-medium text-gray-700">
                    Ville
                  </Label>
                  <Input 
                    v-model="agency.city"
                    placeholder="Ville"
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Address -->
              <div class="space-y-2">
                <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin :size="16" />
                  Adresse
                </Label>
                <Input 
                  v-model="agency.address"
                  placeholder="Adresse complète"
                  class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Location & Logo -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Location Coordinates -->
                <div class="space-y-2">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Navigation :size="16" />
                    Coordonnées GPS
                  </Label>
                  <Input 
                    v-model="agency.location"
                    placeholder="ex: 48.8566, 2.3522"
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                  <p class="text-xs text-gray-500">Latitude, Longitude</p>
                </div>

                <!-- Logo URL -->
                <div class="space-y-2">
                  <Label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Image :size="16" />
                    Logo URL
                  </Label>
                  <Input 
                    v-model="agency.logo"
                    placeholder="https://example.com/logo.png"
                    type="url"
                    class="w-full transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Logo Preview -->
              <div v-if="agency.logo" class="space-y-2">
                <Label class="text-sm font-medium text-gray-700">
                  Aperçu du logo
                </Label>
                <div class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <img 
                    :src="agency.logo" 
                    alt="Logo preview" 
                    class="w-16 h-16 object-contain rounded border border-gray-300"
                    @error="agency.logo = ''"
                  >
                  <div class="flex-1">
                    <p class="text-sm text-gray-600">Logo chargé depuis:</p>
                    <p class="text-xs text-gray-500 truncate">{{ agency.logo }}</p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button 
                  type="button"
                  variant="outline" 
                  @click="router.push('/agencies')"
                  class="flex-1 flex items-center justify-center gap-2"
                  :disabled="isLoading"
                >
                  <ArrowLeft :size="16" />
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  variant="default" 
                  class="flex-1 flex items-center justify-center gap-2"
                  :disabled="isLoading || !agency.name || !agency.username"
                >
                  <Save :size="16" />
                  <span v-if="isLoading">Création en cours...</span>
                  <span v-else>Créer l'agence</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <!-- Form Tips -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <Building2 :size="20" class="text-blue-600 mt-0.5" />
            </div>
            <div>
              <h3 class="text-sm font-medium text-blue-900">Conseils</h3>
              <ul class="mt-1 text-sm text-blue-700 space-y-1">
                <li>• Les champs marqués d'un * sont obligatoires</li>
                <li>• Le nom d'utilisateur doit être unique</li>
                <li>• Les coordonnées GPS doivent être au format "latitude, longitude"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>