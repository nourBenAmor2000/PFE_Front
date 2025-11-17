<template>
  <!-- Sticky, translucent header with subtle border and scroll-aware shadow -->
  <header
  
    class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-teal-50 supports-[backdrop-filter]:bg-white/60"
    :class="{ 'shadow-sm': scrolled }"
  >
  <teleport to="body">
    <LoginModal
      v-model:open="loginOpen"
      @switch-to-register="openRegister"
    />
    <RegisterModal
      v-model:open="registerOpen"
      @switch-to-login="openLogin"
    />
  </teleport>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-18 lg:h-20 items-center justify-between gap-4">
        <!-- Logo / Brand -->
        <router-link
          to="/"
          class="group inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
          aria-label="Aller à l’accueil"
        >
        <img
          src="/assets/images/logo.png"
          alt="Logo Homez"
          class="h-20 w-auto transition-transform duration-300 hover:scale-110"
        >

          <!-- <span class="hidden sm:inline-block text-xl font-semibold tracking-tight text-gray-900">
            E-DAR
          </span> -->
        </router-link>

        <!-- Primary Nav (Desktop) -->
        <nav class="hidden lg:flex items-center gap-2 xl:gap-6" aria-label="Navigation principale">
          <AppNavLink to="/professionnel" icon="briefcase" label="Immobilier Professionnel" />
          <AppNavLink to="/evaluer" icon="clipboard" label="Évaluer mon bien" />
          <AppNavLink to="/agences" icon="marker" label="Chercher une agence" />
        </nav>

        <!-- Right zone: Auth + Theme + Burger -->
        <div class="flex items-center gap-1 sm:gap-2">
          <!-- Theme toggle (optional) -->
          <button
            type="button"
            class="hidden sm:inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            @click="toggleTheme"
            :aria-pressed="isDark ? 'true' : 'false'"
            aria-label="Basculer le thème"
          >
            <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </button>

          <!-- Auth area (Desktop) -->
          <div v-if="hydrated" class="relative hidden lg:block">
            <!-- Logged in -->
            <template v-if="isAuthenticated">
              <button
                ref="userButtonRef"
                type="button"
                class="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                @click.stop="toggleUserMenu"
                aria-haspopup="menu"
                :aria-expanded="userMenuOpen ? 'true' : 'false'"
                aria-controls="user-menu"
              >
                <img
                  :src="user?.avatar || avatarFallback"
                  :alt="displayName"
                  class="h-8 w-8 rounded-full object-cover ring-2 ring-teal-500/20 group-hover:ring-teal-500/40"
                />
                <span class="max-w-[160px] truncate">{{ displayName }}</span>
                <svg class="h-4 w-4 transition-transform group-data-[open=true]:rotate-180" :class="{ 'rotate-180': userMenuOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown -->
              <transition name="fade-scale">
                <div
                  v-if="userMenuOpen"
                  id="user-menu"
                  role="menu"
                  class="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg ring-1 ring-black/5"
                  @click.stop
                >
                  <router-link
                    to="/profile"
                    class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                    role="menuitem"
                    @click="closeUserMenu"
                  >
                    <Icon name="user" class="h-4 w-4" />
                    <span>Mon Profil</span>
                  </router-link>

                  <router-link
                    v-if="isAgent || isAdmin"
                    to="/mes-annonces"
                    class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                    role="menuitem"
                    @click="closeUserMenu"
                  >
                    <Icon name="home" class="h-4 w-4" />
                    <span>Mes Annonces</span>
                  </router-link>

                  <div class="my-1 border-t border-gray-100"></div>

                  <button
                    class="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                    role="menuitem"
                    @click="handleLogout"
                  >
                    <Icon name="logout" class="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </transition>
            </template>

            <!-- Logged out -->
            <button
  v-else
  type="button"
  @click="openLogin()"
  class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
>
  <Icon name="user" class="h-5 w-5" />
  <span>Se connecter</span>
</button>

          </div>

          <!-- Burger (Mobile) -->
          <button
            class="inline-flex lg:hidden items-center justify-center rounded-xl p-2 text-gray-700 hover:text-teal-700 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            @click="openMobileMenu"
            aria-controls="mobile-drawer"
            :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
          >
            <Icon name="menu" class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer + Overlay -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 bg-black/30" @click="closeMobileMenu" />
    </transition>

    <transition name="slide">
      <aside
        v-if="mobileMenuOpen"
        id="mobile-drawer"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl ring-1 ring-black/5"
        role="dialog"
        aria-modal="true"
        @keydown.esc="closeMobileMenu"
      >
        <div class="flex h-16 items-center justify-between px-4 border-b border-gray-100">
          <span class="text-base font-semibold">Menu</span>
          <button
            class="rounded-xl p-2 text-gray-700 hover:text-teal-700 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            @click="closeMobileMenu"
            aria-label="Fermer le menu"
          >
            <Icon name="close" class="h-6 w-6" />
          </button>
        </div>

        <nav class="flex flex-col gap-1 p-3" aria-label="Navigation mobile">
          <MobileLink to="/professionnel" label="Immobilier Professionnel" icon="briefcase" @navigate="closeMobileMenu" />
          <MobileLink to="/evaluer" label="Évaluer mon bien" icon="clipboard" @navigate="closeMobileMenu" />
          <MobileLink to="/agences" label="Chercher une agence" icon="marker" @navigate="closeMobileMenu" />

          <div v-if="hydrated" class="mt-2 border-t border-gray-100 pt-3">
            <template v-if="isAuthenticated">
              <div class="flex items-center gap-3 px-2 py-2">
                <img :src="user?.avatar || avatarFallback" :alt="displayName" class="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500/20" />
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ displayName }}</p>
                  <p class="text-xs text-gray-500">Connecté</p>
                </div>
              </div>
              <MobileLink to="/profile" label="Mon Profil" icon="user" @navigate="closeMobileMenu" />
              <MobileLink v-if="isAgent || isAdmin" to="/mes-annonces" label="Mes Annonces" icon="home" @navigate="closeMobileMenu" />
              <button
                class="mt-2 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                @click="handleLogout"
              >
                <Icon name="logout" class="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </template>
            <button
  v-else
  type="button"
  class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-700 hover:bg-teal-50"
  @click="() => { closeMobileMenu(); openLogin(); }"
