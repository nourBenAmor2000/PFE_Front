<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useContracts } from '@/composables/useContrats'
import { useClients } from '@/composables/useClient'
import { useLogements } from '@/composables/useLogements'

/* UI */
import AdminLayout from '@/layouts/AdminLayout.vue'
import { Button } from '@/components/ui/button'
import {
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

/* Icons */
import {
  Plus, Search, Edit, Trash2, FileText, User, Home, Calendar, DollarSign, Loader
} from 'lucide-vue-next'

const router = useRouter()
const contractStore = useContracts()
const clientStore = useClients()
const logementStore = useLogements()

/* state */
const isLoading = ref(false)
const q = ref('')                  // search
const status = ref('')             // '', 'active', 'expired'
const dateFrom = ref('')           // yyyy-mm-dd
const dateTo = ref('')             // yyyy-mm-dd
const page = ref(1)
const perPage = ref(10)

/* fetch */
onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      contractStore.fetchContracts(),
      clientStore.fetchClients(),
      logementStore.fetchLogements(),
    ])
  } finally { isLoading.value = false }
})

/* helpers */
const getClientName = (id) => clientStore.clients.find(c => (c._id === id || c.id === id))?.name || '—'
const getLogementTitle = (id) => logementStore.logements.find(l => (l._id === id || l.id === id))?.title || '—'
const money = (v) => `${Number(v || 0).toLocaleString('fr-FR')} TND`
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—')
const contractStatus = (endDate) => (new Date(endDate) < new Date() ? 'expired' : 'active')
const statusBadge = (s) =>
  s === 'active' ? 'bg-green-50 text-green-700 border-green-200'
  : s === 'expired' ? 'bg-red-50 text-red-700 border-red-200'
  : 'bg-gray-50 text-gray-700 border-gray-200'

const deleteContract = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce contrat ? Cette action est irréversible.')) {
    try {
      await contractStore.deleteContract(id)
      await contractStore.fetchContracts() // Reload after delete
    } catch (error) {
      alert('Erreur lors de la suppression: ' + (contractStore.error || error.message))
    }
  }
}

/* derived */
const list = computed(() => contractStore.contracts || [])

const filtered = computed(() => {
  let arr = [...list.value]
  const s = q.value.trim().toLowerCase()

  if (s) {
    arr = arr.filter(c => {
      const clientN = (getClientName(c.client_id) || '').toLowerCase()
      const logementT = (getLogementTitle(c.logement_id) || '').toLowerCase()
      const amount = String(c.amount || '')
      return clientN.includes(s) || logementT.includes(s) || amount.includes(s)
    })
  }

  // status filter
  if (status.value) {
    arr = arr.filter(c => contractStatus(c.end_date) === status.value)
  }

  // date range (start_date inside [dateFrom,dateTo] if provided)
  if (dateFrom.value) {
    const from = new Date(dateFrom.value)
    arr = arr.filter(c => new Date(c.start_date) >= from)
  }
  if (dateTo.value) {
    const to = new Date(dateTo.value)
    // include the day
    to.setHours(23, 59, 59, 999)
    arr = arr.filter(c => new Date(c.start_date) <= to)
  }

  // sort recent first by start_date, fallback to end_date
  arr.sort((a, b) => new Date(b.start_date || b.end_date) - new Date(a.start_date || a.end_date))
  return arr
})

/* pagination */
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / Number(perPage.value || 1))))
const paged = computed(() => {
  const start = (page.value - 1) * Number(perPage.value || 1)
  return filtered.value.slice(start, start + Number(perPage.value || 1))
})
const from = computed(() => (filtered.value.length ? (page.value - 1) * Number(perPage.value || 1) + 1 : 0))
const to = computed(() => Math.min(page.value * Number(perPage.value || 1), filtered.value.length))
watch([q, status, dateFrom, dateTo, perPage], () => { page.value = 1 })

/* quick stats */
const total = computed(() => filtered.value.length)
const totalActive = computed(() => filtered.value.filter(c => contractStatus(c.end_date) === 'active').length)
const totalExpired = computed(() => filtered.value.filter(c => contractStatus(c.end_date) === 'expired').length)
const monthlyRevenue = computed(() => filtered.value.reduce((sum, c) => sum + Number(c.amount || 0), 0))
</script>

