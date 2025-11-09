<template>
  <AdminLayout>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestion des Agents</h1>
          <p class="text-gray-600 mt-1">Gérez les agents de votre organisation</p>
        </div>
        <Button @click="goToAdd" class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus class="w-5 h-5" />
          Ajouter un agent
        </Button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card class="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-900">Total Agents</p>
                <p class="text-2xl font-bold text-blue-800">{{ totalAgents }}</p>
              </div>
              <Users class="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card class="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-green-900">Agences</p>
                <p class="text-2xl font-bold text-green-800">{{ uniqueAgencies }}</p>
              </div>
              <Building class="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Search and Filters -->
      <Card>
        <CardContent class="p-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  v-model="searchQuery"
                  placeholder="Rechercher un agent..."
                  class="pl-10 w-full"
                />
              </div>
            </div>
            <Select v-model="selectedAgency">
              <SelectTrigger class="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrer par agence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les agences</SelectItem>
                <SelectItem 
                  v-for="agency in agencyList" 
                  :key="agency" 
                  :value="agency"
                >
                  {{ agency }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <!-- Agents Table -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle>Liste des agents</CardTitle>
          <CardDescription>
            {{ agents.length }} agent(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>

          <div v-else-if="agents.length === 0" class="text-center py-8">
            <Users class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun agent trouvé</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ searchQuery || selectedAgency !== 'all' ? 'Essayez de modifier vos critères de recherche.' : 'Commencez par ajouter votre premier agent.' }}
            </p>
          </div>

          <div v-else class="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader class="bg-gray-50">
                <TableRow>
                  <TableHead class="font-semibold">Agent</TableHead>
                  <TableHead class="font-semibold">Contact</TableHead>
                  <TableHead class="font-semibold">Agence</TableHead>
                  <TableHead class="font-semibold">Poste</TableHead>
                  <TableHead class="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow 
                  v-for="agent in agents" 
                  :key="agent._id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User class="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ agent.name }}</p>
                        <p class="text-sm text-gray-500">ID: {{ agent._id }}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <Mail class="w-4 h-4 text-gray-400" />
                        <a :href="`mailto:${agent.email}`" class="text-primary hover:underline">
                          {{ agent.email }}
                        </a>
                      </div>
                      <div class="flex items-center gap-2">
                        <Phone class="w-4 h-4 text-gray-400" />
                        <a :href="`tel:${agent.phone}`" class="text-gray-600">
                          {{ agent.phone }}
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" class="bg-blue-50 text-blue-700 border-blue-200">
                      {{ agent.agency_name }}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ agent.position }}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div class="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        @click="goToEdit(agent._id)"
                        class="flex items-center gap-1"
                      >
                        <Edit class="w-4 h-4" />
                        Modifier
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        @click="confirmDelete(agent)"
                        class="flex items-center gap-1"
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

          <!-- Pagination -->
          <div v-if="agents.length > 0" class="flex items-center justify-between mt-4">
            <div class="text-sm text-gray-700">
              Affichage de {{ agents.length }} agent(s)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l'agent <strong>{{ agentToDelete?.name }}</strong> ? 
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">
            Annuler
          </Button>
          <Button variant="destructive" @click="handleDelete" :disabled="deleting">
            <span v-if="deleting" class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Suppression...
            </span>
            <span v-else>Supprimer définitivement</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgents } from '@/composables/useAgent'

// Components
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Select from '@/components/ui/select/Select.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Icons - Using Lucide Vue icons (install: npm install lucide-vue-next)
import { 
  Plus, 
  Search, 
  Users, 
  Building, 
  User, 
  Mail, 
  Phone, 
  Edit, 
  Trash2 
} from 'lucide-vue-next'

const router = useRouter()
const agentsStore = useAgents()
const { fetchAgents, deleteAgent } = agentsStore
const agents=ref([])
// Reactive state
const loading = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const selectedAgency = ref('all')
const deleteDialogOpen = ref(false)
const agentToDelete = ref(null)

// Computed properties
const totalAgents = computed(() => agents.value?.length || 0)

const uniqueAgencies = computed(() => {
  if (!agents.value) return 0
  return new Set(agents.value.map(agent => agent.agency_name)).size
})

const agencyList = computed(() => {
  if (!agents.value) return []
  return [...new Set(agents.value.map(agent => agent.agency_name))].sort()
})


// Methods
const goToAdd = () => router.push('/admin/agents/add')
const goToEdit = id => router.push(`/admin/agents/edit/${id}`)

const confirmDelete = (agent) => {
  agentToDelete.value = agent
  deleteDialogOpen.value = true
}

const handleDelete = async () => {
  if (!agentToDelete.value) return
  
  deleting.value = true
  try {
    await deleteAgent(agentToDelete.value._id)
    deleteDialogOpen.value = false
    agentToDelete.value = null
  } catch (error) {
    console.error('Error deleting agent:', error)
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    await fetchAgents()
    agents.value= agentsStore.agents
  } catch (error) {
    console.error('Error fetching agents:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>