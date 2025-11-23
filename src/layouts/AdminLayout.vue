<template>
  <div class="flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50" style="min-height: calc(100vh - 4rem);">
    <!-- Sidebar (sous le header) -->
    <aside
      :class="[
        'fixed left-0 top-16 z-40 w-64 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-sm border-r border-gray-200/80 shadow-sm transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      aria-label="Sidebar"
    >
      <!-- Sidebar Header -->
      <div class="h-16 px-4 border-b border-gray-100/80 flex items-center justify-between bg-gradient-to-r from-orange-50 to-transparent">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">E-DAR Admin</h2>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)] custom-scrollbar">
        <RouterLink
          v-for="item in menu"
          :key="item.name"
          :to="item.route"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative"
          :class="[
            $route.path === item.route 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600'
          ]"
        >
          <component 
            :is="item.icon" 
            class="w-5 h-5 transition-transform duration-200"
            :class="$route.path === item.route ? 'text-white' : 'text-gray-500 group-hover:text-orange-600'"
          />
          <span class="flex-1">{{ item.name }}</span>
          <div 
            v-if="$route.path === item.route"
            class="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/80"
          ></div>
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col lg:ml-64" style="min-height: calc(100vh - 4rem);">
      <!-- Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
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
  TagIcon, StarIcon, CreditCardIcon, CalendarIcon, FolderIcon,
} from 'lucide-vue-next'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const sidebarOpen = ref(false)

// User & menu selon rôle
const storedUser = localStorage.getItem('user')
const user = storedUser ? JSON.parse(storedUser) : null

const fullMenu = [
  { name: 'Dashboard', route: '/admin', icon: HomeIcon, roles: ['admin_global', 'admin_agence', 'agent_rh', 'agent_personnel', 'client'] },
  { name: 'Admins', route: '/admin/admins', icon: ShieldUser, roles: ['admin_global'] },
  { name: 'Clients', route: '/admin/clients', icon: UsersIcon, roles: ['admin_global', 'admin_agence'] },
  { name: 'Agents', route: '/admin/agents', icon: UserCogIcon, roles: ['admin_global'] },
  { name: 'Properties', route: '/admin/logements', icon: BuildingIcon, roles: ['admin_global', 'admin_agence', 'agent_personnel'] },
  { name: 'Categories', route: '/admin/categories', icon: FolderIcon, roles: ['admin_global', 'admin_agence'] },
  { name: 'Subcategories', route: '/admin/subcategories', icon: LayersIcon, roles: ['admin_global', 'admin_agence'] },
  { name: 'Attributes', route: '/admin/attributes', icon: TagIcon, roles: ['admin_global', 'admin_agence'] },
  { name: 'Contracts', route: '/admin/contracts', icon: ClipboardListIcon, roles: ['admin_global', 'admin_agence', 'agent_personnel'] },
  { name: 'Payment Contracts', route: '/admin/payment-contracts', icon: CreditCardIcon, roles: ['admin_global', 'admin_agence', 'agent_personnel'] },
  { name: 'Visits', route: '/admin/visits', icon: CalendarIcon, roles: ['admin_global', 'admin_agence', 'agent_personnel'] },
  { name: 'Reviews', route: '/admin/reviews', icon: StarIcon, roles: ['admin_global', 'admin_agence', 'agent_personnel'] },
]

const normalizeRole = (r) => {
  const x = String(r || '').toLowerCase().trim()
  // Normalize role name variations
  if (x === 'admin_agent') return 'admin_agence'
  if (x === 'agent_personnnel') return 'agent_personnel'
  if (x === 'rh') return 'agent_rh'
  if (x === 'agent' && r !== 'agent_rh' && r !== 'agent_personnel') return 'agent_personnel'
  return x
}
const menu = computed(() => {
  const r = normalizeRole(user?.role)
  if (!r) return []
  return fullMenu.filter(i => i.roles.includes(r))
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* Smooth transitions */
nav a {
  position: relative;
}

nav a::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(to bottom, #f97316, #ea580c);
  border-radius: 0 2px 2px 0;
  transition: height 0.2s ease;
}

nav a.router-link-active::before {
  height: 60%;
}
</style>
