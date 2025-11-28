<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-10">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Carte Profil -->
      <div class="bg-white rounded-2xl shadow-md ring-1 ring-black/5 overflow-hidden">
        <!-- Bandeau -->
        <div class="h-24 bg-gradient-to-r from-[var(--brand)] via-orange-400 to-orange-300"></div>

        <div class="-mt-16 px-6 sm:px-8 pb-8">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
            <!-- Avatar + bouton -->
            <div class="relative self-start">
              <img
                :src="avatarSrc"
                :alt="form.name || user?.name || 'Avatar utilisateur'"
                class="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow-lg bg-gray-100"
              />
              <button
                type="button"
                class="absolute -bottom-2 -right-2 inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white shadow-md ring-1 ring-black/5 text-gray-600 hover:bg-gray-50"
                @click="pickAvatar"
                title="Changer l’avatar"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 20.5H4v-3.5L16.732 3.732z"
                  />
                </svg>
              </button>
              <!-- input file caché -->
              <input
                ref="avatarInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onAvatarSelected"
              />
            </div>

            <!-- Infos utilisateur -->
            <div class="min-w-0 flex-1">
              <h1 class="text-2xl font-bold text-gray-900 truncate">
                {{ form.name || user?.name || 'Utilisateur' }}
              </h1>
              <p class="text-gray-600 truncate">{{ user?.email }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 capitalize"
                >
                  {{ user?.role || 'user' }}
                </span>
                <span
                  v-if="avatarUploading"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700"
                >
                  <span class="h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent"></span>
                  Mise à jour de l’avatar…
                </span>
              </div>
            </div>

            <!-- Actions (desktop) -->
            <div class="ms-auto hidden sm:flex gap-3">
              <button
                type="button"
                @click="resetForm"
                class="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
              >
                Annuler
              </button>
              <button
                type="button"
                :disabled="isLoading || !!pwError"
                @click="handleUpdateProfile"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:bg-[var(--brand-600)] disabled:opacity-60"
              >
                <span v-if="!isLoading">Enregistrer</span>
                <span v-else class="inline-flex items-center gap-2">
                  <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"></span>
                  Enregistrement…
                </span>
              </button>
            </div>
          </div>

          <!-- Alertes -->
          <transition name="fade">
            <div
              v-if="message"
              class="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {{ message }}
            </div>
          </transition>
          <transition name="fade">
            <div
              v-if="error"
              class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {{ error }}
            </div>
          </transition>
          <transition name="fade">
            <div
              v-if="avatarError"
              class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              {{ avatarError }}
            </div>
          </transition>

          <!-- Formulaire -->
          <form @submit.prevent="handleUpdateProfile" class="space-y-8">
            <!-- Infos principales -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="text-sm font-medium text-gray-700">Nom complet</label>
                <div class="mt-1 relative">
                  <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0z M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-9 py-3 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--brand)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="email" class="text-sm font-medium text-gray-700">E-mail</label>
                <div class="mt-1 relative">
                  <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 4h16v16H4z M4 7l8 5 8-5"
                      />
                    </svg>
                  </span>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-9 py-3 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--brand)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="phone" class="text-sm font-medium text-gray-700">Téléphone</label>
                <div class="mt-1 relative">
                  <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 5a2 2 0 012-2h3.28c.45 0 .85.3.97.73L10.5 7.5a1 1 0 01-.5 1.18l-1.6.8a10.97 10.97 0 005.62 5.62l.8-1.6a1 1 0 011.18-.5l3.77 1.25c.43.14.73.52.73.97V19a2 2 0 01-2 2h-1C9.82 21 3 14.18 3 6V5z"
                      />
                    </svg>
                  </span>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-9 py-3 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--brand)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="role" class="text-sm font-medium text-gray-700">Rôle</label>
                <input
                  id="role"
                  :value="user?.role"
                  type="text"
                  disabled
                  class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 capitalize text-sm"
                />
              </div>
            </div>

            <!-- Sécurité / mot de passe -->
            <div class="pt-4 border-t border-gray-100">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-gray-900">Sécurité</h3>
                <span class="text-xs text-gray-400">Changer votre mot de passe (optionnel)</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <input
                    v-model="passwords.new"
                    type="password"
                    placeholder="••••••••"
                    class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand)] text-sm"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                  <input
                    v-model="passwords.confirm"
                    type="password"
                    placeholder="••••••••"
                    class="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand)] text-sm"
                  />
                </div>
              </div>
              <p v-if="pwError" class="mt-2 text-sm text-red-600">{{ pwError }}</p>
            </div>

            <!-- Actions mobile -->
            <div class="sm:hidden flex justify-end gap-3">
              <button
                type="button"
                @click="resetForm"
                class="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="isLoading || !!pwError"
                class="px-4 py-2 rounded-xl bg-[var(--brand)] text-white text-sm font-medium hover:bg-[var(--brand-600)] disabled:opacity-60"
              >
                {{ isLoading ? 'Enregistrement…' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Spacer -->
      <div class="h-6"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useApi } from '@/composables/useApi'

/* Couleurs marque (orange E-Dar) */
document.documentElement.style.setProperty('--brand', '#EF5A1C')
document.documentElement.style.setProperty('--brand-600', '#E25116')

const { user, updateProfile, isLoading } = useAuth()
const { api } = useApi()

const form = ref({ name: '', email: '', phone: '' })
const message = ref('')
const error = ref('')

const passwords = ref({ new: '', confirm: '' })
const pwError = computed(() => {
  if (!passwords.value.new && !passwords.value.confirm) return ''
  if (passwords.value.new.length && passwords.value.new.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères.'
  }
  if (passwords.value.new !== passwords.value.confirm) {
    return 'Les mots de passe ne correspondent pas.'
  }
  return ''
})

/* Avatar */
const avatarPreview = ref(null)
const avatarInputRef = ref(null)
const avatarUploading = ref(false)
const avatarError = ref('')

const avatarSrc = computed(() =>
  avatarPreview.value ||
  user.value?.avatar ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.value?.name || 'U'
  )}&background=EF5A1C&color=fff&bold=true`
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

/* Gestion avatar */
const pickAvatar = () => {
  avatarError.value = ''
  avatarInputRef.value?.click()
}

const onAvatarSelected = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // validations simples
  if (!file.type.startsWith('image/')) {
    avatarError.value = 'Veuillez sélectionner une image valide.'
    return
  }
  const maxSizeMb = 3
  if (file.size > maxSizeMb * 1024 * 1024) {
    avatarError.value = `L’image doit faire moins de ${maxSizeMb} Mo.`
    return
  }

  avatarUploading.value = true
  avatarError.value = ''

  try {
    const formData = new FormData()
    formData.append('avatar', file)

    // URL backend, via ton api composable (baseURL = http://localhost:8000/api)
    const { data } = await api.post('/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const newUrl = data.avatar || data.url
    if (newUrl) {
      avatarPreview.value = newUrl
      if (user.value) {
        // on garde la compatibilité avec ton modèle (avatar ou avatar_url)
        user.value.avatar = newUrl
      }
      message.value = 'Avatar mis à jour avec succès.'
      setTimeout(() => (message.value = ''), 2500)
    } else {
      avatarError.value = 'Avatar mis à jour, mais aucune URL reçue.'
    }
  } catch (e) {
    console.error(e)
    avatarError.value =
      e?.response?.data?.message ||
      'Échec du téléchargement de l’avatar. Veuillez réessayer.'
  } finally {
    avatarUploading.value = false
    if (avatarInputRef.value) {
      avatarInputRef.value.value = ''
    }
  }
}

onMounted(() => {
  resetForm()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
