<script setup>
import { onMounted } from 'vue'
import { useVisits } from '@/composables/useVisits'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'


const visitStore = useVisits()
const router = useRouter()


onMounted(() => visitStore.fetchVisits())


const deleteVisit = async (id) => {
if (confirm('Delete this visit?')) await visitStore.deleteVisit(id)
}
</script>


<template>
    <AdminLayout>
<div class="p-4">
<Button variant="default" @click="router.push('/visits/add')" class="mb-4">Add Visit</Button>
<Table>
<TableHead>
<TableRow>
<TableCell>Client</TableCell>
<TableCell>Logement</TableCell>
<TableCell>Visit Date</TableCell>
<TableCell>Actions</TableCell>
</TableRow>
</TableHead>
<TableBody>
<TableRow v-for="v in visitStore.visits" :key="v._id">
<TableCell>{{ v.client_id }}</TableCell>
<TableCell>{{ v.logement_id }}</TableCell>
<TableCell>{{ new Date(v.visit_date).toLocaleDateString() }}</TableCell>
<TableCell>
<Button variant="link" @click="router.push(`/visits/edit/${v._id}`)">Edit</Button>
<Button variant="destructive" @click="deleteVisit(v._id)">Delete</Button>
</TableCell>
</TableRow>
</TableBody>
</Table>
</div>
    </AdminLayout>

</template>