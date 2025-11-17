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
              <span class="text-orange-600 font-medium">Clients</span>
            </nav>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2m4 0h14v-2H7v2m0 6h14v-2H7v2M3 19h2v-2H3v2M7 5v2h14V5H7M3 7h2V5H3v2Z"/></svg>
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Clients</h1>
                <p class="text-gray-600">Manage your clients and their information</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="hidden sm:inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              @click="refresh"
              :disabled="isBusy"
              title="Refresh"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v7h-7"/></svg>
              Refresh
            </button>
            <a
              href="/clients/add"
              class="inline-flex items-center gap-2 rounded-lg bg-orange-600 text-white px-4 py-2 font-medium hover:bg-orange-700"
            >
              <Plus class="w-4 h-4" />
              Add New Client
            </a>
          </div>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-50 rounded-lg">
              <Users class="w-6 h-6 text-blue-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Clients</p>
              <p class="text-2xl font-bold text-gray-900">{{ clientStore.clients.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-green-50 rounded-lg">
              <Mail class="w-6 h-6 text-green-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">With Email</p>
              <p class="text-2xl font-bold text-gray-900">{{ withEmail }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-purple-50 rounded-lg">
              <Phone class="w-6 h-6 text-purple-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">With Phone</p>
              <p class="text-2xl font-bold text-gray-900">{{ withPhone }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Table Card -->
      <section class="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <!-- Toolbar -->
        <div class="p-4 border-b flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Clients</h2>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search -->
            <div class="flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              <input
                v-model.trim="q"
                @input="onQuery"
                type="text"
                placeholder="Search by name, email, phone…"
                class="ml-2 bg-transparent text-sm outline-none placeholder:text-gray-400 w-56"
              />
            </div>

            <!-- Filters -->
            <select v-model="status" @change="applyFilters" class="rounded-lg border-gray-200 text-sm">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select v-model="segment" @change="applyFilters" class="rounded-lg border-gray-200 text-sm">
              <option value="">All Segments</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="renter">Renter</option>
            </select>

            <!-- Bulk actions -->
            <div class="flex items-center gap-2">
              <button
                class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                :disabled="selectedIds.length === 0"
                @click="bulkDeactivate"
              >
                Deactivate
              </button>
              <button
                class="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm hover:bg-red-100 disabled:opacity-50"
                :disabled="selectedIds.length === 0"
                @click="bulkDelete"
              >
                Delete
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
                <TableHead class="font-semibold text-gray-900">Client</TableHead>
                <TableHead class="font-semibold text-gray-900">Contact</TableHead>
                <TableHead class="font-semibold text-gray-900">Address</TableHead>
                <TableHead class="font-semibold text-gray-900">Status</TableHead>
                <TableHead class="font-semibold text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody v-if="!isBusy && filtered.length">
              <TableRow
                v-for="c in paged"
                :key="c._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <input type="checkbox" :value="c._id" v-model="selectedIds" />
                </TableCell>

                <TableCell>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full grid place-items-center">
                      <Users class="w-5 h-5 text-white" />
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium text-gray-900 truncate">{{ c.name || '—' }}</p>
                      <p class="text-xs text-gray-500">ID: {{ c._id }}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <Mail class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-700 truncate">{{ c.email || 'No email' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Phone class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-600 text-sm">{{ c.phone || 'No phone' }}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div class="flex items-center gap-2 max-w-xs">
                    <svg class="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/></svg>
                    <span class="text-gray-600 truncate">{{ c.address || 'No address' }}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div class="inline-flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full" :class="c.active !== false ? 'bg-green-500' : 'bg-gray-300'"></span>
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="c.active !== false ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-gray-100'"
                    >
                      {{ c.active !== false ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div class="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="router.push(`/clients/edit/${c._id}`)"
                    >
                      <Edit class="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="deleteClient(c._id)"
                    >
                      <Trash2 class="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>

            <!-- Loading skeleton -->
            <TableBody v-else-if="isBusy">
              <TableRow v-for="n in 5" :key="n">
                <TableCell colspan="6">
                  <div class="h-10 animate-pulse bg-gray-100 rounded-md"></div>
                </TableCell>
              </TableRow>
            </TableBody>

            <!-- Empty state -->
            <TableBody v-else>
              <TableRow>
                <TableCell colspan="6">
                  <div class="text-center py-12">
                    <div class="w-20 h-20 bg-gray-100 rounded-full grid place-items-center mx-auto mb-4">
                      <Users class="w-9 h-9 text-gray-400" />
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
                    <p class="text-gray-500 mb-6">Get started by adding your first client.</p>
                    <a href="/clients/add" class="inline-flex items-center gap-2 rounded-lg bg-orange-600 text-white px-4 py-2 font-medium hover:bg-orange-700">
                      <Plus class="w-4 h-4" />
                      Add New Client
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Footer / Pagination -->
        <div class="border-t px-4 py-3 flex items-center justify-between text-sm">
          <p class="text-gray-600">
            Showing <span class="font-semibold">{{ from }}</span>–<span class="font-semibold">{{ to }}</span> of
            <span class="font-semibold">{{ filtered.length }}</span>
          </p>
          <div class="flex items-center gap-2">
            <button class="rounded-lg border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50" :disabled="page===1" @click="page--">Previous</button>
            <button class="rounded-lg border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50" :disabled="page>=pages" @click="page++">Next</button>
          </div>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useClients } from '@/composables/useClient'

import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'

import { Plus, Users, Mail, Phone, Edit, Trash2 } from 'lucide-vue-next'

const clientStore = useClients()
const router = useRouter()

const isBusy = ref(false)

/* filters / search / selection */
const q = ref('')
const status = ref('')
const segment = ref('')
const selectedIds = ref([])

/* pagination */
const page = ref(1)
const perPage = ref(8)

/* KPIs */
const withEmail = computed(() => clientStore.clients.filter(c => !!c.email).length)
const withPhone = computed(() => clientStore.clients.filter(c => !!c.phone).length)

/* filtered list */
const filtered = computed(() => {
  const s = q.value.toLowerCase()
  return clientStore.clients
    .filter(c => (status.value ? (status.value === 'active' ? c.active !== false : c.active === false) : true))
    .filter(c => (segment.value ? (c.segment === segment.value) : true))
    .filter(c => {
      if (!s) return true
      return (c.name || '').toLowerCase().includes(s)
          || (c.email || '').toLowerCase().includes(s)
          || (c.phone || '').toLowerCase?.().includes(s)
          || (c.address || '').toLowerCase().includes(s)
          || (c._id || '').toLowerCase().includes(s)
    })
})

/* pagination helpers */
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))
const paged  = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})
const from   = computed(() => (filtered.value.length ? (page.value - 1) * perPage.value + 1 : 0))
const to     = computed(() => Math.min(page.value * perPage.value, filtered.value.length))

watch([q, status, segment, perPage], () => { page.value = 1 })

/* selection helpers */
const allSelected = computed(() => selectedIds.value.length && paged.value.every(i => selectedIds.value.includes(i._id)))
const toggleAll = (e) => {
  const ids = paged.value.map(i => i._id)
  if (e.target.checked) selectedIds.value = Array.from(new Set([...selectedIds.value, ...ids]))
  else selectedIds.value = selectedIds.value.filter(id => !ids.includes(id))
}

/* actions */
const refresh = async () => {
  isBusy.value = true
  await clientStore.fetchClients()
  isBusy.value = false
}
const deleteClient = async (id) => {
  if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
    await clientStore.deleteClient(id)
    selectedIds.value = selectedIds.value.filter(x => x !== id)
  }
}
const bulkDelete = async () => {
  if (!selectedIds.value.length) return
  if (confirm(`Delete ${selectedIds.value.length} client(s)?`)) {
    for (const id of selectedIds.value) {
      await clientStore.deleteClient(id)
    }
    selectedIds.value = []
  }
}
const bulkDeactivate = async () => {
  if (!selectedIds.value.length) return
  for (const id of selectedIds.value) {
    const c = clientStore.clients.find(x => x._id === id)
    if (c && clientStore.updateClient) await clientStore.updateClient(id, { active: false })
  }
  selectedIds.value = []
}

const onQuery = () => {}
const applyFilters = () => {}

/* fetch on mount */
onMounted(async () => {
  isBusy.value = true
  await clientStore.fetchClients()
  isBusy.value = false
})
</script>

<style scoped>
:deep(.table-header) { background-color: #f9fafb; }
:deep(th), :deep(td) { vertical-align: middle; }
</style>
