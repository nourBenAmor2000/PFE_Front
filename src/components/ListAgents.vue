<template>
  <div class="team-members-section py-16 bg-white">
    <div class="container mx-auto px-4">
      <!-- Swiper Container -->
      <div class="swiper team-swiper">
        <div class="swiper-wrapper">
          <div 
            v-for="member in teamMembers" 
            :key="member.id"
            class="swiper-slide"
          >
            <div class="team-card group cursor-pointer">
              <!-- Member Photo -->
              <div class="member-photo-container mb-4 overflow-hidden rounded-lg">
                <img 
                  :src="member.photo" 
                  :alt="member.name"
                  class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              <!-- Member Info -->
              <div class="member-info text-center">
                <h3 class="member-name text-lg font-semibold text-gray-900 mb-1">
                  {{ member.name }}
                </h3>
                <p class="member-role text-sm text-gray-600">
                  {{ member.role }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="swiper-pagination mt-8"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// Team Member Interface
interface TeamMember {
  id: number
  name: string
  role: string
  photo: string
}

// Mock Team Members Data
const teamMembers = ref<TeamMember[]>([
  {
    id: 1,
    name: 'Ralph Johnson',
    role: 'Manager',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  },
  {
    id: 2,
    name: 'Lori Ramos',
    role: 'Marketing',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  },
  {
    id: 3,
    name: 'Jack Graham',
    role: 'Marketing',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  },
  {
    id: 4,
    name: 'Augusta Silva',
    role: 'Leader Homez',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  },
  {
    id: 5,
    name: 'Albert Flores',
    role: 'Marketing',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  },
  {
    id: 6,
    name: 'Sarah Mitchell',
    role: 'Sales Director',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  },
  {
    id: 7,
    name: 'Michael Chen',
    role: 'Property Specialist',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  },
  {
    id: 8,
    name: 'Emma Rodriguez',
    role: 'Customer Relations',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  }
])

let swiper: any = null

// Initialize Swiper
onMounted(async () => {
  // Dynamically import Swiper
  const { Swiper } = await import('swiper')
  const { Navigation, Pagination, Autoplay } = await import('swiper/modules')
  

  // Initialize Swiper
  swiper = new Swiper('.team-swiper', {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      bulletClass: 'swiper-pagination-bullet',
      bulletActiveClass: 'swiper-pagination-bullet-active',
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
      1280: {
        slidesPerView: 5,
        spaceBetween: 24,
      },
    },
  })
})

// Cleanup Swiper
onUnmounted(() => {
  if (swiper) {
    swiper.destroy(true, true)
  }
})

// Handle member click
const handleMemberClick = (member: TeamMember) => {
  console.log('Member clicked:', member.name)
  // Add navigation logic here
}
</script>

<style scoped>
.team-members-section {
  position: relative;
}

.team-card {
  background: white;
  border-radius: 12px;
  padding: 0;
  transition: all 0.3s ease;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.member-photo-container {
  position: relative;
  aspect-ratio: 4/5;
  background: #f8f9fa;
}

.member-name {
  font-weight: 600;
  color: #1a1a1a;
}

.member-role {
  color: #666;
  font-size: 14px;
}

/* Swiper Pagination Styles */
:deep(.swiper-pagination) {
  position: relative;
  margin-top: 2rem;
}

:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: #e5e7eb;
  opacity: 1;
  margin: 0 6px;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: #ef4444;
  transform: scale(1.2);
}

:deep(.swiper-pagination-bullet:hover) {
  background: #ef4444;
  opacity: 0.8;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .team-card {
    margin: 0 auto;
    max-width: 280px;
  }
}
</style>
