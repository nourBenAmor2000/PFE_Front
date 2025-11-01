<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAgencies } from '@/composables/useAgencies'

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Label from '@/components/ui/label/Label.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

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

const submit = async () => {
  await agencyStore.addAgency(agency.value)
  router.push('/agencies')
}
</script>

<template>
    <AdminLayout>
<Card class="max-w-lg mx-auto mt-10">
  <CardHeader>
    <CardTitle>Ajouter une Agence</CardTitle>
  </CardHeader>
  <CardContent class="space-y-4">
    <div><Label>Nom</Label><Input v-model="agency.name" placeholder="Nom" /></div>
    <div><Label>Nom d'utilisateur</Label><Input v-model="agency.username" placeholder="Username" /></div>
    <div><Label>Adresse</Label><Input v-model="agency.address" placeholder="Adresse" /></div>
    <div><Label>Téléphone</Label><Input v-model="agency.phone" placeholder="Téléphone" /></div>
    <div><Label>Logo URL</Label><Input v-model="agency.logo" placeholder="Logo URL" /></div>
    <div><Label>Location</Label><Input v-model="agency.location" placeholder="Coordonnées" /></div>
    <div><Label>Ville</Label><Input v-model="agency.city" placeholder="Ville" /></div>
    <Button variant="default" class="w-full mt-4" @click="submit">Enregistrer</Button>
  </CardContent>
</Card>
    </AdminLayout>

</template>
