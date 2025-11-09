<script setup>
import { ref, onMounted } from 'vue'
import { useClients } from '@/composables/useClient'
import { useRouter, useRoute } from 'vue-router'
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
const route = useRoute()

const client = ref({
  name: '',
  username: '',
  email: '',
  phone: '',
  role: 'Client',
})

const loading = ref(false)
const error = ref('')
const id = route.params.id

// 🧩 Fetch existing client data
onMounted(async () => {
  try {
    loading.value = true
    const data = await clientStore.getClientById(id)
    client.value = { ...data }
  } catch (err) {
    error.value = "Impossible de charger les informations du client."
    console.error(err)
  } finally {
    loading.value = false
  }
})

// 🧩 Update handler
const update = async () => {
  error.value = ''
  loading.value = true
  try {
    await clientStore.updateClient(id, client.value)
    router.push('/admin/clients')
  } catch (err) {
    error.value = "Une erreur est survenue lors de la mise à jour."
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminLayout>
    <Card class="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>Modifier un client</CardTitle>
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

        <!-- 🧩 Error message -->
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <!-- 🧩 Button with loading spinner -->
        <Button
          variant="default"
          class="w-full mt-4 flex justify-center items-center gap-2"
          :disabled="loading"
          @click="update"
        >
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          {{ loading ? 'Mise à jour...' : 'Mettre à jour' }}
        </Button>
      </CardContent>
    </Card>
  </AdminLayout>
</template>
