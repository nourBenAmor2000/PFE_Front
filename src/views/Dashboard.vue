<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b">
      <div class="container mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Bonjour, <span class="text-[var(--brand-700)]">{{ user?.name }}</span> 👋
          </h1>
          <p class="text-gray-600">Gérez vos recherches, visites, contrats et avis.</p>
        </div>

        <RouterLink
          to="/properties"
          class="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-5 py-3 font-medium text-white shadow-sm hover:bg-[var(--brand-600)]"
        >
          Rechercher un logement
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </RouterLink>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <!-- Stats -->
      <section class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          v-for="s in statCards"
          :key="s.label"
          :label="s.label"
          :value="s.value"
          :icon="s.icon"
          :tone="s.tone"
        />
      </section>

      <!-- Onglets -->
      <section class="mt-8 rounded-xl border bg-white shadow-sm">
        <Tabs v-model="activeTab" :items="tabs" />

        <div class="p-6">
          <!-- TAB: Recherche -->
          <section v-if="activeTab === 'search'">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Recherche de logements</h2>
              <button
                class="rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="resetSearch()"
              >
                Réinitialiser
              </button>
            </div>

            <!-- Filtres -->
            <div class="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-4">
              <FormField label="Localisation">
                <input v-model="searchFilters.location" type="text" placeholder="Ville, quartier..."
                       class="input" />
              </FormField>

              <FormField label="Prix max (TND)">
                <input v-model.number="searchFilters.maxPrice" type="number" min="0" class="input" placeholder="2000" />
              </FormField>

              <FormField label="Type">
                <select v-model="searchFilters.type" class="input">
                  <option value="">Tous types</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Maison">Maison</option>
                  <option value="Studio">Studio</option>
                </select>
              </FormField>

              <div class="flex items-end">
                <button @click="searchProperties" class="btn-primary w-full">Rechercher</button>
              </div>
            </div>

            <!-- Résultats -->
            <EmptyState
              v-if="!availableProperties.length"
              title="Aucun résultat"
              caption="Essayez d’élargir votre zone ou d’assouplir les filtres."
            />

            <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PropertyCard
                v-for="p in availableProperties"
                :key="p.id"
                :property="p"
                @visit="requestVisit"
                @favorite="toggleFavorite"
              />
            </div>
          </section>

          <!-- TAB: Visites -->
          <section v-else-if="activeTab === 'visits'">
            <SectionHeader title="Mes visites" />
            <EmptyState
              v-if="!myVisits.length"
              title="Aucune visite"
              caption="Planifiez votre première visite depuis la page d’un bien."
            />
            <div v-else class="space-y-4">
              <VisitItem
                v-for="v in myVisits"
                :key="v.id"
                :visit="v"
                @cancel="cancelVisit"
              />
            </div>
          </section>

          <!-- TAB: Contrats -->
          <section v-else-if="activeTab === 'contracts'">
            <SectionHeader title="Mes contrats" />
            <EmptyState
              v-if="!myContracts.length"
              title="Aucun contrat"
              caption="Vos contrats actifs et expirés apparaîtront ici."
            />
            <div v-else class="space-y-4">
              <ContractItem
                v-for="c in myContracts"
                :key="c.id"
                :contract="c"
                @view="viewContract"
                @pay="makePayment"
              />
            </div>
          </section>

          <!-- TAB: Avis -->
          <section v-else>
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Mes avis</h2>
              <button class="btn-primary" @click="showAddReviewModal = true">Laisser un avis</button>
            </div>

            <EmptyState
              v-if="!myReviews.length"
              title="Aucun avis"
              caption="Partagez votre expérience avec un agent ou une agence."
            />
            <div v-else class="space-y-4">
              <ReviewItem v-for="r in myReviews" :key="r.id" :review="r" />
            </div>
          </section>
        </div>
      </section>
    </main>

    <!-- MODAL: Demande de visite -->
    <Modal v-if="showVisitModal" title="Demander une visite" @close="showVisitModal = false">
      <template #body>
        <form @submit.prevent="submitVisitRequest" class="space-y-4">
          <FormField label="Logement">
            <p class="text-gray-900">{{ selectedProperty?.title }}</p>
          </FormField>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Date souhaitée">
              <input v-model="visitRequest.preferredDate" required type="date" class="input" />
            </FormField>
            <FormField label="Heure souhaitée">
              <input v-model="visitRequest.preferredTime" required type="time" class="input" />
            </FormField>
          </div>

          <FormField label="Message (optionnel)">
            <textarea v-model="visitRequest.message" rows="3" class="input"></textarea>
          </FormField>
        </form>
      </template>
      <template #footer>
        <button class="btn-ghost" @click="showVisitModal = false">Annuler</button>
        <button class="btn-primary" @click="submitVisitRequest">Envoyer la demande</button>
      </template>
    </Modal>

    <!-- MODAL: Avis -->
    <Modal v-if="showAddReviewModal" title="Laisser un avis" @close="showAddReviewModal = false">
      <template #body>
        <form @submit.prevent="submitReview" class="space-y-4">
          <FormField label="Type">
            <select v-model="newReview.targetType" required class="input">
              <option value="">Sélectionner</option>
              <option value="agent">Agent</option>
              <option value="agency">Agence</option>
            </select>
          </FormField>
          <FormField label="Nom">
            <input v-model="newReview.targetName" required type="text" class="input" />
          </FormField>
          <FormField label="Note">
            <div class="flex gap-1">
              <button
                v-for="i in 5" :key="i" type="button"
                @click="newReview.rating = i"
                :class="i <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'"
                class="text-2xl"
              >★</button>
            </div>
          </FormField>
          <FormField label="Commentaire">
            <textarea v-model="newReview.comment" rows="4" required class="input"></textarea>
          </FormField>
        </form>
      </template>
      <template #footer>
        <button class="btn-ghost" @click="showAddReviewModal = false">Annuler</button>
        <button class="btn-primary" @click="submitReview">Publier</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

