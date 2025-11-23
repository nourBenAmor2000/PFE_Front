<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentContracts } from '@/composables/usePaymentContracts'
import { useContracts } from '@/composables/useContrats'

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
import { Plus, CreditCard, DollarSign, Search, Edit, Trash2, Calendar, FileText, Loader } from 'lucide-vue-next'

const router = useRouter()
const paymentStore = usePaymentContracts()
const contractStore = useContracts()

/* state */
const isLoading = ref(false)
const q = ref('')
const statusFilter = ref('') // '', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'
const page = ref(1)
const perPage = ref(10)

/* fetch */
onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      paymentStore.fetchPaymentContracts(),
      contractStore.fetchContracts(),
    ])
  } finally {
    isLoading.value = false
  }
})

/* helpers */
const getContractInfo = (id) => {
  const contract = contractStore.contracts.find(c => (c._id === id || c.id === id))
  return contract ? `Contrat #${(contract._id || contract.id).slice(-6)}` : '—'
}

const money = (v) => `${Number(v || 0).toLocaleString('fr-FR')} TND`
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR') : '—')

const statusBadge = (s) => {
  const classes = {
    'PENDING': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'PAID': 'bg-green-50 text-green-700 border-green-200',
    'FAILED': 'bg-red-50 text-red-700 border-red-200',
    'REFUNDED': 'bg-gray-50 text-gray-700 border-gray-200'
  }
  return classes[s] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const deletePayment = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.')) {
    try {
      await paymentStore.deletePaymentContract(id)
      await paymentStore.fetchPaymentContracts()
    } catch (error) {
      alert('Erreur lors de la suppression: ' + (paymentStore.error || error.message))
    }
  }
}

/* derived */
const list = computed(() => paymentStore.paymentContracts || [])

const filtered = computed(() => {
  let arr = [...list.value]
  const s = q.value.trim().toLowerCase()

  if (s) {
    arr = arr.filter(p => {
      const contractInfo = (getContractInfo(p.contract_id) || '').toLowerCase()
      const method = (p.methode_paiement || '').toLowerCase()
      const ref = (p.reference_transaction || '').toLowerCase()
      const amount = String(p.montant || '')
      return contractInfo.includes(s) || method.includes(s) || ref.includes(s) || amount.includes(s)
    })
  }

  // status filter
  if (statusFilter.value) {
    arr = arr.filter(p => p.statut === statusFilter.value)
  }

  // sort recent first
  arr.sort((a, b) => new Date(b.date_paiement || b._id) - new Date(a.date_paiement || a._id))
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

watch([q, statusFilter, perPage], () => { page.value = 1 })

/* quick stats */
const total = computed(() => filtered.value.length)
const totalPaid = computed(() => filtered.value.filter(p => p.statut === 'PAID').length)
const totalAmount = computed(() => {
  return filtered.value.reduce((sum, p) => sum + (Number(p.montant) || 0), 0)
})
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
              <span class="text-orange-600 font-medium">Paiements de contrats</span>
            </nav>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white">
                <CreditCard class="w-5 h-5" />
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                  Gestion des paiements
                </h1>
                <p class="text-gray-600">Gérez tous les paiements de contrats</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button
              class="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
              @click="router.push('/admin/payment-contracts/add')"
            >
              <Plus class="w-4 h-4" />
              Ajouter un paiement
            </Button>
          </div>
        </div>
      </section>

      <!-- KPI Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardContent class="p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-50 rounded-lg"><CreditCard class="w-6 h-6 text-blue-600" /></div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Paiements</p>
              <p class="text-2xl font-bold text-gray-900">{{ total }}</p>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent class="p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-green-50 rounded-lg"><DollarSign class="w-6 h-6 text-green-600" /></div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Payés</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalPaid }}</p>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent class="p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-purple-50 rounded-lg"><DollarSign class="w-6 h-6 text-purple-600" /></div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Montant total</p>
              <p class="text-2xl font-bold text-gray-900">{{ money(totalAmount) }}</p>
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
            <Input v-model="q" placeholder="Rechercher (contrat, méthode, référence)…" class="pl-9 w-80" />
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-3">
            <Select v-model="statusFilter">
              <SelectTrigger class="w-[160px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="PAID">Payé</SelectItem>
                <SelectItem value="FAILED">Échoué</SelectItem>
                <SelectItem value="REFUNDED">Remboursé</SelectItem>
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
          <h2 class="text-lg font-semibold text-gray-900">Paiements</h2>
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
            <CreditCard class="w-9 h-9 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">Aucun paiement</h3>
          <p class="text-gray-500 mb-6">
            {{ q || statusFilter ? 'Ajuste la recherche/les filtres.' : 'Commence par ajouter ton premier paiement.' }}
          </p>
          <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="router.push('/admin/payment-contracts/add')">
            Ajouter un paiement
          </Button>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <Table class="w-full">
            <TableHeader class="bg-gray-50">
              <TableRow>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Contrat</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Montant</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Méthode</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Date</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Statut</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900">Référence</TableHead>
                <TableHead class="px-6 py-3 font-semibold text-gray-900 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody class="bg-white divide-y divide-gray-100">
              <TableRow
                v-for="p in paged"
                :key="p._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <FileText class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getContractInfo(p.contract_id) }}</p>
                      <p class="text-xs text-gray-500">Contrat</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <DollarSign class="w-4 h-4 text-gray-500" />
                    <span class="text-sm font-semibold text-blue-600">{{ money(p.montant) }}</span>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-700">{{ p.methode_paiement || '—' }}</span>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <Calendar class="w-4 h-4 text-gray-500" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ fmtDate(p.date_paiement) }}</p>
                      <p class="text-xs text-gray-500">Date</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline" :class="statusBadge(p.statut)">
                    {{ p.statut || '—' }}
                  </Badge>
                </TableCell>

                <TableCell class="px-6 py-4">
                  <span class="text-sm text-gray-600 font-mono">{{ p.reference_transaction || '—' }}</span>
                </TableCell>

                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" class="flex items-center gap-2 px-3 py-2 text-xs"
                      @click="router.push(`/admin/payment-contracts/edit/${p._id}`)">
                      <Edit :size="14" /> Modifier
                    </Button>
                    <Button variant="destructive" size="sm" class="flex items-center gap-2 px-3 py-2 text-xs"
                      @click="deletePayment(p._id)">
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

