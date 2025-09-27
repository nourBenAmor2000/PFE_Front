<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-900">Add New Property</h1>
        <p class="text-gray-600">Fill in the details to list your property</p>
      </div>
    </div>

    <!-- Form -->
    <div class="container mx-auto px-4 py-8">
      <form @submit.prevent="handleSubmit" class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow p-6 space-y-8">
          <!-- Basic Information -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter property title"
                />
              </div>
              
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  id="type"
                  v-model="form.type"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                </select>
              </div>
              
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  id="status"
                  v-model="form.status"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select status</option>
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                </select>
              </div>
              
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <input
                  id="price"
                  v-model="form.price"
                  type="number"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter price"
                />
              </div>
            </div>
          </div>

          <!-- Location -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                <input
                  id="address"
                  v-model="form.address"
                  type="text"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter full address"
                />
              </div>
              
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  id="city"
                  v-model="form.city"
                  type="text"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label for="state" class="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  id="state"
                  v-model="form.state"
                  type="text"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter state"
                />
              </div>
            </div>
          </div>

          <!-- Property Details -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="beds" class="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <input
                  id="beds"
                  v-model="form.beds"
                  type="number"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Number of bedrooms"
                />
              </div>
              
              <div>
                <label for="baths" class="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input
                  id="baths"
                  v-model="form.baths"
                  type="number"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Number of bathrooms"
                />
              </div>
              
              <div>
                <label for="sqft" class="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                <input
                  id="sqft"
                  v-model="form.sqft"
                  type="number"
                  required
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Square footage"
                />
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <textarea
              v-model="form.description"
              rows="4"
              required
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Describe your property..."
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <router-link
              to="/dashboard"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Add Property
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  title: '',
  type: '',
  status: '',
  price: '',
  address: '',
  city: '',
  state: '',
  beds: '',
  baths: '',
  sqft: '',
  description: ''
})

const handleSubmit = () => {
  console.log('Property submission:', form.value)
  
  // Mock submission logic
  alert('Property added successfully!')
  
  // Redirect to dashboard
  router.push('/dashboard')
}
</script>
