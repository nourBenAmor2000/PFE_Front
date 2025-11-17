<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSubcategories } from '@/composables/useSubCategory'
import AdminLayout from '@/layouts/AdminLayout.vue'

/* UI */
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCell from '@/components/ui/table/TableCell.vue'

/* Icons */
import { Plus, Search, Edit, Trash2, Folder, Tag, Layers, Loader } from 'lucide-vue-next'

const router = useRouter()
const subcategoryStore = useSubcategories()
const { fetchSubcategories, deleteSubcategory } = subcategoryStore

/* local state */
const isLoading = ref(false)
const q = ref('')
const qDebounced = ref('')
const parentFilter = ref('') // category id
const page = ref(1)
const perPage = ref(10)

/* debounce recherche */
let t
watch(q, (v) => {
  clearTimeout(t)
  t = setTimeout(() => { qDebounced.value = v }, 250)
})

/* fetch */
onMounted(async () => {
  isLoading.value = true
  try { await fetchSubcategories() } finally { isLoading.value = false }
})

/* utils robustes */
const list = computed(() => subcategoryStore.subcategories || [])
const idOf = (s) => s?.id || s?._id || ''
const sliceSafe = (str, n = 6) => (str && str.length >= n ? str.slice(-n) : str || '—')
const categoryName = (s) => s?.category?.name || 'Non assignée'
const categoryId = (s) => s?.category?.id || s?.category?._id || ''

/* options catégories (uniques, triées) */
const categoryOptions = computed(() => {
  const set = new Map()
  for (const s of list.value) {
    const cid = categoryId(s)
    const name = categoryName(s)
    if (cid) set.set(cid, name)
  }
  return Array.from(set, ([value, label]) => ({ value, label })).sort((a,b)=>a.label.localeCompare(b.label))
})

/* filtre + recherche */
const filtered = computed(() => {
  let arr = [...list.value]
  const s = qDebounced.value.trim().toLowerCase()

  if (s) {
    arr = arr.filter(x =>
      (x.name || '').toLowerCase().includes(s) ||
      (x.category?.name || '').toLowerCase().includes(s)
    )
  }

  if (parentFilter.value) {
    arr = arr.filter(x => categoryId(x) === parentFilter.value)
  }

  // tri par nom puis par catégorie
  arr.sort((a, b) => {
    const an = (a.name || '').toLowerCase()
    const bn = (b.name || '').toLowerCase()
    if (an !== bn) return an.localeCompare(bn)
    return categoryName(a).toLowerCase().localeCompare(categoryName(b).toLowerCase())
  })

  return arr
})

/* pagination */
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / Number(perPage.value || 1))))
const paged = computed(() => {
  const start = (page.value - 1) * Number(perPage.value || 1)
  return filtered.value.slice(start, start + Number(perPage.value || 1))
})
const from = computed(() => filtered.value.length ? (page.value - 1) * Number(perPage.value || 1) + 1 : 0)
const to = computed(() => Math.min(page.value * Number(perPage.value || 1), filtered.value.length))

watch([qDebounced, parentFilter, perPage], () => { page.value = 1 })

/* actions */
const goToAdd = () => router.push('/subcategories/add')
const goToEdit = (id) => router.push(`/subcategories/edit/${id}`)
const deleteSub = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette sous-catégorie ? Cette action est irréversible.')) {
    await deleteSubcategory(id)
  }
}
</script>

