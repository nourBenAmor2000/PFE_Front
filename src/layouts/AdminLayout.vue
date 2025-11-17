<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Sidebar (sous le header) -->
    <aside
      :class="[
        'fixed left-0 top-16 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      aria-label="Sidebar"
    >
      <div class="h-14 px-4 border-b border-gray-100 flex items-center">
        <h2 class="text-lg font-bold text-orange-600">Admin</h2>
      </div>

      <nav class="px-3 py-3 space-y-1 overflow-y-auto h-[calc(100%-3.5rem)]">
        <RouterLink
          v-for="item in menu"
          :key="item.name"
          :to="item.route"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium"
          :class="[$route.path === item.route ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600']"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </RouterLink>
      </nav>
    </aside>

    <!-- Overlay mobile (sous le header) -->
   

    <!-- Main (padding-top pour header) -->
<div class="flex-1 flex flex-col min-h-screen lg:ml-64">
      <!-- Barre locale optionnelle (breadcrumb / actions) -->
     

      <!-- Contenu -->
      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>
    
  </div>
  
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  HomeIcon, UsersIcon, BuildingIcon, UserCogIcon,
  LayersIcon, SettingsIcon, ClipboardListIcon, ShieldUser,
} from 'lucide-vue-next'

const route = useRoute()
const sidebarOpen = ref(false)

// User & menu selon rôle
const storedUser = localStorage.getItem('user')
const user = storedUser ? JSON.parse(storedUser) : null

const fullMenu = [
  { name: 'Dashboard', route: '/admin', icon: HomeIcon, roles: ['admin_global', 'admin_agent', 'admin_agence', 'agent', 'agent_rh', 'agent_personnel', 'client'] },
  { name: 'Admins', route: '/admin/admins', icon: ShieldUser, roles: ['admin_global'] },
  { name: 'Clients', route: '/admin/clients', icon: UsersIcon, roles: ['admin_global', 'admin_agent', 'admin_agence'] },
  { name: 'Agents', route: '/admin/agents', icon: UserCogIcon, roles: ['admin_global'] },
  { name: 'Properties', route: '/admin/logements', icon: BuildingIcon, roles: ['admin_global', 'admin_agent', 'admin_agence', 'agent', 'agent_personnel'] },
  { name: 'Subcategories', route: '/admin/subcategories', icon: LayersIcon, roles: ['admin_global', 'admin_agent', 'admin_agence'] },
  { name: 'Contracts', route: '/admin/contracts', icon: ClipboardListIcon, roles: ['admin_global', 'admin_agent', 'admin_agence', 'agent', 'agent_personnel'] },
]

const normalizeRole = (r) => {
  const x = String(r || '').toLowerCase().trim()
  if (x === 'admin_agent') return 'admin_agence'
  if (x === 'agent_personnnel') return 'agent_personnel'
  return x
}
const menu = computed(() => {
  const r = normalizeRole(user?.role)
  if (!r) return []
  return fullMenu.filter(i => i.roles.includes(r))
})
</script>
