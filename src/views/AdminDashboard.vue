<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Admin Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Welcome, {{ user?.name }}</span>
            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ user?.name?.charAt(0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.totalUsers }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Properties</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.activeProperties }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pending Contracts</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.pendingContracts }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                <dd class="text-lg font-medium text-gray-900">${{ stats.monthlyRevenue.toLocaleString() }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <!-- Users Management -->
        <div v-if="activeTab === 'users'" class="bg-white rounded-lg shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">User Management</h3>
              <button
                @click="showAddUserModal = true"
                class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                Add User
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <!-- User Filters -->
            <div class="flex flex-wrap gap-4 mb-6">
              <select
                v-model="userFilters.role"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Roles</option>
                <option value="client">Clients</option>
                <option value="agent">Agents</option>
                <option value="admin">Admins</option>
              </select>
              
              <select
                v-model="userFilters.status"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              
              <input
                v-model="userFilters.search"
                type="text"
                placeholder="Search users..."
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <!-- Users Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in filteredUsers" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img :src="user.avatar" :alt="user.name" class="w-10 h-10 rounded-full" />
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                          <div class="text-sm text-gray-500">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium rounded-full capitalize" :class="getRoleClass(user.role)">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium rounded-full capitalize" :class="getStatusClass(user.status)">
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.joinDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button @click="editUser(user)" class="text-orange-600 hover:text-orange-900">Edit</button>
                      <button @click="toggleUserStatus(user)" class="text-blue-600 hover:text-blue-900">
                        {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
                      </button>
                      <button @click="deleteUser(user)" class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Properties Management -->
        <div v-if="activeTab === 'properties'" class="bg-white rounded-lg shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Property Management</h3>
          </div>
          
          <div class="p-6">
            <!-- Property Filters -->
            <div class="flex flex-wrap gap-4 mb-6">
              <select
                v-model="propertyFilters.status"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending Approval</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
              
              <select
                v-model="propertyFilters.type"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
              
              <input
                v-model="propertyFilters.search"
                type="text"
                placeholder="Search properties..."
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <!-- Properties Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="property in filteredProperties"
                :key="property.id"
                class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <img :src="property.image" :alt="property.title" class="w-full h-48 object-cover" />
                <div class="p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-gray-900 truncate">{{ property.title }}</h4>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getPropertyStatusClass(property.status)">
                      {{ property.status }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ property.address }}</p>
                  <p class="text-lg font-semibold text-gray-900 mb-3">${{ property.price.toLocaleString() }}</p>
                  
                  <div class="flex space-x-2">
                    <button
                      v-if="property.status === 'pending'"
                      @click="approveProperty(property)"
                      class="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      @click="editProperty(property)"
                      class="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics -->
        <div v-if="activeTab === 'analytics'" class="space-y-6">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Analytics</h3>
            <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p class="text-gray-500">Revenue Chart Placeholder</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
              <div class="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p class="text-gray-500">User Growth Chart Placeholder</p>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Property Performance</h3>
              <div class="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p class="text-gray-500">Property Chart Placeholder</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div v-if="activeTab === 'settings'" class="bg-white rounded-lg shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">System Settings</h3>
          </div>
          
          <div class="p-6 space-y-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-3">General Settings</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">User Registration</label>
                    <p class="text-sm text-gray-500">Allow new users to register</p>
                  </div>
                  <button
                    @click="toggleSetting('userRegistration')"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                      settings.userRegistration ? 'bg-orange-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        settings.userRegistration ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    />
                  </button>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Agent Approval Required</label>
                    <p class="text-sm text-gray-500">Require admin approval for new agents</p>
                  </div>
                  <button
                    @click="toggleSetting('agentApproval')"
                    :class="[
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                      settings.agentApproval ? 'bg-orange-600' : 'bg-gray-200'
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        settings.agentApproval ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    />
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Commission Settings</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Default Commission Rate (%)</label>
                  <input
                    v-model.number="settings.defaultCommission"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Processing Fee (%)</label>
                  <input
                    v-model.number="settings.processingFee"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
            
            <div class="pt-4">
              <button
                @click="saveSettings"
                class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

const activeTab = ref('users')
const showAddUserModal = ref(false)

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

const userFilters = ref({
  role: '',
  status: '',
  search: ''
})

const propertyFilters = ref({
  status: '',
  type: '',
  search: ''
})

const settings = ref({
  userRegistration: true,
  agentApproval: true,
  defaultCommission: 6.0,
  processingFee: 2.9
})

// Mock data
const users = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'client',
    status: 'active',
    joinDate: '2024-01-15',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=f97316&color=fff'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'agent',
    status: 'active',
    joinDate: '2024-01-10',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=f97316&color=fff'
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike@example.com',
    role: 'agent',
    status: 'pending',
    joinDate: '2024-01-20',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Davis&background=f97316&color=fff'
  }
])

const properties = ref([
  {
    id: 1,
    title: 'House on the Hollywood',
    address: '374 Johnson Ave, Los Angeles, CA',
    price: 450000,
    status: 'active',
    type: 'house',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
  },
  {
    id: 2,
    title: 'Modern Downtown Apartment',
    address: '123 Main St, Los Angeles, CA',
    price: 320000,
    status: 'pending',
    type: 'apartment',
    image: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg'
  }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    if (userFilters.value.role && user.role !== userFilters.value.role) return false
    if (userFilters.value.status && user.status !== userFilters.value.status) return false
    if (userFilters.value.search && !user.name.toLowerCase().includes(userFilters.value.search.toLowerCase()) && !user.email.toLowerCase().includes(userFilters.value.search.toLowerCase())) return false
    return true
  })
})

const filteredProperties = computed(() => {
  return properties.value.filter(property => {
    if (propertyFilters.value.status && property.status !== propertyFilters.value.status) return false
    if (propertyFilters.value.type && property.type !== propertyFilters.value.type) return false
    if (propertyFilters.value.search && !property.title.toLowerCase().includes(propertyFilters.value.search.toLowerCase())) return false
    return true
  })
})

const getRoleClass = (role) => {
  const classes = {
    client: 'bg-blue-100 text-blue-800',
    agent: 'bg-green-100 text-green-800',
    admin: 'bg-purple-100 text-purple-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPropertyStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-blue-100 text-blue-800',
    rented: 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const editUser = (user) => {
  console.log('Edit user:', user.id)
}

const toggleUserStatus = (user) => {
  user.status = user.status === 'active' ? 'inactive' : 'active'
}

const deleteUser = (user) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
  }
}

const approveProperty = (property) => {
  property.status = 'active'
}

const editProperty = (property) => {
  console.log('Edit property:', property.id)
}

const toggleSetting = (setting) => {
  settings.value[setting] = !settings.value[setting]
}

const saveSettings = () => {
  console.log('Settings saved:', settings.value)
  alert('Settings saved successfully!')
}

onMounted(() => {
  // Load initial data
})
</script>
