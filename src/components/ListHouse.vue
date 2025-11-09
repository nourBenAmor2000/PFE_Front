<template>
  <div class="property-listings">
    <div class="swiper-container relative">
      <!-- Flèches externes (même style que l’exemple) -->
      <button class="prop-nav prop-prev" aria-label="Précédent">
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button class="prop-nav prop-next" aria-label="Suivant">
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      <swiper
        :slides-per-view="1"
        :space-between="20"
        :navigation="{ prevEl: '.prop-prev', nextEl: '.prop-next' }"
        :keyboard="{ enabled: true }"
        :breakpoints="{
          640:  { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 }
        }"
        :modules="modules"
        class="property-swiper"
      >
        <swiper-slide v-for="property in properties" :key="property.id">
          <div class="property-card">
            <!-- Image -->
            <div class="property-image">
              <img :src="property.image" :alt="property.title" />
              <div class="featured-badge" v-if="property.featured">À&nbsp;LA&nbsp;UNE</div>
              <div class="price-tag">
                {{ property.price.toLocaleString() }}&nbsp;DT
              </div>
            </div>
            <!-- Détails -->
            <div class="property-details">
              <h3 class="property-title">{{ property.title }}</h3>
              <p class="property-address">{{ property.address }}</p>

              <!-- Caractéristiques -->
              <div class="property-features">
                <div class="feature">
                  <span class="feature-value">{{ property.beds }}</span>
                  <span class="feature-label">Chambres</span>
                </div>
                <div class="feature">
                  <span class="feature-value">{{ property.baths }}</span>
                  <span class="feature-label">Salles de bain</span>
                </div>
                <div class="feature">
                  <span class="feature-value">{{ property.sqft }}</span>
                  <span class="feature-label">m²</span>
                </div>
              </div>

              <!-- Pied de carte -->
              <div class="property-footer">
                <span class="property-status">
                  {{ property.status === 'For Rent' ? 'À louer' : 'À vendre' }}
                </span>
                <div class="property-actions">
                  <button class="action-btn" @click="toggleFavorite(property.id)" aria-label="Ajouter aux favoris">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </button>
                  <button class="action-btn" @click="shareProperty(property.id)" aria-label="Partager l’annonce">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Keyboard } from 'swiper/modules' // ⬅️ flèches + clavier
import 'swiper/css'
import 'swiper/css/navigation'

// Accent (capture)
onMounted(() => {
  document.documentElement.style.setProperty('--brand', '#EF4445') // orange/rouge
})

// Modules
const modules = [Navigation, Keyboard]

interface Property {
  id: number
  title: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  status: string
  featured: boolean
  image: string
}

const properties = ref<Property[]>([
  { id: 1, title: "House on the Hollywood", address: "374 Johnson Ave", price: 4600, beds: 6, baths: 2, sqft: 200, status: "For Sale", featured: true,  image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" },
  { id: 2, title: "Comfortable Villa Green", address: "178 Broadway, Brooklyn", price: 5800, beds: 9, baths: 3, sqft: 600, status: "For Sale", featured: true,  image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" },
  { id: 3, title: "Quality House For Sale", address: "873 Bedford Ave", price: 2500, beds: 10, baths: 2, sqft: 500, status: "For Sale", featured: true, image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" },
  { id: 4, title: "Luxury Downtown Apartment", address: "456 Park Avenue, Manhattan", price: 7200, beds: 3, baths: 2, sqft: 1200, status: "For Rent", featured: false, image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" },
  { id: 5, title: "Cozy Family Home", address: "789 Maple Street, Queens", price: 3400, beds: 4, baths: 3, sqft: 1800, status: "For Sale", featured: true, image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" },
  { id: 6, title: "Modern Penthouse Suite", address: "321 Fifth Avenue, Manhattan", price: 12000, beds: 5, baths: 4, sqft: 2500, status: "For Rent", featured: true, image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" },
  { id: 7, title: "Charming Cottage", address: "654 Oak Lane, Staten Island", price: 2800, beds: 2, baths: 1, sqft: 900, status: "For Sale", featured: false, image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" },
  { id: 8, title: "Waterfront Mansion", address: "987 Harbor View, Brooklyn", price: 15000, beds: 8, baths: 6, sqft: 4000, status: "For Sale", featured: true, image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" }
])

const toggleFavorite = (propertyId: number) => {
  console.log(`Toggled favorite for property ${propertyId}`)
}
const shareProperty = (propertyId: number) => {
  console.log(`Shared property ${propertyId}`)
}
</script>

<style scoped>
.property-listings { @apply py-16 px-4; }
.swiper-container  { @apply mt-12; }
.property-swiper   { @apply pb-12; }

/* Cartes */
.property-card {
  @apply bg-white overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-all duration-300;
}
.property-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,.08); }

.property-image { @apply relative; }
.property-image img { @apply w-full h-64 object-cover; }

.featured-badge {
  background: linear-gradient(135deg, var(--brand), #ff7b7b);
  @apply absolute top-4 left-4 text-white px-3 py-1 rounded-full text-[12px] font-semibold shadow;
}
.price-tag {
  @apply absolute bottom-4 left-4 bg-white/95 text-gray-900 px-3 py-2 rounded-lg font-bold text-lg shadow-md ring-1 ring-black/5;
}

.property-details { @apply p-6; }
.property-title   { @apply text-[18px] font-semibold text-gray-900 mb-1; }
.property-address { @apply text-gray-600 mb-4 text-sm; }

.property-features { @apply flex items-center gap-6 mb-4 pb-4 border-b border-gray-200; }
.feature           { @apply flex items-center gap-1; }
.feature-value     { @apply font-semibold text-gray-900; }
.feature-label     { @apply text-gray-500 text-sm; }

.property-footer  { @apply flex items-center justify-between; }
.property-status  { @apply font-medium text-gray-700; }

.action-btn {
  @apply p-2 text-gray-500 hover:text-[var(--brand)] transition-colors duration-200 rounded-md hover:bg-gray-50;
}

/* ===== Flèches externes (même style que l’exemple) ===== */
.prop-nav{
  @apply absolute top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center
         h-10 w-10 rounded-full bg-white text-[var(--brand)]
         shadow-[0_8px_24px_rgba(0,0,0,.15)] ring-1 ring-black/5
         transition hover:bg-white/95 hover:scale-105;
}
.prop-prev{ left: -6px; }
.prop-next{ right: -6px; }

@media (min-width: 768px){
  .prop-prev{ left: -12px; }
  .prop-next{ right: -12px; }
}

/* On supprime d’éventuels bullets si Swiper les ajoute ailleurs */
:deep(.swiper-pagination){ display:none !important; }
</style>
