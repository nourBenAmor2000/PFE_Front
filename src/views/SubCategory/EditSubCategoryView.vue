<template>
  <AdminLayout>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Modifier une sous-catégorie</h1>

    <Card>
      <CardContent>
        <form @submit.prevent="updateSubcategoryData" class="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input v-model="form.name" required />
          </div>

          <div>
            <Label>Catégorie</Label>
            <Select v-model="form.category_id">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="cat in categories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" class="bg-primary text-white w-full">Mettre à jour</Button>
        </form>
      </CardContent>
    </Card>
  </div>
  </AdminLayout>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSubcategories } from '@/composables/useSubCategory'
import { useCategories } from '@/composables/useCategories'

// ✅ shadcn-vue components
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select'
import AdminLayout from '@/layouts/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const subcategoryStore = useSubcategories()
const categoryStore = useCategories()
const { categories, fetchCategories } = categoryStore

const form = ref({ name: '', category_id: '' })

onMounted(async () => {
  await fetchCategories()
  const subcategory = subcategoryStore.subcategories.find(s => s.id === Number(route.params.id))
  if (subcategory) Object.assign(form.value, subcategory)
})

const updateSubcategoryData = async () => {
  await subcategoryStore.updateSubcategory(route.params.id, form.value)
  router.push('/subcategories')
}
</script>
