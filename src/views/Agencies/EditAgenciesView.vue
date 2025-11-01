<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAgencies } from '@/composables/useAgencies'

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Label from '@/components/ui/label/Label.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const agencyStore = useAgencies()

const agency = ref({
  name: '',
  username: '',
  address: '',
  phone: '',
  logo: '',
  location: '',
  city: ''
})

onMounted(async () => {
  await agencyStore.fetchAgencies()
  const a = agencyStore.agencies.find(a => a._id === route.params.id)
  if (a) agency.value = { ...a }
})

const submit = async () => {
  await agencyStore.updateAgency(route.params.id, agency.value)
  router.push('/agencies')
}
</script>

<template>
 <AdminLayout>
<Card class="max-w-lg mx-auto mt-10">
  <CardHeader>
    <CardTitle>Modifier l'Agence</CardTitle>
  </CardHeader>
  <CardContent class="space-y-4">
    <div><Label>Nom</Label><Input v-model="agency.name" /></div>
    <div><Label>Nom d'utilisateur</Label><Input v-model="agency.username" /></div>
    <div><Label>Adresse</Label><Input v-model="agency.address" /></div>
    <div><Label>Téléphone</Label><Input v-model="agency.phone" /></div>
    <div><Label>Logo URL</Label><Input v-model="agency.logo" /></div>
    <div><Label>Location</Label><Input v-model="agency.location" /></div>
    <div><Label>Ville</Label><Input v-model="agency.city" /></div>
    <Button variant="default" class="w-full mt-4" @click="submit">Mettre à jour</Button>
  </CardContent>
</Card>
 </AdminLayout>   

</template>