/* ==== Couleurs de marque (E-Dar) ==== */
document.documentElement.style.setProperty('--brand', '#EF5A1C')
document.documentElement.style.setProperty('--brand-600', '#E25116')
document.documentElement.style.setProperty('--brand-700', '#C94710')

const router = useRouter()
const { user } = useAuth()

/* ==== Onglets ==== */
const tabs = [
  { id: 'search', name: 'Recherche' },
  { id: 'visits', name: 'Mes visites' },
  { id: 'contracts', name: 'Mes contrats' },
  { id: 'reviews', name: 'Mes avis' }
]
const activeTab = ref('search')

/* ==== Stats ==== */
const clientStats = ref({
  scheduledVisits: 3,
  activeContracts: 1,
  favorites: 5,
  pendingPayments: 1
})
const statCards = computed(() => ([
  { label: 'Visites programmées', value: clientStats.value.scheduledVisits, icon: 'calendar', tone: 'blue' },
  { label: 'Contrats actifs', value: clientStats.value.activeContracts, icon: 'doc', tone: 'green' },
  { label: 'Favoris', value: clientStats.value.favorites, icon: 'heart', tone: 'purple' },
  { label: 'Paiements en attente', value: clientStats.value.pendingPayments, icon: 'coin', tone: 'orange' },
]))

/* ==== Recherche ==== */
const searchFilters = ref({ location: '', maxPrice: '', type: '' })
const availableProperties = ref([
  { id: 1, title: 'Appt 2P - Marais', address: '15 Rue des Rosiers', price: 1800, rooms: 2, image: '/placeholder.svg?height=200&width=300', isFavorite: false },
  { id: 2, title: 'Studio - Montmartre', address: '8 Rue Lepic', price: 1200, rooms: 1, image: '/placeholder.svg?height=200&width=300', isFavorite: true }
])
const searchProperties = () => {
  console.log('Rechercher avec :', searchFilters.value)
}
const resetSearch = () => (searchFilters.value = { location: '', maxPrice: '', type: '' })

/* ==== Visites ==== */
const myVisits = ref([
  { id: 1, propertyTitle: 'Appt 2P - Marais', propertyAddress: '15 Rue des Rosiers', dateTime: new Date('2025-02-20T14:00:00'), agentName: 'Marie Dubois', status: 'Programmée' }
])
const showVisitModal = ref(false)
const selectedProperty = ref(null)
const visitRequest = ref({ preferredDate: '', preferredTime: '', message: '' })

