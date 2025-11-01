<script setup>
import { ref, onMounted } from 'vue'
import { useCategories } from '@/composables/useCategories'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'


const name = ref('')
const categoryStore = useCategories()
const router = useRouter()


const submit = async () => {
await categoryStore.addCategory(name.value)
router.push('/categories')
}
</script>


<template>
    <AdminLayout>
<Card class="max-w-md mx-auto mt-10">
<CardHeader>
<CardTitle>Add Category</CardTitle>
</CardHeader>
<CardContent class="space-y-4">
<Input v-model="name" placeholder="Category name" />
<Button variant="default" @click="submit">Save</Button>
</CardContent>
</Card>
    </AdminLayout>

</template>