<template>
  <section class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-red-400 py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <!-- Content Section -->
        <div class="text-white space-y-6">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Start Listing Or Buying A Property With Realton
          </h2>
          <p class="text-lg sm:text-xl text-white/90 leading-relaxed">
            Talk to our experts or Browse through more properties
          </p>
          <button 
            @click="handleGetStarted"
            class="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 group"
          >
            Get Started
            <svg 
              class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        <!-- Illustration Section -->
        <div class="relative flex justify-center lg:justify-end">
          <div class="relative w-full max-w-lg">
            <!-- Buildings Illustration -->
            <svg viewBox="0 0 500 300" class="w-full h-auto">
              <!-- Background buildings -->
              <rect x="400" y="80" width="60" height="180" fill="#8B5A8C" rx="4"/>
              <rect x="420" y="90" width="8" height="12" fill="#FFE4B5" rx="1"/>
              <rect x="432" y="90" width="8" height="12" fill="#FFE4B5" rx="1"/>
              <rect x="444" y="90" width="8" height="12" fill="#FFE4B5" rx="1"/>
              <rect x="420" y="110" width="8" height="12" fill="#FFE4B5" rx="1"/>
              <rect x="432" y="110" width="8" height="12" fill="#FFE4B5" rx="1"/>
              <rect x="444" y="110" width="8" height="12" fill="#FFE4B5" rx="1"/>
              
              <!-- Main buildings -->
              <!-- Building 1 -->
              <rect x="50" y="120" width="80" height="140" fill="#9B7EBD" rx="6"/>
              <polygon points="50,120 90,80 130,120" fill="#6B5B95"/>
              <rect x="65" y="140" width="12" height="16" fill="#FFE4B5" rx="2"/>
              <rect x="85" y="140" width="12" height="16" fill="#FFE4B5" rx="2"/>
              <rect x="105" y="140" width="12" height="16" fill="#FFE4B5" rx="2"/>
              <rect x="65" y="170" width="12" height="16" fill="#FFE4B5" rx="2"/>
              <rect x="85" y="170" width="12" height="16" fill="#FFE4B5" rx="2"/>
              <rect x="105" y="170" width="12" height="16" fill="#FFE4B5" rx="2"/>
              
              <!-- Building 2 -->
              <rect x="140" y="100" width="90" height="160" fill="#D4A574" rx="6"/>
              <polygon points="140,100 185,60 230,100" fill="#B8956A"/>
              <rect x="155" y="120" width="14" height="18" fill="#FFE4B5" rx="2"/>
              <rect x="175" y="120" width="14" height="18" fill="#FFE4B5" rx="2"/>
              <rect x="195" y="120" width="14" height="18" fill="#FFE4B5" rx="2"/>
              <rect x="155" y="150" width="14" height="18" fill="#FFE4B5" rx="2"/>
              <rect x="175" y="150" width="14" height="18" fill="#FFE4B5" rx="2"/>
              <rect x="195" y="150" width="14" height="18" fill="#FFE4B5" rx="2"/>
              
              <!-- Building 3 -->
              <rect x="240" y="110" width="85" height="150" fill="#E67E22" rx="6"/>
              <polygon points="240,110 282.5,70 325,110" fill="#D35400"/>
              <rect x="255" y="130" width="13" height="17" fill="#FFE4B5" rx="2"/>
              <rect x="275" y="130" width="13" height="17" fill="#FFE4B5" rx="2"/>
              <rect x="295" y="130" width="13" height="17" fill="#FFE4B5" rx="2"/>
              <rect x="255" y="160" width="13" height="17" fill="#FFE4B5" rx="2"/>
              <rect x="275" y="160" width="13" height="17" fill="#FFE4B5" rx="2"/>
              <rect x="295" y="160" width="13" height="17" fill="#FFE4B5" rx="2"/>
              
              <!-- Building 4 -->
              <rect x="335" y="90" width="75" height="170" fill="#8E44AD" rx="6"/>
              <polygon points="335,90 372.5,50 410,90" fill="#7D3C98"/>
              <rect x="350" y="110" width="12" height="16" fill="#FFE4B5" rx="2"/>
              <rect x="370" y="110" width="12" height="16" fill="#FFE4B5" rx="2"/>
              <rect x="390" y="110" width="12" height="16" fill="#FFE4B5" rx="2"/>
              <rect x="350" y="140" width="12" height="16" fill="#FFE4B5" rx="2"/>
              <rect x="370" y="140" width="12" height="16" fill="#FFE4B5" rx="2"/>
              <rect x="390" y="140" width="12" height="16" fill="#FFE4B5" rx="2"/>
              
              <!-- Trees -->
              <ellipse cx="30" cy="240" rx="15" ry="25" fill="#95A5A6"/>
              <circle cx="30" cy="220" r="20" fill="#2ECC71"/>
              
              <ellipse cx="480" cy="240" rx="12" ry="20" fill="#95A5A6"/>
              <circle cx="480" cy="225" r="15" fill="#27AE60"/>
              
              <ellipse cx="180" cy="250" rx="10" ry="15" fill="#95A5A6"/>
              <circle cx="180" cy="240" r="12" fill="#2ECC71"/>
              
              <ellipse cx="300" cy="250" rx="8" ry="12" fill="#95A5A6"/>
              <circle cx="300" cy="242" r="10" fill="#27AE60"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const handleGetStarted = () => {
  // Handle navigation or action
  console.log('Get Started clicked')
}
</script>