const requestVisit = (property) => {
  selectedProperty.value = property
  showVisitModal.value = true
}
const submitVisitRequest = () => {
  myVisits.value.push({
    id: myVisits.value.length + 1,
    propertyTitle: selectedProperty.value.title,
    propertyAddress: selectedProperty.value.address,
    dateTime: new Date(`${visitRequest.value.preferredDate}T${visitRequest.value.preferredTime}`),
    agentName: 'Agent assigné',
    status: 'En attente'
  })
  clientStats.value.scheduledVisits++
  visitRequest.value = { preferredDate: '', preferredTime: '', message: '' }
  showVisitModal.value = false
  selectedProperty.value = null
  alert('Demande envoyée ✅')
}
const cancelVisit = (id) => {
  if (!confirm('Annuler cette visite ?')) return
  const v = myVisits.value.find(x => x.id === id)
  if (v) { v.status = 'Annulée'; clientStats.value.scheduledVisits-- }
}

/* ==== Contrats ==== */
const myContracts = ref([
  { id: 1, propertyTitle: 'Studio - Bastille', propertyAddress: '8 Place de la Bastille', monthlyRent: 1200, startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), agentName: 'Pierre Martin', status: 'Actif' }
])
const viewContract = (c) => console.log('Voir contrat', c)
const makePayment = (c) => { console.log('Payer', c); alert('Redirection vers le paiement…') }

/* ==== Avis ==== */
const myReviews = ref([])
const showAddReviewModal = ref(false)
const newReview = ref({ targetType: '', targetName: '', rating: 0, comment: '' })
const submitReview = () => {
  myReviews.value.push({ id: myReviews.value.length + 1, ...newReview.value, date: new Date() })
  newReview.value = { targetType: '', targetName: '', rating: 0, comment: '' }
  showAddReviewModal.value = false
  alert('Avis publié ✅')
}

/* ==== Favoris ==== */
const toggleFavorite = (property) => {
  property.isFavorite = !property.isFavorite
  clientStats.value.favorites += property.isFavorite ? 1 : -1
}

/* ==== Guard ==== */
onMounted(() => {
  if (!user.value) router.push('/login')
})
</script>

<script>
/* Petits composants composables dans le même fichier pour simplicité */
import { defineComponent, h } from 'vue'

export const FormField = defineComponent({
  name: 'FormField',
  props: { label: String },
  setup(p, { slots }) {
    return () => h('label', { class: 'block text-sm font-medium text-gray-700' }, [
      h('span', { class: 'mb-1 block' }, p.label),
      h('div', { class: 'relative' }, slots.default?.())
    ])
  }
})

export const Tabs = defineComponent({
  name: 'Tabs',
  props: { modelValue: String, items: Array },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { class: 'border-b' }, [
      h('nav', { class: '-mb-px flex gap-6 px-6 overflow-x-auto' },
        props.items.map(t =>
          h('button', {
            class: [
              'whitespace-nowrap py-4 text-sm font-medium border-b-2',
              props.modelValue === t.id
                ? 'border-[var(--brand)] text-[var(--brand-700)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ],
            onClick: () => emit('update:modelValue', t.id)
          }, t.name)
        )
      )
    ])
  }
})

export const StatCard = defineComponent({
  name: 'StatCard',
  props: { label: String, value: [String, Number], icon: String, tone: String },
  setup(p) {
    const tones = {
      blue:   ['bg-blue-100',   'text-blue-600'],
      green:  ['bg-green-100',  'text-green-600'],
      purple: ['bg-purple-100', 'text-purple-600'],
      orange: ['bg-orange-100', 'text-orange-600'],
    }
    const [bg, text] = tones[p.tone || 'blue']
    const icons = {
      calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      doc: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6L18 7.4V19a2 2 0 01-2 2z',
      heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636 10.682 6.318a4.5 4.5 0 00-6.364 0z',
      coin: 'M12 8c-1.657 0-3 .9-3 2s1.343 2 3 2 3 .9 3 2-1.343 2-3 2M12 8V7m0 1v8'
    }
    return () => h('div', { class: 'rounded-lg bg-white shadow p-6 flex items-center' }, [
      h('div', { class: `rounded-lg p-2 ${bg}` }, [
        h('svg', { class: `h-6 w-6 ${text}`, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor' }, [
          h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', 'stroke-width':'2', d: icons[p.icon] })
        ])
      ]),
      h('div', { class: 'ml-4' }, [
        h('p', { class: 'text-sm font-medium text-gray-600' }, p.label),
        h('p', { class: 'text-2xl font-semibold text-gray-900' }, String(p.value))
      ])
    ])
  }
})

