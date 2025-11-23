<script setup>
import { ref } from 'vue'
import { useAttributes } from '@/composables/useAttributes'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

const name = ref('')
const type = ref('text')
const attributeStore = useAttributes()
const router = useRouter()

const submit = async () => {
  if (!name.value.trim()) {
    alert('Le nom est requis')
    return
  }
  try {
    await attributeStore.addAttribute({ name: name.value, type: type.value })
    router.push('/admin/attributes')
  } catch (error) {
    const errorMsg = attributeStore.error || error.message || 'Erreur lors de la création'
    alert('Erreur: ' + errorMsg)
    console.error('Error creating attribute:', error)
  }
}
</script>

<template>
  <AdminLayout>
    <div class="p-6">
      <Card class="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un attribut</CardTitle>
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
            <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="submit">Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

