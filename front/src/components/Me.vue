<script setup lang="ts">
import type { Player } from "back/player";
import Card from "./Card.vue";
const props = defineProps<{
  myData: Player;
}>();
</script>

<template>
  <div class="main">
    <h1>Hand:</h1>
    <Card v-for="card in myData.hand" :card-data="card" :big="true"></Card>
    <h1>Tasks:</h1>
    <Card
      v-for="task in myData.tasks"
      :card-data="task.card"
      :big="true"
    ></Card>
  </div>
</template>

<style scoped>
.main {
  border: 2px solid red;
  display: flex;
  align-items: center;
}

h1 {
  margin: 0px 20px;
}
</style>