export const PropertyCard = defineComponent({
  name: 'PropertyCard',
  props: { property: Object },
  emits: ['visit','favorite'],
  setup({ property }, { emit }) {
    const price = new Intl.NumberFormat('fr-FR', { style:'currency', currency:'TND', maximumFractionDigits:0 }).format(property.price)
    return () => h('article', { class: 'overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition' }, [
      h('img', { src: property.image, alt: property.title, class: 'h-48 w-full object-cover' }),
      h('div', { class: 'p-4' }, [
        h('h3', { class: 'mb-1 font-semibold text-gray-900' }, property.title),
        h('p', { class: 'mb-3 text-sm text-gray-600' }, property.address),
        h('div', { class: 'mb-3 flex items-center justify-between' }, [
          h('span', { class: 'text-lg font-bold text-[var(--brand-700)]' }, `${price}/mois`),
          h('span', { class: 'text-sm text-gray-500' }, `${property.rooms} pièces`)
        ]),
        h('div', { class: 'flex items-center justify-between' }, [
          h('button', { class: 'btn-success', onClick: () => emit('visit', property) }, 'Demander une visite'),
          h('button', {
            class: ['p-1', property.isFavorite ? 'text-red-500' : 'text-gray-400'],
            onClick: () => emit('favorite', property)
          }, [
            h('svg', { class:'h-5 w-5', viewBox:'0 0 24 24', fill:'currentColor' }, [
              h('path', { d:'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' })
            ])
          ])
        ])
      ])
    ])
  }
})

export const VisitItem = defineComponent({
  name: 'VisitItem',
  props: { visit: Object },
  emits: ['cancel'],
  setup({ visit }, { emit }) {
    const fmt = new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})
    const badge = (s)=>({
      'Programmée':'bg-blue-100 text-blue-800',
      'En attente':'bg-orange-100 text-orange-800',
      'Annulée':'bg-red-100 text-red-800',
      'Terminée':'bg-green-100 text-green-800'
    }[s] || 'bg-gray-100 text-gray-800')
    return () => h('div', { class:'rounded-lg bg-gray-50 p-4' }, [
      h('div', { class:'flex items-start justify-between' }, [
        h('div', { class:'flex-1' }, [
          h('div', { class:'mb-2 flex items-center gap-3' }, [
            h('h3', { class:'font-medium text-gray-900' }, visit.propertyTitle),
            h('span', { class:`px-2 py-1 text-xs rounded-full ${badge(visit.status)}` }, visit.status)
          ]),
          h('p', { class:'mb-2 text-sm text-gray-600' }, visit.propertyAddress),
          h('div', { class:'flex flex-wrap items-center gap-4 text-sm text-gray-600' }, [
            h('div', { class:'flex items-center gap-2' }, [
              h('svg', { class:'h-4 w-4', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor' }, [
                h('path',{ 'stroke-linecap':'round','stroke-linejoin':'round','stroke-width':'2', d:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'})
              ]),
              fmt.format(new Date(visit.dateTime))
            ]),
            h('div', { class:'flex items-center gap-2' }, [
              h('svg', { class:'h-4 w-4', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor' }, [
                h('path',{ 'stroke-linecap':'round','stroke-linejoin':'round','stroke-width':'2', d:'M15 7a3 3 0 11-6 0 3 3 0 016 0z'})
              ]),
              `Agent: ${visit.agentName}`
            ])
          ])
        ]),
        visit.status === 'Programmée'
          ? h('button', { class:'text-sm text-red-600 hover:text-red-800', onClick:()=>emit('cancel', visit.id) }, 'Annuler')
          : null
      ])
    ])
  }
})

