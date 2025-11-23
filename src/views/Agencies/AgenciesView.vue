<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAgencies } from '@/composables/useAgencies'
import { Plus, Search, Edit, Trash2, Building2, Phone, MapPin, User } from 'lucide-vue-next'

import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
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
    <div class="p-6 space-y-6">
      <!-- Header / Breadcrumb + Actions -->
      <section class="bg-white rounded-2xl border shadow-sm p-5">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <nav class="text-sm text-gray-500 mb-1">
              <span class="hover:text-gray-700 cursor-default">Home</span>
              <span class="mx-2">›</span>
              <span class="text-orange-600 font-medium">Agences</span>
            </nav>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white">
                <Building2 class="w-5 h-5" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Gestion des agences</h1>
                <p class="text-gray-600">Gérez toutes les agences de votre système</p>
              </div>
            </div>
          </div>
          
          <Button 
            class="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
            @click="router.push('/admin/agencies/add')"
          >
            <Plus class="w-4 h-4" />
            Ajouter une agence
          </Button>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-50 rounded-lg">
              <Building2 class="w-6 h-6 text-blue-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Agences</p>
              <p class="text-2xl font-bold text-gray-900">{{ filteredAgencies.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-green-50 rounded-lg">
              <Phone class="w-6 h-6 text-green-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Avec téléphone</p>
              <p class="text-2xl font-bold text-gray-900">{{ filteredAgencies.filter(a => a.phone).length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-purple-50 rounded-lg">
              <MapPin class="w-6 h-6 text-purple-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Villes uniques</p>
              <p class="text-2xl font-bold text-gray-900">{{ new Set(filteredAgencies.map(a => a.city).filter(Boolean)).size }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Table Card -->
      <section class="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <!-- Toolbar -->
        <div class="p-4 border-b flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Agences</h2>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Rechercher une agence..." 
                class="pl-9 w-72 rounded-lg border border-gray-200 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
            <div class="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600">Chargement des agences...</p>
          </div>

        <!-- Empty States -->
        <div v-else-if="filteredAgencies.length === 0 && searchQuery" class="text-center py-12 px-4">
          <div class="w-20 h-20 bg-gray-100 rounded-full grid place-items-center mx-auto mb-4">
            <Search class="w-9 h-9 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Aucune agence trouvée</h3>
          <p class="text-gray-500 mb-6">
            Aucune agence ne correspond à votre recherche "{{ searchQuery }}"
          </p>
          <Button variant="outline" @click="searchQuery = ''" class="flex items-center gap-2">
            Effacer la recherche
          </Button>
        </div>

        <div v-else-if="filteredAgencies.length === 0" class="text-center py-12 px-4">
          <div class="w-20 h-20 bg-gray-100 rounded-full grid place-items-center mx-auto mb-4">
            <Building2 class="w-9 h-9 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Aucune agence</h3>
          <p class="text-gray-500 mb-6">Commencez par ajouter votre première agence</p>
          <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="router.push('/admin/agencies/add')" >
            <Plus class="w-4 h-4" />
            Ajouter une agence
          </Button>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <Table class="w-full">
            <TableHeader class="bg-gray-50">
              <TableRow>
                <TableHead class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nom
                </TableHead>
                <TableHead class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Utilisateur
                </TableHead>
                <TableHead class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Téléphone
                </TableHead>
                <TableHead class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Adresse
                </TableHead>
                <TableHead class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ville
                </TableHead>
                <TableHead class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody class="bg-white divide-y divide-gray-100">
              <TableRow 
                v-for="a in filteredAgencies" 
                :key="a._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Building2 class="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span class="text-sm font-medium text-gray-900">{{ a.name }}</span>
                  </div>
                </TableCell>
                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <User class="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span class="text-sm text-gray-700">{{ a.username }}</span>
                  </div>
                </TableCell>
                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Phone class="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span class="text-sm text-gray-700">{{ a.phone || 'Non renseigné' }}</span>
                  </div>
                </TableCell>
                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <MapPin class="w-4 h-4 text-gray-500 flex-shrink-0" />
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
                      size="sm"
                      @click="router.push(`/admin/agencies/edit/${a._id}`)"
                      class="flex items-center gap-2"
                    >
                      <Edit class="w-4 h-4" />
                      Modifier
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      @click="deleteAgency(a._id)"
                      class="flex items-center gap-2"
                    >
                      <Trash2 class="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
      </div>
  </AdminLayout>
</template>