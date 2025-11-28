<template>
  <AdminAgentLayout>
    <div class="p-6 max-w-xl mx-auto">
      <h1 class="text-2xl font-semibold mb-4">Modifier un agent</h1>

      <Card>
        <CardContent>
          <!-- Loading state -->
          <div v-if="loading" class="text-center py-6 text-gray-500">
            Chargement...
          </div>

          <!-- Edit form -->
          <form v-else @submit.prevent="updateAgent" class="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input v-model="form.name" required placeholder="Nom complet" />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                v-model="form.email"
                required
                type="email"
                placeholder="exemple@mail.com"
              />
            </div>

            <div>
              <Label>Téléphone</Label>
              <Input v-model="form.phone" placeholder="+216..." />
            </div>

            <!-- Agence (affichée, non modifiable pour l’admin d’agence) -->
            <div>
              <Label>Agence</Label>
              <select
                v-model="form.agency_id"
                disabled
                class="w-full border-gray-300 rounded-md p-2 bg-gray-50 text-gray-500 cursor-not-allowed"
              >
                <option
                  v-if="currentAgency"
                  :value="currentAgency._id"
                >
                  {{ currentAgency.name }}
                </option>
                <option v-else value="">
                  Agence non trouvée
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                L’admin d’agence ne peut modifier que les agents de sa propre agence.
              </p>
            </div>

            <div>
              <Label>Rôle</Label>
              <select
                v-model="form.role"
                required
                class="w-full border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">-- Sélectionnez un rôle --</option>
                <!-- adapte ces valeurs selon ton backend -->
                <option value="agent">Agent</option>
                <option value="rh">RH</option>
                <!-- si tu veux : <option value="agent_personnel">Agent personnel</option> -->
              </select>
            </div>

            <Button
              type="submit"
              class="bg-primary text-white w-full"
              :disabled="submitting"
            >
              <span v-if="submitting">Mise à jour...</span>
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
const loading = ref(true)
const submitting = ref(false)
const agencies = ref([])

const form = ref({
  name: '',
  email: '',
  phone: '',
  agency_id: '',
  role: ''
})

/** ID de l’agence de l’admin d’agence connecté */
const currentAgencyId = computed(
  () =>
    user.value?.agency_id ||
    user.value?.agency?._id ||
    user.value?.agency?.id ||
    ''
)

/** Agence courante (objet) */
const currentAgency = computed(() =>
  agencies.value.find(a => a._id === currentAgencyId.value) || null
)

onMounted(async () => {
  try {
    // 1) Récupérer les agences (pour afficher le nom)
    await agenciesStore.fetchAgencies()
    agencies.value = agenciesStore.agencies

    // 2) Récupérer l’agent à modifier
    await agentsStore.getAgentById(agentId)
    const agent = agentsStore.selectedAgent

    if (!agent) {
      throw new Error('Agent introuvable')
    }

    // si l’agent n’appartient pas à cette agence → redirection (sécurité UX)
    if (
      currentAgencyId.value &&
      agent.agency_id &&
      agent.agency_id !== currentAgencyId.value
    ) {
      return router.push('/admin-agence/agents')
    }

    form.value = {
      name: agent.name || '',
      email: agent.email || '',
      phone: agent.phone || '',
      agency_id: agent.agency_id || currentAgencyId.value || '',
      role: agent.role || ''
    }

    // forcer l’agence front sur celle de l’admin (même si l’agent a autre chose)
    if (currentAgencyId.value) {
      form.value.agency_id = currentAgencyId.value
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
    router.push('/admin-agence/agents')
  } finally {
    loading.value = false
  }
})

const updateAgent = async () => {
  try {
    submitting.value = true

    // sécurité front : on impose l’agence de l’admin
    if (currentAgencyId.value) {
      form.value.agency_id = currentAgencyId.value
    }

    await agentsStore.updateAgent(agentId, form.value)
    router.push('/admin-agence/agents')
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’agent :', error)
  } finally {
    submitting.value = false
  }
}
</script>
