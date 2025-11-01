<template>
  <AdminLayout>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-semibold mb-4">Ajouter un agent</h1>

    <Card>
      <CardContent>
        <form @submit.prevent="saveAgent" class="space-y-4">
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
            <Input v-model="form.phone" required placeholder="+216..." />
          </div>

          <div>
            <Label>Agence</Label>
            <Input v-model="form.agency_name" placeholder="Nom de l'agence" />
          </div>

          <div>
            <Label>Poste</Label>
            <Input v-model="form.position" placeholder="Poste (ex: Agent Immobilier)" />
          </div>

          <Button type="submit" class="bg-primary text-white w-full">Enregistrer</Button>
        </form>
      </CardContent>
    </Card>
  </div>
  </AdminLayout>

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAgents } from '@/composables/useAgent'
import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = useRouter()
const agentsStore = useAgents()

const form = ref({
  name: '',
  email: '',
  phone: '',
  agency_name: '',
  position: ''
})

const saveAgent = async () => {
  await agentsStore.addAgent(form.value)
  router.push('/agents')
}
</script>
