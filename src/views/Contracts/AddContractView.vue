<script setup>
import { ref, onMounted } from 'vue'
import { useContracts } from '@/composables/useContrats'
import { useClients } from '@/composables/useClient'
import { useLogements } from '@/composables/useLogements'
import { useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()
const contractStore = useContracts()
const clientStore = useClients()
const logementStore = useLogements()

const contract = ref({
  client_id: '',
  logement_id: '',
  start_date: '',
  end_date: '',
  amount: ''
})

onMounted(async () => {
  await Promise.all([clientStore.fetchClients(), logementStore.fetchLogements()])
})

const submit = async () => {
  await contractStore.addContract(contract.value)
  router.push('/contracts')
}
</script>

<template>
    <AdminLayout>
  <Card class="max-w-lg mx-auto mt-10">
    <CardHeader>
      <CardTitle>Ajouter un contrat</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Client -->
      <div>
        <label class="block text-sm font-medium mb-1">Client</label>
        <Select v-model="contract.client_id">
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="client in clientStore.clients"
              :key="client._id"
              :value="client._id"
            >
              {{ client.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Logement -->
      <div>
        <label class="block text-sm font-medium mb-1">Logement</label>
        <Select v-model="contract.logement_id">
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un logement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="logement in logementStore.logements"
              :key="logement._id"
              :value="logement._id"
            >
              {{ logement.title }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Start Date -->
      <div>
        <label class="block text-sm font-medium mb-1">Date de début</label>
        <Input type="date" v-model="contract.start_date" />
      </div>

      <!-- End Date -->
      <div>
        <label class="block text-sm font-medium mb-1">Date de fin</label>
        <Input type="date" v-model="contract.end_date" />
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium mb-1">Montant</label>
        <Input type="number" v-model="contract.amount" placeholder="Montant du contrat" />
      </div>

      <!-- Save -->
      <div class="pt-2">
        <Button variant="default" class="w-full" @click="submit">
          Enregistrer le contrat
        </Button>
      </div>
    </CardContent>
  </Card>
    </AdminLayout>

</template>
