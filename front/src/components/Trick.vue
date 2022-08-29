<script setup lang="ts">
import type { Trick } from "back/trick";
import Card from "./shared/Card.vue";

const props = defineProps<{
  trickData: Trick;
}>();
</script>

<template>
  <div class="main">
    <Card v-for="card in trickData.cards" :card-data="card" :big="true"></Card>
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
