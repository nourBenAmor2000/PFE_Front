<template>
  <AdminAgentLayout>
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

            <!-- Agence (affichée mais non modifiable pour l'admin d'agence) -->
            <div>
              <Label>Agence</Label>
              <select
                v-model="form.agency_id"
                disabled
                class="w-full border-gray-300 rounded-md p-2 bg-gray-50 text-gray-500 cursor-not-allowed"
              >
                <option v-if="currentAgency" :value="currentAgency._id">
                  {{ currentAgency.name }}
                </option>
                <option v-else value="">Agence non trouvée</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                L’admin d’agence ne peut modifier que les agents de sa propre agence.
              </p>
            </div>

            <!-- Rôle : on limite aux rôles internes à l’agence -->
            <div>
              <Label>Rôle</Label>
              <select
                v-model="form.role"
                required
                class="w-full border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">-- Sélectionnez un rôle --</option>
                <!-- adapte ces valeurs à tes rôles réels -->
                <option value="agent_personnel">Agent</option>
                <option value="rh">RH</option>
              </select>
            </div>

            <Button type="submit" class="bg-primary text-white w-full" :disabled="isSubmitting">
              <span v-if="isSubmitting">Mise à jour…</span>
              <span v-else>Mettre à jour</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminAgentLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgents } from '@/composables/useAgent'
import { useAgencies } from '@/composables/useAgencies'
import { useAuth } from '@/composables/useAuth'

import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import AdminAgentLayout from '@/layouts/AdminAgentLayout.vue'

const router = useRouter()
const route = useRoute()
const agentsStore = useAgents()
const agenciesStore = useAgencies()
const { user } = useAuth()

const agentId = route.params.id
const agencies = ref([])
const isSubmitting = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  agency_id: '',
  role: ''
})

/** agence courante de l’admin d’agence */
const currentAgencyId = computed(
  () => user.value?.agency_id || user.value?.agency?._id || user.value?.agency?.id || ''
)

const currentAgency = computed(() =>
  agencies.value.find(a => a._id === currentAgencyId.value) || null
)

onMounted(async () => {
  // récupérer les agences (pour afficher le nom)
  await agenciesStore.fetchAgencies()
  agencies.value = agenciesStore.agencies

  // charger l’agent
  await fetchAgent()

  // forcer l’agence sur celle de l’admin d’agence (sécurité front)
  if (currentAgencyId.value) {
    form.value.agency_id = currentAgencyId.value
  }
})

const fetchAgent = async () => {
  try {
    const agent = await agentsStore.getAgentById(agentId)
    form.value = {
      name: agent.name || '',
      email: agent.email || '',
      phone: agent.phone || '',
      // on garde agency_id pour info mais on le remplace ensuite par currentAgencyId si nécessaire
      agency_id: agent.agency_id || currentAgencyId.value || '',
      role: agent.role || ''
    }

    // si l’agent n’appartient pas à cette agence → redirection (sécurité UX)
    if (currentAgencyId.value && agent.agency_id && agent.agency_id !== currentAgencyId.value) {
      router.push('/admin-agence/agents')
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l’agent :', error)
    router.push('/admin-agence/agents')
  }
}

const updateAgent = async () => {
  try {
    isSubmitting.value = true

    // on s’assure côté front que l’agence reste celle de l’admin d’agence
    if (currentAgencyId.value) {
      form.value.agency_id = currentAgencyId.value
    }

    await agentsStore.updateAgent(agentId, form.value)
    router.push('/admin-agence/agents')
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’agent :', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
