<template>
  <!-- HERO pleine hauteur avec image géante à droite -->
  <section class="relative min-h-[86vh] lg:min-h-[88vh] bg-gray-950 overflow-hidden">
    <!-- Image géante ancrée à droite -->
    <div class="absolute inset-y-0 right-0 w-full lg:w-[60%]">
      <img :src="currentImage" :alt="`Modern house ${currentImageIndex + 1}`" class="h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-l from-gray-950/60 via-gray-950/30 to-transparent"></div>

      <!-- Pagination images -->
      <div class="absolute bottom-6 left-1/2 lg:left-auto lg:right-10 -translate-x-1/2 lg:translate-x-0 flex gap-2">
        <button
          v-for="(image, i) in images"
          :key="i"
          @click="currentImageIndex = i"
          :class="['h-2.5 w-5 rounded-full transition-all', currentImageIndex === i ? 'bg-white' : 'bg-white/50']"
          :aria-label="`show image ${i+1}`"
        />
      </div>
    </div>

    <!-- Colonne gauche (contenu) -->
    <div class="relative z-10 container mx-auto px-4">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[86vh] lg:min-h-[88vh]">
        <div class="lg:col-span-6 xl:col-span-5 py-16 lg:py-0">
          <h1 class="text-white text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
            <span class="font-light text-gray-200">Votre Futur Commence À Cette Adresse</span>
          </h1>
          <p class="text-white/80 mt-3 text-lg">Partout en Tunisie.</p>

          <!-- Onglets Vente / Location -->
          <div class="mt-8">
            <div class="flex gap-8 text-white/80 text-sm font-semibold tracking-wide">
              <button class="relative pb-2" :class="tab==='sale' && 'text-white'" @click="tab='sale'">
                VENTE
                <span v-if="tab==='sale'" class="absolute left-0 -bottom-[2px] h-[3px] w-full bg-white rounded-full" />
              </button>
              <button class="relative pb-2" :class="tab==='rent' && 'text-white'" @click="tab='rent'">
                LOCATION
                <span v-if="tab==='rent'" class="absolute left-0 -bottom-[2px] h-[3px] w-full bg-white rounded-full" />
              </button>
            </div>
          </div>

          <!-- Barre de recherche -->
         <!-- …dans ton <template> (barre de recherche) -->
<form class="mt-6 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl p-2.5 pl-3 flex items-center gap-2"
      @submit.prevent="goSearch">

  <!-- icône -->
  <div class="h-11 w-11 rounded-full bg-gray-100 grid place-items-center shrink-0">
    <svg class="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10.5L12 3l9 7.5M4.5 10.5V21h15V10.5"/>
    </svg>
  </div>

  <!-- Champs (plus clairs) -->
<div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 px-1">
  <!-- VILLE -->
  <div
    class="relative rounded-xl bg-gray-100/80 border border-gray-200 focus-within:ring-2 focus-within:ring-[var(--brand,#0ea5e9)] focus-within:border-transparent transition"
  >
    <!-- Label flottant -->
    <span class="pointer-events-none absolute left-3 top-1.5 text-[11px] uppercase tracking-wider text-gray-500">
      Ville
    </span>

    <!-- Select -->
    <select
      v-model="city"
      class="h-12 w-full bg-transparent pl-3 pr-10 pt-4 text-sm text-gray-900 rounded-xl appearance-none outline-none"
      aria-label="Ville"
    >
      <option value="" disabled>Choisir une ville</option>
      <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
    </select>

    <!-- Caret -->
    <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
         viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clip-rule="evenodd"/>
    </svg>
  </div>

  <!-- MUNICIPALITÉ (dépend de la ville) -->
  <div
    class="relative rounded-xl bg-gray-100/80 border border-gray-200 focus-within:ring-2 focus-within:ring-[var(--brand,#0ea5e9)] focus-within:border-transparent transition"
    :class="!city ? 'opacity-60' : ''"
  >
    <span class="pointer-events-none absolute left-3 top-1.5 text-[11px] uppercase tracking-wider text-gray-500">
      Municipalité
    </span>

    <select
      v-model="municipality"
      :disabled="!city"
      class="h-12 w-full bg-transparent pl-3 pr-10 pt-4 text-sm text-gray-900 rounded-xl appearance-none outline-none disabled:cursor-not-allowed"
      aria-label="Municipalité"
    >
      <option value="" disabled>Choisir une municipalité</option>
      <option v-for="m in municipalityOptions" :key="m" :value="m">{{ m }}</option>
    </select>

    <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
         viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clip-rule="evenodd"/>
    </svg>

    
  </div>
