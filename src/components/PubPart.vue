<template>
  <section class="relative overflow-hidden py-16">
    <!-- Background gradient + subtle pattern -->
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--brand)] via-[#f25b57] to-[#ff896c]"
    />
    <div
      class="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px]"
    />
    <!-- Soft blobs -->
    <div class="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center rounded-2xl border border-white/20 bg-white/10 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,.15)] ring-1 ring-white/10 backdrop-blur-md"
      >
        <!-- Content -->
        <div class="text-white space-y-5">
          <p class="uppercase tracking-widest text-white/80 text-xs">Prêt à démarrer ?</p>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Commencez à publier ou acheter un bien avec Realton
          </h2>
          <p class="text-base sm:text-lg text-white/90 leading-relaxed">
            Échangez avec nos experts ou parcourez davantage d’annonces adaptées à vos besoins.
          </p>

          <div class="flex flex-wrap gap-3 pt-2">
            <button
              @click="handleGetStarted"
              class="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[var(--brand)] shadow-md ring-1 ring-white/60 transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Commencer
              <svg
                class="h-5 w-5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0-4 4m4-4H3"/>
              </svg>
            </button>

            <button
              @click="handleBrowse"
              class="group inline-flex items-center gap-2 rounded-xl bg-transparent px-6 py-3 font-semibold text-white ring-1 ring-white/60 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Parcourir les biens
              <svg
                class="h-5 w-5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0-4 4m4-4H3"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Illustration -->
        <div class="relative flex justify-center lg:justify-end">
          <div class="relative w-full max-w-lg">
            <div class="absolute -inset-4 -z-10 rounded-[28px] bg-white/10 blur-xl"></div>
            <div class="rounded-[28px] border border-white/30 bg-white/10 p-4 ring-1 ring-white/20 shadow-lg">
              <svg viewBox="0 0 500 300" class="w-full h-auto">
                <!-- Background buildings -->
                <rect x="400" y="80" width="60" height="180" fill="#8B5A8C" rx="4"/>
                <rect x="420" y="90" width="8" height="12" fill="#FFE4B5" rx="1"/>
                <rect x="432" y="90" width="8" height="12" fill="#FFE4B5" rx="1"/>
                <rect x="444" y="90" width="8" height="12" fill="#FFE4B5" rx="1"/>
                <rect x="420" y="110" width="8" height="12" fill="#FFE4B5" rx="1"/>
                <rect x="432" y="110" width="8" height="12" fill="#FFE4B5" rx="1"/>
                <rect x="444" y="110" width="8" height="12" fill="#FFE4B5" rx="1"/>

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

      <!-- Bottom helper text (optional) -->
      <p class="mt-5 text-center text-white/80 text-sm">
        Besoin d’aide ? <a href="#" class="font-semibold underline-offset-2 hover:underline">Parlez à un expert</a>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const handleGetStarted = () => {
  console.log('Get Started clicked')
}
const handleBrowse = () => {
  console.log('Browse clicked')
}
</script>

<style scoped>
:root { --brand: #EF4445; } /* même accent que le reste du site */
</style>
