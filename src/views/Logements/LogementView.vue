<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLogements } from '@/composables/useLogements'

/* UI (shadcn-vue) */
import AdminLayout from '@/layouts/AdminLayout.vue'
import { Button } from '@/components/ui/button'
import {
  Table, TableHeader, TableHead, TableRow, TableBody, TableCell,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

/* Icons (lucide-vue-next) */
import { Plus, Home, Filter, Search, MapPin, Image as ImageIcon } from 'lucide-vue-next'

const router = useRouter()
const logementStore = useLogements()

/* Fetch */
onMounted(() => logementStore.fetchLogements())

/* Toolbar state */
const q = ref('')
const dispo = ref('')           // '', 'free', 'busy'
const sortBy = ref('created')   // 'priceAsc','priceDesc','created'
const minPrice = ref('')
const maxPrice = ref('')

/* Pagination */
const page = ref(1)
const perPage = ref(8)

/* Derived */
const items = computed(() => logementStore.logements || [])

const filtered = computed(() => {
  let arr = [...items.value]

  // search
  const s = q.value.trim().toLowerCase()
  if (s) {
    arr = arr.filter(l =>
      (l.title || '').toLowerCase().includes(s) ||
      (l.description || '').toLowerCase().includes(s) ||
      (l.location || '').toLowerCase().includes(s)
    )
  }

  // availability
  if (dispo.value === 'free') arr = arr.filter(l => !!l.free)
  if (dispo.value === 'busy') arr = arr.filter(l => !l.free)

  // price range
  const min = Number(minPrice.value) || null
  const max = Number(maxPrice.value) || null
  if (min !== null) arr = arr.filter(l => Number(l.price) >= min)
  if (max !== null) arr = arr.filter(l => Number(l.price) <= max)

  // sort
  if (sortBy.value === 'priceAsc') arr.sort((a,b)=>Number(a.price)-Number(b.price))
  else if (sortBy.value === 'priceDesc') arr.sort((a,b)=>Number(b.price)-Number(a.price))
  else arr.sort((a,b)=> new Date(b.createdAt||b._id?.toString()?.slice(0,8)*1000) - new Date(a.createdAt||a._id?.toString()?.slice(0,8)*1000))

  return arr
})

const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))
const paged = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})
const from = computed(() => filtered.value.length ? (page.value - 1) * perPage.value + 1 : 0)
const to = computed(() => Math.min(page.value * perPage.value, filtered.value.length))

watch([q, dispo, sortBy, minPrice, maxPrice, perPage], () => { page.value = 1 })

/* KPI */
const total = computed(() => items.value.length)
const totalFree = computed(() => items.value.filter(l => !!l.free).length)
const avgPrice = computed(() => {
  if (!items.value.length) return 0
  const sum = items.value.reduce((acc, l) => acc + (Number(l.price) || 0), 0)
  return Math.round(sum / items.value.length)
})

/* Actions */
const goAdd = () => router.push('/logements/add')
const goEdit = (id) => router.push(`/logements/edit/${id}`)
const deleteLogement = async (id) => {
  if (confirm('Supprimer ce logement ?')) await logementStore.deleteLogement(id)
}

