<script setup>
import { ref } from 'vue'
import { useVisits } from '@/composables/useVisits'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'


const visitStore = useVisits()
const router = useRouter()
const visit = ref({ client_id:'', logement_id:'', visit_date:'' })


const submit = async () => {
await visitStore.addVisit(visit.value)
router.push('/visits')
}
</script>


<template>
    <AdminLayout>
<Card class="max-w-lg mx-auto mt-10">
<CardHeader>
<CardTitle>Add Visit</CardTitle>
</CardHeader>
<CardContent class="space-y-4">
<Input v-model="visit.client_id" placeholder="Client ID" />
<Input v-model="visit.logement_id" placeholder="Logement ID" />
<Input type="date" v-model="visit.visit_date" placeholder="Visit Date" />
<Button variant="default" @click="submit">Save</Button>
</CardContent>
</Card>
    </AdminLayout>

</template>