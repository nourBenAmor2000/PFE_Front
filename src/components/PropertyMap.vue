<template>
  <div class="property-map">
    <div ref="mapContainer" class="w-full h-full rounded-lg"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  properties: {
    type: Array,
    default: () => []
  },
  center: {
    type: Array,
    default: () => [36.8065, 10.1815] // Tunis, Tunisia default
  },
  zoom: {
    type: Number,
    default: 10
  },
  height: {
    type: String,
    default: '400px'
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  autoLoad: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['property-selected', 'map-moved'])

const mapContainer = ref(null)
let map = null
let markers = []

onMounted(async () => {
  // Dynamically import Leaflet
  const L = await import('leaflet')
  
  // Initialize map
  map = L.map(mapContainer.value).setView(props.center, props.zoom)
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)
  
  // Add properties as markers
  addPropertyMarkers(L)
  
  // Listen for map events
  map.on('moveend', () => {
    const center = map.getCenter()
    const zoom = map.getZoom()
    emit('map-moved', { center: [center.lat, center.lng], zoom })
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})

watch(() => props.properties, async () => {
  if (map && !props.autoLoad) {
    const L = await import('leaflet')
    clearMarkers()
    addPropertyMarkers(L, props.properties)
  }
}, { deep: true })

const addPropertyMarkers = (L, properties = null) => {
  const propertiesToShow = properties || props.properties || []
  
  propertiesToShow.forEach(property => {
    // Validate coordinates
    const lat = property.latitude || property.lat
    const lng = property.longitude || property.lng
    
    if (lat && lng && typeof lat === 'number' && typeof lng === 'number' && 
        !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      // Create custom icon
      const customIcon = L.divIcon({
        html: `
          <div class="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
            $${Math.round(property.price / 1000)}K
          </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
      
      const marker = L.marker([lat, lng], {
        icon: customIcon
      }).addTo(map)
      
      // Format price in TND
      const priceFormatted = property.price ? 
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(property.price) :
        'Prix non disponible'
      
      // Create popup content with more details
      const popupContent = `
        <div class="p-2 min-w-[200px] max-w-[250px]">
          ${property.image ? `<img src="${property.image}" alt="${property.title || 'Logement'}" class="w-full h-24 object-cover rounded mb-2" />` : ''}
          <h3 class="font-bold text-sm mb-1">${property.title || 'Logement'}</h3>
          ${property.address ? `<p class="text-xs text-gray-600 mb-2">${property.address}</p>` : ''}
          ${property.surface ? `<p class="text-xs text-gray-500 mb-1">Surface: ${property.surface} m²</p>` : ''}
          ${property.category ? `<p class="text-xs text-gray-500 mb-1">Catégorie: ${property.category.name || ''}</p>` : ''}
          ${property.agency ? `<p class="text-xs text-gray-500 mb-2">Agence: ${property.agency.name || ''}</p>` : ''}
          <div class="flex justify-between items-center mt-2">
            <span class="font-bold text-orange-500">${priceFormatted}</span>
            <button class="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600" onclick="window.selectProperty('${property.id}')">
              Voir détails
            </button>
          </div>
        </div>
      `
      
      marker.bindPopup(popupContent)
      markers.push(marker)
      
      // Add click event
      marker.on('click', () => {
        emit('property-selected', property)
      })
    }
  })
  
  // Fit map to show all markers if there are any
  if (markers.length > 0) {
    const group = new L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.1))
  }
}

const clearMarkers = () => {
  markers.forEach(marker => {
    map.removeLayer(marker)
  })
  markers = []
}

// Global function for popup buttons
if (typeof window !== 'undefined') {
  window.selectProperty = (propertyId) => {
    // Search in both props.properties and loadedProperties
    const allProperties = [...props.properties, ...loadedProperties.value]
    const property = allProperties.find(p => (p.id === propertyId || p._id === propertyId))
    if (property) {
      emit('property-selected', property)
    }
  }
}
</script>

<style>
/* Leaflet CSS - Import the required styles */
@import 'leaflet/dist/leaflet.css';

.custom-marker {
  background: transparent !important;
  border: none !important;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}

.leaflet-popup-content {
  margin: 0;
}
</style>
