<script setup>
import { ref, onMounted } from 'vue'
import { useReviews } from '@/composables/useReviews'
import { useClients } from '@/composables/useClient'
import { useLogements } from '@/composables/useLogements'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

const client_id = ref('')
const logement_id = ref('')
const comment = ref('')
const rating = ref(5)
const reviewStore = useReviews()
const clientStore = useClients()
const logementStore = useLogements()
const router = useRouter()

onMounted(async () => {
  try {
    await Promise.all([
      clientStore.fetchClients(),
      logementStore.fetchLogements(),
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

const submit = async () => {
  if (!client_id.value || !logement_id.value) {
    alert('Le client et le logement sont requis')
    return
  }
  if (!rating.value || rating.value < 1 || rating.value > 5) {
    alert('La note doit être entre 1 et 5')
    return
  }
  try {
    await reviewStore.addReview({
      client_id: client_id.value,
      logement_id: logement_id.value,
      comment: comment.value,
      rating: Number(rating.value)
    })
    router.push('/admin/reviews')
  } catch (error) {
    const errorMsg = reviewStore.error || error.message || 'Erreur lors de la création'
    alert('Erreur: ' + errorMsg)
    console.error('Error creating review:', error)
  }
}
</script>

<template>
  <AdminLayout>
    <div class="p-6">
      <Card class="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un avis</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Client *</label>
            <Select v-model="client_id">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="client in clientStore.clients" :key="client._id || client.id" :value="client._id || client.id">
                  {{ client.name || client.email }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Logement *</label>
            <Select v-model="logement_id">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un logement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="logement in logementStore.logements" :key="logement._id || logement.id" :value="logement._id || logement.id">
                  {{ logement.title }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Note * (1-5)</label>
            <Select v-model="rating">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="5">5 étoiles</SelectItem>
                <SelectItem :value="4">4 étoiles</SelectItem>
                <SelectItem :value="3">3 étoiles</SelectItem>
                <SelectItem :value="2">2 étoiles</SelectItem>
                <SelectItem :value="1">1 étoile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
            <textarea
              v-model="comment"
              placeholder="Commentaire (optionnel)"
              class="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
            ></textarea>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" @click="router.push('/admin/reviews')">Annuler</Button>
            <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="submit">Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

