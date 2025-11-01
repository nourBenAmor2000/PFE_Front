<template>
  <AdminLayout>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Modifier l'agent</h1>

    <Card>
      <CardContent>
        <form @submit.prevent="updateAgentData" class="space-y-4">
          <div>
            <Label>Nom</Label>
            <Input v-model="form.name" required />
          </div>

          <div>
            <Label>Email</Label>
            <Input v-model="form.email" required type="email" />
          </div>

          <div>
            <Label>Téléphone</Label>
            <Input v-model="form.phone" required />
          </div>

          <div>
            <Label>Agence</Label>
            <Input v-model="form.agency_name" />
          </div>

          <div>
            <Label>Poste</Label>
            <Input v-model="form.position" />
          </div>

          <Button type="submit" class="bg-primary text-white w-full">Mettre à jour</Button>
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
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()
const route = useRoute()
const agentsStore = useAgents()

const form = ref({
  name: '',
  email: '',
  phone: '',
  agency_name: '',
  position: ''
})

onMounted(() => {
  const agent = agentsStore.agents.find(a => a.id === route.params.id)
  if (agent) Object.assign(form.value, agent)
})

const updateAgentData = async () => {
  await agentsStore.updateAgent(route.params.id, form.value)
  router.push('/agents')
}
</script>
