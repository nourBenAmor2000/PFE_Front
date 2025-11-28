<template>
  <AdminAgentLayout>
    <div class="p-6 space-y-6">
      <!-- Header / Breadcrumb + Actions -->
      <section class="bg-white rounded-2xl border shadow-sm p-5">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <nav class="text-sm text-gray-500 mb-1">
              <span class="hover:text-gray-700 cursor-default">Dashboard agence</span>
              <span class="mx-2">›</span>
              <span class="text-orange-600 font-medium">Agents de l'agence</span>
            </nav>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h2v-2H3v2m4 0h14v-2H7v2m0 6h14v-2H7v2M3 19h2v-2H3v2M7 5v2h14V5H7M3 7h2V5H3v2Z" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                  Gestion des agents de mon agence
                </h1>
                <p class="text-gray-600">
                  Gérer les agents rattachés à votre agence
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              @click="refresh"
              :disabled="isBusy"
              title="Rafraîchir"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12a9 9 0 1 1-3-6.7" />
                <path d="M21 3v7h-7" />
              </svg>
              Refresh
            </button>
            <Button
              class="inline-flex items-center gap-2 rounded-lg bg-orange-600 text-white px-4 py-2 font-medium hover:bg-orange-700"
              @click="goToAdd"
            >
              <Plus class="w-4 h-4" />
              Ajouter un agent
            </Button>
          </div>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total agents de mon agence -->
        <Card class="rounded-xl border shadow-sm">
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-blue-50 rounded-lg">
                <Users class="w-6 h-6 text-blue-600" />
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Agents de mon agence</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalAgents }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Nom de l'agence -->
        <Card class="rounded-xl border shadow-sm">
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-green-50 rounded-lg">
                <Building class="w-6 h-6 text-green-600" />
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Mon agence</p>
                <p class="text-lg font-bold text-gray-900 truncate">
                  {{ currentAgencyName || 'Agence non définie' }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Nombre d'agents avec téléphone -->
        <Card class="rounded-xl border shadow-sm">
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-purple-50 rounded-lg">
                <User class="w-6 h-6 text-purple-600" />
              </div>
              <div class="min-w-0">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Avec téléphone</p>
                <p class="text-2xl font-bold text-gray-900">{{ withPhone }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- Table Card -->
      <section class="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <!-- Toolbar -->
        <div class="p-4 border-b flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Liste des agents de l'agence</h2>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search -->
            <div class="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                v-model.trim="q"
                @input="onQuery"
                type="text"
                placeholder="Rechercher (nom, email, téléphone, poste)…"
                class="ml-2 bg-transparent text-sm outline-none placeholder:text-gray-400 w-64"
              />
            </div>

            <!-- Filtre par poste -->
            <select v-model="position" @change="applyFilters" class="rounded-lg border-gray-200 text-sm">
              <option value="">Tous les postes</option>
              <option v-for="p in positionList" :key="p" :value="p">{{ p }}</option>
            </select>

            <!-- Bulk actions -->
            <div class="flex items-center gap-2">
              <button
                class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                :disabled="selectedIds.length === 0"
                @click="bulkDeactivate"
              >
                Désactiver
              </button>
              <button
                class="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm hover:bg-red-100 disabled:opacity-50"
                :disabled="selectedIds.length === 0"
                @click="bulkDelete"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <Table>
            <TableHeader class="bg-gray-50">
              <TableRow>
                <TableHead class="w-10">
                  <input type="checkbox" :checked="allSelected" @change="toggleAll" />
                </TableHead>
                <TableHead class="font-semibold text-gray-900">Agent</TableHead>
                <TableHead class="font-semibold text-gray-900">Contact</TableHead>
                <TableHead class="font-semibold text-gray-900">Poste</TableHead>
                <TableHead class="font-semibold text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <!-- Loading -->
            <TableBody v-if="isBusy">
              <TableRow v-for="n in 5" :key="n">
                <TableCell colspan="5">
                  <div class="h-10 animate-pulse bg-gray-100 rounded-md"></div>
                </TableCell>
              </TableRow>
            </TableBody>

            <!-- Data -->
            <TableBody v-else-if="filtered.length">
              <TableRow
                v-for="a in paged"
                :key="a._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <input type="checkbox" :value="a._id" v-model="selectedIds" />
                </TableCell>

                <TableCell>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary/10 rounded-full grid place-items-center">
                      <User class="w-5 h-5 text-primary" />
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium text-gray-900 truncate">{{ a.name || '—' }}</p>
                      <p class="text-xs text-gray-500">ID: {{ a._id }}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <Mail class="w-4 h-4 text-gray-400" />
                      <a
                        :href="`mailto:${a.email}`"
                        class="text-primary hover:underline truncate"
                      >
                        {{ a.email || '—' }}
                      </a>
                    </div>
                    <div class="flex items-center gap-2">
                      <Phone class="w-4 h-4 text-gray-400" />
                      <a
                        :href="`tel:${a.phone}`"
                        class="text-gray-700 truncate"
                      >
                        {{ a.phone || '—' }}
                      </a>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ a.position || '—' }}
                  </span>
                </TableCell>

                <TableCell>
                  <div class="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="goToEdit(a._id)"
                    >
                      <Edit class="w-4 h-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="confirmDelete(a)"
                    >
                      <Trash2 class="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>

            <!-- Empty -->
            <TableBody v-else>
              <TableRow>
                <TableCell colspan="5">
                  <div class="text-center py-12">
                    <div class="w-20 h-20 bg-gray-100 rounded-full grid place-items-center mx-auto mb-4">
                      <Users class="w-9 h-9 text-gray-400" />
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-1">Aucun agent trouvé</h3>
                    <p class="text-gray-500 mb-6">
                      {{
                        q || position
                          ? 'Essayez de modifier vos critères de recherche.'
                          : 'Commencez par ajouter votre premier agent dans cette agence.'
                      }}
                    </p>
                    <Button
                      class="inline-flex items-center gap-2 rounded-lg bg-orange-600 text-white px-4 py-2 font-medium hover:bg-orange-700"
                      @click="goToAdd"
                    >
                      <Plus class="w-4 h-4" />
                      Ajouter un agent
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Footer / Pagination -->
        <div class="border-t px-4 py-3 flex items-center justify-between text-sm">
          <p class="text-gray-600">
            Affichage <span class="font-semibold">{{ from }}</span>–<span class="font-semibold">{{ to }}</span> sur
            <span class="font-semibold">{{ filtered.length }}</span>
          </p>
          <div class="flex items-center gap-2">
            <button
              class="rounded-lg border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
              :disabled="page === 1"
              @click="page--"
            >
              Précédent
            </button>
            <button
              class="rounded-lg border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
              :disabled="page >= pages"
              @click="page++"
            >
              Suivant
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l'agent
            <strong>{{ agentToDelete?.name }}</strong> ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">Annuler</Button>
          <Button variant="destructive" @click="handleDelete" :disabled="deleting">
            <span v-if="deleting" class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Suppression…
            </span>
            <span v-else>Supprimer définitivement</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </AdminAgentLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAgents } from '@/composables/useAgent'
