<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Header -->
      <header class="bg-white/90 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 grid place-items-center text-white shadow-sm">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l2-2 4 4 8-8 4 4"/></svg>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900 dark:text-white leading-tight">Admin Dashboard</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Monitor, moderate, and manage your platform</p>
            </div>
            <nav class="ml-5 hidden md:flex text-xs text-gray-500 dark:text-gray-400 items-center gap-2">
              <span class="hover:text-gray-700 dark:hover:text-gray-200 transition">Home</span>
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
              <span class="text-orange-600 dark:text-orange-400 font-medium">Dashboard</span>
            </nav>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative hidden sm:block">
              <input v-model.trim="keyword" type="text" placeholder="Search…" class="peer w-64 pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none transition"/>
              <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 peer-focus:text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
            </div>
            <!-- AI Assistant Button -->
            <button 
              @click="showAIAssistant = !showAIAssistant" 
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
              title="AI Assistant"
            >
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3l7 4v6c0 5-7 8-7 8s-7-3-7-8V7l7-4z"/>
              </svg>
              <span v-if="!showAIAssistant" class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-purple-500 animate-pulse"></span>
            </button>
            <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative" @click="toggleTheme">
              <svg v-if="!isDark" class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05 5.636 5.636"/></svg>
              <svg v-else class="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
            <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/><path d="M9 20h6"/></svg>
              <span class="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-600 text-white text-[10px] grid place-items-center">3</span>
            </button>
            <div class="h-8 w-8 rounded-full bg-orange-500 grid place-items-center text-white font-semibold">
              {{ user?.name?.charAt(0) || 'A' }}
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            :value="stats.totalUsers"
            :delta="'+4.2%'">
            <template #icon>
              <div class="w-8 h-8 rounded-lg bg-blue-500 text-white grid place-items-center">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </template>
          </StatCard>
          <StatCard
            title="Active Properties"
            :value="stats.activeProperties"
            :delta="'+2.1%'">
            <template #icon>
              <div class="w-8 h-8 rounded-lg bg-green-500 text-white grid place-items-center">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/></svg>
              </div>
            </template>
          </StatCard>
          <StatCard
            title="Pending Contracts"
            :value="stats.pendingContracts"
            :delta="'-1.3%'">
            <template #icon>
              <div class="w-8 h-8 rounded-lg bg-yellow-500 text-white grid place-items-center">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></svg>
              </div>
            </template>
          </StatCard>
          <StatCard
            title="Monthly Revenue"
            :value="formatCurrency(stats.monthlyRevenue)"
            :delta="'+7.8%'">
            <template #icon>
              <div class="w-8 h-8 rounded-lg bg-purple-500 text-white grid place-items-center">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </template>
          </StatCard>
        </section>

        <!-- Quick AI Actions -->
        <section v-if="!showAIAssistant" class="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-4">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 3l7 4v6c0 5-7 8-7 8s-7-3-7-8V7l7-4z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Get instant insights about your system</p>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <button
                @click="quickAIQuery('Combien d\'utilisateurs dans le système?')"
                class="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 transition"
              >
                📊 Stats utilisateurs
              </button>
              <button
                @click="quickAIQuery('Propriétés en attente d\'approbation')"
                class="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 transition"
              >
                🏠 Propriétés en attente
              </button>
              <button
                @click="quickAIQuery('Revenus du mois')"
                class="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 transition"
              >
                💰 Revenus mensuels
              </button>
              <button
                @click="showAIAssistant = true"
                class="px-4 py-1.5 text-xs rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md transition"
              >
                Ouvrir Assistant
              </button>
            </div>
          </div>
        </section>

        <!-- Tabs -->
        <div class="mb-6 sticky top-16 z-30 bg-gray-50/80 dark:bg-gray-950/70 backdrop-blur pt-3 -mt-3">
          <div class="inline-flex rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-1 shadow-sm">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-2 rounded-lg text-sm font-medium transition"
              :class="activeTab === tab.id ? 'bg-orange-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- USERS -->
        <section v-if="activeTab === 'users'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">User Management</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Filter, sort and moderate users</p>
            </div>
            <div class="flex items-center gap-2">
              <div class="relative">
                <input v-model="userFilters.search" placeholder="Search users…" class="w-56 pl-8 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm"/>
                <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
              </div>
              <select v-model="userFilters.role" class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
                <option value="">All Roles</option>
                <option value="client">Clients</option>
                <option value="agent">Agents</option>
                <option value="admin">Admins</option>
              </select>
              <select v-model="userFilters.status" class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <button class="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm hover:bg-orange-700" @click="showAddUserModal = true">
                <span class="inline-flex items-center gap-2">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                  Add User
                </span>
              </button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
                <tr>
                  <th class="px-6 py-3 text-left font-medium">User</th>
                  <th class="px-6 py-3 text-left font-medium">Role</th>
                  <th class="px-6 py-3 text-left font-medium">Status</th>
                  <th class="px-6 py-3 text-left font-medium">Joined</th>
                  <th class="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in filteredUsers" :key="u.id" class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img :src="u.avatar" :alt="u.name" class="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-900"/>
                      <div>
                        <div class="font-medium text-gray-900 dark:text-gray-100">{{ u.name }}</div>
                        <div class="text-gray-500 dark:text-gray-400 text-xs">{{ u.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium capitalize" :class="getRoleClass(u.role)">{{ u.role }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium capitalize" :class="getStatusClass(u.status)">{{ u.status }}</span>
                  </td>
                  <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ formatDate(u.joinDate) }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" @click="editUser(u)">
                        <svg class="w-4 h-4 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                      </button>
                      <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" @click="toggleUserStatus(u)">
                        <svg v-if="u.status==='active'" class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                        <svg v-else class="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg>
                      </button>
                      <button class="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30" @click="deleteUser(u)">
                        <svg class="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!filteredUsers.length">
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No users match your filters.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- PROPERTIES -->
        <section v-else-if="activeTab === 'properties'" class="bg-transparent">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Property Management</h3>
            <div class="flex items-center gap-2">
              <select v-model="propertyFilters.status" class="px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending Approval</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
              <select v-model="propertyFilters.type" class="px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm">
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
              <div class="relative">
                <input v-model="propertyFilters.search" placeholder="Search properties…" class="w-56 pl-8 pr-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm"/>
                <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article v-for="p in filteredProperties" :key="p.id" class="group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition">
              <div class="relative">
                <img :src="p.image" :alt="p.title" class="w-full h-44 object-cover">
                <span :class="['absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium', getPropertyStatusClass(p.status)]">{{ p.status }}</span>
                <button class="absolute top-3 right-3 p-2 rounded-lg bg-white/90 dark:bg-gray-900/80 backdrop-blur hover:scale-105 transition">
                  <svg class="w-4 h-4 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between gap-3 mb-1">
                  <h4 class="font-semibold text-gray-900 dark:text-white truncate">{{ p.title }}</h4>
                  <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ formatCurrency(p.price) }}</div>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">{{ p.address }}</p>
                <div class="flex gap-2">
                  <button v-if="p.status==='pending'" @click="approveProperty(p)" class="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700">Approve</button>
                  <button @click="editProperty(p)" class="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Edit</button>
                </div>
              </div>
            </article>
          </div>
          <div v-if="!filteredProperties.length" class="text-center text-gray-500 dark:text-gray-400 py-16">No properties found.</div>
        </section>

        <!-- ANALYTICS -->
        <section v-else-if="activeTab === 'analytics'" class="space-y-6">
          <!-- Revenue Analytics -->
          <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <div class="flex items-start justify-between gap-4">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Revenue Analytics</h3>
              <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                • Live last 6 months
              </span>
            </div>
            <div class="mt-4">
              <div class="relative h-64">
                <div class="absolute inset-0 pointer-events-none">
                  <div class="h-full w-full [background:repeating-linear-gradient(to_top,transparent_0,transparent_23px,rgba(148,163,184,0.12)_24px)] dark:[background:repeating-linear-gradient(to_top,transparent_0,transparent_23px,rgba(100,116,139,0.18)_24px)] rounded-xl"></div>
                </div>
                <div class="relative h-full grid content-end">
                  <div class="flex items-end gap-3 h-56">
                    <div
                      v-for="(m,i) in revenueBars"
                      :key="i"
                      class="group relative flex-1 min-w-[10px]"
                    >
                      <div
                        class="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] px-2 py-0.5 rounded-md bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow"
                      >
                        {{ m }}%
                      </div>
                      <div
                        class="w-full rounded-t-lg bg-gradient-to-t from-orange-600 to-rose-500 shadow-[inset_0_-1px_0_rgba(255,255,255,.25)] transition-all duration-300"
                        :style="{ height: Math.max(0, Math.min(100, m)) + '%' }"
                        :aria-label="`Revenue bar ${last6Months[i]}: ${m}%`"
                        role="img"
                      ></div>
                    </div>
                  </div>
                  <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 grid grid-cols-6 gap-3">
                    <span
                      v-for="(l,i) in last6Months"
                      :key="i"
                      class="text-center truncate"
                    >
                      {{ l }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- User Growth + Property Performance -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- User Growth -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <div class="flex items-start justify-between">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">User Growth</h3>
                <span class="text-xs text-gray-500 dark:text-gray-400">Goal: 5k users</span>
              </div>
              <div class="mt-4 space-y-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-300">Progress</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ userGrowth }}%</span>
                </div>
                <div class="h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-orange-600 to-rose-500 transition-all"
                    :style="{ width: Math.max(0, Math.min(100, userGrowth)) + '%' }"
                    aria-label="User growth progress"
                    role="img"
                  ></div>
                </div>
                <div class="mt-2">
                  <svg viewBox="0 0 100 24" class="w-full h-10">
                    <polyline
                      :points="sparkPoints"
                      fill="url(#g)"
                      stroke="currentColor"
                      class="text-orange-600/70 dark:text-orange-400/80"
                      stroke-width="1.5"
                    />
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="currentColor" stop-opacity="0.18"/>
                        <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Property Performance -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Property Performance</h3>
              <ul class="space-y-3">
                <li
                  v-for="kpi in propertyKPIs"
                  :key="kpi.label"
                  class="flex items-center justify-between gap-4"
                >
                  <div class="min-w-0">
                    <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ kpi.label }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      v-if="kpi.trend"
                      :class="[
                        'px-1.5 py-0.5 rounded-md text-[11px] font-medium',
                        kpi.trend > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                       : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                      ]"
                      :aria-label="`Trend ${kpi.trend > 0 ? 'up' : 'down'} ${Math.abs(kpi.trend)}%`"
                    >
                      {{ kpi.trend > 0 ? '+' : '−' }}{{ Math.abs(kpi.trend) }}%
                    </span>
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ kpi.value }}</span>
                  </div>
                </li>
              </ul>
              <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
                KPIs based on last 30 days activity.
              </p>
            </div>
          </div>
        </section>

        <!-- SETTINGS -->
        <section v-else-if="activeTab === 'settings'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">System Settings</h3>
          </div>
          <div class="p-6 space-y-8">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">General</h4>
              <div class="space-y-4">
                <ToggleRow
                  label="User Registration"
                  hint="Allow new users to register"
                  v-model:checked="settings.userRegistration"/>
                <ToggleRow
                  label="Agent Approval Required"
                  hint="Require admin approval for new agents"
                  v-model:checked="settings.agentApproval"/>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Commissions</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Default Commission Rate (%)">
                  <input v-model.number="settings.defaultCommission" type="number" min="0" max="100" step="0.1" class="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"/>
                </FormField>
                <FormField label="Processing Fee (%)">
                  <input v-model.number="settings.processingFee" type="number" min="0" max="10" step="0.1" class="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"/>
                </FormField>
              </div>
            </div>
            <div class="pt-2">
              <button @click="saveSettings" class="px-5 py-2.5 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700">Save Settings</button>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- AI Assistant Chat -->
    <ChatAssistant
      ref="chatAssistantRef"
      :is-open="showAIAssistant"
      :on-toggle="() => showAIAssistant = !showAIAssistant"
      :user-name="user?.name || user?.email || 'Administrateur'"
      :user-id="user?._id || user?.id || 'admin'"
      class="fixed bottom-4 right-4 z-50"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuth } from '@/composables/useAuth'
