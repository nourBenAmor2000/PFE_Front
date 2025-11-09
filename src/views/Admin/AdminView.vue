<template>
  <AdminLayout>
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p class="text-gray-600 mt-2">Manage system administrators and their permissions</p>
        </div>
        <a href="/admin/admins/add" class="flex items-center gap-2">
          <Plus class="w-4 h-4" />
          Add New Admin
        </a>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg border p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-lg">
              <Users class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Total Admins</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStore.admins.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg border p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <UserCheck class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Active Admins</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStore.admins.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg border p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Shield class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Admin Roles</p>
              <p class="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Admins Table -->
      <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900">Administrators</h2>
        </div>
        
        <Table>
          <TableHeader class="bg-gray-50">
            <TableRow>
              <TableHead class="font-semibold text-gray-900">Admin</TableHead>
              <TableHead class="font-semibold text-gray-900">Contact</TableHead>
              <TableHead class="font-semibold text-gray-900">Status</TableHead>
              <TableHead class="font-semibold text-gray-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="a in adminStore.admins" :key="a._id" class="hover:bg-gray-50 transition-colors">
              <TableCell>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ a.name }}</p>
                    <p class="text-sm text-gray-500">Administrator</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <Mail class="w-4 h-4 text-gray-400" />
                    <span class="text-gray-600">{{ a.email }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Phone class="w-4 h-4 text-gray-400" />
                    <span class="text-gray-600 text-sm">+1 (555) 123-4567</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span class="text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">Active</span>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="router.push(`/admins/edit/${a._id}`)"
                    class="flex items-center gap-2"
                  >
                    <Edit class="w-4 h-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    @click="deleteAdmin(a._id)"
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
        <div v-if="adminStore.admins.length === 0" class="text-center py-12">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No administrators found</h3>
          <p class="text-gray-500 mb-6">Get started by adding your first system administrator.</p>
          <a href="/admin/admins/add" class="flex items-center gap-2 mx-auto">
            <Plus class="w-4 h-4" />
            Add New Admin
          </a>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdmins } from '@/composables/useAdmin'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { 
  Plus, 
  Users, 
  UserCheck, 
  Shield, 
  User, 
  Mail, 
  Phone, 
  Edit, 
  Trash2 
} from 'lucide-vue-next'

const adminStore = useAdmins()
const router = useRouter()

onMounted(() => adminStore.fetchAdmins())

const deleteAdmin = async (id) => {
  if (confirm('Are you sure you want to delete this administrator? This action cannot be undone.')) {
    await adminStore.deleteAdmin(id)
  }
}
</script>

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