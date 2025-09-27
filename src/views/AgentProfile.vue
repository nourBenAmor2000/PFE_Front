<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Profile Header -->
    <div class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Agent Profile</h1>
            <p class="text-gray-600">Manage your professional information</p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="editMode = !editMode"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {{ editMode ? 'Cancel' : 'Edit Profile' }}
            </button>
            <button
              v-if="editMode"
              @click="saveProfile"
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Info -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Profile Photo -->
              <div class="md:col-span-2 flex items-center space-x-6">
                <img :src="profile.photo" :alt="profile.name" class="w-24 h-24 rounded-full object-cover" />
                <div v-if="editMode">
                  <button class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Change Photo
                  </button>
                </div>
              </div>
              
              <!-- Name Fields -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  v-model="profile.firstName"
                  :disabled="!editMode"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  v-model="profile.lastName"
                  :disabled="!editMode"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                />
              </div>
              
              <!-- Contact Info -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="profile.email"
                  :disabled="!editMode"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  v-model="profile.phone"
                  :disabled="!editMode"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                />
              </div>
              
              <!-- Professional Info -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                <input
                  v-model="profile.licenseNumber"
                  :disabled="!editMode"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  v-model="profile.experience"
                  :disabled="!editMode"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                />
              </div>
              
              <!-- Agency -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Agency</label>
                <select
                  v-model="profile.agencyId"
                  :disabled="!editMode"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                >
                  <option value="">Independent Agent</option>
                  <option value="1">Premium Real Estate Group</option>
                  <option value="2">Golden Gate Properties</option>
                  <option value="3">Empire State Realty</option>
                </select>
              </div>
              
              <!-- Bio -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                <textarea
                  v-model="profile.bio"
                  :disabled="!editMode"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50"
                  placeholder="Tell clients about your experience and expertise..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Specialties -->
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Specialties</h2>
            
            <div v-if="editMode" class="mb-4">
              <div class="flex space-x-2">
                <input
                  v-model="newSpecialty"
                  type="text"
                  placeholder="Add a specialty..."
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  @keyup.enter="addSpecialty"
                />
                <button
                  @click="addSpecialty"
                  class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(specialty, index) in profile.specialties"
                :key="index"
                class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium flex items-center"
              >
                {{ specialty }}
                <button
                  v-if="editMode"
                  @click="removeSpecialty(index)"
                  class="ml-2 text-orange-500 hover:text-orange-700"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Performance Stats -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Performance Statistics</h2>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900">{{ profile.stats.propertiesSold }}</div>
                <div class="text-sm text-gray-600">Properties Sold</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900">{{ profile.stats.activeListings }}</div>
                <div class="text-sm text-gray-600">Active Listings</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900">{{ profile.stats.avgSalePrice }}K</div>
                <div class="text-sm text-gray-600">Avg Sale Price</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900">{{ profile.stats.clientRating }}</div>
                <div class="text-sm text-gray-600">Client Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Profile Completion -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
            <div class="mb-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Progress</span>
                <span class="font-medium">{{ profileCompletion }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  class="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: profileCompletion + '%' }"
                ></div>
              </div>
            </div>
            <p class="text-sm text-gray-600">Complete your profile to attract more clients</p>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <router-link
                to="/add-property"
                class="block w-full text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add New Property
              </router-link>
              <router-link
                to="/dashboard"
                class="block w-full text-center border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Dashboard
              </router-link>
              <button class="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Generate Business Card
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
                <div class="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-gray-900">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const editMode = ref(false)
const newSpecialty = ref('')

const profile = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  licenseNumber: 'RE123456789',
  experience: 8,
  agencyId: '1',
  bio: 'Experienced real estate professional with a passion for helping clients find their dream homes. Specializing in luxury properties and first-time buyer assistance.',
  photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
  specialties: ['Luxury Homes', 'First-Time Buyers', 'Investment Properties'],
  stats: {
    propertiesSold: 127,
    activeListings: 15,
    avgSalePrice: 650,
    clientRating: 4.9
  }
})

const recentActivity = ref([
  { id: 1, description: 'New property listing added', time: '2 hours ago' },
  { id: 2, description: 'Client meeting scheduled', time: '1 day ago' },
  { id: 3, description: 'Property sold successfully', time: '3 days ago' },
  { id: 4, description: 'Profile updated', time: '1 week ago' }
])

const profileCompletion = computed(() => {
  const fields = [
    profile.value.firstName,
    profile.value.lastName,
    profile.value.email,
    profile.value.phone,
    profile.value.licenseNumber,
    profile.value.bio,
    profile.value.specialties.length > 0
  ]
  
  const completedFields = fields.filter(field => field && field !== '').length
  return Math.round((completedFields / fields.length) * 100)
})

const addSpecialty = () => {
  if (newSpecialty.value.trim() && !profile.value.specialties.includes(newSpecialty.value.trim())) {
    profile.value.specialties.push(newSpecialty.value.trim())
    newSpecialty.value = ''
  }
}

const removeSpecialty = (index) => {
  profile.value.specialties.splice(index, 1)
}

const saveProfile = () => {
  // Mock save logic
  console.log('Saving profile:', profile.value)
  editMode.value = false
  // Show success message
  alert('Profile updated successfully!')
}
</script>
