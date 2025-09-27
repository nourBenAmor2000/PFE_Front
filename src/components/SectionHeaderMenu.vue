<template>
  <div class="flex items-center justify-between mb-8">
    <div>
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        {{ title }}
      </h2>
      <p class="text-gray-600 text-base">
        {{ subtitle }}
      </p>
    </div>
    <div v-if="linkText && linkHref">
      <a 
        :href="linkHref" 
        class="inline-flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium"
      >
        {{ linkText }}
        <svg 
          class="ml-2 w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  linkText?: string
  linkHref?: string
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  linkText: '',
  linkHref: ''
})
</script>