>
  <Icon name="user" class="h-5 w-5" />
  <span>Se connecter</span>
</button>

          </div>
        </nav>
      </aside>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

/* Auth state */
const { user, isAuthenticated, isAgent, isAdmin, logout, initAuth } = useAuth()
const hydrated = ref(false)

onMounted(() => {
  initAuth()
  hydrated.value = true
})

/* Display name */
const displayName = computed(() => {
  const u: any = user?.value || null
  if (!u) return ''
  return u.name || u.username || (u.email ? u.email.split('@')[0] : 'Utilisateur')
})

/* Avatar fallback */
const avatarFallback = 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&bold=true'

/* Scroll shadow */
const scrolled = ref(false)
const onScroll = () => { scrolled.value = window.scrollY > 4 }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

/* Theme toggle (basic) */
const isDark = ref(false)
const toggleTheme = () => { isDark.value = !isDark.value; document.documentElement.classList.toggle('dark', isDark.value) }

/* User menu */
const userMenuOpen = ref(false)
const userButtonRef = ref<HTMLElement | null>(null)
const toggleUserMenu = () => (userMenuOpen.value = !userMenuOpen.value)
const closeUserMenu = () => (userMenuOpen.value = false)

/* Close on outside click */
const onBodyClick = (e: MouseEvent) => {
  const header = (e.target as HTMLElement).closest('header')
  if (!header) {
    userMenuOpen.value = false
    mobileMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onBodyClick))
onUnmounted(() => document.removeEventListener('click', onBodyClick))

/* Mobile drawer */
const mobileMenuOpen = ref(false)
const openMobileMenu = () => (mobileMenuOpen.value = true)
const closeMobileMenu = () => (mobileMenuOpen.value = false)

/* Route-aware active styles */
const route = useRoute()
const isActive = (to: string) => route.path.startsWith(to)

/* Logout */
const handleLogout = () => { logout(); userMenuOpen.value = false; mobileMenuOpen.value = false }
</script>

<!-- Local components: Icon, AppNavLink, MobileLink -->
<script lang="ts">
import RegisterModal from '@/components/RegisterModal.vue'

const registerOpen = ref(false)

const openRegister = () => { loginOpen.value = false; registerOpen.value = true }

import { defineComponent, h, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import LoginModal from '@/components/LoginModal.vue'




const loginOpen = ref(false)
const openLogin = () => { loginOpen.value = true }

const paths: Record<string, string> = {
  briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  clipboard: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  marker: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0z M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 18L18 6M6 6l12 12'
}

export default defineComponent({
  name: 'LocalComponents',
  components: {
    Icon: defineComponent({
      name: 'Icon',
      props: { name: { type: String, required: true }, class: { type: String, default: '' } },
      setup(props) {
        return () => h('svg', {
          xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
          class: props.class
        }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: paths[props.name] || '' })])
      }
    }),

    AppNavLink: defineComponent({
      name: 'AppNavLink',
      props: { to: { type: String, required: true }, label: { type: String, required: true }, icon: { type: String, required: true } },
      setup(props) {
        const route = useRoute()
        const active = computed(() => route.path.startsWith(props.to))
        return () => h(RouterLink, { to: props.to, class: [
          'group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
          active.value ? 'text-teal-700' : 'text-gray-700 hover:text-teal-700 hover:bg-teal-50'
        ] }, {
          default: () => [
            h('span', { class: 'relative inline-flex' }, [
              h('span', { class: 'absolute -inset-1 rounded-lg bg-gradient-to-r from-teal-500/0 via-teal-500/0 to-teal-500/0 blur-sm opacity-0 transition group-hover:opacity-30' }),
              h('span', { class: 'relative inline-flex items-center gap-2' }, [
                h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
                  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: paths[props.icon] })
                ]),
                h('span', props.label)
              ])
            ])
          ]
        })
      }
    }),

    MobileLink: defineComponent({
      name: 'MobileLink',
      emits: ['navigate'],
      props: { to: { type: String, required: true }, label: { type: String, required: true }, icon: { type: String, required: true } },
      setup(props, { emit }) {
        const onClick = () => emit('navigate')
        return () => h(RouterLink, { to: props.to, onClick, class: 'inline-flex items-center gap-3 rounded-xl px-3 py-3 text-gray-700 hover:text-teal-700 hover:bg-teal-50' }, [
          h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', class: 'h-5 w-5', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
            h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: paths[props.icon] })
          ]),
          h('span', { class: 'text-sm font-medium' }, props.label)
        ])
      }
    })
  }
})
</script>

<style scoped>
/***** Transitions *****/
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-scale-enter-active { transition: opacity 120ms ease, transform 120ms ease; transform-origin: 90% 0; }
.fade-scale-leave-active { transition: opacity 100ms ease, transform 100ms ease; transform-origin: 90% 0; }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }

.slide-enter-active { transition: transform 220ms cubic-bezier(.2,.7,.3,1); }
.slide-leave-active { transition: transform 180ms ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
