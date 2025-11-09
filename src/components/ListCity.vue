<template>
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4">
      <!-- Tabs (pills) -->
      <div class="flex gap-2 overflow-x-auto no-scrollbar">
        <button
          v-for="t in tabs"
          :key="t.key"
          @click="activeTab = t.key"
          class="rounded-2xl px-5 py-2 text-sm font-medium shadow-sm transition-colors"
          :class="activeTab === t.key
            ? 'bg-white text-[var(--ink-strong)] ring-1 ring-black/5'
            : 'bg-white/70 text-[var(--ink)] hover:bg-white'"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- Swiper + custom arrows -->
      <div class="mt-6 relative">
        <!-- Left / Right arrows -->
        <button class="city-nav city-prev" aria-label="Précédent">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button class="city-nav city-next" aria-label="Suivant">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <Swiper
          class="city-swiper"
          :modules="modules"
          :slides-per-view="1"
          :space-between="18"
          :navigation="{ prevEl: '.city-prev', nextEl: '.city-next' }"
          :keyboard="{ enabled: true }"
          :breakpoints="{
            640:  { slidesPerView: 2, spaceBetween: 20 },
            860:  { slidesPerView: 3, spaceBetween: 22 },
            1200: { slidesPerView: 4, spaceBetween: 24 },
            1536: { slidesPerView: 5, spaceBetween: 26 }
          }"
        >
          <SwiperSlide
            v-for="city in visibleItems"
            :key="city.id"
          >
            <article class="group relative h-[360px] overflow-hidden rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,.08)] ring-1 ring-black/5">
              <!-- Image -->
              <img
                :src="city.mapImage"
                :alt="city.name"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />

              <!-- Overlay gradient (bottom) -->
              <div
                class="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
                style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 35%, rgba(0,0,0,.65) 100%);"
              />

              <!-- Content -->
              <div class="absolute inset-x-0 bottom-0 p-6">
                <h3 class="text-white text-[28px] font-semibold drop-shadow-sm">
                  {{ city.name }}
                </h3>
                <p class="mt-1 text-white/90 text-sm">
                  {{ city.propertyCount }} {{ city.propertyCount === 1 ? 'propriété' : 'propriétés' }}
                </p>

                <button
                  class="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-[var(--brand)]
                         shadow-[0_6px_20px_rgba(0,0,0,.18)] ring-1 ring-black/5 transition-colors hover:bg-white/95"
                  @click="navigateToCity(city.id)"
                >
                  En savoir plus
                </button>
              </div>
            </article>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation, Keyboard } from 'swiper/modules' // + Navigation, Keyboard
import 'swiper/css'
import 'swiper/css/navigation'

/** Couleurs (capture) */
onMounted(() => {
  document.documentElement.style.setProperty('--brand', '#EF4445')   // orange/rouge
  document.documentElement.style.setProperty('--ink', '#476072')
  document.documentElement.style.setProperty('--ink-strong', '#2A3B46')
})

const modules = [Navigation, Keyboard] // plus besoin de Pagination

type City = { id: number; name: string; propertyCount: number; mapImage: string }
type Region = { id: number; name: string; propertyCount: number; mapImage: string }

const tabs = [
  { key: 'cities',  label: 'Principales Villes Tunisiennes' },
  { key: 'regions', label: 'Régions Tunisiennes' }
]
const activeTab = ref<'cities' | 'regions'>('cities')

const cities = ref<City[]>([
  { id: 1, name: 'Tunis',      propertyCount: 28, mapImage: 'https://images.pexels.com/photos/221436/pexels-photo-221436.jpeg' },
  { id: 2, name: 'Hammamet',   propertyCount: 16, mapImage: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg' },
  { id: 3, name: 'Sousse',     propertyCount: 22, mapImage: 'https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg' },
  { id: 4, name: 'Monastir',   propertyCount: 12, mapImage: 'https://images.pexels.com/photos/417054/pexels-photo-417054.jpeg' },
  { id: 5, name: 'Mahdia',     propertyCount: 9,  mapImage: 'https://images.pexels.com/photos/240665/pexels-photo-240665.jpeg' },
  { id: 6, name: 'Nabeul',     propertyCount: 7,  mapImage: 'https://images.pexels.com/photos/221471/pexels-photo-221471.jpeg' }
])

const regions = ref<Region[]>([
  { id: 101, name: 'Grand Tunis',  propertyCount: 44, mapImage: 'https://images.pexels.com/photos/132071/pexels-photo-132071.jpeg' },
  { id: 102, name: 'Sahel',        propertyCount: 35, mapImage: 'https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg' },
  { id: 103, name: 'Cap Bon',      propertyCount: 19, mapImage: 'https://images.pexels.com/photos/274144/pexels-photo-274144.jpeg' },
  { id: 104, name: 'Nord-Est',     propertyCount: 12, mapImage: 'https://images.pexels.com/photos/210205/pexels-photo-210205.jpeg' },
  { id: 105, name: 'Centre',       propertyCount: 10, mapImage: 'https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg' }
])

const visibleItems = computed(() => activeTab.value === 'cities' ? cities.value : regions.value)

function navigateToCity(id: number) {
  console.log('Navigate to item', id)
}
</script>

<style scoped>
/* Arrows style */
.city-nav {
  @apply absolute top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center
         h-10 w-10 rounded-full bg-white text-[var(--brand)]
         shadow-[0_8px_24px_rgba(0,0,0,.15)] ring-1 ring-black/5
         transition hover:bg-white/95 hover:scale-105;
}
.city-prev { left: -6px; }     /* en dehors du flux pour respirer */
.city-next { right: -6px; }

@media (min-width: 768px) {
  .city-prev { left: -12px; }
  .city-next { right: -12px; }
}

/* Cache scrollbar horizontale onglets */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
