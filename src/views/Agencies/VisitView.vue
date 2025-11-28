<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useVisits } from '@/composables/useVisits'
import { useClients } from '@/composables/useClient'
import { useLogements } from '@/composables/useLogements'
import { useAuth } from '@/composables/useAuth'

/* UI */
import AdminAgentLayout from '@/layouts/AdminAgentLayout.vue'
import { Button } from '@/components/ui/button'
import {
  Table, TableHeader, TableHead, TableRow, TableBody, TableCell,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

/* Icons */
import { Calendar, User, Home, Search, Clock, Loader } from 'lucide-vue-next'

const router = useRouter()
const visitStore = useVisits()
const clientStore = useClients()
const logementStore = useLogements()
const { user } = useAuth()

/* state */
const isLoading = ref(false)
const q = ref('')
const status = ref('all') // 'all', 'upcoming', 'completed'
const dateFrom = ref('')
const dateTo = ref('')
const page = ref(1)
const perPage = ref(10)

/* agence courante */
const agencyId = computed(
  () => user.value?.agency_id || user.value?.agency?._id || user.value?.agency?.id || null
)

/* fetch */
onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      visitStore.fetchVisits(),
      clientStore.fetchClients(),
      logementStore.fetchLogements(),
    ])
  } finally {
    isLoading.value = false
  }
})

/* helpers */
const getClientName = (id) => {
  const client = clientStore.clients.find(c => (c._id === id || c.id === id))
  return client?.name || '—'
}

const getLogementTitle = (id) => {
  const logement = logementStore.logements.find(l => (l._id === id || l.id === id))
  return logement?.title || '—'
}

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}) : '—')

const visitStatus = (visitDate) => {
  const now = new Date()
  const visit = new Date(visitDate)
  if (visit < now) return 'completed'
  return 'upcoming'
}

const statusBadge = (s) => {
  if (s === 'completed') return 'bg-green-50 text-green-700 border-green-200'
  if (s === 'upcoming') return 'bg-blue-50 text-blue-700 border-blue-200'
  if (s === 'cancelled') return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-gray-50 text-gray-700 border-gray-200'
}

/* liste filtrée par agence */
const allVisits = computed(() => visitStore.visits || [])

const list = computed(() => {
  // Si pas d’agence détectée → strict : rien
  if (!agencyId.value) return []

  const logements = logementStore.logements || []

  // tous les logements de l'agence courante
  const logementIdsForAgency = new Set(
    logements
      .filter(l => {
        const aId = l.agency_id || l.agency?._id || l.agency?.id
        return aId === agencyId.value
      })
      .map(l => l._id || l.id)
  )

  return allVisits.value.filter(v => {
    // si la visite porte directement un agency_id
    if (v.agency_id || v.agency) {
      const vA = v.agency_id || v.agency?._id || v.agency?.id
      return vA === agencyId.value
    }
    // sinon on filtre par logement
    return logementIdsForAgency.has(v.logement_id)
  })
})

/* filtered */
const filtered = computed(() => {
  let arr = [...list.value]
  const s = q.value.trim().toLowerCase()

  if (s) {
    arr = arr.filter(v => {
      const clientN = (getClientName(v.client_id) || '').toLowerCase()
      const logementT = (getLogementTitle(v.logement_id) || '').toLowerCase()
      return clientN.includes(s) || logementT.includes(s)
    })
  }

  // status filter (ignore "all")
  if (status.value && status.value !== 'all') {
    arr = arr.filter(v => visitStatus(v.visit_date) === status.value)
  }

  // date range
  if (dateFrom.value) {
    const from = new Date(dateFrom.value)
    arr = arr.filter(v => new Date(v.visit_date) >= from)
  }
  if (dateTo.value) {
    const to = new Date(dateTo.value)
    to.setHours(23, 59, 59, 999)
    arr = arr.filter(v => new Date(v.visit_date) <= to)
  }

  // sort recent first
  arr.sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))
  return arr
})

