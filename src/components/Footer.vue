<template>
  <!-- Fusion compacte & pro : palette conservée, visuel carte discret, grille 3 colonnes -->
  <footer class="relative text-gray-200">
    <!-- Fond dégradé discret (reprend ton style) -->
    <div aria-hidden="true" class="absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_100%_0%,#193242_0%,#0f1f26_60%,#0b171d_100%)]" />
    <!-- Texture carte du monde très légère -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] bg-no-repeat bg-right-top bg-contain"
         :style="worldMapStyle" />

    <!-- Hairline top -->
    <div class="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-40" />

    <!-- Corps (espaces serrés) -->
    <div class="mx-auto max-w-[1200px] px-6 lg:px-8 py-9">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- Col 1 : Marque / sociaux / contacts -->
        <section class="lg:col-span-4">
          <div class="flex items-center gap-3">
            <img src="/assets/images/logo.png" alt="Homez Immobilier" class="h-9 w-auto" />
            <span class="text-base font-semibold tracking-tight text-white">Homez Immobilier</span>
          </div>
          <p class="mt-2 text-[13px] leading-6 text-gray-400 max-w-md">
            Réseau d’agences et d’experts immobiliers. Estimation, conseils et accompagnement partout en Tunisie.
          </p>

          <!-- Sociaux compacts -->
          <nav class="mt-4 flex items-center gap-2" aria-label="Réseaux sociaux">
            <Social icon="facebook" label="Facebook" />
            <Social icon="instagram" label="Instagram" />
            <Social icon="linkedin" label="LinkedIn" />
          </nav>

          <!-- Contacts -->
          <dl class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 text-[13px]">
            <div class="flex items-center gap-2 text-gray-300">
              <Icon name="phone" class="h-4 w-4 opacity-80" />
              <a href="tel:+21670123456" class="hover:text-white">+216 70 123 456</a>
            </div>
            <div class="flex items-center gap-2 text-gray-300">
              <Icon name="mail" class="h-4 w-4 opacity-80" />
              <a href="mailto:contact@homez.tn" class="hover:text-white">contact@homez.tn</a>
            </div>
          </dl>
        </section>

        <!-- Col 2 : Liens agence + siège (compact) -->
        <section class="lg:col-span-4 grid grid-cols-2 gap-6">
          <div>
            <h3 class="flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-gray-400">
              <Icon name="menu" class="h-4 w-4" /> Agence
            </h3>
            <ul class="mt-2.5 space-y-1.5 text-[14px]">
              <li v-for="l in agencyLinks" :key="l.text">
                <a :href="l.href" class="group inline-flex items-center gap-2 text-gray-300 hover:text-white">
                  <span class="h-[3px] w-[3px] rounded-full bg-white/40 group-hover:bg-white" />
                  <span>{{ l.text }}</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-gray-400">
              <Icon name="pin" class="h-4 w-4" /> Siège national
            </h3>
            <address class="not-italic mt-2.5 text-[14px] leading-6">
              <a href="https://homeZ.tn" target="_blank" class="text-white font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white">homeZ.tn</a>
              <div class="text-gray-400">72 Av. Mouaouia Ibn Abi Sofiane, El Menzah 7, Ariana 2037</div>
              <div class="text-gray-400">Tél : +216 70 000 000</div>
            </address>
          </div>
        </section>

        <!-- Col 3 : Monde / Affiliés -->
        <section class="lg:col-span-4">
          <h3 class="flex items-center gap-2 text-[11px] uppercase tracking-[.18em] text-gray-400">
            <Icon name="globe" class="h-4 w-4" /> homeZ dans le monde
          </h3>
          <div class="mt-2.5 flex flex-wrap gap-1.5">
            <span v-for="c in countries" :key="c" class="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-200 hover:bg-white/10">{{ c }}</span>
          </div>
          <RouterLink to="#" class="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-white/10 hover:border-white/30">
            Zone Affiliés
            <Icon name="arrow" class="h-4 w-4" />
          </RouterLink>
        </section>
      </div>
    </div>

    <!-- Barre basse (resserrée) -->
    <div class="border-t border-white/10">
      <div class="mx-auto max-w-[1200px] px-6 lg:px-8 py-3 flex flex-col items-center justify-between gap-2 md:flex-row">
        <p class="text-[12px] leading-relaxed text-gray-400 text-center md:text-left">
          © {{ year }} “Siege Master Franchise Tunisie” HOMEZ Real Estate – 72, Avenue Mouaouia Ibn Abi Sofiane, El Menzah 7, Ariana 2037 Tunis
        </p>
        <nav class="flex items-center gap-4 text-[12px]" aria-label="Liens légaux">
          <a href="#" class="text-gray-400 hover:text-white">Données Personnelles</a>
          <a href="#" class="text-gray-400 hover:text-white">Cookies</a>
          <a href="#" class="text-gray-400 hover:text-white">Mentions légales</a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const agencyLinks = [
  { text: 'Qui sommes-nous ?', href: '#' },
  { text: 'Nos points forts', href: '#' },
  { text: 'Dans le monde', href: '#' },
  { text: 'Travaillez avec nous', href: '#' },
]

