<template>
  <Transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
      @keydown.esc.prevent="close()"
    >
      <!-- overlay -->
      <div class="absolute inset-0 bg-black/45 backdrop-blur-[2px]" @click="close()" />

      <!-- card (compact) -->
      <div
        ref="cardRef"
        class="relative w-full max-w-[22rem] sm:max-w-sm rounded-2xl border border-black/5 bg-white/90 shadow-xl supports-[backdrop-filter]:bg-white/80"
        @click.stop
      >
        <!-- fond dégradé -->
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 rounded-2xl" :style="bgStyle"></div>

        <!-- header -->
        <div class="relative flex items-center gap-3 px-5 pt-5 pb-3">
          <div class="h-9 w-9 rounded-xl bg-teal-600/10 flex items-center justify-center">
            <svg class="h-5 w-5 text-teal-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2 7-7 7 7 2 2v8a2 2 0 01-2 2h-3V9H8v13H5a2 2 0 01-2-2v-8z"/>
            </svg>
          </div>
          <h2 id="register-title" class="text-base sm:text-lg font-semibold text-gray-900">
            Créez votre compte
          </h2>

          <button
            type="button"
            class="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            @click="close()"
            aria-label="Fermer la fenêtre"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- body -->
        <div class="relative px-5 pb-5 max-h-[78vh] overflow-y-auto">
          <!-- Form -->
          <form class="space-y-3" novalidate :aria-busy="isLoading ? 'true' : 'false'" @submit.prevent="submit">
            <p
              v-if="error"
              id="register-error"
              class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
              role="alert"
              aria-live="assertive"
            >
              {{ error }}
            </p>

            <input
              v-model.trim="form.username"
              required
              placeholder="Username"
              :aria-invalid="!!error"
              :aria-describedby="error ? 'register-error' : undefined"
              class="inp"
            />

            <div class="grid grid-cols-2 gap-2.5">
              <input v-model.trim="form.firstName" required placeholder="Prénom" class="inp" />
              <input v-model.trim="form.lastName" required placeholder="Nom" class="inp" />
            </div>

            <!-- Sélection agence (uniquement pour agent) -->
            <div v-if="form.role === 'agent'" class="space-y-1">
              <select
                v-model="form.agency_id"
                required
                class="inp bg-white"
              >
                <option value="">Sélectionner une agence</option>
                <option
                  v-for="agency in agencies"
                  :key="agency.id"
                  :value="agency.id"
                >
                  {{ agency.name }}
                </option>
              </select>

              <p v-if="loadingAgencies" class="text-xs text-gray-500 px-1">
                Chargement des agences…
              </p>
              <p v-if="agenciesError" class="text-xs text-red-500 px-1">
                {{ agenciesError }}
              </p>
            </div>

            <input
              v-model.trim="form.email"
              type="email"
              inputmode="email"
              autocomplete="email"
              required
              placeholder="E-mail"
              :aria-invalid="!!error"
              :aria-describedby="error ? 'register-error' : undefined"
              class="inp"
            />

            <input v-model.trim="form.phone" type="tel" required placeholder="Téléphone" class="inp" />

            <select v-model="form.role" required class="inp bg-white">
              <option value="">Type de compte</option>
              <option value="client">Client — Je cherche un bien</option>
              <option value="agent">Agent — Professionnel immobilier</option>
            </select>

            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                autocomplete="new-password"
                required
                minlength="8"
                placeholder="Mot de passe (min. 8 caractères)"
                class="inp pr-10"
              />
              <button
                type="button"
                class="abs-toggle"
                :aria-pressed="showPassword ? 'true' : 'false'"
                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10a5 5 0 0 1 0 10Z"/>
                </svg>
                <svg v-else class="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.05-3.05A10.9 10.9 0 0 1 12 19c-7 0-10-7-10-7a18.1 18.1 0 0 1 5-6.22L2 5.27ZM12 7a5 5 0 0 1 5 5c0 .74-.16 1.44-.45 2.07L9.93 7.45A4.9 4.9 0 0 1 12 7Z"/>
                </svg>
              </button>
            </div>

            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.confirmPassword"
              required
              placeholder="Confirmer le mot de passe"
              class="inp"
            />

            <label class="mt-1 inline-flex items-start gap-2 text-[13px] leading-5 text-gray-600">
              <input v-model="form.agreeTerms" type="checkbox" class="mt-1 accent-teal-600" required />
              <span>
                J’accepte les
                <a href="#" class="text-teal-600 hover:underline">Conditions</a>
                et la
                <a href="#" class="text-teal-600 hover:underline">Politique de confidentialité</a>
              </span>
            </label>

            <button type="submit" :disabled="isLoading || !canSubmit" class="btn-primary">
              <span v-if="!isLoading">Créer un compte</span>
              <span v-else class="inline-flex items-center gap-2">
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"></span>
                Création…
              </span>
            </button>

            <p class="text-center text-sm text-gray-600">
              Déjà un compte ?
              <button
                type="button"
                class="font-semibold text-teal-600 hover:text-teal-700"
                @click="goLogin"
              >
                Se connecter
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

