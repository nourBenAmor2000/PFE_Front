<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-100">
        <h2 class="text-xl font-bold text-orange-600">Admin</h2>
        <button @click="sidebarOpen = false" class="lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="mt-6 px-3 space-y-1">
        <RouterLink
          v-for="item in menu"
          :key="item.name"
          :to="item.route"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium"
          :class="[
            $route.path === item.route
              ? 'bg-orange-100 text-orange-700'
              : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </RouterLink>
      </nav>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen lg:ml-64">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div class="flex items-center justify-between px-6 h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="sidebarOpen = true"
              class="lg:hidden text-gray-600 hover:text-orange-600 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 class="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Welcome, {{ user?.name }}</span>
            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ user?.name?.charAt(0) }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main slot content -->
      <main class="flex-1 p-6 bg-gray-50">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  HomeIcon,
  UsersIcon,
  BuildingIcon,
  UserCogIcon,
  LayersIcon,
  SettingsIcon,
  ClipboardListIcon,
  ShieldUser,
} from 'lucide-vue-next'

// --- Get user from localStorage ---
const storedUser = localStorage.getItem('user')
const user = storedUser ? JSON.parse(storedUser) : null

const route = useRoute()
const sidebarOpen = ref(false)

// --- Full menu definition ---
const fullMenu = [
  { name: 'Dashboard', route: '/dashboard', icon: HomeIcon, roles: ['admin_global', 'admin_agent', 'agent', 'client'] },
    { name: 'Admins', route: '/admin/admins', icon: ShieldUser, roles: ['admin_global'] },
  { name: 'Clients', route: '/admin/clients', icon: UsersIcon, roles: ['admin_global', 'admin_agent'] },
  { name: 'Agents', route: '/admin/agents', icon: UserCogIcon, roles: ['admin_global'] },
  { name: 'Properties', route: '/admin/logements', icon: BuildingIcon, roles: ['admin_global', 'admin_agent', 'agent'] },
  { name: 'Subcategories', route: '/admin/subcategories', icon: LayersIcon, roles: ['admin_global', 'admin_agent'] },
  { name: 'Contracts', route: '/admin/contracts', icon: ClipboardListIcon, roles: ['admin_global', 'admin_agent', 'agent'] },
]

// --- Filter menu based on role ---
const menu = computed(() => {
  const role = user?.role
  if (!role) return []
  return fullMenu.filter(item => item.roles.includes(role))
})
</script>


<style scoped>
.router-link-active {
  @apply bg-orange-100 text-orange-700;
}
</style>
