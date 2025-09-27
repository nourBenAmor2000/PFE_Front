<template>
  <header class="bg-white shadow-sm border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900">homez</span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <div 
            v-for="item in navigationItems" 
            :key="item.name"
            class="relative group"
          >
            <button 
              class="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              @click="toggleDropdown(item.name)"
            >
              <span>{{ item.name }}</span>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': activeDropdown === item.name }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div 
              v-if="activeDropdown === item.name"
              class="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
            >
              <router-link 
                v-for="subItem in item.subItems" 
                :key="subItem.name"
                :to="subItem.path" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                @click="closeDropdowns"
              >
                {{ subItem.name }}
              </router-link>
            </div>
          </div>
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-6">
          <!-- Phone Number -->
          <div class="hidden md:flex items-center space-x-2 text-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <span class="font-medium">+(088) 123 456 789</span>
          </div>

          <!-- User Menu (when authenticated) -->
          <div v-if="isAuthenticated" class="relative">
            <button 
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <img 
                :src="user?.avatar" 
                :alt="user?.name"
                class="w-8 h-8 rounded-full object-cover"
              />
              <span class="hidden md:block font-medium">{{ user?.name }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            
            <!-- User Dropdown -->
            <div 
              v-if="userMenuOpen"
              class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
            >
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
                <p class="text-xs text-gray-500">{{ user?.email }}</p>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 capitalize mt-1">
                  {{ user?.role }}
                </span>
              </div>
              
              <router-link 
                to="/dashboard" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="closeUserMenu"
              >
                Dashboard
              </router-link>
              
              <router-link 
                to="/profile" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="closeUserMenu"
              >
                Profile
              </router-link>
              
              <router-link 
                v-if="isAgent" 
                to="/agent-profile" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="closeUserMenu"
              >
                Agent Profile
              </router-link>
              
              <router-link 
                v-if="isAdmin" 
                to="/admin" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="closeUserMenu"
              >
                Admin Dashboard
              </router-link>
              
              <div class="border-t border-gray-100 mt-2 pt-2">
                <button 
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <!-- Login/Register (when not authenticated) -->
          <div v-else class="hidden md:flex items-center space-x-4">
            <router-link 
              to="/login"
              class="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>Login</span>
            </router-link>
            
            <router-link 
              to="/register"
              class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Register
            </router-link>
          </div>

          <!-- Add Property Button -->
          <router-link 
            v-if="isAuthenticated && (isAgent || isAdmin)"
            to="/add-property"
            class="hidden md:flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <span>Add Property</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </router-link>

          <!-- Mobile Menu Button -->
          <button 
            class="lg:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            @click="toggleMobileMenu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-100 py-4">
        <div class="space-y-4">
          <div v-for="item in navigationItems" :key="item.name">
            <button 
              class="flex items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2"
              @click="toggleMobileDropdown(item.name)"
            >
              <span>{{ item.name }}</span>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': activeMobileDropdown === item.name }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-if="activeMobileDropdown === item.name" class="pl-4 space-y-2">
              <router-link 
                v-for="subItem in item.subItems" 
                :key="subItem.name"
                :to="subItem.path" 
                class="block text-sm text-gray-600 hover:text-gray-900 py-1"
                @click="closeDropdowns"
              >
                {{ subItem.name }}
              </router-link>
            </div>
          </div>
          
          <!-- Mobile Actions -->
          <div class="pt-4 border-t border-gray-100 space-y-3">
            <div class="flex items-center space-x-2 text-gray-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span class="font-medium">+(088) 123 456 789</span>
            </div>
            
            <!-- Mobile Auth Actions -->
            <div v-if="isAuthenticated" class="space-y-2">
              <div class="flex items-center space-x-2 py-2">
                <img 
                  :src="user?.avatar" 
                  :alt="user?.name"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
                  <p class="text-xs text-gray-500 capitalize">{{ user?.role }}</p>
                </div>
              </div>
              
              <router-link 
                to="/dashboard"
                class="block text-gray-700 hover:text-gray-900 py-1"
                @click="closeMobileMenu"
              >
                Dashboard
              </router-link>
              
              <router-link 
                to="/profile"
                class="block text-gray-700 hover:text-gray-900 py-1"
                @click="closeMobileMenu"
              >
                Profile
              </router-link>
              
              <router-link 
                v-if="isAgent" 
                to="/agent-profile" 
                class="block text-gray-700 hover:text-gray-900 py-1"
                @click="closeMobileMenu"
              >
                Agent Profile
              </router-link>
              
              <router-link 
                v-if="isAdmin" 
                to="/admin" 
                class="block text-gray-700 hover:text-gray-900 py-1"
                @click="closeMobileMenu"
              >
                Admin Dashboard
              </router-link>
              
              <button 
                @click="handleLogout"
                class="block w-full text-left text-red-600 hover:text-red-700 py-1"
              >
                Sign out
              </button>
            </div>
            
            <div v-else class="space-y-2">
              <router-link 
                to="/login"
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                @click="closeMobileMenu"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span class="font-medium">Login</span>
              </router-link>
              
              <router-link 
                to="/register"
                class="block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium text-center"
                @click="closeMobileMenu"
              >
                Register
              </router-link>
            </div>
            
            <router-link 
              v-if="isAuthenticated && (isAgent || isAdmin)"
              to="/add-property"
              class="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              @click="closeMobileMenu"
            >
              <span>Add Property</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const authComposable = useAuth()
const { user, isAuthenticated, isAgent, isAdmin, logout } = authComposable

const navigationItems = [
  {
    name: 'Home',
    subItems: [
      { name: 'Home 1', path: '/' },
      { name: 'Home 2', path: '/' },
      { name: 'Home 3', path: '/' }
    ]
  },
  {
    name: 'Listings',
    subItems: [
      { name: 'All Properties', path: '/properties' },
      { name: 'Featured', path: '/properties?featured=true' },
      { name: 'For Sale', path: '/properties?status=for-sale' },
      { name: 'For Rent', path: '/properties?status=for-rent' }
    ]
  },
  {
    name: 'Members',
    subItems: [
      { name: 'All Agents', path: '/agents' },
      { name: 'Agencies', path: '/agencies' }
    ]
  },
  {
    name: 'Pages',
    subItems: [
      { name: 'Cities', path: '/cities' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' }
    ]
  }
]

const activeDropdown = ref(null)
const activeMobileDropdown = ref(null)
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const toggleDropdown = (itemName) => {
  activeDropdown.value = activeDropdown.value === itemName ? null : itemName
}

const toggleMobileDropdown = (itemName) => {
  activeMobileDropdown.value = activeMobileDropdown.value === itemName ? null : itemName
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const closeUserMenu = () => {
  userMenuOpen.value = false
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleLogout = () => {
  logout()
  closeUserMenu()
  closeMobileMenu()
}

const closeDropdowns = () => {
  activeDropdown.value = null
  activeMobileDropdown.value = null
  userMenuOpen.value = false
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', closeDropdowns)
  }
})
</script>
