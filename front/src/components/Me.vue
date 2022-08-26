<script setup lang="ts">
import type { Player } from "back/player";
import Card from "./Card.vue";

const props = defineProps<{
  myData: Player;
}>();
</script>

<template>
  <div class="main">
    <Card v-for="card in myData.hand" :card-data="card" :big="true"></Card>
  </div>
</template>

<style>
.main {
  border: 2px solid red;
}
</style>
