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


onMounted(() => {
const cat = categoryStore.categories.find(c => c._id === route.params.id)
if (cat) name.value = cat.name
})


const submit = async () => {
await categoryStore.updateCategory(route.params.id, name.value)
router.push('/categories')
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