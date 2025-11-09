<script setup>
import { onMounted, ref, computed } from 'vue'
import { useClients } from '@/composables/useClient'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Input from '@/components/ui/input/Input.vue'
import { 
  Plus, 
  Search, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2,
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-vue-next'

const clientStore = useClients()
const router = useRouter()
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

onMounted(() => clientStore.fetchClients())

const deleteClient = async (id) => {
  if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
    await clientStore.deleteClient(id)
  }
}

// Computed properties for pagination and filtering
const filteredClients = computed(() => {
  if (!searchQuery.value) return clientStore.clients
  
  const query = searchQuery.value.toLowerCase()
  return clientStore.clients.filter(client => 
    client.name?.toLowerCase().includes(query) ||
    client.email?.toLowerCase().includes(query) ||
    client.phone?.includes(query) ||
    client.address?.toLowerCase().includes(query)
  )
})

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredClients.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredClients.value.length / itemsPerPage.value)
})

const pageNumbers = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
})

function goToPage(page) {
  if (page !== '...' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<template>
  <AdminLayout>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Client Management</h1>
          <p class="text-gray-600 mt-2">Manage your clients and their information</p>
        </div>
        <a href="/clients/add" class="flex items-center gap-2">
          <Plus class="w-4 h-4" />
          Add New Client
        </a>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg border p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Users class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Total Clients</p>
              <p class="text-2xl font-bold text-gray-900">{{ clientStore.clients.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg border p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <Mail class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Active Contacts</p>
              <p class="text-2xl font-bold text-gray-900">{{ clientStore.clients.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg border p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Phone class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">With Phone</p>
              <p class="text-2xl font-bold text-gray-900">{{ clientStore.clients.filter(c => c.phone).length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg border p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-orange-100 rounded-lg">
              <MapPin class="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">With Address</p>
              <p class="text-2xl font-bold text-gray-900">{{ clientStore.clients.filter(c => c.address).length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Clients Table Section -->
      <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
        <!-- Table Header with Search and Filters -->
        <div class="p-6 border-b">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="relative w-full sm:w-auto">
              <Search class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                v-model="searchQuery"
                placeholder="Search clients..."
                class="pl-10 w-full sm:w-80"
              />
            </div>
            <div class="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" class="flex items-center gap-2">
                <Filter class="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" class="flex items-center gap-2">
                <Download class="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <Table>
          <TableHead class="bg-gray-50">
            <TableRow>
              <TableHead class="font-semibold text-gray-900">Client</TableHead>
              <TableHead class="font-semibold text-gray-900">Contact</TableHead>
              <TableHead class="font-semibold text-gray-900">Address</TableHead>
              <TableHead class="font-semibold text-gray-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow v-for="client in paginatedClients" :key="client._id" class="hover:bg-gray-50 transition-colors">
              <TableCell>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Users class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ client.name }}</p>
                    <p class="text-sm text-gray-500">Client ID: {{ client._id }}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <Mail class="w-4 h-4 text-gray-400" />
                    <span class="text-gray-600">{{ client.email || 'No email' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Phone class="w-4 h-4 text-gray-400" />
                    <span class="text-gray-600 text-sm">{{ client.phone || 'No phone' }}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2 max-w-xs">
                  <MapPin class="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span class="text-gray-600 truncate">{{ client.address || 'No address provided' }}</span>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="router.push(`/clients/edit/${client._id}`)"
                    class="flex items-center gap-2"
                  >
                    <Edit class="w-4 h-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    @click="deleteClient(client._id)"
                    class="flex items-center gap-2"
                  >
                    <Trash2 class="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Empty State -->
        <div v-if="filteredClients.length === 0" class="text-center py-12">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p class="text-gray-500 mb-6" v-if="searchQuery">
            No clients match your search criteria. Try adjusting your search terms.
          </p>
          <p class="text-gray-500 mb-6" v-else>
            Get started by adding your first client to the system.
          </p>
          <Button @click="router.push('/clients/add')" class="flex items-center gap-2 mx-auto">
            <Plus class="w-4 h-4" />
            Add New Client
          </Button>
        </div>

        <!-- Pagination -->
        <div v-if="filteredClients.length > 0" class="px-6 py-4 border-t">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-600">
              Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to 
              {{ Math.min(currentPage * itemsPerPage, filteredClients.length) }} of 
              {{ filteredClients.length }} results
            </div>
            
            <div class="flex items-center gap-2">
              <!-- Previous Button -->
              <Button
                variant="outline"
                size="sm"
                :disabled="currentPage === 1"
                @click="previousPage"
                class="flex items-center gap-1"
              >
                Previous
              </Button>

              <!-- Page Numbers -->
              <div class="flex gap-1">
                <Button
                  v-for="page in pageNumbers"
                  :key="page"
                  variant="outline"
                  size="sm"
                  :class="[
                    'min-w-10',
                    page === currentPage 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'text-gray-700',
                    page === '...' && 'cursor-default hover:bg-transparent'
                  ]"
                  @click="goToPage(page)"
                  :disabled="page === '...'"
                >
                  {{ page }}
                </Button>
              </div>

              <!-- Next Button -->
              <Button
                variant="outline"
                size="sm"
                :disabled="currentPage === totalPages"
                @click="nextPage"
                class="flex items-center gap-1"
              >
                Next
              </Button>
            </div>

            <!-- Items Per Page Selector -->
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Show</span>
              <select 
                v-model="itemsPerPage" 
                class="border rounded px-2 py-1 text-sm"
                @change="currentPage = 1"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span class="text-sm text-gray-600">per page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Custom styles for better visual hierarchy */
:deep(.table) {
  border-radius: 0.5rem;
}

:deep(.table-header) {
  background-color: #f9fafb;
}

:deep(.table-row:hover) {
  background-color: #f8fafc;
}
</style>