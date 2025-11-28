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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
            </svg>
          </div>
          <h2 class="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Admin Agence</h2>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)] custom-scrollbar">
        <RouterLink
          v-for="item in adminAgentMenu"
          :key="item.name"
          :to="item.route"
          class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative"
          :class="[
            isActiveRoute(item.route)
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-gray-800'
          ]"
        >
          <component 
            :is="item.icon" 
            class="w-5 h-5 transition-transform duration-200"
            :class="isActiveRoute(item.route) ? 'text-white' : 'text-gray-500 group-hover:text-orange-600 dark:text-gray-400'"
          />
          <span class="flex-1">{{ item.name }}</span>
          <div 
            v-if="isActiveRoute(item.route)"
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
  HomeIcon, 
  BuildingIcon, 
  UserCogIcon,
  CalendarIcon,
} from 'lucide-vue-next'

const route = useRoute()
const sidebarOpen = ref(false)

// Menu spécifique pour Admin Agence - seulement les accès autorisés selon les routes API
// Routes API disponibles selon Agency module :
// - /agency (CRUD): GET /agency, GET /agency/{id}, POST /agency, PUT /agency/{id}, DELETE /agency/{id}
// - /agents (CRUD): GET /agents, POST /agents, GET /agents/{id}, PUT /agents/{id}, DELETE /agents/{id}
// - /visits (lecture seule): GET /visits, GET /visits/{id}
const adminAgentMenu = [
  { 
    name: 'Dashboard', 
    route: '/admin-agence', 
    icon: HomeIcon 
  },
  { 
    name: 'Mon Agence', 
    route: '/admin-agence/agency', 
    icon: BuildingIcon 
  },
  { 
    name: 'Agents', 
    route: '/admin-agence/agents', 
    icon: UserCogIcon 
  },
  { 
    name: 'Visites', 
    route: '/admin-agence/visits', 
    icon: CalendarIcon 
  },
]

// Fonction pour déterminer si une route est active
const isActiveRoute = (menuRoute) => {
  const currentPath = route.path
  
  // Exact match pour dashboard
  if (menuRoute === '/admin-agence') {
    return currentPath === '/admin-agence'
  }
  
  // Pour les autres routes, vérifier si le chemin commence par la route du menu
  // et gérer les sous-routes (edit, add, etc.)
  if (menuRoute === '/admin-agence/agency') {
    return currentPath === '/admin-agence/agency' || currentPath.startsWith('/admin-agence/agency/')
  }
  
  if (menuRoute === '/admin-agence/agents') {
    return currentPath === '/admin-agence/agents' || currentPath.startsWith('/admin-agence/agents/')
  }
  
  if (menuRoute === '/admin-agence/visits') {
    return currentPath === '/admin-agence/visits' || currentPath.startsWith('/admin-agence/visits/')
  }
  
  return currentPath === menuRoute
}
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

/* Dark mode scrollbar */
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
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