import { useAuth } from '@/composables/useAuth'

/* Layout & UI */
import AdminAgentLayout from '@/layouts/AdminAgentLayout.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import Button from '@/components/ui/button/Button.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'

/* Icons */
import { Plus, Users, Building, User, Mail, Phone, Edit, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const agentsStore = useAgents()
const { user } = useAuth()

/* local state */
const isBusy = ref(false)
const q = ref('')
const position = ref('')
const selectedIds = ref([])

const deleteDialogOpen = ref(false)
const agentToDelete = ref(null)
const deleting = ref(false)

/* agence courante */
const agencyId = computed(
  () => user.value?.agency_id || user.value?.agency?.id || null
)
const currentAgencyName = computed(() => {
  if (user.value?.agency?.name) return user.value.agency.name
  const firstWithName = (agentsStore.agents || []).find(a => a.agency_name)
  return firstWithName?.agency_name || ''
})

/* agents filtrés par agence de l'admin */
const agents = computed(() => {
  const all = agentsStore.agents || []
  if (!agencyId.value) return all
  return all.filter(a => {
    const aId = a.agency_id || a.agency?._id || a.agency?.id
    return aId === agencyId.value
  })
})

const totalAgents = computed(() => agents.value.length)
const withPhone = computed(() => agents.value.filter(a => !!a.phone).length)
const positionList = computed(() =>
  [...new Set(agents.value.map(a => a.position).filter(Boolean))].sort()
)

/* filtering */
const filtered = computed(() => {
  const s = q.value.toLowerCase()
  return agents.value
    .filter(a => (position.value ? a.position === position.value : true))
    .filter(a => {
      if (!s) return true
      return (
        (a.name || '').toLowerCase().includes(s) ||
        (a.email || '').toLowerCase().includes(s) ||
        (a.phone || '').toLowerCase?.().includes(s) ||
        (a.position || '').toLowerCase().includes(s) ||
        (a._id || '').toLowerCase().includes(s)
      )
    })
})

/* pagination */
const page = ref(1)
const perPage = ref(8)
const pages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / perPage.value))
)
const paged = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})
const from = computed(() =>
  filtered.value.length ? (page.value - 1) * perPage.value + 1 : 0
)
const to = computed(() =>
  Math.min(page.value * perPage.value, filtered.value.length)
)

