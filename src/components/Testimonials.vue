<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Testimonial {
  id: number
  name: string
  title: string
  content: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Agent immobilier",
    content:
      "La plateforme a rendu la recherche de ma maison de rêve incroyablement simple. Les filtres et les fiches détaillées m’ont aidée à décider rapidement.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Investisseur",
    content:
      "Service remarquable et annonces complètes. Les insights marché et outils d’analytique sont précieux pour mes décisions d’investissement.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 3,
    name: "Ali Tufan",
    title: "Product Manager",
    content:
      "Excellente expérience ! Les ateliers et masterclass étaient très utiles. Je recommande vivement pour les jeunes designers.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    title: "Acheteuse pour la première fois",
    content:
      "L’équipe m’a guidée à chaque étape pour mon premier achat. Leur expertise a transformé un parcours stressant en moment enthousiasmant.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 5,
    name: "David Thompson",
    title: "Promoteur",
    content:
      "Parfait pour mettre en valeur mes biens. Les visites virtuelles et descriptions détaillées aident les acheteurs à saisir la valeur immédiatement.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  }
]

const activeTestimonial = ref(2) // 0-based : Ali Tufan par défaut

const setActiveTestimonial = (index: number) => {
  activeTestimonial.value = index
}
const getCurrentTestimonial = () => testimonials[activeTestimonial.value]

// Navigation (flèches)
const prev = () => {
  activeTestimonial.value =
    (activeTestimonial.value - 1 + testimonials.length) % testimonials.length
}
const next = () => {
  activeTestimonial.value =
    (activeTestimonial.value + 1) % testimonials.length
}

onMounted(() => {
  // Assure l’accent global cohérent
  if (!getComputedStyle(document.documentElement).getPropertyValue('--brand')) {
    document.documentElement.style.setProperty('--brand', '#EF4445')
  }
})
</script>

<template>
  <section class="py-16 bg-[rgba(239,68,69,0.04)]">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="text-center mb-12">
        <p class="inline-flex items-center gap-2 text-[var(--brand)] font-semibold tracking-wide uppercase text-xs">
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"></span>
          Avis clients
        </p>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          Ce que disent nos utilisateurs
        </h2>
        <p class="text-gray-600 text-lg mt-2">
          Aliquam lacinia diam quis lacus euismod
        </p>
      </div>

      <!-- Carte Témoignage -->
      <div
        class="relative mx-auto max-w-4xl rounded-2xl bg-white p-8 md:p-12 border border-gray-200 shadow-sm
               ring-1 ring-black/5"
      >
        <!-- Guillemet décoratif -->
        <div class="mb-6 flex justify-center">
          <svg class="w-12 h-12 text-[var(--brand)]/20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"
            />
          </svg>
        </div>

        <!-- Texte + Auteur -->
        <div class="text-center">
          <p class="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium">
            {{ getCurrentTestimonial().content }}
          </p>

          <div class="mt-6 space-y-1">
            <h4 class="text-lg font-semibold text-gray-900">
              {{ getCurrentTestimonial().name }}
            </h4>
            <p class="text-gray-600">
              {{ getCurrentTestimonial().title }}
            </p>
          </div>
        </div>

        <!-- Flèches navigation -->
        <button
          class="nav-btn left-3 md:-left-5"
          aria-label="Précédent"
          type="button"
          @click="prev"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button
          class="nav-btn right-3 md:-right-5"
          aria-label="Suivant"
          type="button"
          @click="next"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- Avatars (sélecteurs) -->
      <div class="mt-8 flex justify-center items-center gap-3 flex-wrap">
        <button
          v-for="(t, index) in testimonials"
          :key="t.id"
          type="button"
          @click="setActiveTestimonial(index)"
          class="relative transition-all duration-300 ease-in-out hover:scale-105 focus-visible:outline-none"
          :class="activeTestimonial === index ? 'scale-105' : 'opacity-70 hover:opacity-100'"
          :aria-pressed="activeTestimonial === index"
          :aria-label="`Afficher l’avis de ${t.name}`"
        >
          <!-- Halo brand -->
          <span
            class="absolute -inset-1 rounded-full"
            :style="activeTestimonial === index
              ? 'box-shadow: 0 0 0 3px var(--brand), 0 0 0 8px rgba(239,68,69,.12);'
              : 'box-shadow: none;'"
            aria-hidden="true"
          />
          <img
            :src="t.avatar"
            :alt="t.name"
            class="relative w-14 h-14 rounded-full object-cover ring-1 ring-black/5 bg-white"
          />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nav-btn{
  @apply absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center
         h-10 w-10 rounded-full bg-white text-[var(--brand)]
         shadow-[0_8px_24px_rgba(0,0,0,.15)] ring-1 ring-black/5
         transition hover:bg-white/95 hover:scale-105;
}
</style>
