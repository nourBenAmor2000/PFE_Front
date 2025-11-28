<template>
  <div class="property-map">
    <div ref="mapContainer" class="w-full rounded-lg" :style="{ height }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  properties: {
    type: Array,
    default: () => []
  },
  center: {
    type: Array,
    default: () => [36.8065, 10.1815] // Tunis par défaut
  },
  zoom: {
    type: Number,
    default: 10
  },
  height: {
    type: String,
    default: '400px'
  }
})

const emit = defineEmits(['property-selected', 'map-moved'])

const mapContainer = ref(null)
let map = null
let markersLayer = null

onMounted(() => {
  map = L.map(mapContainer.value, {
    center: props.center,
    zoom: props.zoom,
    scrollWheelZoom: true,
    doubleClickZoom: true
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
  updateMarkers()

  map.on('moveend', () => {
    const center = map.getCenter()
    const zoom = map.getZoom()
    emit('map-moved', { center: [center.lat, center.lng], zoom })
  })
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

watch(
  () => props.properties,
  () => {
    if (map && markersLayer) {
      updateMarkers()
    }
  },
  { deep: true }
)

watch(
  () => [props.center, props.zoom],
  ([center, zoom]) => {
    if (map && center && Array.isArray(center)) {
      map.setView(center, zoom || map.getZoom())
    }
  },
  { deep: true }
)

function updateMarkers() {
  markersLayer.clearLayers()

  const pts = []

  props.properties.forEach(property => {
    const lat = property.latitude ?? property.lat
    const lng = property.longitude ?? property.lng

    if (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng)
    ) {
      pts.push([lat, lng])

      const price = typeof property.price === 'number' ? property.price : 0
      const priceLabel = price
        ? new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'TND',
            maximumFractionDigits: 0
          }).format(price)
        : 'Prix non disponible'

      const customIcon = L.divIcon({
        html: `
          <div class="bg-orange-500 text-white rounded-full w-9 h-9 flex items-center justify-center text-xs font-bold shadow-lg">
            ${price ? Math.round(price / 1000) + 'k' : '?'}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersLayer)

      const popupHtml = `
        <div style="min-width:180px;max-width:220px;">
          ${property.image ? `<img src="${property.image}" alt="${property.title || 'Logement'}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:4px;" />` : ''}
          <div style="font-weight:600;margin-bottom:2px;">${property.title || 'Logement'}</div>
          ${property.address ? `<div style="font-size:12px;color:#4b5563;margin-bottom:4px;">${property.address}</div>` : ''}
          <div style="font-size:13px;font-weight:600;color:#ea580c;">${priceLabel}</div>
        </div>
      `

      marker.bindPopup(popupHtml)
      marker.on('click', () => emit('property-selected', property))
    }
  })

  if (pts.length) {
    const bounds = L.latLngBounds(pts)
    map.fitBounds(bounds.pad(0.15))
  } else {
    map.setView(props.center, props.zoom)
  }
}
</script>

<style>
.custom-marker {
  background: transparent !important;
  border: none !important;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}

.leaflet-popup-content {
  margin: 6px 8px;
}
</style>