</div>


  <!-- bouton rechercher -->
  <button type="submit"
          class="h-11 w-11 rounded-full bg-gray-900 text-white grid place-items-center hover:bg-gray-800 transition-colors shrink-0"
          title="Rechercher">
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z"/>
    </svg>
  </button>
</form>


          <!-- Stats -->
          <div class="mt-10 grid grid-cols-3 gap-6">
            <div v-for="s in stats" :key="s.label" class="text-center lg:text-left">
              <div class="text-3xl lg:text-4xl font-bold text-white">{{ s.value }}</div>
              <div class="text-white/70 text-sm">{{ s.label }}</div>
            </div>
          </div>
        </div>

        <!-- Colonne fantôme -->
        <div class="hidden lg:block lg:col-span-6 xl:col-span-7"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// …dans <script setup lang="ts">


// Ville & municipalité
const city = ref('')
const municipality = ref('')

// Villes supportées
const cities = [
  'Tunis','Sfax','Sousse','Bizerte','Nabeul','Monastir','Mahdia','Ariana','Ben Arous','Manouba'
]

// Dictionnaire municipalités par ville (ajoute/édite librement)
const muniByCity: Record<string, string[]> = {
  'Tunis': [
    'La Marsa','Carthage','Sidi Bou Saïd','Le Kram','La Goulette','Le Bardo',
    'Cité El Khadra','El Menzah','El Omrane','Ettahrir','Sidi Hassine'
  ],
  'Sfax': ['Sfax Ville','Sakiet Ezzit','Sakiet Eddaier','Gremda','Chihia','Thyna'],
  'Sousse': ['Sousse Riadh','Sousse Jawhara','Akouda','Hammam Sousse','Msaken','Kalaa Kebira','Kalaa Sghira'],
  'Bizerte': ['Bizerte Nord','Bizerte Sud','Menzel Bourguiba','Menzel Jemil','Menzel Abderrahmen','Zarzouna'],
  'Nabeul': ['Nabeul','Hammamet','Dar Chaabane','Béni Khiar','Korba','Menzel Temime','Kelibia'],
  'Monastir': ['Monastir','Sahline','Ksar Hlel','Jemmal','Moknine','Bekalta'],
  'Mahdia': ['Mahdia','Ksour Essef','Chebba','El Jem','Bou Merdes'],
  'Ariana': ['Ariana Ville','La Soukra','Raoued','Kalaat El Andalous','Sidi Thabet'],
  'Ben Arous': ['Ben Arous','Ezzahra','Rades','Mourouj','Hammam Lif','Hammam Chott','Megrine'],
  'Manouba': ['Manouba','Douar Hicher','Oued Ellil','Den Den','Jedaida','Mornaguia']
}

// Options filtrées pour le deuxième select
const municipalityOptions = computed(() => muniByCity[city.value] ?? [])

// Réinitialiser la municipalité si la ville change


const router = useRouter()

/** Onglet actif : sale | rent */
const tab = ref<'sale' | 'rent'>('sale')
const q = ref('')
const region = ref('')

const regions = ['Grand Tunis', 'Cap Bon', 'Sousse', 'Monastir', 'Mahdia', 'Bizerte']

const stats = [
  { value: '154',  label: 'Awards' },
  { value: '6K+',  label: 'Clients satisfaits' },
  { value: '558+', label: 'Biens publiés' }
]

/** Slider images */
const images = [
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
  'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg',
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'
]
const currentImageIndex = ref(0)
const currentImage = computed(() => images[currentImageIndex.value])

/** Redirection statique vers /properties */
function goSearch () {
  router.push({
    path: '/properties',
    query: {
      type: tab.value === 'rent' ? 'for-rent' : 'for-sale',
      region: region.value || undefined,
      q: q.value || undefined
    }
  })
}

let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  timer = setInterval(() => { currentImageIndex.value = (currentImageIndex.value + 1) % images.length }, 4000)
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.container { max-width: 1200px; }
</style>
