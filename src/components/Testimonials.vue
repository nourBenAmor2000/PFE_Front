<script setup lang="ts">
import { ref } from 'vue'

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
    title: "Real Estate Agent",
    content: "The platform made finding my dream home incredibly easy. The search filters and detailed property information helped me make the right decision quickly.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Property Investor",
    content: "Outstanding service and comprehensive property listings. The market insights and analytics tools have been invaluable for my investment decisions.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 3,
    name: "Ali Tufan",
    title: "Product Manager",
    content: "What a great experience! I have visited one of the workshops and attended a masterclass, and both were super useful for young designers. Highly recommended.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    title: "First-time Buyer",
    content: "The team guided me through every step of buying my first home. Their expertise and patience made what seemed overwhelming become manageable and exciting.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  },
  {
    id: 5,
    name: "David Thompson",
    title: "Property Developer",
    content: "Excellent platform for showcasing properties. The virtual tours and detailed descriptions help potential buyers understand the value proposition immediately.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  }
]

const activeTestimonial = ref(2) // Ali Tufan is active by default (index 2)

const setActiveTestimonial = (index: number) => {
  activeTestimonial.value = index
}

const getCurrentTestimonial = () => {
  return testimonials[activeTestimonial.value]
}
</script>

<template>
  <section class="py-16 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Testimonials
        </h2>
        <p class="text-gray-600 text-lg">
          Aliquam lacinia diam quis lacus euismod
        </p>
      </div>

      <!-- Testimonial Content -->
      <div class="text-center max-w-4xl mx-auto">
        <!-- Quote Icon -->
        <div class="mb-8">
          <svg class="w-16 h-16 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
        </div>

        <!-- Testimonial Text -->
        <div class="mb-8 transition-all duration-500 ease-in-out">
          <p class="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-medium">
            {{ getCurrentTestimonial().content }}
          </p>
          
          <!-- Author Info -->
          <div class="space-y-2">
            <h4 class="text-lg font-semibold text-gray-900">
              {{ getCurrentTestimonial().name }}
            </h4>
            <p class="text-gray-600">
              {{ getCurrentTestimonial().title }}
            </p>
          </div>
        </div>

        <!-- Profile Images -->
        <div class="flex justify-center items-center space-x-4">
          <button
            v-for="(testimonial, index) in testimonials"
            :key="testimonial.id"
            @click="setActiveTestimonial(index)"
            class="relative transition-all duration-300 ease-in-out transform hover:scale-110"
            :class="{
              'ring-4 ring-orange-400 ring-offset-2 scale-110': activeTestimonial === index,
              'opacity-60 hover:opacity-100': activeTestimonial !== index
            }"
          >
            <img
              :src="testimonial.avatar"
              :alt="testimonial.name"
              class="w-14 h-14 rounded-full object-cover cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
