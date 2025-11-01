<template>
    <AdminLayout>
  <div class="p-4">
    <Button variant="default" @click="router.push('admin/admins/add')" class="mb-4">Add Admin</Button>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow v-for="a in adminStore.admins" :key="a._id">
          <TableCell>{{ a.name }}</TableCell>
          <TableCell>{{ a.email }}</TableCell>
          <TableCell>
            <Button variant="link" @click="router.push(`/admins/edit/${a._id}`)">Edit</Button>
            <Button variant="destructive" @click="deleteAdmin(a._id)">Delete</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
    </AdminLayout>

</template>

<script setup>
import { onMounted } from 'vue'
import { useAdmins } from '@/composables/useAdmin'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const adminStore = useAdmins()
const router = useRouter()

onMounted(() => adminStore.fetchAdmins())

const deleteAdmin = async (id) => {
  if (confirm('Delete this admin?')) await adminStore.deleteAdmin(id)
}
</script>
