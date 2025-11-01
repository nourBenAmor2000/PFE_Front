<script setup>
import { ref, onMounted } from 'vue'
import { useVisits } from '@/composables/useVisits'
import { useRouter, useRoute } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'


const route = useRoute()
const router = useRouter()
const visitStore = useVisits()
const visit = ref({ client_id:'', logement_id:'', visit_date:'' })


onMounted(() => {
const v = visitStore.visits.find(v => v._id === route.params.id)
if (v) visit.value = { ...v }
})


const submit = async () => {
await visitStore.updateVisit(route.params.id, visit.value)
router.push('/visits')
}
</script>


<template>
    <AdminLayout>
<Card class="max-w-lg mx-auto mt-10">
<CardHeader>
<CardTitle>Edit Visit</CardTitle>
</CardHeader>
<CardContent class="space-y-4">
<Input v-model="visit.client_id" placeholder="Client ID" />
<Input v-model="visit.logement_id" placeholder="Logement ID" />
<Input type="date" v-model="visit.visit_date" placeholder="Visit Date" />
<Button variant="default" @click="submit">Update</Button>
</CardContent>
</Card>
    </AdminLayout>

</template>