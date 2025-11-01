<script setup>
import { onMounted } from 'vue'
import { useLogements } from '@/composables/useLogements'
import { useRouter } from 'vue-router'

// ✅ shadcn-vue components
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import AdminLayout from '@/layouts/AdminLayout.vue'

const logementStore = useLogements()
const router = useRouter()

onMounted(() => logementStore.fetchLogements())

const deleteLogement = async (id) => {
  if (confirm('Supprimer ce logement ?')) {
    await logementStore.deleteLogement(id)
  }
}
</script>

<template>
    <AdminLayout>
  <div class="p-6 max-w-6xl mx-auto">
    <Card>
      <CardHeader class="flex items-center justify-between">
        <CardTitle>Liste des logements</CardTitle>
        <Button @click="router.push('/logements/add')">Ajouter un logement</Button>
      </CardHeader>

      <CardContent>
        <!-- Loading -->
        <div v-if="logementStore.isLoading" class="text-center py-6">
          Chargement des logements...
        </div>

        <!-- Empty -->
        <div
          v-else-if="!logementStore.logements.length"
          class="text-center text-gray-500 py-6"
        >
          Aucun logement trouvé.
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Disponible</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow
                v-for="log in logementStore.logements"
                :key="log._id"
                class="hover:bg-muted/50"
              >
                <TableCell>{{ log.title }}</TableCell>
                <TableCell class="max-w-[250px] truncate">
                  {{ log.description }}
                </TableCell>
                <TableCell>{{ log.price }} TND</TableCell>
                <TableCell>{{ log.location }}</TableCell>
                <TableCell>
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    :class="log.free ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  >
                    {{ log.free ? 'Oui' : 'Non' }}
                  </span>
                </TableCell>
                <TableCell class="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="router.push(`/logements/edit/${log._id}`)"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    @click="deleteLogement(log._id)"
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
    </AdminLayout>

</template>
