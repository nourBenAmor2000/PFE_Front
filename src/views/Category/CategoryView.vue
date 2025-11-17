<script setup>
import { onMounted, ref, computed } from 'vue'
import { useCategories } from '@/composables/useCategories'
import { useRouter } from 'vue-router'
import { Plus, Search, Edit, Trash2, Folder, Tag, Loader } from 'lucide-vue-next'

import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const categoryStore = useCategories()
const router = useRouter()
const isLoading = ref(false)
const searchQuery = ref('')

onMounted(() => {
  isLoading.value = true
  categoryStore.fetchCategories().finally(() => {
    isLoading.value = false
  })
})

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
    await categoryStore.deleteCategory(id)
  }
}

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categoryStore.categories
  
  const query = searchQuery.value.toLowerCase()
  return categoryStore.categories.filter(category => 
    category.name.toLowerCase().includes(query)
  )
})
</script>

<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <Folder :size="32" class="text-blue-600" />
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Categories Management</h1>
                <p class="text-gray-600 mt-1">Manage all categories in your system</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            @click="router.push('/categories/add')" 
            class="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus :size="18" />
            Add Category
          </Button>
        </div>

        <!-- Controls Section -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search categories..." 
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div class="flex items-center">
            <span class="text-sm text-gray-600 font-medium">
              {{ filteredCategories.length }} category(s) found
            </span>
          </div>
        </div>

        <!-- Table Section -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
            <Loader class="animate-spin text-blue-600 mb-4" :size="32" />
            <p class="text-gray-600">Loading categories...</p>
          </div>

          <!-- Empty States -->
          <div v-else-if="filteredCategories.length === 0 && searchQuery" class="flex flex-col items-center justify-center py-12 px-4">
            <Search :size="56" class="text-gray-400 mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
            <p class="text-gray-600 text-center mb-6 max-w-sm">
              No categories match your search "{{ searchQuery }}"
            </p>
            <Button variant="outline" @click="searchQuery = ''" class="flex items-center gap-2">
              Clear search
            </Button>
          </div>

          <div v-else-if="filteredCategories.length === 0" class="flex flex-col items-center justify-center py-12 px-4">
            <Folder :size="56" class="text-gray-400 mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No categories</h3>
            <p class="text-gray-600 text-center mb-6">Start by adding your first category</p>
            <Button variant="primary" @click="router.push('/categories/add')" class="flex items-center gap-2">
              <Plus :size="18" />
              Add Category
            </Button>
          </div>

          <!-- Table -->
          <Table v-else class="w-full">
            <TableHead class="bg-gray-50">
              <TableRow>
                <TableCell class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </TableCell>
                <TableCell class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody class="bg-white divide-y divide-gray-200">
              <TableRow 
                v-for="cat in filteredCategories" 
                :key="cat._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableCell class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <Tag :size="18" class="text-gray-500 flex-shrink-0" />
                    <span class="text-sm font-medium text-gray-900">{{ cat.name }}</span>
                  </div>
                </TableCell>
                <TableCell class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center gap-2">
                    <Button 
                      variant="outline" 
                      @click="router.push(`/categories/edit/${cat._id}`)"
                      class="flex items-center gap-2 px-3 py-2 text-xs"
                    >
                      <Edit :size="14" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      @click="deleteCategory(cat._id)"
                      class="flex items-center gap-2 px-3 py-2 text-xs"
                    >
                      <Trash2 :size="14" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Quick Stats -->
        <div v-if="!isLoading && filteredCategories.length > 0" class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div class="flex items-center gap-3">
              <Folder class="text-blue-600" :size="20" />
              <div>
                <p class="text-sm font-medium text-blue-900">Total Categories</p>
                <p class="text-2xl font-bold text-blue-700">{{ filteredCategories.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-green-50 rounded-lg p-4 border border-green-200">
            <div class="flex items-center gap-3">
              <Tag class="text-green-600" :size="20" />
              <div>
                <p class="text-sm font-medium text-green-900">Active</p>
                <p class="text-2xl font-bold text-green-700">{{ filteredCategories.length }}</p>
              </div>
            </div>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div class="flex items-center gap-3">
              <Edit class="text-purple-600" :size="20" />
              <div>
                <p class="text-sm font-medium text-purple-900">Ready to Manage</p>
                <p class="text-2xl font-bold text-purple-700">{{ filteredCategories.length }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>