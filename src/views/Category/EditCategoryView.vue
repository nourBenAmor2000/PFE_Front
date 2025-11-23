<script setup>
import { ref, onMounted } from 'vue'
import { useCategories } from '@/composables/useCategories'
import { useRouter, useRoute } from 'vue-router'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategories()
const name = ref('')


onMounted(async () => {
  try {
    await categoryStore.fetchCategories()
    const cat = categoryStore.categories.find(c => c._id === route.params.id || c.id === route.params.id)
    if (cat) {
      name.value = cat.name
    } else {
      alert('Catégorie non trouvée')
      router.push('/admin/categories')
    }
  } catch (error) {
    console.error('Error loading category:', error)
    alert('Erreur lors du chargement: ' + (error.message || 'Erreur inconnue'))
  }
})


const submit = async () => {
  try {
    await categoryStore.updateCategory(route.params.id, name.value)
    router.push('/admin/categories')
  } catch (error) {
    const errorMsg = categoryStore.error || error.message || 'Erreur lors de la mise à jour'
    alert('Erreur: ' + errorMsg)
    console.error('Error updating category:', error)
  }
}
</script>


<template>
    <AdminLayout>
<Card class="max-w-md mx-auto mt-10">
<CardHeader>
<CardTitle>Edit Category</CardTitle>
</CardHeader>
<CardContent class="space-y-4">
<Input v-model="name" placeholder="Category name" />
<Button variant="default" @click="submit">Update</Button>
</CardContent>
</Card>
    </AdminLayout>

</template>