<template>
  <!-- HERO pleine hauteur avec image géante à droite -->
  <section class="relative min-h-[86vh] lg:min-h-[88vh] bg-gray-950 overflow-hidden">
    

    <!-- Image géante ancrée à droite -->
    <div
      class="absolute inset-y-0 right-0 w-full lg:w-[60%]"
    >
      <img
        :src="currentImage"
        :alt="`Modern house ${currentImageIndex + 1}`"
        class="h-full w-full object-cover"
      />
      <!-- léger voile pour lisibilité -->
      <div class="absolute inset-0 bg-gradient-to-l from-gray-950/60 via-gray-950/30 to-transparent"></div>

      <!-- points de pagination -->
      <div class="absolute bottom-6 left-1/2 lg:left-auto lg:right-10 -translate-x-1/2 lg:translate-x-0 flex gap-2">
        <button
          v-for="(image, index) in images"
          :key="index"
          @click="currentImageIndex = index"
          :class="[
            'h-2.5 w-5 rounded-full transition-all',
            currentImageIndex === index ? 'bg-white' : 'bg-white/50'
          ]"
          :aria-label="`show image ${index+1}`"
        />
      </div>
    </div>

    <!-- Colonne gauche (contenu) -->
    <div class="relative z-10 container mx-auto px-4">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[86vh] lg:min-h-[88vh]">
        <div class="lg:col-span-6 xl:col-span-5 py-16 lg:py-0">
          <!-- Logo (optionnel) -->
          <!-- <img src="/logo.svg" class="h-8 mb-8 opacity-90" alt=""> -->

          <h1 class="text-white text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
            <span class="font-light text-gray-200">Votre Futur Commence A Cette Adresse</span><br />
            <!-- <span class="font-extrabold">commence à cette adresse</span> -->
          </h1>

          <p class="text-white/80 mt-3 text-lg">Partout en Tunisie.</p>

          <!-- Onglets Vente / Location -->
          <div class="mt-8">
            <div class="flex gap-8 text-white/80 text-sm font-semibold tracking-wide">
              <button
                class="relative pb-2"
                :class="activeTab==='For Sale' ? 'text-white' : ''"
                @click="activeTab='For Sale'"
              >
                VENTE
                <span
                  v-if="activeTab==='For Sale'"
                  class="absolute left-0 -bottom-[2px] h-[3px] w-full bg-white rounded-full"
                />
              </button>
              <button
                class="relative pb-2"
                :class="activeTab==='For Rent' ? 'text-white' : ''"
                @click="activeTab='For Rent'"
              >
                LOCATION
                <span
                  v-if="activeTab==='For Rent'"
                  class="absolute left-0 -bottom-[2px] h-[3px] w-full bg-white rounded-full"
                />
              </button>
            </div>
          </div>

          <!-- Barre de recherche pilule -->
          <form
            class="mt-6 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl p-2.5 pl-3 flex items-center gap-2"
            @submit.prevent="handleSearch"
          >
            <!-- icône pilule -->
            <div class="h-11 w-11 rounded-full bg-gray-100 grid place-items-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10.5L12 3l9 7.5M4.5 10.5V21h15V10.5" />
              </svg>
            </div>

            <!-- champs -->
            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 px-1">
              <div class="flex items-center">
                <select
                  v-model="region"
                  class="w-full bg-transparent px-3 py-2.5 rounded-lg border border-transparent focus:border-gray-300 focus:outline-none"
                >
                  <option value="" disabled>Sélectionner une région</option>
                  <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>
              <div class="flex items-center">
                <input
                  v-model="searchKeyword"
                  type="text"
                  placeholder="Municipalités"
                  class="w-full bg-transparent px-3 py-2.5 rounded-lg border border-transparent focus:border-gray-300 focus:outline-none"
                />
              </div>
            </div>

            <!-- bouton rechercher -->
            <button
              type="submit"
              class="h-11 w-11 rounded-full bg-gray-900 text-white grid place-items-center hover:bg-gray-800 transition-colors shrink-0"
              title="Rechercher"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </form>

          <!-- Stats -->
          <div class="mt-10 grid grid-cols-3 gap-6">
            <div v-for="stat in stats" :key="stat.label" class="text-center lg:text-left">
              <div class="text-3xl lg:text-4xl font-bold text-white">{{ stat.value }}</div>
              <div class="text-white/70 text-sm">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- colonne fantôme pour équilibrer la grille sur grands écrans -->
        <div class="hidden lg:block lg:col-span-6 xl:col-span-7"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const activeTab = ref<'All' | 'For Sale' | 'For Rent'>('For Sale')
const searchKeyword = ref('')
const region = ref('')

const regions = ['Grand Tunis', 'Cap Bon', 'Sousse', 'Monastir', 'Mahdia', 'Bizerte']

const stats = [
  { value: '154',  label: 'Awards' },
  { value: '6K+',  label: 'Clients satisfaits' },
  { value: '558+', label: 'Biens publiés' }
]

// images plein écran (droite)
const images = [
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
  'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg',
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'
]

const currentImageIndex = ref(0)
const currentImage = computed(() => images[currentImageIndex.value])

function handleSearch () {
  console.log('Search:', { type: activeTab.value, region: region.value, keyword: searchKeyword.value })
  // ex: router push -> /properties?type=...&region=...&q=...
}

let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  timer = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length
  }, 4000)
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
/* corrige l’alias container Tailwind si nécessaire */
.container { max-width: 1200px; }
</style>
