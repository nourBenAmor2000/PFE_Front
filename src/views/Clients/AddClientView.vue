<script setup>
import { ref } from 'vue'
import { useClients } from '@/composables/useClient'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Label from '@/components/ui/label/Label.vue'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import AdminLayout from '@/layouts/AdminLayout.vue'

const clientStore = useClients()
const router = useRouter()

// 🧩 Reactive form
const client = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  phone: '',
  role: 'Client',
})

// 🧩 Submit handler
const submit = async () => {
  await clientStore.addClient(client.value)
  router.push('/clients')
}
</script>

<template>
  <AdminLayout>
  <Card class="max-w-lg mx-auto mt-10">
    <CardHeader>
      <CardTitle>Ajouter un client</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <div>
        <Label>Nom</Label>
        <Input v-model="client.name" placeholder="Nom complet" required />
      </div>

      <div>
        <Label>Nom d'utilisateur</Label>
        <Input v-model="client.username" placeholder="Nom d'utilisateur" required />
      </div>

      <div>
        <Label>Email</Label>
        <Input type="email" v-model="client.email" placeholder="Adresse email" required />
      </div>

      <div>
        <Label>Mot de passe</Label>
        <Input type="password" v-model="client.password" placeholder="Mot de passe" required />
      </div>

      <div>
        <Label>Téléphone</Label>
        <Input v-model="client.phone" placeholder="Numéro de téléphone" />
      </div>

      <div>
        <Label>Rôle</Label>
        <Select v-model="client.role">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Client">Client</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="default" class="w-full mt-4" @click="submit">Enregistrer</Button>
    </CardContent>
  </Card>
  </AdminLayout>

</template>
