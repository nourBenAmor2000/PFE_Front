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
              <span class="text-orange-600 font-medium">Dashboard</span>
            </nav>
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 grid place-items-center text-white">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2m4 0h14v-2H7v2m0 6h14v-2H7v2M3 19h2v-2H3v2M7 5v2h14V5H7M3 7h2V5H3v2Z"/></svg>
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Admins</h1>
                <p class="text-gray-600">Manage system administrators and their permissions</p>
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
              href="/admin/admins/add"
              class="inline-flex items-center gap-2 rounded-lg bg-orange-600 text-white px-4 py-2 font-medium hover:bg-orange-700"
            >
              <Plus class="w-4 h-4" />
              Add New Admin
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
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Admins</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStore.admins.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-green-50 rounded-lg">
              <UserCheck class="w-6 h-6 text-green-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Admins</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border shadow-sm p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-purple-50 rounded-lg">
              <Shield class="w-6 h-6 text-purple-600" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Admin Roles</p>
              <p class="text-2xl font-bold text-gray-900">{{ roleCount }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Table Card -->
      <section class="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <!-- Toolbar -->
        <div class="p-4 border-b flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Administrators</h2>

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
                placeholder="Search by name or email…"
                class="ml-2 bg-transparent text-sm outline-none placeholder:text-gray-400 w-56"
              />
            </div>

            <!-- Filters -->
            <select v-model="status" @change="applyFilters" class="rounded-lg border-gray-200 text-sm">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select v-model="role" @change="applyFilters" class="rounded-lg border-gray-200 text-sm">
              <option value="">All Roles</option>
              <option v-for="r in roleOptions" :key="r" :value="r" class="capitalize">{{ r }}</option>
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
                <TableHead class="font-semibold text-gray-900">Admin</TableHead>
                <TableHead class="font-semibold text-gray-900">Contact</TableHead>
                <TableHead class="font-semibold text-gray-900">Status</TableHead>
                <TableHead class="font-semibold text-gray-900">Role</TableHead>
                <TableHead class="font-semibold text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody v-if="!isBusy && filtered.length">
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
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full grid place-items-center">
                      <User class="w-5 h-5 text-white" />
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium text-gray-900 truncate">{{ a.name }}</p>
                      <p class="text-xs text-gray-500">Administrator</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <Mail class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-700 truncate">{{ a.email }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Phone class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-600 text-sm">—</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div class="inline-flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full" :class="a.active ? 'bg-green-500' : 'bg-gray-300'"></span>
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="a.active ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-gray-100'"
                    >
                      {{ a.active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <span class="px-2 py-1 rounded-md text-xs font-semibold capitalize"
                        :class="badgeForRole(a.role)">
                    {{ a.role || 'admin' }}
                  </span>
                </TableCell>

                <TableCell>
                  <div class="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="router.push(`/admins/edit/${a._id}`)"
                    >
                      <Edit class="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      class="flex items-center gap-2"
                      @click="deleteAdmin(a._id)"
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
                    <h3 class="text-lg font-medium text-gray-900 mb-1">No administrators found</h3>
                    <p class="text-gray-500 mb-6">Get started by adding your first system administrator.</p>
                    <a href="/admin/admins/add" class="inline-flex items-center gap-2 rounded-lg bg-orange-600 text-white px-4 py-2 font-medium hover:bg-orange-700">
                      <Plus class="w-4 h-4" />
                      Add New Admin
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
import { useAdmins } from '@/composables/useAdmin'

import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'

import { Plus, Users, UserCheck, Shield, User, Mail, Phone, Edit, Trash2 } from 'lucide-vue-next'

const adminStore = useAdmins()
const router = useRouter()

const isBusy = ref(false)

/* filters / search / selection */
const q = ref('')
const status = ref('')
const role = ref('')
const roleOptions = ['admin_global', 'admin_agent', 'admin_agence', 'agent_rh', 'agent_personnel']

const selectedIds = ref([])

/* pagination */
const page = ref(1)
const perPage = ref(8)

/* derived */
const activeCount = computed(() => adminStore.admins.filter(a => a.active !== false).length)
const roleCount = computed(() => new Set(adminStore.admins.map(a => a.role || 'admin')).size)

/* search + filters */
const filtered = computed(() => {
  const s = q.value.toLowerCase()
  return adminStore.admins
    .filter(a => (status.value ? (status.value === 'active' ? a.active !== false : a.active === false) : true))
    .filter(a => (role.value ? (a.role === role.value) : true))
    .filter(a => {
      if (!s) return true
      return (a.name || '').toLowerCase().includes(s) || (a.email || '').toLowerCase().includes(s)
    })
})

/* pagination helpers */
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))
const paged = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})
const from = computed(() => (filtered.value.length ? (page.value - 1) * perPage.value + 1 : 0))
const to = computed(() => Math.min(page.value * perPage.value, filtered.value.length))

watch([q, status, role], () => { page.value = 1 })

/* selection helpers */
const allSelected = computed(() => selectedIds.value.length && paged.value.every(i => selectedIds.value.includes(i._id)))
const toggleAll = (e) => {
  const ids = paged.value.map(i => i._id)
  if (e.target.checked) {
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...ids]))
  } else {
    selectedIds.value = selectedIds.value.filter(id => !ids.includes(id))
  }
}

/* role badge */
const badgeForRole = (r) => {
  const role = (r || 'admin').toLowerCase()
  if (role.includes('global')) return 'bg-purple-50 text-purple-700'
  if (role.includes('agence') || role.includes('agent')) return 'bg-blue-50 text-blue-700'
  return 'bg-gray-100 text-gray-700'
}

/* actions */
const refresh = async () => {
  isBusy.value = true
  await adminStore.fetchAdmins()
  isBusy.value = false
}
const deleteAdmin = async (id) => {
  if (confirm('Are you sure you want to delete this administrator? This action cannot be undone.')) {
    await adminStore.deleteAdmin(id)
    selectedIds.value = selectedIds.value.filter(x => x !== id)
  }
}
const bulkDelete = async () => {
  if (!selectedIds.value.length) return
  if (confirm(`Delete ${selectedIds.value.length} admin(s)?`)) {
    for (const id of selectedIds.value) {
      // Si tu as une méthode bulk côté API, remplace par un seul appel
      await adminStore.deleteAdmin(id)
    }
    selectedIds.value = []
  }
}
const bulkDeactivate = async () => {
  if (!selectedIds.value.length) return
  // Exemple : si ton store possède une méthode updateAdmin
  for (const id of selectedIds.value) {
    const a = adminStore.admins.find(x => x._id === id)
    if (a) await adminStore.updateAdmin(id, { active: false })
  }
  selectedIds.value = []
}

const onQuery = () => { /* debounce si tu veux; ici direct */ }
const applyFilters = () => { /* watchers déjà en place */ }

/* fetch on mount */
onMounted(async () => {
  isBusy.value = true
  await adminStore.fetchAdmins()
  isBusy.value = false
})
</script>

<style scoped>
/* Affine la hiérarchie visuelle dans le tableau */
:deep(.table-header) { background-color: #f9fafb; }
:deep(th), :deep(td) { vertical-align: middle; }
</style>