watch([q, position, perPage], () => {
  page.value = 1
})

/* selection */
const allSelected = computed(
  () =>
    selectedIds.value.length &&
    paged.value.every(i => selectedIds.value.includes(i._id))
)
const toggleAll = e => {
  const ids = paged.value.map(i => i._id)
  if (e.target.checked)
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...ids]))
  else selectedIds.value = selectedIds.value.filter(id => !ids.includes(id))
}

/* actions */
const refresh = async () => {
  isBusy.value = true
  await agentsStore.fetchAgents()
  isBusy.value = false
}
const goToAdd = () => router.push('/admin-agence/agents/add')
const goToEdit = id => router.push(`/admin-agence/agents/edit/${id}`)

const confirmDelete = agent => {
  agentToDelete.value = agent
  deleteDialogOpen.value = true
}
const handleDelete = async () => {
  if (!agentToDelete.value) return
  deleting.value = true
  try {
    await agentsStore.deleteAgent(agentToDelete.value._id)
    deleteDialogOpen.value = false
    agentToDelete.value = null
    if (paged.value.length === 0 && page.value > 1) page.value--
  } catch (e) {
    console.error(e)
  } finally {
    deleting.value = false
  }
}
const bulkDelete = async () => {
  if (!selectedIds.value.length) return
  if (confirm(`Supprimer ${selectedIds.value.length} agent(s) ?`)) {
    for (const id of selectedIds.value) {
      await agentsStore.deleteAgent(id)
    }
    selectedIds.value = []
    if (paged.value.length === 0 && page.value > 1) page.value--
  }
}
const bulkDeactivate = async () => {
  if (!selectedIds.value.length || !agentsStore.updateAgent) return
  for (const id of selectedIds.value) {
    const a = agents.value.find(x => x._id === id)
    if (a) await agentsStore.updateAgent(id, { active: false })
  }
  selectedIds.value = []
}

const onQuery = () => {}
const applyFilters = () => {}

/* mount */
onMounted(refresh)
</script>

<style scoped>
:deep(.table-header) {
  background-color: #f9fafb;
}
:deep(th),
:deep(td) {
  vertical-align: middle;
}
</style>
