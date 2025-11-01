<template>
  <AdminLayout>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Liste des agents</h1>
      <Button @click="goToAdd" class="bg-primary text-white">+ Ajouter un agent</Button>
    </div>

    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Agence</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow v-for="agent in agents" :key="agent.id">
              <TableCell>{{ agent.name }}</TableCell>
              <TableCell>{{ agent.email }}</TableCell>
              <TableCell>{{ agent.phone }}</TableCell>
              <TableCell>{{ agent.agency_name }}</TableCell>
              <TableCell>{{ agent.position }}</TableCell>
              <TableCell class="space-x-2">
                <Button variant="outline" size="sm" @click="goToEdit(agent.id)">Modifier</Button>
                <Button variant="destructive" size="sm" @click="deleteAgent(agent.id)">Supprimer</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
  </AdminLayout>

</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgents } from '@/composables/useAgent'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'


const router = useRouter()
const agentsStore = useAgents()
const { agents, fetchAgents, deleteAgent } = agentsStore

const goToAdd = () => router.push('/agents/add')
const goToEdit = id => router.push(`/agents/edit/${id}`)

onMounted(fetchAgents)
</script>
