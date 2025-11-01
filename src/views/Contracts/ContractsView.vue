<script setup>
import { onMounted, computed } from 'vue'
import { useContracts } from '@/composables/useContrats'
import { useClients } from '@/composables/useClient'
import { useLogements } from '@/composables/useLogements'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table'
import AdminLayout from '@/layouts/AdminLayout.vue'

const contractStore = useContracts()
const clientStore = useClients()
const logementStore = useLogements()
const router = useRouter()

onMounted(async () => {
  await Promise.all([
    contractStore.fetchContracts(),
    clientStore.fetchClients(),
    logementStore.fetchLogements(),
  ])
})

// ✅ Utility to map IDs to names
const getClientName = (id) =>
  clientStore.clients.find((c) => c._id === id)?.name || '—'

const getLogementTitle = (id) =>
  logementStore.logements.find((l) => l._id === id)?.title || '—'

const deleteContract = async (id) => {
  if (confirm('Supprimer ce contrat ?')) {
    await contractStore.deleteContract(id)
  }
}
</script>

<template>
    <AdminLayout>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Liste des contrats</h1>
      <Button variant="default" @click="router.push('/contracts/add')">
        Ajouter un contrat
      </Button>
    </div>

    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Client</TableCell>
          <TableCell>Logement</TableCell>
          <TableCell>Début</TableCell>
          <TableCell>Fin</TableCell>
          <TableCell>Montant</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        <TableRow
          v-for="c in contractStore.contracts"
          :key="c._id"
          class="hover:bg-gray-50"
        >
          <TableCell>{{ getClientName(c.client_id) }}</TableCell>
          <TableCell>{{ getLogementTitle(c.logement_id) }}</TableCell>
          <TableCell>
            {{ new Date(c.start_date).toLocaleDateString('fr-FR') }}
          </TableCell>
          <TableCell>
            {{ new Date(c.end_date).toLocaleDateString('fr-FR') }}
          </TableCell>
          <TableCell>{{ c.amount }} TND</TableCell>
          <TableCell class="flex space-x-2">
            <Button
              variant="link"
              @click="router.push(`/contracts/edit/${c._id}`)"
            >
              Modifier
            </Button>
            <Button
              variant="destructive"
              @click="deleteContract(c._id)"
            >
              Supprimer
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
    </AdminLayout>

</template>
