<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-8">
          <div class="flex items-center space-x-6 mb-8">
            <img
              :src="user?.avatar"
              :alt="user?.name"
              class="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ user?.name }}</h1>
              <p class="text-gray-600">{{ user?.email }}</p>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 capitalize">
                {{ user?.role }}
              </span>
            </div>
          </div>
          
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <div v-if="message" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {{ message }}
            </div>
            
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {{ error }}
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                <input
                  id="role"
                  :value="user?.role"
                  type="text"
                  disabled
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
                />
              </div>
            </div>
            
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="resetForm"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Reset
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {{ isLoading ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user, updateProfile, isLoading } = useAuth()

const form = ref({
  name: '',
  email: '',
  phone: ''
})

const message = ref('')
const error = ref('')

const resetForm = () => {
  form.value = {
    name: user.value?.name || '',
    email: user.value?.email || '',
    phone: user.value?.phone || ''
  }
}

const handleUpdateProfile = async () => {
  message.value = ''
  error.value = ''
  
  const result = await updateProfile(form.value)
  
  if (result.success) {
    message.value = 'Profile updated successfully!'
    setTimeout(() => {
      message.value = ''
    }, 3000)
  } else {
    error.value = result.error || 'Failed to update profile'
  }
}

onMounted(() => {
  resetForm()
})
</script>