/* Helpers */
const money = (v) => `${Number(v||0).toLocaleString('fr-FR')} TND`
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
              <span class="text-orange-600 font-medium">Logements</span>
            </nav>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white">
                <Home class="w-5 h-5" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Gestion des logements</h1>
                <p class="text-gray-600">Liste, filtrage et gestion des biens immobiliers</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button class="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white" @click="goAdd">
              <Plus class="w-4 h-4" />
              Ajouter un logement
            </Button>
          </div>
        </div>
      </section>

      <!-- KPI Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="rounded-xl border shadow-sm">
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-blue-50 rounded-lg">
                <Home class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                <p class="text-2xl font-bold text-gray-900">{{ total }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-xl border shadow-sm">
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-green-50 rounded-lg">
                <Filter class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Disponibles</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalFree }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="rounded-xl border shadow-sm">
          <CardContent class="p-5">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-purple-50 rounded-lg">
                <Home class="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Prix moyen</p>
                <p class="text-2xl font-bold text-gray-900">{{ money(avgPrice) }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <!-- Table Card -->
      <section class="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <!-- Toolbar -->
        <div class="p-4 border-b flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Liste des logements</h2>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input v-model.trim="q" placeholder="Rechercher (titre, description, lieu)…" class="pl-9 w-72" />
            </div>

            <!-- Price range -->
            <div class="flex items-center gap-2">
              <Input v-model="minPrice" type="number" min="0" placeholder="Min" class="w-28" />
              <span class="text-gray-400">—</span>
              <Input v-model="maxPrice" type="number" min="0" placeholder="Max" class="w-28" />
            </div>

            <!-- Availability -->
            <Select v-model="dispo">
              <SelectTrigger class="w-[160px]">
                <SelectValue placeholder="Disponibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes</SelectItem>
                <SelectItem value="free">Disponibles</SelectItem>
                <SelectItem value="busy">Indisponibles</SelectItem>
              </SelectContent>
            </Select>

            <!-- Sort -->
            <Select v-model="sortBy">
              <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Récents</SelectItem>
                <SelectItem value="priceAsc">Prix ↑</SelectItem>
                <SelectItem value="priceDesc">Prix ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <Table>
            <TableHeader class="bg-gray-50">
              <TableRow>
                <TableHead>Média</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead class="w-[320px]">Description</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Disponibilité</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <!-- Loading -->
            <TableBody v-if="logementStore.isLoading">
              <TableRow v-for="n in 5" :key="n">
                <TableCell colspan="7">
                  <div class="h-10 animate-pulse bg-gray-100 rounded-md"></div>
                </TableCell>
              </TableRow>
            </TableBody>

            <!-- Data -->
            <TableBody v-else-if="filtered.length">
              <TableRow v-for="log in paged" :key="log._id" class="hover:bg-muted/50">
                <TableCell>
                  <div class="w-12 h-10 bg-gray-100 rounded-md overflow-hidden grid place-items-center">
                    <img
                      v-if="log.coverUrl"
                      :src="log.coverUrl"
                      alt=""
                      class="w-full h-full object-cover"
                    />
                    <ImageIcon v-else class="w-5 h-5 text-gray-400" />
                  </div>
                </TableCell>

                <TableCell class="font-medium text-gray-900">
                  {{ log.title || '—' }}
                </TableCell>

                <TableCell class="max-w-[320px]">
                  <span class="block truncate text-gray-700">{{ log.description || '—' }}</span>
                </TableCell>

                <TableCell class="whitespace-nowrap">
                  {{ money(log.price) }}
                </TableCell>

                <TableCell class="whitespace-nowrap">
                  <div class="inline-flex items-center gap-1 text-gray-700">
                    <MapPin class="w-4 h-4 text-gray-400" /> {{ log.location || '—' }}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    :variant="log.free ? 'outline' : 'secondary'"
                    :class="log.free ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'"
                  >
                    {{ log.free ? 'Disponible' : 'Indisponible' }}
                  </Badge>
                </TableCell>

                <TableCell class="text-right space-x-2 whitespace-nowrap">
                  <Button variant="outline" size="sm" @click="goEdit(log._id)">Modifier</Button>
                  <Button variant="destructive" size="sm" @click="deleteLogement(log._id)">Supprimer</Button>
                </TableCell>
              </TableRow>
            </TableBody>

            <!-- Empty -->
            <TableBody v-else>
              <TableRow>
                <TableCell colspan="7">
                  <div class="text-center py-12">
                    <div class="w-20 h-20 bg-gray-100 rounded-full grid place-items-center mx-auto mb-4">
                      <Home class="w-9 h-9 text-gray-400" />
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-1">Aucun logement trouvé</h3>
                    <p class="text-gray-500 mb-6">
                      Ajuste la recherche/les filtres ou ajoute un nouveau logement.
                    </p>
                    <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="goAdd">
                      Ajouter un logement
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
            Affichage <span class="font-semibold">{{ from }}</span>–<span class="font-semibold">{{ to }}</span>
            sur <span class="font-semibold">{{ filtered.length }}</span>
          </p>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" :disabled="page===1" @click="page--">Précédent</Button>
            <div class="text-gray-700">Page {{ page }} / {{ pages }}</div>
            <Button variant="outline" size="sm" :disabled="page>=pages" @click="page++">Suivant</Button>
            <Select v-model="perPage">
              <SelectTrigger class="w-[110px]">
                <SelectValue placeholder="Par page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="5">5</SelectItem>
                <SelectItem :value="8">8</SelectItem>
                <SelectItem :value="12">12</SelectItem>
                <SelectItem :value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>
