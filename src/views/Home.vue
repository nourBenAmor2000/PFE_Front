<template>
  <div>
    <MainMenu />
    <div class="container p-3.5 lg:px-40 xl:px-40 mx-auto my-32">
      <SectionHeaderMenu 
        :title="'Discover Our Featured Listings'"  
        :subtitle="'Aliquam lacinia diam quis lacus euismod'"
        :linkText="'See All Properties'"
        :linkHref="'/properties'"
      />
      <ListHouse />
      
      <SectionHeaderMenu 
        :title="'Explore Cities'"  
        :subtitle="'Aliquam lacinia diam quis lacus euismod'"
        :linkText="'All Cities'"
        :linkHref="'/cities'"
      />
      <ListCity />
      
      <MainHelp />
      <Testimonials />
      
      <SectionHeaderMenu 
        :title="'Our Exclusive Agents'"  
        :subtitle="'Aliquam lacinia diam quis lacus euismod'"
        :linkText="'See All Agents'"
        :linkHref="'/agents'"
      />
      <ListAgents />
      
      <PubPart />
    </div>
  </div>
</template>

<script setup>
import MainMenu from '../components/MainMenu.vue'
import ListHouse from '../components/ListHouse.vue'
import ListCity from '../components/ListCity.vue'
import ListAgents from '../components/ListAgents.vue'
import MainHelp from '../components/MainHelp.vue'
import Testimonials from '../components/Testimonials.vue'
import PubPart from '../components/PubPart.vue'
import SectionHeaderMenu from '../components/SectionHeaderMenu.vue'
</script>
