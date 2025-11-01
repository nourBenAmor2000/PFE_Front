<template>
    <AdminLayout>
  <Card class="max-w-lg mx-auto mt-10">
    <CardHeader>
      <CardTitle>Edit Admin</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <Input v-model="admin.name" placeholder="Name" />
      <Input v-model="admin.email" placeholder="Email" />
      <Input type="password" v-model="admin.password" placeholder="Password" />
      <Button variant="default" @click="submit">Update</Button>
    </CardContent>
  </Card>
    </AdminLayout>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdmins } from '@/composables/useAdmin'
import { useRouter, useRoute } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const adminStore = useAdmins()
const admin = ref({ name: '', email: '', password: '' })

onMounted(() => {
  const a = adminStore.admins.find(a => a._id === route.params.id)
  if (a) admin.value = { ...a }
})

const submit = async () => {
  await adminStore.updateAdmin(route.params.id, admin.value)
  router.push('/admins')
}
</script>