export const ContractItem = defineComponent({
  name: 'ContractItem',
  props: { contract: Object },
  emits: ['view','pay'],
  setup({ contract }, { emit }) {
    const cur = new Intl.NumberFormat('fr-FR', { style:'currency', currency:'TND' })
    const d   = (x)=> new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(x)
    const badge = (s)=>({
      'Actif':'bg-green-100 text-green-800',
      'Expiré':'bg-red-100 text-red-800',
      'En attente':'bg-orange-100 text-orange-800'
    }[s] || 'bg-gray-100 text-gray-800')
    return () => h('div', { class:'rounded-lg bg-gray-50 p-6' }, [
      h('div', { class:'mb-4 flex items-start justify-between' }, [
        h('div', null, [
          h('h3', { class:'mb-1 font-semibold text-gray-900' }, contract.propertyTitle),
          h('p', { class:'text-sm text-gray-600' }, contract.propertyAddress)
        ]),
        h('span', { class:`px-3 py-1 text-sm rounded-full ${badge(contract.status)}` }, contract.status)
      ]),
      h('div', { class:'mb-4 grid grid-cols-1 gap-4 md:grid-cols-3' }, [
        h('div', null, [ h('p',{class:'text-sm text-gray-600'},'Loyer mensuel'), h('p',{class:'font-semibold text-gray-900'}, cur.format(contract.monthlyRent)) ]),
        h('div', null, [ h('p',{class:'text-sm text-gray-600'},'Début du contrat'), h('p',{class:'font-semibold text-gray-900'}, d(contract.startDate)) ]),
        h('div', null, [ h('p',{class:'text-sm text-gray-600'},'Fin du contrat'), h('p',{class:'font-semibold text-gray-900'}, d(contract.endDate)) ])
      ]),
      h('div', { class:'flex items-center justify-between' }, [
        h('div', { class:'text-sm text-gray-600' }, `Agent: ${contract.agentName}`),
        h('div', { class:'flex gap-2' }, [
          h('button', { class:'text-sm text-[var(--brand-700)] hover:underline', onClick:()=>emit('view',contract) }, 'Voir détails'),
          contract.status === 'Actif'
            ? h('button', { class:'btn-success', onClick:()=>emit('pay',contract) }, 'Payer')
            : null
        ])
      ])
    ])
  }
})

export const ReviewItem = defineComponent({
  name: 'ReviewItem',
  props: { review: Object },
  setup({ review }) {
    const fmt = new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'})
    return () => h('div', { class:'rounded-lg bg-gray-50 p-4' }, [
      h('div', { class:'mb-2 flex items-start justify-between' }, [
        h('div', null, [
          h('h3', { class:'font-medium text-gray-900' }, review.targetName),
          h('p', { class:'text-sm text-gray-600' }, review.targetType === 'agent' ? 'Agent' : 'Agence')
        ]),
        h('div', { class:'flex items-center' }, [
          h('div', { class:'mr-2 flex text-yellow-400' },
            Array.from({length:5}, (_,i)=> h('svg',{class:'h-4 w-4', viewBox:'0 0 24 24', fill: i < review.rating ? 'currentColor':'#E5E7EB'},[
              h('path',{d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'})
            ]))
          ),
          h('span', { class:'text-sm text-gray-600' }, fmt.format(review.date))
        ])
      ]),
      h('p', { class:'text-gray-700' }, review.comment)
    ])
  }
})

export const SectionHeader = defineComponent({
  name: 'SectionHeader',
  props: { title: String },
  setup(p){ return () => h('div',{class:'mb-6'},[ h('h2',{class:'text-lg font-semibold text-gray-900'}, p.title) ])}
})

export const EmptyState = defineComponent({
  name: 'EmptyState',
  props: { title:String, caption:String },
  setup(p){ return () => h('div',{class:'rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center'},[
    h('p',{class:'font-medium text-gray-900'}, p.title),
    p.caption ? h('p',{class:'mt-1 text-gray-500'}, p.caption) : null
  ])}
})

export const Modal = defineComponent({
  name: 'Modal',
  props: { title:String },
  emits: ['close'],
  setup(p,{ emit, slots }) {
    return () => h('div',{class:'fixed inset-0 z-50 grid place-items-center bg-black/50 p-4'},[
      h('div',{class:'w-full max-w-md rounded-xl bg-white p-6 shadow-xl'},[
        h('div',{class:'mb-4 flex items-start justify-between'},[
          h('h3',{class:'text-lg font-semibold'}, p.title),
          h('button',{class:'text-gray-500 hover:text-gray-700', onClick:()=>emit('close')},'✕')
        ]),
        slots.body?.(),
        h('div',{class:'mt-6 flex justify-end gap-3'}, slots.footer?.())
      ])
    ])
  }
})
</script>

<style scoped>
.container { max-width: 1200px; }

/* helpers */
.input {
  @apply w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent;
}
.btn-primary {
  @apply inline-flex items-center justify-center rounded-lg bg-[var(--brand)] px-4 py-2 font-medium text-white hover:bg-[var(--brand-600)];
}
.btn-success {
  @apply inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700;
}
.btn-ghost {
  @apply rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100;
}
</style>
