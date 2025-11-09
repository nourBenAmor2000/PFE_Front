<template>
  <section class="team-members-section py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Swiper Container -->
      <div class="swiper team-swiper relative">

        <!-- Custom arrows (même style que villes/régions) -->
        <button class="team-nav team-prev" aria-label="Précédent">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button class="team-nav team-next" aria-label="Suivant">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <div class="swiper-wrapper">
          <div
            v-for="member in teamMembers"
            :key="member.id"
            class="swiper-slide"
          >
            <article class="team-card group cursor-pointer rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <!-- Photo -->
              <div class="member-photo-container relative overflow-hidden rounded-t-2xl">
                <img
                  :src="member.photo"
                  :alt="member.name"
                  class="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <!-- léger gradient pour la lisibilité -->
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                <!-- mini overlay réseaux (exemple) -->
                <div class="absolute bottom-3 right-3 hidden gap-2 group-hover:flex">
                  <button class="icon-chip" aria-label="Contacter">
                    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l9 6 9-6-9-6-9 6zm0 0v8l9 6 9-6V8"/>
                    </svg>
                  </button>
                  <button class="icon-chip" aria-label="Voir profil">
                    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Infos -->
              <div class="member-info text-center p-5">
                <h3 class="member-name text-lg font-semibold text-gray-900">
                  {{ member.name }}
                </h3>
                <p class="member-role mt-0.5 text-sm text-gray-600">
                  {{ member.role }}
                </p>
              </div>
            </article>
          </div>
        </div>

        <!-- Pagination -->
        <div class="swiper-pagination mt-8"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface TeamMember {
  id: number
  name: string
  role: string
  photo: string
}

const teamMembers = ref<TeamMember[]>([
  { id: 1, name: 'Ralph Johnson',  role: 'Manager',             photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
  { id: 2, name: 'Lori Ramos',     role: 'Marketing',           photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
  { id: 3, name: 'Jack Graham',    role: 'Marketing',           photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
  { id: 4, name: 'Augusta Silva',  role: 'Leader Homez',        photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
  { id: 5, name: 'Albert Flores',  role: 'Marketing',           photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
  { id: 6, name: 'Sarah Mitchell', role: 'Sales Director',      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
  { id: 7, name: 'Michael Chen',   role: 'Property Specialist', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' },
  { id: 8, name: 'Emma Rodriguez', role: 'Customer Relations',  photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' }
])

let swiper: any = null

onMounted(async () => {
  // couleur d’accent globale (même que le reste)
  document.documentElement.style.setProperty('--brand', '#EF4445')

  const { Swiper } = await import('swiper')
  const { Navigation, Pagination, Autoplay, Keyboard } = await import('swiper/modules')

  swiper = new Swiper('.team-swiper', {
    modules: [Navigation, Pagination, Autoplay, Keyboard],
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    keyboard: { enabled: true },
    navigation: {
      prevEl: '.team-prev',
      nextEl: '.team-next'
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    breakpoints: {
      640:  { slidesPerView: 2, spaceBetween: 20 },
      768:  { slidesPerView: 3, spaceBetween: 24 },
      1024: { slidesPerView: 4, spaceBetween: 24 },
      1280: { slidesPerView: 5, spaceBetween: 24 }
    }
  })
})

onUnmounted(() => {
  if (swiper) swiper.destroy(true, true)
})

const handleMemberClick = (member: TeamMember) => {
  console.log('Member clicked:', member.name)
}
</script>

<style scoped>
.team-members-section { position: relative; }

/* Card */
.team-card { overflow: hidden; }

/* Photo */
.member-photo-container { background: #f8f9fa; }

/* Mini actions overlay */
.icon-chip {
  @apply inline-flex items-center justify-center h-8 w-8 rounded-full bg-white text-[var(--brand)]
         shadow-[0_8px_24px_rgba(0,0,0,.15)] ring-1 ring-black/5 transition hover:bg-white/95;
}

/* Arrows — cohérents avec la section Villes/Régions */
.team-nav {
  @apply absolute top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center
         h-10 w-10 rounded-full bg-white text-[var(--brand)]
         shadow-[0_8px_24px_rgba(0,0,0,.15)] ring-1 ring-black/5
         transition hover:bg-white/95 hover:scale-105;
}
.team-prev { left: -6px; }
.team-next { right: -6px; }
@media (min-width: 768px) {
  .team-prev { left: -12px; }
  .team-next { right: -12px; }
}

/* Pagination bullets premium (halo brand) */
:deep(.swiper-pagination) { position: relative; margin-top: 2rem; }
:deep(.swiper-pagination-bullet) {
  width: 8px; height: 8px;
  background: rgba(0,0,0,.28);
  opacity: .6;
  margin: 0 5px !important;
  transition: all .2s ease;
  box-shadow: 0 0 0 0 rgba(239,68,69,0);
}
:deep(.swiper-pagination-bullet-active) {
  background: var(--brand);
  opacity: 1;
  box-shadow: 0 0 0 4px rgba(239,68,69,.12);
  transform: translateY(-1px);
}

/* Text */
.member-name { font-weight: 600; color: #111827; }
.member-role { color: #6B7280; font-size: 14px; }

/* Mobile card width */
@media (max-width: 640px) {
  .team-card { margin: 0 auto; max-width: 300px; }
}
</style>
