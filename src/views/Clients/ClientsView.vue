<script setup>
import { onMounted } from 'vue'
import { useClients } from '@/composables/useClient'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const clientStore = useClients()
const router = useRouter()

onMounted(() => clientStore.fetchClients())

const deleteClient = async (id) => {
  if (confirm('Delete this client?')) await clientStore.deleteClient(id)
}
</script>

<template>
  <AdminLayout>
  <div class="p-4">
    <Button variant="default" class="mb-4" @click="router.push('/clients/add')">Add Client</Button>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Address</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow v-for="client in clientStore.clients" :key="client.id">
          <TableCell>{{ client.name }}</TableCell>
          <TableCell>{{ client.email }}</TableCell>
          <TableCell>{{ client.phone }}</TableCell>
          <TableCell>{{ client.address }}</TableCell>
          <TableCell>
            <Button variant="link" @click="router.push(`/clients/edit/${client.id}`)">Edit</Button>
            <Button variant="destructive" @click="deleteClient(client.id)">Delete</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  </AdminLayout>

</template>
