<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAgencies } from '@/composables/useAgencies'
import { Plus, Search, Edit, Trash2, Building2, Phone, MapPin, User } from 'lucide-vue-next'

import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const agencyStore = useAgencies()
const router = useRouter()
const isLoading = ref(false)
const searchQuery = ref('')

onMounted(() => {
  isLoading.value = true
  agencyStore.fetchAgencies().finally(() => {
    isLoading.value = false
  })
})

const deleteAgency = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette agence ? Cette action est irréversible.')) {
    await agencyStore.deleteAgency(id)
  }
}

const filteredAgencies = computed(() => {
  if (!searchQuery.value) return agencyStore.agencies
  
  const query = searchQuery.value.toLowerCase()
  return agencyStore.agencies.filter(agency => 
    agency.name.toLowerCase().includes(query) ||
    agency.username.toLowerCase().includes(query) ||
    agency.city.toLowerCase().includes(query)
  )
})
</script>

<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <Building2 :size="32" class="text-blue-600" />
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Gestion des Agences</h1>
                <p class="text-gray-600 mt-1">Gérez toutes les agences de votre système</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            @click="router.push('/agencies/add')" 
            class="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus :size="18" />
            Ajouter une Agence
          </Button>
        </div>

        <!-- Controls Section -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher une agence..." 
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div class="flex items-center">
            <span class="text-sm text-gray-600 font-medium">
              {{ filteredAgencies.length }} agence(s) trouvée(s)
            </span>
          </div>
        </div>

        <!-- Table Section -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
            <div class="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600">Chargement des agences...</p>
          </div>

          <!-- Empty States -->
          <div v-else-if="filteredAgencies.length === 0 && searchQuery" class="flex flex-col items-center justify-center py-12 px-4">
            <Building2 :size="56" class="text-gray-400 mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune agence trouvée</h3>
            <p class="text-gray-600 text-center mb-6 max-w-sm">
              Aucune agence ne correspond à votre recherche "{{ searchQuery }}"
            </p>
            <Button variant="outline" @click="searchQuery = ''" class="flex items-center gap-2">
              Effacer la recherche
            </Button>
          </div>

          <div v-else-if="filteredAgencies.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
            <Building2 :size="56" class="text-gray-400 mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune agence</h3>
            <p class="text-gray-600 text-center mb-6">Commencez par ajouter votre première agence</p>
            <Button variant="primary" @click="router.push('/agencies/add')" class="flex items-center gap-2">
              <Plus :size="18" />
              Ajouter une agence
            </Button>
          </div>

          <!-- Table -->
          <Table v-else class="w-full">
            <TableHead class="bg-gray-50">
              <TableRow>
                <TableCell class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nom
                </TableCell>
                <TableCell class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Utilisateur
                </TableCell>
                <TableCell class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Téléphone
                </TableCell>
                <TableCell class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Adresse
                </TableCell>
                <TableCell class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ville
                </TableCell>
                <TableCell class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody class="bg-white divide-y divide-gray-200">
              <TableRow 
                v-for="a in filteredAgencies" 
                :key="a._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Building2 :size="18" class="text-gray-500 flex-shrink-0" />
                    <span class="text-sm font-medium text-gray-900">{{ a.name }}</span>
                  </div>
                </TableCell>
                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <User :size="18" class="text-gray-500 flex-shrink-0" />
                    <span class="text-sm text-gray-700">{{ a.username }}</span>
                  </div>
                </TableCell>
                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Phone :size="18" class="text-gray-500 flex-shrink-0" />
                    <span class="text-sm text-gray-700">{{ a.phone || 'Non renseigné' }}</span>
                  </div>
                </TableCell>
                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <MapPin :size="18" class="text-gray-500 flex-shrink-0" />
                    <span class="text-sm text-gray-700">{{ a.address || 'Non renseignée' }}</span>
                  </div>
                </TableCell>
                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-700">{{ a.city || 'Non renseignée' }}</span>
                </TableCell>
                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center gap-2">
                    <Button 
                      variant="outline" 
                      @click="router.push(`/agencies/edit/${a._id}`)"
                      class="flex items-center gap-2 px-3 py-2 text-xs"
                    >
                      <Edit :size="14" />
                      Modifier
                    </Button>
                    <Button 
                      variant="destructive" 
                      @click="deleteAgency(a._id)"
                      class="flex items-center gap-2 px-3 py-2 text-xs"
                    >
                      <Trash2 :size="14" />
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>