import ChatAssistant from '@/components/ChatAssistant.vue'

/* ─────────────────────────────────────────────────────────────────────────── */
/* state                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */
const { user } = useAuth()
const isDark = ref(false)
const keyword = ref('')
const activeTab = ref('users')
const showAddUserModal = ref(false)
const showAIAssistant = ref(false)
const chatAssistantRef = ref(null)

const tabs = [
  { id: 'users', name: 'Users' },
  { id: 'properties', name: 'Properties' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'settings', name: 'Settings' }
]

const stats = ref({
  totalUsers: 1247,
  activeProperties: 89,
  pendingContracts: 23,
  monthlyRevenue: 125000
})

const userFilters = ref({ role: '', status: '', search: '' })
const propertyFilters = ref({ status: '', type: '', search: '' })
const settings = ref({ userRegistration: true, agentApproval: true, defaultCommission: 6.0, processingFee: 2.9 })

/* mock data */
const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'client', status: 'active', joinDate: '2024-01-15', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=f97316&color=fff' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'agent', status: 'active', joinDate: '2024-01-10', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=f97316&color=fff' },
  { id: 3, name: 'Mike Davis', email: 'mike@example.com', role: 'agent', status: 'pending', joinDate: '2024-01-20', avatar: 'https://ui-avatars.com/api/?name=Mike+Davis&background=f97316&color=fff' }
])