<template>
  <AdminLayout>
    <div class="p-6 space-y-6 max-w-6xl mx-auto">
      <!-- Header / Breadcrumb + Actions -->
      <section class="bg-white rounded-2xl border shadow-sm p-5">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <nav class="text-sm text-gray-500 mb-1">
              <span class="hover:text-gray-700 cursor-default">Home</span>
              <span class="mx-2">›</span>
              <span class="text-orange-600 font-medium">Sous-catégories</span>
            </nav>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white">
                <Layers class="w-5 h-5" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                  Gestion des sous-catégories
                </h1>
                <p class="text-gray-600">Organisez vos sous-catégories par catégorie</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button class="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white" @click="goToAdd">
              <Plus class="w-4 h-4" />
              Ajouter une sous-catégorie
            </Button>
          </div>
        </div>
      </section>

      <!-- Toolbar -->
      <section class="bg-white rounded-2xl border shadow-sm p-4">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              v-model="q"
              type="text"
              placeholder="Rechercher (nom, catégorie)…"
              class="pl-9 w-80 rounded-lg border border-gray-200 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <!-- Filter by parent category -->
          <div class="flex items-center gap-2">
            <select
              v-model="parentFilter"
              class="rounded-lg border border-gray-200 py-2 px-3 text-sm focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Toutes les catégories</option>
              <option v-for="c in categoryOptions" :key="c.value" :value="c.value">
                {{ c.label }}
              </option>
            </select>

            <select
              v-model="perPage"
              class="rounded-lg border border-gray-200 py-2 px-3 text-sm"
            >
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
        <div class="p-4 border-b flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Sous-catégories</h2>
          <p class="text-sm text-gray-600">
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
            <Layers class="w-9 h-9 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Aucune sous-catégorie</h3>
          <p class="text-gray-500 mb-6">
            {{ q || parentFilter ? 'Ajuste la recherche/les filtres.' : 'Commence par ajouter ta première sous-catégorie.' }}
          </p>
          <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="goToAdd">
            Ajouter une sous-catégorie
          </Button>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <Table>
            <TableHeader class="bg-gray-50">
              <TableRow>
                <TableHead class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sous-catégorie
                </TableHead>
                <TableHead class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Catégorie parente
                </TableHead>
                <TableHead class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody class="bg-white divide-y divide-gray-100">
              <TableRow
                v-for="s in paged"
                :key="idOf(s)"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <Tag :size="16" class="text-gray-500 flex-shrink-0" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ s.name || '—' }}</p>
                      <p class="text-xs text-gray-500">ID: {{ sliceSafe(idOf(s)) }}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <Folder :size="16" class="text-gray-500 flex-shrink-0" />
                    <div>
                      <p class="text-sm text-gray-700">{{ categoryName(s) }}</p>
                      <p v-if="categoryId(s)" class="text-xs text-gray-500">Catégorie parente</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="goToEdit(idOf(s))"
                    >
                      <Edit :size="14" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="deleteSub(idOf(s))"
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

      <!-- Quick Stats -->
      <section v-if="filtered.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div class="flex items-center gap-3">
            <Layers class="text-blue-600" :size="20" />
            <div>
              <p class="text-sm font-medium text-blue-900">Total sous-catégories</p>
              <p class="text-2xl font-bold text-blue-700">{{ filtered.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-green-50 rounded-lg p-4 border border-green-200">
          <div class="flex items-center gap-3">
            <Folder class="text-green-600" :size="20" />
            <div>
              <p class="text-sm font-medium text-green-900">Catégories utilisées</p>
              <p class="text-2xl font-bold text-green-700">
                {{ new Set(filtered.map(s => s.category?.id || s.category?._id).filter(Boolean)).size }}
              </p>
            </div>
          </div>
        </div>
        <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div class="flex items-center gap-3">
            <Tag class="text-purple-600" :size="20" />
            <div>
              <p class="text-sm font-medium text-purple-900">Sans catégorie</p>
              <p class="text-2xl font-bold text-purple-700">
                {{ filtered.filter(s => !s.category).length }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Help -->
      <section class="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-start gap-3">
          <Layers :size="20" class="text-blue-600 mt-0.5" />
          <div>
            <h3 class="text-sm font-medium text-blue-900">Astuce</h3>
            <ul class="mt-1 text-sm text-blue-700 space-y-1">
              <li>• Utilisez la recherche et le filtre par catégorie pour naviguer rapidement.</li>
              <li>• Les sous-catégories renforcent vos filtres de logements.</li>
              <li>• Gardez des noms cohérents pour une meilleure UX.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>
