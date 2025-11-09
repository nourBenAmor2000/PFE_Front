<template>
  <section class="py-16 px-4 bg-[rgba(239,68,69,0.04)]">
    <div class="max-w-7xl mx-auto">
      <!-- En-tête -->
      <div class="text-center mb-12">
        <p class="inline-flex items-center gap-2 text-[var(--brand)] font-semibold tracking-wide uppercase text-xs">
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"></span>
          Nos services
        </p>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          Découvrez comment nous pouvons vous aider
        </h2>
        <p class="text-gray-600 text-lg mt-2">
          Aliquam lacinia diam quis lacus euismod
        </p>
      </div>

      <!-- Grille services -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div
          v-for="service in services"
          :key="service.id"
          class="group bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,.08)]"
        >
          <!-- Illustration / icône -->
          <div class="mb-6 flex justify-center">
            <div class="relative">
              <div class="absolute inset-0 blur-xl opacity-30 rounded-full"
                   :style="{ background: 'radial-gradient(ellipse at center, ' + brandSoft + ' 0%, transparent 70%)' }"/>
              <div class="relative h-24 w-24 rounded-2xl ring-1 ring-black/5 bg-white grid place-items-center shadow-[0_10px_25px_rgba(0,0,0,.06)]">
                <img :src="service.illustration" :alt="service.title"
                     class="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>
          </div>

          <!-- Titre -->
          <h3 class="text-xl font-semibold text-gray-900 mb-3 text-center">
            {{ service.title }}
          </h3>

          <!-- Description -->
          <p class="text-gray-600 leading-relaxed text-center mb-6">
            {{ service.description }}
          </p>

          <!-- Bouton -->
          <button
            :class="[
              'mx-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300',
              'ring-1 ring-black/5 shadow-[0_6px_20px_rgba(0,0,0,.06)]',
              service.buttonStyle === 'filled'
                ? 'bg-[var(--brand)] text-white hover:brightness-95'
                : 'bg-white text-[var(--brand)] border border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white'
            ]"
            @click="handleServiceClick(service)"
          >
            {{ service.buttonText }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Service {
  id: number
  title: string
  description: string
  buttonText: string
  buttonStyle: 'filled' | 'outlined'
  illustration: string
  action: string
}

onMounted(() => {
  // Assure l’accent global (même que les autres sections)
  if (!getComputedStyle(document.documentElement).getPropertyValue('--brand')) {
    document.documentElement.style.setProperty('--brand', '#EF4445')
  }
})

const brandSoft = ref('rgba(239,68,69,.25)') // halo doux sous l’illustration

const services: Service[] = [
  {
    id: 1,
    title: 'Acheter un bien',
    description: 'Trouvez rapidement la maison ou l’appartement idéal grâce à nos filtres avancés et notre accompagnement personnalisé.',
    buttonText: 'Trouver une maison',
    buttonStyle: 'outlined',
    illustration: './assets/images/icon1.png',
    action: 'buy'
  },
  {
    id: 2,
    title: 'Vendre un bien',
    description: 'Estimation précise, stratégie de mise en valeur et diffusion multi-plateformes pour vendre au meilleur prix.',
    buttonText: 'Déposer une annonce',
    buttonStyle: 'filled',
    illustration: './assets/images/icon2.png',
    action: 'sell'
  },
  {
    id: 3,
    title: 'Louer un bien',
    description: 'Accédez à des centaines d’offres vérifiées et réservez des visites en quelques clics.',
    buttonText: 'Chercher une location',
    buttonStyle: 'outlined',
    illustration: './assets/images/icon3.png',
    action: 'rent'
  }
]

const handleServiceClick = (service: Service) => {
  console.log(`[ui] service: ${service.action}`)
  // ex: router.push(`/${service.action}`)
}
</script>

<style scoped>
/* Petits affinages pour matcher le style global */
:where(button){ outline: none; }
</style>