const properties = ref([
  { id: 1, title: 'House on the Hollywood', address: '374 Johnson Ave, Los Angeles, CA', price: 450000, status: 'active', type: 'house', image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg' },
  { id: 2, title: 'Modern Downtown Apartment', address: '123 Main St, Los Angeles, CA', price: 320000, status: 'pending', type: 'apartment', image: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg' }
])

/* ─────────────────────────────────────────────────────────────────────────── */
/* computed                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */
const filteredUsers = computed(() => {
  const q = userFilters.value.search.trim().toLowerCase()
  return users.value.filter(u => {
    if (userFilters.value.role && u.role !== userFilters.value.role) return false
    if (userFilters.value.status && u.status !== userFilters.value.status) return false
    if (q && !(`${u.name} ${u.email}`.toLowerCase().includes(q))) return false
    return true
  })
})

const filteredProperties = computed(() => {
  const q = propertyFilters.value.search.trim().toLowerCase()
  return properties.value.filter(p => {
    if (propertyFilters.value.status && p.status !== propertyFilters.value.status) return false
    if (propertyFilters.value.type && p.type !== propertyFilters.value.type) return false
    if (q && !p.title.toLowerCase().includes(q)) return false
    return true
  })
})

const last6Months = computed(() => {
  const arr = []
  const d = new Date()
  for (let i = 5; i >= 0; i--) {
    const nd = new Date(d.getFullYear(), d.getMonth() - i, 1)
    arr.push(nd.toLocaleString('en-US', { month: 'short' }))
  }
  return arr
})

const revenueBars = computed(() => [35, 52, 44, 60, 72, 80])

const userGrowth = computed(() => 62)

const sparkPoints = computed(() => {
  const points = []
  for (let i = 0; i <= 100; i += 5) {
    const y = 20 + Math.sin(i / 10) * 8
    points.push(`${i},${y}`)
  }
  return points.join(' ')
})

const propertyKPIs = computed(() => [
  { label: 'Avg. Time to Approval', value: '12h 30m' },
  { label: 'Conversion Rate', value: '8.6%' },
  { label: 'Avg. Price / m²', value: formatCurrency(2250) }
])

/* ─────────────────────────────────────────────────────────────────────────── */
/* methods                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const getRoleClass = (role) => ({
  client: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  agent: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
}[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300')

const getStatusClass = (status) => ({
  active: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  inactive: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
}[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300')

const getPropertyStatusClass = (status) => ({
  active: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  sold: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  rented: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
}[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300')

const formatDate = (s) => new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

const formatCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n || 0))

const editUser = (u) => console.log('Edit user', u.id)

const toggleUserStatus = (u) => u.status = (u.status === 'active' ? 'inactive' : 'active')

const deleteUser = (u) => { if (confirm(`Delete ${u.name}?`)) users.value = users.value.filter(x => x.id !== u.id) }

const approveProperty = (p) => p.status = 'active'

const editProperty = (p) => console.log('Edit property', p.id)

const saveSettings = () => {
  alert('Settings saved successfully!')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  const root = document.documentElement
  if (isDark.value) root.classList.add('dark'); else root.classList.remove('dark')
}

// Quick AI Query helper
const quickAIQuery = (query) => {
  showAIAssistant.value = true
  // Wait for component to mount, then trigger query
  setTimeout(() => {
    const chatInput = document.querySelector('[data-chat-input]')
    if (chatInput) {
      chatInput.value = query
      chatInput.dispatchEvent(new Event('input', { bubbles: true }))
      // Trigger send after a short delay
      setTimeout(() => {
        const sendButton = document.querySelector('[data-chat-send]')
        if (sendButton && !sendButton.disabled) {
          sendButton.click()
        }
      }, 100)
    }
  }, 500)
}

onMounted(() => {
  // init theme from system preference
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (isDark.value) document.documentElement.classList.add('dark')
})
</script>

<!-- lightweight shared UI bits -->
<script>
export default {
  components: {
    StatCard: {
      props: { title: String, value: [String, Number], delta: String },
      template: `
        <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <slot name="icon"/>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ title }}</p>
              <div class="flex items-end gap-2">
                <h4 class="text-2xl font-semibold text-gray-900 dark:text-white leading-7">{{ value }}</h4>
                <span class="text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" v-if="delta">{{ delta }}</span>
              </div>
              <div class="mt-3 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-orange-600 to-rose-500 rounded-full" :style="{ width: '70%' }"></div>
              </div>
            </div>
          </div>
        </div>
      `
    },
    ToggleRow: {
      props: { label: String, hint: String, checked: Boolean },
      emits: ['update:checked'],
      template: `
        <div class="flex items-center justify-between gap-4">
          <div>
            <label class="text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ hint }}</p>
          </div>
          <button @click="$emit('update:checked', !checked)" :class="['relative inline-flex h-6 w-11 items-center rounded-full transition', checked ? 'bg-orange-600' : 'bg-gray-300 dark:bg-gray-700']">
            <span :class="['inline-block h-5 w-5 transform rounded-full bg-white shadow transition', checked ? 'translate-x-5' : 'translate-x-1']"></span>
          </button>
        </div>
      `
    },
    FormField: {
      props: { label: String },
      template: `
        <label class="block">
          <span class="block text-sm mb-2 text-gray-700 dark:text-gray-300">{{ label }}</span>
          <slot />
        </label>
      `
    }
  }
}
</script>

<style scoped>
/***** optional: nicer scrollbars *****/
:global(html.dark) ::-webkit-scrollbar-thumb { background: #374151; border-radius: 999px; }
:global(html.dark) ::-webkit-scrollbar { width: 10px; height: 10px; }
</style>
