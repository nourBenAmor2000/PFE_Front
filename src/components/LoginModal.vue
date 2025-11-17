<template>
  <Transition name="modal">
    <div
      v-if="open"
      class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      @keydown.esc.prevent="close()"
    >
      <!-- overlay -->
      <div class="absolute inset-0 bg-black/40" @click="close()" />

      <!-- card -->
      <div
        ref="cardRef"
        class="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/80 backdrop-blur shadow-2xl supports-[backdrop-filter]:bg-white/70"
        @click.stop
      >
        <!-- fond sans image -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 rounded-2xl"
          :style="bgStyle"
        ></div>

        <!-- close -->
        <button
          type="button"
          class="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-gray-500 hover:text-gray-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          @click="close()"
          aria-label="Fermer la fenêtre"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div class="relative px-6 pt-10 pb-5">
          <h2 id="login-title" class="mb-4 text-center text-lg font-bold text-gray-900">
            Connectez-vous ou inscrivez-vous pour profiter de tous les services homez
          </h2>

          <!-- Social -->
          <div class="space-y-3 mb-6">
            <button type="button" class="btn-social bg-[#4267B2] text-white" @click="social('facebook')" aria-label="Continuer avec Facebook">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button type="button" class="btn-social bg-white border text-gray-800" @click="social('google')" aria-label="Continuer avec Google">
              <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button type="button" class="btn-social bg-black text-white" @click="social('apple')" aria-label="Continuer avec Apple">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>

          <!-- Divider -->
          <div class="my-4 flex items-center">
            <div class="h-px flex-1 bg-gray-200"></div>
            <span class="px-3 text-sm text-gray-500">ou</span>
            <div class="h-px flex-1 bg-gray-200"></div>
          </div>

          <!-- Form -->
          <form class="space-y-4" novalidate :aria-busy="isLoading ? 'true' : 'false'" @submit.prevent="submit">
            <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert" aria-live="assertive">
              {{ error }}
            </p>

            <label class="block">
              <span class="sr-only">E-mail</span>
              <input
                ref="emailRef"
                v-model.trim="form.email"
                type="email"
                inputmode="email"
                autocomplete="email"
                required
                placeholder="E-mail"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
              />
            </label>

            <div class="relative">
              <label class="sr-only" for="password">Mot de passe</label>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="form.password"
                autocomplete="current-password"
                required
                minlength="6"
                placeholder="Mot de passe"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                :aria-pressed="showPassword ? 'true' : 'false'"
                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10a5 5 0 0 1 0 10Z"/></svg>
                <svg v-else class="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.05-3.05A10.9 10.9 0 0 1 12 19c-7 0-10-7-10-7a18.1 18.1 0 0 1 5-6.22L2 5.27ZM12 7a5 5 0 0 1 5 5c0 .74-.16 1.44-.45 2.07L9.93 7.45A4.9 4.9 0 0 1 12 7Z"/></svg>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <label class="inline-flex items-center gap-2 text-sm text-gray-600">
                <input v-model="form.remember" type="checkbox" class="accent-teal-600" />
                <span>Se souvenir de moi</span>
              </label>
              <button type="button" class="text-sm font-semibold text-teal-600 hover:text-teal-700" @click="forgot">
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:brightness-[.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <span v-if="!isLoading">Connexion</span>
              <span v-else class="inline-flex items-center gap-2">
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"></span>
                Connexion…
              </span>
            </button>

            <p class="text-center text-sm text-gray-600">
              Pas encore de compte ?
              <button type="button" class="font-semibold text-teal-600 hover:text-teal-700" @click="goRegister">Inscrivez-vous</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

/* v-model:open */
const props = defineProps<{ open: boolean }>()


const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'success'): void
  (e: 'switch-to-register'): void    // 👈 ajouté
}>()
const goRegister = () => {
  close()
  emit('switch-to-register')         // 👈 ouvre le RegisterModal côté parent
}
const router = useRouter()
const { login, isLoading } = useAuth()

const form = ref({ email: '', password: '', remember: false })
const error = ref('')
const showPassword = ref(false)

const emailRef = ref<HTMLInputElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)

/* fond dégradé doux (sans image) */
const bgStyle = `background:
  radial-gradient(900px 500px at 10% -5%, rgba(13,148,136,.12), transparent 55%),
  radial-gradient(800px 450px at 110% 110%, rgba(13,148,136,.10), transparent 60%),
  linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,0));`

/* open/close helpers */
const close = () => emit('update:open', false)

/* lock body scroll quand ouvert */
const lockScroll = (lock: boolean) => {
  const body = document.body
  if (lock) {
    body.style.setProperty('overflow', 'hidden')
  } else {
    body.style.removeProperty('overflow')
  }
}

/* focus trap minimal */
let lastFocused: HTMLElement | null = null
const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Tab') return
  const focusables = cardRef.value?.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusables || focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

watch(() => props.open, (val) => {
  lockScroll(val)
  if (val) {
    lastFocused = document.activeElement as HTMLElement
    setTimeout(() => emailRef.value?.focus(), 0)
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('keydown', onKeydown)
    lastFocused?.focus?.()
  }
})

onBeforeUnmount(() => {
  lockScroll(false)
  document.removeEventListener('keydown', onKeydown)
})

/* actions */
const submit = async () => {
  error.value = ''
  // ⬇️ si tu as un select pour le type, passe-le ici. Sinon, laisse "client" par défaut.
  const roleType = form.value.roleType || 'client'

  const res = await login(
    {
      email: form.value.email,
      password: form.value.password,
      rememberMe: form.value.remember,
    },
    roleType
  )

  if (res?.success) {
    // admin -> /dashboardadmin ; sinon /dashboard
    const role = String(res?.user?.role || '').toLowerCase()
    const isAdmin = role === 'admin_global' || role === 'admin_agence' || role === 'admin_agent'
    const to = isAdmin ? '/admin' : '/dashboard'
    emit('success'); close(); router.push(to)
  } else {
    error.value = res?.error || 'Échec de connexion. Veuillez réessayer.'
  }
}


const social = (provider: string) => {
  // TODO: impl. auth sociale
  console.log('social:', provider)
}

const forgot = () => {
  // TODO
  console.log('forgot password')
}


</script>

<style scoped>
/* transitions */
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .rounded-2xl, .modal-leave-active .rounded-2xl { transition: transform .2s ease; }
.modal-enter-from .rounded-2xl, .modal-leave-to .rounded-2xl { transform: translateY(4px) scale(.98); }

/* boutons sociaux */
.btn-social{
  width:100%;
  display:flex; align-items:center; justify-content:center; gap:.6rem;
  border-radius: .9rem;
  padding:.8rem 1rem;
  font-weight: 700;
  border:1px solid transparent;
}
.btn-social.border{ border-color:#e5e7eb; }
.btn-social:hover{ filter: brightness(.98); transform: translateY(-1px); transition: .12s ease; }
</style>