/* pagination */
const pages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / Number(perPage.value || 1)))
)
const paged = computed(() => {
  const start = (page.value - 1) * Number(perPage.value || 1)
  return filtered.value.slice(start, start + Number(perPage.value || 1))
})
const from = computed(() =>
  filtered.value.length ? (page.value - 1) * Number(perPage.value || 1) + 1 : 0
)
const to = computed(() =>
  Math.min(page.value * Number(perPage.value || 1), filtered.value.length)
)

watch([q, status, dateFrom, dateTo, perPage], () => { page.value = 1 })

/* quick stats */
const total = computed(() => filtered.value.length)
const totalUpcoming = computed(() =>
  filtered.value.filter(v => visitStatus(v.visit_date) === 'upcoming').length
)
const totalCompleted = computed(() =>
  filtered.value.filter(v => visitStatus(v.visit_date) === 'completed').length
)
</script>

<template>
  <AdminAgentLayout>
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <!-- Header / Breadcrumb + Actions -->
      <section class="bg-white rounded-2xl border shadow-sm p-5">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <nav class="text-sm text-gray-500 mb-1">
              <span class="hover:text-gray-700 cursor-default">Dashboard agence</span>
              <span class="mx-2">›</span>
              <span class="text-orange-600 font-medium">Visites de l'agence</span>
            </nav>
            <div class="flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white"
              >
                <Calendar class="w-5 h-5" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                  Visites rattachées à mon agence
                </h1>
                <p class="text-gray-600">
                  Vue centralisée des visites des logements de votre agence (lecture seule)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- KPI Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-blue-50 rounded-lg">
                <Calendar class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Total visites (agence)
                </p>
                <p class="text-2xl font-bold text-gray-900">{{ total }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-green-50 rounded-lg">
                <Clock class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  À venir
                </p>
                <p class="text-2xl font-bold text-gray-900">{{ totalUpcoming }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-purple-50 rounded-lg">
                <Calendar class="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Terminées
                </p>
                <p class="text-2xl font-bold text-gray-900">{{ totalCompleted }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- Toolbar -->
      <section class="bg-white rounded-2xl border shadow-sm p-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input v-model="q" placeholder="Rechercher (client, logement)…" class="pl-9 w-80" />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-3">
            <Select v-model="status">
              <SelectTrigger class="w-[160px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
              </SelectContent>
            </Select>

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
          <h2 class="text-lg font-semibold text-gray-900">Visites de l'agence</h2>
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
            <Calendar class="w-9 h-9 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Aucune visite</h3>
          <p class="text-gray-500 mb-2">
            {{
              q || status !== 'all' || dateFrom || dateTo
                ? 'Ajuste la recherche ou les filtres.'
                : 'Aucune visite trouvée pour cette agence.'
            }}
          </p>
          <p class="text-xs text-gray-400">
            La création et la modification des visites se font via le back-office principal.
          </p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <Table class="w-full">
            <TableHeader class="bg-gray-50">
              <TableRow>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Client</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Logement</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Date de visite</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Statut</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody class="bg-white divide-y divide-gray-100">
              <TableRow
                v-for="v in paged"
                :key="v._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <User class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getClientName(v.client_id) }}</p>
                      <p class="text-xs text-gray-500">Client</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <Home class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getLogementTitle(v.logement_id) }}</p>
                      <p class="text-xs text-gray-500">Logement</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Calendar class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ fmtDate(v.visit_date) }}</p>
                      <p class="text-xs text-gray-500">Date</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    :class="statusBadge(visitStatus(v.visit_date))"
                  >
                    {{ visitStatus(v.visit_date) === 'completed' ? 'Terminée' : 'À venir' }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Footer / Pagination -->
        <div
          v-if="filtered.length"
          class="border-t px-4 py-3 flex items-center justify-between text-sm"
        >
          <p class="text-gray-600">
            Affichage <span class="font-semibold">{{ from }}</span>–<span class="font-semibold">{{ to }}</span>
            sur <span class="font-semibold">{{ filtered.length }}</span>
          </p>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" :disabled="page===1" @click="page--">
              Précédent
            </Button>
            <div class="text-gray-700">Page {{ page }} / {{ pages }}</div>
            <Button variant="outline" size="sm" :disabled="page>=pages" @click="page++">
              Suivant
            </Button>
          </div>
        </div>
      </section>
    </div>
  </AdminAgentLayout>
</template>
