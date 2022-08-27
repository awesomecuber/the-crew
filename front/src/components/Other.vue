<script setup lang="ts">
import type { StrippedPlayer } from "back/strippedPlayer";
import Card from "./shared/Card.vue";

const props = defineProps<{
  otherData: StrippedPlayer;
}>();
</script>

<template>
  <div class="main">
    <h1>Hand:</h1>
    <Card v-for="i in 10" :big="false"></Card>
    <h1>Tasks:</h1>
    <Card
      v-for="task in otherData.tasks"
      :card-data="task.card"
      :big="true"
    ></Card>
  </div>
</template>

<style scoped>
.main {
  border: 2px solid red;
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
}
</style>