const countries = [ 'Italie','Espagne','Hongrie','Mexique','Pologne','France','Allemagne','Tunisie','Thaïlande','Saint-Marin' ]

// Optionnel : texture carte du monde
const worldMapUrl = '/assets/images/world-map.svg'
const worldMapStyle = computed(() => worldMapUrl ? { backgroundImage: `url('${worldMapUrl}')` } : {})

const year = new Date().getFullYear()
</script>

<script lang="ts">
import { defineComponent, h } from 'vue'

const paths: Record<string, string> = {
  facebook: 'M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.01 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.93 8.44-9.94Z',
  instagram: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5Zm5 3.5A5.5 5.5 0 116.5 13 5.51 5.51 0 0112 7.5Zm5.75-2.5a1 1 0 11-1 1 1 1 0 011-1Z',
  linkedin: 'M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5ZM3 8.98h4v12.02H3V8.98Zm6 0h3.84v1.64h.05c.53-1 1.83-2.06 3.76-2.06 4.02 0 4.76 2.65 4.76 6.1v6.34h-4V15.4c0-1.44-.03-3.3-2.01-3.3-2.01 0-2.32 1.57-2.32 3.19v5.71H9V8.98Z',
  phone: 'M3 5a2 2 0 012-2h3l2 5-2 1a11 11 0 005 5l1-2 5 2v3a2 2 0 01-2 2h-1C9.163 19 5 14.837 5 9V8a2 2 0 00-2-2z',
  mail: 'M3 8l9 6 9-6M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  pin: 'M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0zM12 14a3 3 0 100-6 3 3 0 000 6z',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20m0 0c2.5 2.5 2.5 15.5 0 18m0-18C9.5 6.5 4 9 4 12s5.5 5.5 8 8m0-18c2.5 3.5 8 6 8 10s-5.5 6.5-8 10',
  arrow: 'M9 5l7 7-7 7'
}

export default defineComponent({
  name: 'FooterProCompact',
  components: {
    Icon: defineComponent({
      name: 'Icon', props: { name: { type: String, required: true }, class: { type: String, default: '' } },
      setup(props) { return () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', class: props.class }, [ h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: paths[props.name] || '' }) ]) }
    }),
    Social: defineComponent({
      name: 'Social', props: { icon: { type: String, required: true }, label: { type: String, required: true } },
      setup(props) { return () => h('a', { href: '#', class: 'inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-gray-200 hover:text-white hover:bg-white/10', 'aria-label': props.label }, [ h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', class: 'h-4 w-4', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [ h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: paths[props.icon] || '' }) ]) ]) }
    })
  }
})
</script>

<style scoped>
footer{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
</style>
