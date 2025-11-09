<template>
  <AdminLayout>
    <div class="p-6 max-w-xl mx-auto">
      <h1 class="text-2xl font-semibold mb-4">Modifier un agent</h1>

      <Card>
        <CardContent>
          <form @submit.prevent="updateAgent" class="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input v-model="form.name" required placeholder="Nom complet" />
            </div>

            <div>
              <Label>Email</Label>
              <Input v-model="form.email" required type="email" placeholder="exemple@mail.com" />
            </div>

            <div>
              <Label>Téléphone</Label>
              <Input v-model="form.phone" placeholder="+216..." />
            </div>

            <div>
              <Label>Agence</Label>
              <select
                v-model="form.agency_id"
                required
                class="w-full border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">-- Sélectionnez une agence --</option>
                <option v-for="agency in agencies" :key="agency._id" :value="agency._id">
                  {{ agency.name }}
                </option>
              </select>
            </div>

            <div>
              <Label>Rôle</Label>
              <select
                v-model="form.role"
                required
                class="w-full border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">-- Sélectionnez un rôle --</option>
                <option value="admin">Admin</option>
                <option value="rh">RH</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            <Button type="submit" class="bg-primary text-white w-full">
              Mettre à jour
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgents } from '@/composables/useAgent'
import { useAgencies } from '@/composables/useAgencies'
import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()
const route = useRoute()
const agentsStore = useAgents()
const agenciesStore = useAgencies()

const agentId = route.params.id // 👈 get ID from route param
const agencies = ref([])
const form = ref({
  name: '',
  email: '',
  phone: '',
  agency_id: '',
  role: ''
})

onMounted(async () => {
  // Fetch all agencies for the dropdown
  await agenciesStore.fetchAgencies()
  agencies.value = agenciesStore.agencies

  // Fetch agent data
  await fetchAgent()
})

const fetchAgent = async () => {
  try {
    const agent = await agentsStore.getAgentById(agentId)
    form.value = {
      name: agent.name || '',
      email: agent.email || '',
      phone: agent.phone || '',
      agency_id: agent.agency_id || '',
      role: agent.role || ''
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l’agent :', error)
  }
}

const updateAgent = async () => {
  try {
    await agentsStore.updateAgent(agentId, form.value)
    router.push('/admin/agents')
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’agent :', error)
  }
}
</script>
