<template>
  <section class="py-16 px-4 bg-rose-50">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          See How Realtor Can Help
        </h2>
        <p class="text-gray-600 text-lg">
          Aliquam lacinia diam quis lacus euismod
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="service in services" 
          :key="service.id"
          class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <!-- Service Illustration -->
          <div class="mb-6 flex justify-center">
            <img 
              :src="service.illustration" 
              :alt="service.title"
              class="w-48 h-32 object-contain"
            />
          </div>

          <!-- Service Title -->
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            {{ service.title }}
          </h3>

          <!-- Service Description -->
          <p class="text-gray-600 mb-6 leading-relaxed">
            {{ service.description }}
          </p>

          <!-- Service Button -->
          <button 
            :class="[
              'px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 mx-auto',
              service.buttonStyle === 'filled' 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
            ]"
            @click="handleServiceClick(service)"
          >
            {{ service.buttonText }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Service {
  id: number
  title: string
  description: string
  buttonText: string
  buttonStyle: 'filled' | 'outlined'
  illustration: string
  action: string
}

const services: Service[] = [
  {
    id: 1,
    title: 'Buy a property',
    description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
    buttonText: 'Find a home',
    buttonStyle: 'outlined',
    illustration: './assets/images/icon1.png',
    action: 'buy'
  },
  {
    id: 2,
    title: 'Sell a property',
    description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
    buttonText: 'Place an ad',
    buttonStyle: 'filled',
    illustration: './assets/images/icon2.png',
    action: 'sell'
  },
  {
    id: 3,
    title: 'Rent a property',
    description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
    buttonText: 'Find a rental',
    buttonStyle: 'outlined',
    illustration: './assets/images/icon3.png',
    action: 'rent'
  }
]

const handleServiceClick = (service: Service) => {
  console.log(`[v0] Service clicked: ${service.action}`)
  // Add your navigation logic here
  // Example: router.push(`/${service.action}`)
}
</script>
