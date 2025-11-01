<script setup>
import { ref, onMounted } from 'vue'
import { useLogements } from '@/composables/useLogements'
import { useCategories } from '@/composables/useCategories'
import { useAgencies } from '@/composables/useAgencies'
import { useRouter, useRoute } from 'vue-router'

// ✅ shadcn-vue components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()
const route = useRoute()
const logementStore = useLogements()
const categoryStore = useCategories()
const agencyStore = useAgencies()

const { categories, fetchCategories } = categoryStore
const { agencies, fetchAgencies } = agencyStore

const logement = ref({
  title: '',
  description: '',
  price: '',
  category_id: '',
  agency_id: '',
  latitude: '',
  longitude: '',
  location: '',
  surface: '',
  floor: '',
  free: false
})

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchAgencies()])
  const log = logementStore.logements.find(l => l._id === route.params.id)
  if (log) logement.value = { ...log }
})

const submit = async () => {
  await logementStore.updateLogement(route.params.id, logement.value)
  router.push('/logements')
}
</script>

<template>
    <AdminLayout>
  <Card class="max-w-2xl mx-auto mt-10">
    <CardHeader>
      <CardTitle>Modifier un logement</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <div>
        <Label>Titre</Label>
        <Input v-model="logement.title" placeholder="Titre du logement" required />
      </div>

      <div>
        <Label>Description</Label>
        <Input v-model="logement.description" placeholder="Description" required />
      </div>

      <div>
        <Label>Prix</Label>
        <Input v-model="logement.price" type="number" placeholder="Prix" required />
      </div>

      <div>
        <Label>Catégorie</Label>
        <Select v-model="logement.category_id">
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

      <div>
        <Label>Agence</Label>
        <Select v-model="logement.agency_id">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Sélectionner une agence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="agency in agencies"
              :key="agency.id"
              :value="agency.id"
            >
              {{ agency.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label>Latitude</Label>
          <Input v-model="logement.latitude" placeholder="Latitude" />
        </div>
        <div>
          <Label>Longitude</Label>
          <Input v-model="logement.longitude" placeholder="Longitude" />
        </div>
      </div>

      <div>
        <Label>Localisation</Label>
        <Input v-model="logement.location" placeholder="Ville ou région" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label>Surface (m²)</Label>
          <Input v-model="logement.surface" type="number" placeholder="Surface" />
        </div>
        <div>
          <Label>Étage</Label>
          <Input v-model="logement.floor" type="number" placeholder="Étage" />
        </div>
      </div>

      <div class="flex items-center justify-between mt-4">
        <Label>Disponible</Label>
        <Switch v-model:checked="logement.free" />
      </div>

      <Button @click="submit" class="w-full bg-primary text-white">
        Mettre à jour
      </Button>
    </CardContent>
  </Card>
    </AdminLayout>

</template>
