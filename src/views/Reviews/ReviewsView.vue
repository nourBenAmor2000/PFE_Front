<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useReviews } from '@/composables/useReviews'
import { useClients } from '@/composables/useClient'
import { useLogements } from '@/composables/useLogements'

/* UI */
import AdminLayout from '@/layouts/AdminLayout.vue'
import { Button } from '@/components/ui/button'
import {
  Table, TableHeader, TableHead, TableRow, TableBody, TableCell,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

/* Icons */
import { Plus, Star, User, Home, Search, Edit, Trash2, MessageSquare, Loader } from 'lucide-vue-next'

const router = useRouter()
const reviewStore = useReviews()
const clientStore = useClients()
const logementStore = useLogements()

/* state */
const isLoading = ref(false)
const q = ref('')
const ratingFilter = ref('') // '', '1', '2', '3', '4', '5'
const page = ref(1)
const perPage = ref(10)

/* fetch */
onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      reviewStore.fetchReviews(),
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

const deleteReview = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.')) {
    try {
      await reviewStore.deleteReview(id)
      await reviewStore.fetchReviews()
    } catch (error) {
      alert('Erreur lors de la suppression: ' + (reviewStore.error || error.message))
    }
  }
}

/* derived */
const list = computed(() => reviewStore.reviews || [])

const filtered = computed(() => {
  let arr = [...list.value]
  const s = q.value.trim().toLowerCase()

  if (s) {
    arr = arr.filter(r => {
      const clientN = (getClientName(r.client_id) || '').toLowerCase()
      const logementT = (getLogementTitle(r.logement_id) || '').toLowerCase()
      const comment = (r.comment || '').toLowerCase()
      return clientN.includes(s) || logementT.includes(s) || comment.includes(s)
    })
  }

  // rating filter
  if (ratingFilter.value) {
    arr = arr.filter(r => String(r.rating) === ratingFilter.value)
  }

  // sort recent first
  arr.sort((a, b) => new Date(b.created_at || b._id) - new Date(a.created_at || a._id))
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

watch([q, ratingFilter, perPage], () => { page.value = 1 })

/* quick stats */
const total = computed(() => filtered.value.length)
const avgRating = computed(() => {
  if (!filtered.value.length) return 0
  const sum = filtered.value.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return (sum / filtered.value.length).toFixed(1)
})
const total5Stars = computed(() => filtered.value.filter(r => r.rating === 5).length)
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
              <span class="text-orange-600 font-medium">Avis</span>
            </nav>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white">
                <Star class="w-5 h-5" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                  Gestion des avis
                </h1>
                <p class="text-gray-600">Gérez tous les avis des clients</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button
              class="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
              @click="router.push('/admin/reviews/add')"
            >
              <Plus class="w-4 h-4" />
              Ajouter un avis
            </Button>
          </div>
        </div>
      </section>

      <!-- KPI Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardContent class="p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-50 rounded-lg"><Star class="w-6 h-6 text-blue-600" /></div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Avis</p>
              <p class="text-2xl font-bold text-gray-900">{{ total }}</p>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent class="p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-green-50 rounded-lg"><Star class="w-6 h-6 text-green-600" /></div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Note moyenne</p>
              <p class="text-2xl font-bold text-gray-900">{{ avgRating }}/5</p>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent class="p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-purple-50 rounded-lg"><Star class="w-6 h-6 text-purple-600" /></div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">5 étoiles</p>
              <p class="text-2xl font-bold text-gray-900">{{ total5Stars }}</p>
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
            <Input v-model="q" placeholder="Rechercher (client, logement, commentaire)…" class="pl-9 w-80" />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-3">
            <Select v-model="ratingFilter">
              <SelectTrigger class="w-[160px]">
                <SelectValue placeholder="Note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les notes</SelectItem>
                <SelectItem value="5">5 étoiles</SelectItem>
                <SelectItem value="4">4 étoiles</SelectItem>
                <SelectItem value="3">3 étoiles</SelectItem>
                <SelectItem value="2">2 étoiles</SelectItem>
                <SelectItem value="1">1 étoile</SelectItem>
              </SelectContent>
            </Select>

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
          <h2 class="text-lg font-semibold text-gray-900">Avis</h2>
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
            <Star class="w-9 h-9 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Aucun avis</h3>
          <p class="text-gray-500 mb-6">
            {{ q || ratingFilter ? 'Ajuste la recherche/les filtres.' : 'Commence par ajouter ton premier avis.' }}
          </p>
          <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="router.push('/admin/reviews/add')">
            Ajouter un avis
          </Button>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <Table class="w-full">
            <TableHeader class="bg-gray-50">
              <TableRow>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Client</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Logement</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Note</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Commentaire</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody class="bg-white divide-y divide-gray-100">
              <TableRow
                v-for="r in paged"
                :key="r._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <User class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getClientName(r.client_id) }}</p>
                      <p class="text-xs text-gray-500">Client</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <Home class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getLogementTitle(r.logement_id) }}</p>
                      <p class="text-xs text-gray-500">Logement</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-1">
                    <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span class="text-sm font-semibold text-gray-900">{{ r.rating }}/5</span>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 max-w-md">
                  <div class="flex items-start gap-2">
                    <MessageSquare class="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p class="text-sm text-gray-700 line-clamp-2">{{ r.comment || 'Aucun commentaire' }}</p>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" class="flex items-center gap-2 px-3 py-2 text-xs"
                      @click="router.push(`/admin/reviews/edit/${r._id}`)">
                      <Edit :size="14" /> Modifier
                    </Button>
                    <Button variant="destructive" size="sm" class="flex items-center gap-2 px-3 py-2 text-xs"
                      @click="deleteReview(r._id)">
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

