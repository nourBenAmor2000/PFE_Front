<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgencies } from '@/composables/useAgencies'

import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const agencyStore = useAgencies()
const router = useRouter()

onMounted(() => agencyStore.fetchAgencies())

const deleteAgency = async (id) => {
  if (confirm('Supprimer cette agence ?')) await agencyStore.deleteAgency(id)
}
</script>

<template>
    <AdminLayout>
<div class="p-4">
  <Button variant="default" @click="router.push('/agencies/add')" class="mb-4">Ajouter Agence</Button>

  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Nom</TableCell>
        <TableCell>Username</TableCell>
        <TableCell>Téléphone</TableCell>
        <TableCell>Adresse</TableCell>
        <TableCell>Ville</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      <TableRow v-for="a in agencyStore.agencies" :key="a._id">
        <TableCell>{{ a.name }}</TableCell>
        <TableCell>{{ a.username }}</TableCell>
        <TableCell>{{ a.phone }}</TableCell>
        <TableCell>{{ a.address }}</TableCell>
        <TableCell>{{ a.city }}</TableCell>
        <TableCell>
          <Button variant="link" @click="router.push(`/agencies/edit/${a._id}`)">Edit</Button>
          <Button variant="destructive" @click="deleteAgency(a._id)">Delete</Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
    </AdminLayout>

</template>
