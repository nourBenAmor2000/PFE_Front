<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Tableau de Bord Agent</h1>
            <p class="text-gray-600 mt-1">Gestion des logements, contrats et visites</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Agent:</span>
            <span class="font-medium text-gray-900">{{ user?.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Mes Logements</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.myProperties }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Contrats Actifs</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeContracts }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Visites ce Mois</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.monthlyVisits }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Commission ce Mois</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.monthlyCommission) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Tabs -->
      <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Properties Tab -->
          <div v-if="activeTab === 'properties'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Mes Logements</h2>
              <button 
                @click="showAddPropertyModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter un Logement
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="property in properties" :key="property.id" class="border border-gray-200 rounded-lg overflow-hidden">
                <img :src="property.image" :alt="property.title" class="w-full h-48 object-cover">
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 mb-2">{{ property.title }}</h3>
                  <p class="text-sm text-gray-600 mb-2">{{ property.address }}</p>
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-lg font-bold text-blue-600">{{ formatCurrency(property.price) }}/mois</span>
                    <span :class="getPropertyStatusClass(property.status)" class="px-2 py-1 text-xs rounded-full">
                      {{ property.status }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                      {{ property.rooms }} pièces • {{ property.surface }}m²
                    </div>
                    <div class="flex space-x-1">
                      <button 
                        @click="editProperty(property)"
                        class="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="deleteProperty(property.id)"
                        class="text-red-600 hover:text-red-800 p-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contracts Tab -->
          <div v-if="activeTab === 'contracts'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Mes Contrats</h2>
              <button 
                @click="showAddContractModal = true"
                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Nouveau Contrat
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logement</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="contract in contracts" :key="contract.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img :src="contract.clientAvatar" :alt="contract.clientName" class="w-8 h-8 rounded-full mr-3">
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ contract.clientName }}</div>
                          <div class="text-sm text-gray-500">{{ contract.clientEmail }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ contract.propertyTitle }}</div>
                      <div class="text-sm text-gray-500">{{ contract.propertyAddress }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatCurrency(contract.amount) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{{ formatDate(contract.startDate) }}</div>
                      <div class="text-gray-500">{{ formatDate(contract.endDate) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getContractStatusClass(contract.status)" class="px-2 py-1 text-xs rounded-full">
                        {{ contract.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        <button 
                          @click="editContract(contract)"
                          class="text-blue-600 hover:text-blue-800"
                        >
                          Modifier
                        </button>
                        <button 
                          @click="deleteContract(contract.id)"
                          class="text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Visits Tab -->
          <div v-if="activeTab === 'visits'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-semibold text-gray-900">Mes Visites</h2>
              <button 
                @click="showAddVisitModal = true"
                class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Programmer une Visite
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="visit in visits" :key="visit.id" class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="font-medium text-gray-900">{{ visit.propertyTitle }}</h3>
                      <span :class="getVisitStatusClass(visit.status)" class="px-2 py-1 text-xs rounded-full">
                        {{ visit.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{{ visit.propertyAddress }}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        {{ visit.clientName }}
                      </div>
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {{ formatDateTime(visit.dateTime) }}
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      @click="editVisit(visit)"
                      class="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2-2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deleteVisit(visit.id)"
                      class="text-red-600 hover:text-red-800 p-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'">
            <h2 class="text-lg font-semibold text-gray-900 mb-6">Mon Profil</h2>
            <div class="max-w-2xl">
              <form @submit.prevent="updateProfile">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    <input v-model="profile.name" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="profile.email" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input v-model="profile.phone" type="tel" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                    <input v-model="profile.specialty" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea v-model="profile.bio" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2"></textarea>
                  </div>
                </div>
                <div class="mt-6">
                  <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Mettre à jour le profil
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Property Modal -->
    <div v-if="showAddPropertyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Ajouter un Logement</h3>
        <form @submit.prevent="addProperty">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input v-model="newProperty.title" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input v-model="newProperty.address" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Prix (€/mois)</label>
              <input v-model="newProperty.price" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Surface (m²)</label>
              <input v-model="newProperty.surface" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de pièces</label>
              <input v-model="newProperty.rooms" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select v-model="newProperty.type" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                <option value="Appartement">Appartement</option>
                <option value="Maison">Maison</option>
                <option value="Studio">Studio</option>
                <option value="Loft">Loft</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="newProperty.description" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2"></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showAddPropertyModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Contract Modal -->
    <div v-if="showAddContractModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Nouveau Contrat</h3>
        <form @submit.prevent="addContract">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input v-model="newContract.clientName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Client</label>
              <input v-model="newContract.clientEmail" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Logement</label>
              <select v-model="newContract.propertyId" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                <option value="">Sélectionner un logement</option>
                <option v-for="property in properties" :key="property.id" :value="property.id">
                  {{ property.title }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Montant (€/mois)</label>
              <input v-model="newContract.amount" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input v-model="newContract.startDate" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input v-model="newContract.endDate" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showAddContractModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Visit Modal -->
    <div v-if="showAddVisitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Programmer une Visite</h3>
        <form @submit.prevent="addVisit">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input v-model="newVisit.clientName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Logement</label>
              <select v-model="newVisit.propertyId" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                <option value="">Sélectionner un logement</option>
                <option v-for="property in properties" :key="property.id" :value="property.id">
                  {{ property.title }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date et heure</label>
              <input v-model="newVisit.dateTime" type="datetime-local" class="w-full border border-gray-300 rounded-lg px-3 py-2" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea v-model="newVisit.notes" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2"></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showAddVisitModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Annuler
            </button>
            <button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Programmer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const { user, updateProfile: updateUserProfile } = useAuth()

// Reactive data
const activeTab = ref('properties')
const stats = ref({
  myProperties: 12,
  activeContracts: 8,
  monthlyVisits: 24,
  monthlyCommission: 3500
})

const tabs = [
  { id: 'properties', name: 'Logements' },
  { id: 'contracts', name: 'Contrats' },
  { id: 'visits', name: 'Visites' },
  { id: 'profile', name: 'Profil' }
]

const properties = ref([
  {
    id: 1,
    title: 'Appartement 3P - Marais',
    address: '15 Rue des Rosiers, 75004 Paris',
    price: 2500,
    surface: 75,
    rooms: 3,
    type: 'Appartement',
    status: 'Disponible',
    image: '/placeholder.svg?height=200&width=300'
  },
  {
    id: 2,
    title: 'Studio - Bastille',
    address: '8 Place de la Bastille, 75011 Paris',
    price: 1200,
    surface: 35,
    rooms: 1,
    type: 'Studio',
    status: 'Loué',
    image: '/placeholder.svg?height=200&width=300'
  }
])

const contracts = ref([
  {
    id: 1,
    clientName: 'Jean Dupont',
    clientEmail: 'jean.dupont@email.com',
    clientAvatar: 'https://ui-avatars.com/api/?name=Jean+Dupont&background=f97316&color=fff',
    propertyTitle: 'Studio - Bastille',
    propertyAddress: '8 Place de la Bastille, 75011 Paris',
    amount: 1200,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'Actif'
  }
])

const visits = ref([
  {
    id: 1,
    clientName: 'Marie Martin',
    propertyTitle: 'Appartement 3P - Marais',
    propertyAddress: '15 Rue des Rosiers, 75004 Paris',
    dateTime: new Date('2024-02-15T14:00:00'),
    status: 'Programmée',
    notes: 'Client intéressé par la luminosité'
  }
])

const profile = ref({
  name: user.value?.name || '',
  email: user.value?.email || '',
  phone: '+33 1 23 45 67 89',
  specialty: 'Immobilier résidentiel',
  bio: 'Agent immobilier spécialisé dans les biens de prestige à Paris.'
})

// Modal states
const showAddPropertyModal = ref(false)
const showAddContractModal = ref(false)
const showAddVisitModal = ref(false)

// Form data
const newProperty = ref({
  title: '',
  address: '',
  price: 0,
  surface: 0,
  rooms: 1,
  type: 'Appartement',
  description: ''
})

const newContract = ref({
  clientName: '',
  clientEmail: '',
  propertyId: '',
  amount: 0,
  startDate: '',
  endDate: ''
})

const newVisit = ref({
  clientName: '',
  propertyId: '',
  dateTime: '',
  notes: ''
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getPropertyStatusClass = (status) => {
  const classes = {
    'Disponible': 'bg-green-100 text-green-800',
    'Loué': 'bg-blue-100 text-blue-800',
    'En maintenance': 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getContractStatusClass = (status) => {
  const classes = {
    'Actif': 'bg-green-100 text-green-800',
    'Expiré': 'bg-red-100 text-red-800',
    'En attente': 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getVisitStatusClass = (status) => {
  const classes = {
    'Programmée': 'bg-blue-100 text-blue-800',
    'Terminée': 'bg-green-100 text-green-800',
    'Annulée': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const addProperty = () => {
  const property = {
    id: properties.value.length + 1,
    ...newProperty.value,
    status: 'Disponible',
    image: '/placeholder.svg?height=200&width=300'
  }
  properties.value.push(property)
  stats.value.myProperties++
  
  // Reset form
  newProperty.value = {
    title: '',
    address: '',
    price: 0,
    surface: 0,
    rooms: 1,
    type: 'Appartement',
    description: ''
  }
  showAddPropertyModal.value = false
}

const editProperty = (property) => {
  console.log('Edit property:', property)
}

const deleteProperty = (propertyId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce logement ?')) {
    properties.value = properties.value.filter(p => p.id !== propertyId)
    stats.value.myProperties--
  }
}

const addContract = () => {
  const selectedProperty = properties.value.find(p => p.id == newContract.value.propertyId)
  const contract = {
    id: contracts.value.length + 1,
    ...newContract.value,
    propertyTitle: selectedProperty?.title || '',
    propertyAddress: selectedProperty?.address || '',
    clientAvatar: `https://ui-avatars.com/api/?name=${newContract.value.clientName}&background=f97316&color=fff`,
    startDate: new Date(newContract.value.startDate),
    endDate: new Date(newContract.value.endDate),
    status: 'Actif'
  }
  contracts.value.push(contract)
  stats.value.activeContracts++
  
  // Reset form
  newContract.value = {
    clientName: '',
    clientEmail: '',
    propertyId: '',
    amount: 0,
    startDate: '',
    endDate: ''
  }
  showAddContractModal.value = false
}

const editContract = (contract) => {
  console.log('Edit contract:', contract)
}

const deleteContract = (contractId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
    contracts.value = contracts.value.filter(c => c.id !== contractId)
    stats.value.activeContracts--
  }
}

const addVisit = () => {
  const selectedProperty = properties.value.find(p => p.id == newVisit.value.propertyId)
  const visit = {
    id: visits.value.length + 1,
    ...newVisit.value,
    propertyTitle: selectedProperty?.title || '',
    propertyAddress: selectedProperty?.address || '',
    dateTime: new Date(newVisit.value.dateTime),
    status: 'Programmée'
  }
  visits.value.push(visit)
  stats.value.monthlyVisits++
  
  // Reset form
  newVisit.value = {
    clientName: '',
    propertyId: '',
    dateTime: '',
    notes: ''
  }
  showAddVisitModal.value = false
}

const editVisit = (visit) => {
  console.log('Edit visit:', visit)
}

const deleteVisit = (visitId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette visite ?')) {
    visits.value = visits.value.filter(v => v.id !== visitId)
    stats.value.monthlyVisits--
  }
}

const updateProfile = async () => {
  try {
    await updateUserProfile(profile.value)
    alert('Profil mis à jour avec succès!')
  } catch (error) {
    alert('Erreur lors de la mise à jour du profil')
  }
}

onMounted(() => {
  // Initialize profile with user data
  if (user.value) {
    profile.value.name = user.value.name
    profile.value.email = user.value.email
  }
})
</script>
