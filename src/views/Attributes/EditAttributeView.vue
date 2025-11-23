<script setup>
import { ref, onMounted } from 'vue'
import { useAttributes } from '@/composables/useAttributes'
import { useRouter, useRoute } from 'vue-router'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

const route = useRoute()
const router = useRouter()
const attributeStore = useAttributes()
const name = ref('')
const type = ref('text')

onMounted(async () => {
  try {
    await attributeStore.fetchAttributes()
    const attr = attributeStore.attributes.find(a => a._id === route.params.id || a.id === route.params.id)
    if (attr) {
      name.value = attr.name || ''
      type.value = attr.type || 'text'
    } else {
      alert('Attribut non trouvé')
      router.push('/admin/attributes')
    }
  } catch (error) {
    console.error('Error loading attribute:', error)
    alert('Erreur lors du chargement: ' + (error.message || 'Erreur inconnue'))
  }
})

const submit = async () => {
  if (!name.value.trim()) {
    alert('Le nom est requis')
    return
  }
  try {
    await attributeStore.updateAttribute(route.params.id, { name: name.value, type: type.value })
    router.push('/admin/attributes')
  } catch (error) {
    const errorMsg = attributeStore.error || error.message || 'Erreur lors de la mise à jour'
    alert('Erreur: ' + errorMsg)
    console.error('Error updating attribute:', error)
  }
}
</script>

<template>
  <AdminLayout>
    <div class="p-6">
      <Card class="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Modifier l'attribut</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <Input v-model="name" placeholder="Nom de l'attribut" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <Select v-model="type">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texte</SelectItem>
                <SelectItem value="number">Nombre</SelectItem>
                <SelectItem value="bool">Booléen</SelectItem>
                <SelectItem value="list">Liste</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" @click="router.push('/admin/attributes')">Annuler</Button>
            <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="submit">Mettre à jour</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

