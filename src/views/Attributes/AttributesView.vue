<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAttributes } from '@/composables/useAttributes'
import { useRouter } from 'vue-router'
import { Plus, Search, Edit, Trash2, Tag, Loader, Settings } from 'lucide-vue-next'

import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { Badge } from '@/components/ui/badge'

const attributeStore = useAttributes()
const router = useRouter()
const isLoading = ref(false)
const searchQuery = ref('')

onMounted(() => {
  isLoading.value = true
  attributeStore.fetchAttributes().finally(() => {
    isLoading.value = false
  })
})

const deleteAttribute = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet attribut ? Cette action est irréversible.')) {
    try {
      await attributeStore.deleteAttribute(id)
      await attributeStore.fetchAttributes()
    } catch (error) {
      alert('Erreur lors de la suppression: ' + (attributeStore.error || error.message))
    }
  }
}

const filteredAttributes = computed(() => {
  if (!searchQuery.value) return attributeStore.attributes
  
  const query = searchQuery.value.toLowerCase()
  return attributeStore.attributes.filter(attr => 
    (attr.name || '').toLowerCase().includes(query) ||
    (attr.type || '').toLowerCase().includes(query)
  )
})

const getTypeBadgeClass = (type) => {
  const classes = {
    'bool': 'bg-purple-50 text-purple-700 border-purple-200',
    'list': 'bg-blue-50 text-blue-700 border-blue-200',
    'text': 'bg-green-50 text-green-700 border-green-200',
    'number': 'bg-orange-50 text-orange-700 border-orange-200'
  }
  return classes[type] || 'bg-gray-50 text-gray-700 border-gray-200'
}
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
              <span class="text-orange-600 font-medium">Attributs</span>
            </nav>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white">
                <Settings class="w-5 h-5" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Gestion des attributs</h1>
                <p class="text-gray-600">Gérez tous les attributs de votre système</p>
              </div>
            </div>
          </div>
          
          <Button 
            class="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
            @click="router.push('/admin/attributes/add')"
          >
            <Plus class="w-4 h-4" />
            Ajouter un attribut
          </Button>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-50 rounded-lg">
              <Settings class="w-6 h-6 text-blue-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Attributs</p>
              <p class="text-2xl font-bold text-gray-900">{{ filteredAttributes.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-green-50 rounded-lg">
              <Tag class="w-6 h-6 text-green-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Types différents</p>
              <p class="text-2xl font-bold text-gray-900">{{ new Set(filteredAttributes.map(a => a.type).filter(Boolean)).size }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-purple-50 rounded-lg">
              <Edit class="w-6 h-6 text-purple-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Prêts à gérer</p>
              <p class="text-2xl font-bold text-gray-900">{{ filteredAttributes.length }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Table Card -->
      <section class="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <!-- Toolbar -->
        <div class="p-4 border-b flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Attributs</h2>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Rechercher des attributs..." 
                class="pl-9 w-72 rounded-lg border border-gray-200 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
          <Loader class="animate-spin text-orange-600 mb-4" :size="32" />
          <p class="text-gray-600">Chargement des attributs...</p>
        </div>

        <!-- Empty States -->
        <div v-else-if="filteredAttributes.length === 0 && searchQuery" class="text-center py-12 px-4">
          <div class="w-20 h-20 bg-gray-100 rounded-full grid place-items-center mx-auto mb-4">
            <Search class="w-9 h-9 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Aucun attribut trouvé</h3>
          <p class="text-gray-500 mb-6">
            Aucun attribut ne correspond à votre recherche "{{ searchQuery }}"
          </p>
          <Button variant="outline" @click="searchQuery = ''" class="flex items-center gap-2">
            Effacer la recherche
          </Button>
        </div>

        <div v-else-if="filteredAttributes.length === 0" class="text-center py-12 px-4">
          <div class="w-20 h-20 bg-gray-100 rounded-full grid place-items-center mx-auto mb-4">
            <Settings class="w-9 h-9 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Aucun attribut</h3>
          <p class="text-gray-500 mb-6">Commencez par ajouter votre premier attribut</p>
          <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="router.push('/admin/attributes/add')">
            <Plus class="w-4 h-4" />
            Ajouter un attribut
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
                  Type
                </TableHead>
                <TableHead class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody class="bg-white divide-y divide-gray-100">
              <TableRow 
                v-for="attr in filteredAttributes" 
                :key="attr._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <Tag class="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span class="text-sm font-medium text-gray-900">{{ attr.name }}</span>
                  </div>
                </TableCell>
                <TableCell class="px-6 py-4">
                  <Badge variant="outline" :class="getTypeBadgeClass(attr.type)">
                    {{ attr.type || '—' }}
                  </Badge>
                </TableCell>
                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      @click="router.push(`/admin/attributes/edit/${attr._id}`)"
                      class="flex items-center gap-2"
                    >
                      <Edit class="w-4 h-4" />
                      Modifier
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      @click="deleteAttribute(attr._id)"
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

