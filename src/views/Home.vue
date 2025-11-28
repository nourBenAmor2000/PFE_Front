<template>
  <div>
    <MainMenu />
    <div class="container p-3.5 lg:px-40 xl:px-40 mx-auto my-32">
      <SectionHeaderMenu 
        :title="'Découvrez Nos Annonces '"  
        :subtitle="''"
        :linkText="'Voir toutes les propriétés'"
        :linkHref="'/properties'"
      />
      <ListHouse />
      
     <SectionHeaderMenu
        :title="'Villes & Régions de Tunisie'"
        :subtitle="'Parcourez les principales villes et régions pour votre prochain bien'"
        :linkText="'Voir toutes les localités'"
        :linkHref="'/cities'"
      />
      <ListCity />

      
      <MainHelp />
      <Testimonials />
      
      <SectionHeaderMenu 
        :title="'Nos Agents Exclusifs'"
        :subtitle="''"
        :linkText="'Voir tous les agents'"
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
