<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Card -->
      <div class="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
        <!-- Top banner -->
        <div class="h-20 bg-gradient-to-r from-teal-500/20 via-teal-500/10 to-transparent"></div>

        <div class="-mt-12 px-6 sm:px-8 pb-8">
          <!-- Header row -->
          <div class="flex items-center gap-5 mb-6">
            <div class="relative">
              <img
                :src="avatarSrc"
                :alt="user?.name || 'User avatar'"
                class="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-sm"
              />
              <button
                type="button"
                class="absolute -bottom-2 -right-2 inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white shadow ring-1 ring-black/5 text-gray-600 hover:bg-gray-50"
                @click="pickAvatar"
                title="Changer l’avatar"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 20.5H4v-3.5L16.732 3.732z"/>
                </svg>
              </button>
            </div>

            <div class="min-w-0">
              <h1 class="text-2xl font-bold text-gray-900 truncate">
                {{ form.name || user?.name || '—' }}
              </h1>
              <p class="text-gray-600 truncate">{{ user?.email }}</p>
              <span class="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 capitalize">
                {{ user?.role || 'user' }}
              </span>
            </div>

            <div class="ms-auto hidden sm:flex gap-3">
              <button
                type="button"
                @click="resetForm"
                class="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                :disabled="isLoading"
                @click="handleUpdateProfile"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white hover:brightness-95 disabled:opacity-60"
              >
                <span v-if="!isLoading">Enregistrer</span>
                <span v-else class="inline-flex items-center gap-2">
                  <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"></span>
                  Enregistrement…
                </span>
              </button>
            </div>
          </div>

          <!-- Alerts -->
          <transition name="fade">
            <div v-if="message" class="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {{ message }}
            </div>
          </transition>
          <transition name="fade">
            <div v-if="error" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {{ error }}
            </div>
          </transition>

          <!-- Form -->
          <form @submit.prevent="handleUpdateProfile" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="text-sm font-medium text-gray-700">Nom complet</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label for="email" class="text-sm font-medium text-gray-700">E-mail</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label for="phone" class="text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label for="role" class="text-sm font-medium text-gray-700">Rôle</label>
                <input
                  id="role"
                  :value="user?.role"
                  type="text"
                  disabled
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 capitalize"
                />
              </div>
            </div>

            <!-- Section mot de passe (facultative) -->
            <div class="pt-2 border-t border-gray-100">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Sécurité</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <input
                    v-model="passwords.new"
                    type="password"
                    placeholder="••••••••"
                    class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                  <input
                    v-model="passwords.confirm"
                    type="password"
                    placeholder="••••••••"
                    class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <p v-if="pwError" class="mt-2 text-sm text-red-600">{{ pwError }}</p>
            </div>

            <!-- Mobile CTAs -->
            <div class="sm:hidden flex justify-end gap-3">
              <button type="button" @click="resetForm" class="px-4 py-2 rounded-xl border border-gray-200 text-gray-700">
                Annuler
              </button>
              <button type="submit" :disabled="isLoading" class="px-4 py-2 rounded-xl bg-teal-600 text-white disabled:opacity-60">
                {{ isLoading ? 'Enregistrement…' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- footer spacer -->
      <div class="h-6"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user, updateProfile, isLoading } = useAuth()

const form = ref({ name: '', email: '', phone: '' })
const message = ref('')
const error = ref('')

const passwords = ref({ new: '', confirm: '' })
const pwError = computed(() => {
  if (!passwords.value.new && !passwords.value.confirm) return ''
  if (passwords.value.new.length && passwords.value.new.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.'
  if (passwords.value.new !== passwords.value.confirm) return 'Les mots de passe ne correspondent pas.'
  return ''
})

const avatarSrc = computed(() =>
  user.value?.avatar ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value?.name || 'U')}&background=14b8a6&color=fff&bold=true`
)

const resetForm = () => {
  form.value = {
    name: user.value?.name || '',
    email: user.value?.email || '',
    phone: user.value?.phone || ''
  }
  passwords.value = { new: '', confirm: '' }
  error.value = ''
  message.value = ''
}

const handleUpdateProfile = async () => {
  message.value = ''
  error.value = ''
  if (pwError.value) {
    error.value = pwError.value
    return
  }

  const payload = { ...form.value }
  if (passwords.value.new) payload.password = passwords.value.new

  const result = await updateProfile(payload)
  if (result?.success) {
    message.value = 'Profil mis à jour avec succès.'
    setTimeout(() => (message.value = ''), 2500)
  } else {
    error.value = result?.error || 'Échec de la mise à jour du profil.'
  }
}

const pickAvatar = () => {
  // Ici, tu peux ouvrir un input file ou un modal d’upload
  // document.getElementById('avatar-input')?.click()
  console.log('TODO: uploader un avatar')
}

onMounted(() => {
  resetForm()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
