<template>
    <AdminLayout>
  <Card class="max-w-lg mx-auto mt-10">
    <CardHeader>
      <CardTitle>Add Admin</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <Input v-model="admin.name" placeholder="Name" />
      <Input v-model="admin.email" placeholder="Email" />
      <Input type="password" v-model="admin.password" placeholder="Password" />
      <Button variant="default" @click="submit">Save</Button>
    </CardContent>
  </Card>
    </AdminLayout>

</template>

<script setup>
import { ref } from 'vue'
import { useAdmins } from '@/composables/useAdmin'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const adminStore = useAdmins()
const router = useRouter()

const admin = ref({
  name: '',
  email: '',
  password: ''
})

const submit = async () => {
  await adminStore.addAdmin(admin.value)
  router.push('/admin/admins')
}
</script>
