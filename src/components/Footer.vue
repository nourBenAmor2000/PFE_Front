<template>
  <footer class="bg-[#0b1a13] text-white">
    <!-- Main -->
    <div class="container mx-auto px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <!-- Brand & Contact -->
        <div class="lg:col-span-2">
          <div class="flex items-center mb-4">
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              class="h-9 w-auto"
            />
            <span class="ml-3 text-xl font-semibold tracking-tight">Homez Immobilier</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-3 sm:space-y-0 text-sm">
            <div>
              <p class="text-gray-400">Service client</p>
              <a href="tel:+21670123456" class="hover:text-white font-medium">+216 70 123 456</a>
            </div>
            <div class="hidden sm:block h-6 w-px bg-gray-800"></div>
            <div>
              <p class="text-gray-400">Assistance</p>
              <a href="mailto:contact@homez.tn" class="hover:text-white font-medium">contact@homez.tn</a>
            </div>
            <div class="hidden sm:block h-6 w-px bg-gray-800"></div>
            <div>
              <p class="text-gray-400">Adresse</p>
              <p class="font-medium">Tunis, Tunisie</p>
            </div>
          </div>

          <!-- Socials -->
          <div class="mt-5">
            <div class="flex items-center space-x-3" aria-label="Réseaux sociaux">
              <a href="#" class="rounded-md bg-gray-800/70 hover:bg-[var(--brand)] transition px-2.5 py-2" aria-label="Facebook">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.01 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.93 8.44-9.94Z"/></svg>
              </a>
              <a href="#" class="rounded-md bg-gray-800/70 hover:bg-[var(--brand)] transition px-2.5 py-2" aria-label="Instagram">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5Zm5.75-2.5a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"/></svg>
              </a>
              <a href="#" class="rounded-md bg-gray-800/70 hover:bg-[var(--brand)] transition px-2.5 py-2" aria-label="LinkedIn">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5ZM3 8.98h4v12.02H3V8.98Zm6 0h3.84v1.64h.05c.53-1 1.83-2.06 3.76-2.06 4.02 0 4.76 2.65 4.76 6.1v6.34h-4V15.4c0-1.44-.03-3.3-2.01-3.3-2.01 0-2.32 1.57-2.32 3.19v5.71H9V8.98Z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Popular Search -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Recherches populaires</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="text-gray-400 hover:text-white">Appartement à vendre</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Appartement à louer</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Maison à vendre</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Bureaux à louer</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Terrain à vendre</a></li>
          </ul>
        </div>

        <!-- Découvrir (TN) -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Découvrir</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="text-gray-400 hover:text-white">Tunis</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">La Marsa</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">El Menzah</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Ariana</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Sousse</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white">Sfax</a></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Restez informé</h4>
          <form @submit.prevent="handleSubscribe" class="flex">
            <input
              v-model="email"
              type="email"
              placeholder="Votre email"
              class="flex-1 px-3 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-l-md border-0 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              required
            />
            <button
              type="submit"
              class="px-4 py-2 bg-[var(--brand)] text-white rounded-r-md hover:opacity-90 transition font-medium"
            >
              S’abonner
            </button>
          </form>
          <p v-if="success" class="text-xs text-green-400 mt-2">Merci ! Vous êtes inscrit(e) à la newsletter.</p>
          <p v-if="error" class="text-xs text-red-400 mt-2">Veuillez saisir un email valide.</p>

          <!-- App badges (optionnels, compacts) -->
          <div class="mt-4 space-y-2">
            <a href="#" class="flex items-center text-gray-300 hover:text-white text-sm">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83"/></svg>
              <span>Apple Store</span>
            </a>
            <a href="#" class="flex items-center text-gray-300 hover:text-white text-sm">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
              <span>Google Play</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800/80">
      <div class="container mx-auto px-6 lg:px-8 py-3">
        <div class="flex flex-col md:flex-row justify-between items-center gap-3">
          <p class="text-gray-400 text-xs">© {{ new Date().getFullYear() }} Homez – Tous droits réservés</p>
          <nav class="flex items-center gap-5">
            <a href="#" class="text-gray-400 hover:text-white text-xs">Confidentialité</a>
            <a href="#" class="text-gray-400 hover:text-white text-xs">Conditions</a>
            <a href="#" class="text-gray-400 hover:text-white text-xs">Plan du site</a>
          </nav>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

/**
 * Thème inspiré Tecnocasa
 * Tu peux changer facilement la couleur de marque ici.
 */
onMounted(() => {
  document.documentElement.style.setProperty('--brand', '#006341') // vert Tecnocasa
})

const email = ref('')
const success = ref(false)
const error = ref(false)

const validateEmail = (val: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

const handleSubscribe = () => {
  success.value = false
  error.value = false

  if (!validateEmail(email.value)) {
    error.value = true
    return
  }

  // TODO: requête API newsletter
  console.log('Subscribing email:', email.value)

  success.value = true
  email.value = ''
  setTimeout(() => (success.value = false), 3500)
}
</script>

<style scoped>
/* Légère amélioration de rendu sur fonds sombres */
footer {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
