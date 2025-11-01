<template>
  <AdminLayout>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Liste des sous-catégories</h1>
      <Button @click="goToAdd" class="bg-primary text-white">+ Ajouter</Button>
    </div>

    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow v-for="subcategory in subcategories" :key="subcategory.id">
              <TableCell>{{ subcategory.name }}</TableCell>
              <TableCell>{{ subcategory.category?.name }}</TableCell>
              <TableCell class="space-x-2">
                <Button variant="outline" size="sm" @click="goToEdit(subcategory.id)">Modifier</Button>
                <Button variant="destructive" size="sm" @click="deleteSub(subcategory.id)">Supprimer</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
  </AdminLayout>

</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSubcategories } from '@/composables/useSubCategory'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()
const subcategoryStore = useSubcategories()
const { subcategories, fetchSubcategories, deleteSubcategory } = subcategoryStore

const goToAdd = () => router.push('/subcategories/add')
const goToEdit = id => router.push(`/subcategories/edit/${id}`)
const deleteSub = async id => await deleteSubcategory(id)

onMounted(fetchSubcategories)
</script>