<template>
  <AdminLayout>
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <!-- Header / Breadcrumb + Actions -->
      <section class="bg-white rounded-2xl border shadow-sm p-5">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <nav class="text-sm text-gray-500 mb-1">
              <span class="hover:text-gray-700 cursor-default">Home</span>
              <span class="mx-2">›</span>
              <span class="text-orange-600 font-medium">Contrats</span>
            </nav>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white">
                <FileText class="w-5 h-5" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                  Gestion des contrats
                </h1>
                <p class="text-gray-600">Gérez tous les contrats de location</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button
              class="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
              @click="router.push('/admin/contracts/add')"
            >
              <Plus class="w-4 h-4" />
              Ajouter un contrat
            </Button>
          </div>
        </div>
      </section>

      <!-- KPI Cards -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardContent class="p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-50 rounded-lg"><FileText class="w-6 h-6 text-blue-600" /></div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ total }}</p>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent class="p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-green-50 rounded-lg"><Calendar class="w-6 h-6 text-green-600" /></div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Actifs</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalActive }}</p>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent class="p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-red-50 rounded-lg"><Calendar class="w-6 h-6 text-red-600" /></div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Expirés</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalExpired }}</p>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent class="p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-purple-50 rounded-lg"><DollarSign class="w-6 h-6 text-purple-600" /></div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Revenu mensuel</p>
              <p class="text-2xl font-bold text-gray-900">{{ money(monthlyRevenue) }}</p>
            </div>
          </div>
        </CardContent></Card>
      </section>

      <!-- Toolbar -->
      <section class="bg-white rounded-2xl border shadow-sm p-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input v-model="q" placeholder="Rechercher (client, logement, montant)…" class="pl-9 w-80" />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-3">
            <select v-model="status" class="rounded-lg border border-gray-200 py-2 px-3 text-sm">
              <option value="">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="expired">Expirés</option>
            </select>

            <div class="flex items-center gap-2">
              <Input v-model="dateFrom" type="date" class="w-[150px]" />
              <span class="text-gray-400">—</span>
              <Input v-model="dateTo" type="date" class="w-[150px]" />
            </div>

            <select v-model="perPage" class="rounded-lg border border-gray-200 py-2 px-3 text-sm">
              <option :value="5">5 / page</option>
              <option :value="10">10 / page</option>
              <option :value="20">20 / page</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Table Card -->
      <section class="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <!-- Header line -->
        <div class="p-4 border-b flex items-center justify-between text-sm">
          <h2 class="text-lg font-semibold text-gray-900">Contrats</h2>
          <p class="text-gray-600">
            Affichage <span class="font-semibold">{{ from }}</span>–<span class="font-semibold">{{ to }}</span>
            sur <span class="font-semibold">{{ filtered.length }}</span>
          </p>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
          <Loader class="animate-spin text-orange-600 mb-3" :size="28" />
          <p class="text-gray-600">Chargement…</p>
        </div>

        <!-- Empty -->
        <div v-else-if="!filtered.length" class="text-center py-12 px-4">
          <div class="w-20 h-20 bg-gray-100 rounded-full grid place-items-center mx-auto mb-4">
            <FileText class="w-9 h-9 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Aucun contrat</h3>
          <p class="text-gray-500 mb-6">
            {{ q || status || dateFrom || dateTo ? 'Ajuste la recherche/les filtres.' : 'Commence par ajouter ton premier contrat.' }}
          </p>
          <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="router.push('/admin/contracts/add')">
            Ajouter un contrat
          </Button>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <Table class="w-full">
            <TableHead class="bg-gray-50">
              <TableRow>
                <TableCell class="px-6 py-3 font-semibold text-gray-900">Client</TableCell>
                <TableCell class="px-6 py-3 font-semibold text-gray-900">Logement</TableCell>
                <TableCell class="px-6 py-3 font-semibold text-gray-900">Début</TableCell>
                <TableCell class="px-6 py-3 font-semibold text-gray-900">Fin</TableCell>
                <TableCell class="px-6 py-3 font-semibold text-gray-900">Montant</TableCell>
                <TableCell class="px-6 py-3 font-semibold text-gray-900">Statut</TableCell>
                <TableCell class="px-6 py-3 font-semibold text-gray-900 text-center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody class="bg-white divide-y divide-gray-100">
              <TableRow
                v-for="c in paged"
                :key="c._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <User class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getClientName(c.client_id) }}</p>
                      <p class="text-xs text-gray-500">Client</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <Home class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getLogementTitle(c.logement_id) }}</p>
                      <p class="text-xs text-gray-500">Logement</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Calendar class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ fmtDate(c.start_date) }}</p>
                      <p class="text-xs text-gray-500">Début</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Calendar class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium" :class="contractStatus(c.end_date) === 'expired' ? 'text-red-600' : 'text-green-600'">
                        {{ fmtDate(c.end_date) }}
                      </p>
                      <p class="text-xs text-gray-500">Fin</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <DollarSign class="w-4 h-4 text-gray-500" />
                    <span class="text-sm font-semibold text-blue-600">{{ money(c.amount) }}</span>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    :class="statusBadge(contractStatus(c.end_date))"
                  >
                    {{ contractStatus(c.end_date) === 'active' ? 'Actif' : 'Expiré' }}
                  </Badge>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" class="flex items-center gap-2 px-3 py-2 text-xs"
                      @click="router.push(`/admin/contracts/edit/${c._id}`)">
                      <Edit :size="14" /> Modifier
                    </Button>
                    <Button variant="destructive" size="sm" class="flex items-center gap-2 px-3 py-2 text-xs"
                      @click="deleteContract(c._id)">
                      <Trash2 :size="14" /> Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Footer / Pagination -->
        <div v-if="filtered.length" class="border-t px-4 py-3 flex items-center justify-between text-sm">
          <p class="text-gray-600">
            Affichage <span class="font-semibold">{{ from }}</span>–<span class="font-semibold">{{ to }}</span>
            sur <span class="font-semibold">{{ filtered.length }}</span>
          </p>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" :disabled="page===1" @click="page--">Précédent</Button>
            <div class="text-gray-700">Page {{ page }} / {{ pages }}</div>
            <Button variant="outline" size="sm" :disabled="page>=pages" @click="page++">Suivant</Button>
          </div>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>
