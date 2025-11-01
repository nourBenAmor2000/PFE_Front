<script setup>
import { onMounted } from 'vue'
import { useCategories } from '@/composables/useCategories'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'


const categoryStore = useCategories()
const router = useRouter()


onMounted(() => categoryStore.fetchCategories())


const deleteCategory = async (id) => {
if (confirm('Are you sure you want to delete this category?')) {
await categoryStore.deleteCategory(id)
}
}
</script>


<template>
    <AdminLayout>
<div class="p-4">
<Button variant="default" @click="router.push('/categories/add')" class="mb-4">Add Category</Button>
<Table>
<TableHead>
<TableRow>
<TableCell>Name</TableCell>
<TableCell>Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
<TableRow v-for="cat in categoryStore.categories" :key="cat._id">
<TableCell>{{ cat.name }}</TableCell>
<TableCell>
<Button variant="link" @click="router.push(`/categories/edit/${cat._id}`)">Edit</Button>
<Button variant="destructive" @click="deleteCategory(cat._id)">Delete</Button>
</TableCell>
</TableRow>
</TableBody>
</Table>
</div>
    </AdminLayout>

</template>