const props = withDefaults(defineProps<{ open: boolean }>(), { open: false })
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'success'): void
  (e: 'switch-to-login'): void
}>()

const router = useRouter()
const { register, isLoading } = useAuth()

const cardRef = ref<HTMLElement | null>(null)

const form = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  agency_id: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

const error = ref('')
const showPassword = ref(false)

// 🔹 Agences pour le select
const agencies = ref<Array<{ id: string; name: string }>>([])
const loadingAgencies = ref(false)
const agenciesError = ref('')

// même base URL que ton backend
const API_BASE =
  ((import.meta.env.VITE_BACKEND_URL as string | undefined)?.replace(/\/+$/, '') ||
    'http://localhost:8000/api')

const bgStyle = `background:
  radial-gradient(900px 500px at 10% -5%, rgba(13,148,136,.12), transparent 55%),
  radial-gradient(800px 450px at 110% 110%, rgba(13,148,136,.10), transparent 60%),
  linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,0));`

const canSubmit = computed(() => {
  const baseOk =
    !!form.value.username &&
    !!form.value.firstName &&
    !!form.value.lastName &&
    !!form.value.email &&
    !!form.value.phone &&
    !!form.value.role &&
    form.value.password.length >= 8 &&
    form.value.password === form.value.confirmPassword &&
    form.value.agreeTerms

  if (form.value.role === 'agent') {
    return baseOk && !!form.value.agency_id
  }

  return baseOk
})

const close = () => emit('update:open', false)

const lockScroll = (lock: boolean) => {
  const body = document.body
  lock ? body.style.setProperty('overflow', 'hidden') : body.style.removeProperty('overflow')
}
watch(
  () => props.open,
  (v) => lockScroll(v)
)
onBeforeUnmount(() => lockScroll(false))

// ✅ Charger les agences (public, sans interceptor d'auth)
const loadAgencies = async () => {
  if (loadingAgencies.value) return
  loadingAgencies.value = true
  agenciesError.value = ''

  try {
    const { data } = await axios.get(`${API_BASE}/agencies`, {
      headers: { Accept: 'application/json' },
    })

    const list = Array.isArray(data)
      ? data
      : Array.isArray((data as any).data)
      ? (data as any).data
      : []

    agencies.value = list.map((a: any) => ({
      id: a.id ?? a._id ?? a._id ?? a.id,
      name: a.name ?? a.nom ?? 'Agence',
    }))
  } catch (err: any) {
    console.error('Erreur chargement agences:', err?.response?.data || err?.message)
    agenciesError.value =
      err?.response?.data?.message ||
      err?.message ||
      'Impossible de charger les agences'
  } finally {
    loadingAgencies.value = false
  }
}

// Quand le modal s’ouvre ET que le rôle est déjà “agent”
onMounted(() => {
  if (props.open && form.value.role === 'agent') {
    loadAgencies()
  }
})

// Quand l’utilisateur choisit “agent”
watch(
  () => form.value.role,
  (newRole) => {
    if (newRole === 'agent' && agencies.value.length === 0) {
      loadAgencies()
    }
  }
)

const submit = async () => {
  error.value = ''
  if (!canSubmit.value) {
    error.value = 'Veuillez compléter tous les champs correctement.'
    return
  }

  const isAgent = form.value.role === 'agent'

  const res = await register(
    {
      username: form.value.username,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      name: `${form.value.firstName} ${form.value.lastName}`,
      email: form.value.email,
      phone: form.value.phone,
      agent_role: isAgent ? 'agent' : undefined,
      agency_id: isAgent ? form.value.agency_id : null,
      password: form.value.password,
      password_confirmation: form.value.password,
    },
    isAgent ? 'agent' : 'client'
  )

  if (res?.success) {
    emit('success')
    close()

    if (isAgent) {
      // 👉 aller sur la page de vérification de code
      router.push({
        path: '/verify-email',
        query: { email: form.value.email },
      })
    } else {
      alert("Compte créé. Vérifiez votre e-mail pour activer votre compte.")
    }
  } else {
    error.value = res?.error || "Échec de création de compte. Veuillez réessayer."
  }
}


const goLogin = () => {
  close()
  emit('switch-to-login')
}
</script>

<style scoped>
/* transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .rounded-2xl,
.modal-leave-active .rounded-2xl {
  transition: transform 0.18s ease;
}
.modal-enter-from .rounded-2xl,
.modal-leave-to .rounded-2xl {
  transform: translateY(6px) scale(0.985);
}

/* inputs compacts */
.inp {
  @apply w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-[15px] text-gray-900 outline-none transition
    focus:border-transparent focus:ring-2 focus:ring-teal-500 placeholder:text-gray-400;
}

/* bouton principal */
.btn-primary {
  @apply inline-flex w-full items-center justify-center gap-2 h-11 rounded-xl bg-teal-600 px-4 font-semibold text-white
    shadow-lg shadow-teal-600/20 transition hover:brightness-[.98] disabled:opacity-60 focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-teal-500;
}

/* icône toggle password */
.abs-toggle {
  @apply absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg
    text-gray-500 hover:bg-gray-100;
}
</style>
