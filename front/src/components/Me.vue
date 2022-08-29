<script setup lang="ts">
import { socketKey } from "@/keys";
import uuid from "@/uuid";
import type { Player } from "back/player";
import { inject } from "vue";
import Card from "./shared/Card.vue";
import Task from "./shared/Task.vue";

const socket = inject(socketKey);

const props = defineProps<{
  myData: Player;
}>();
</script>

<template>
  <div class="main">
    <h1>Hand:</h1>
    <Card
      @click="(cardData) => socket?.emit('playCard', uuid, cardData)"
      v-for="card in myData.hand"
      :card-data="card"
      :big="true"
    ></Card>
    <h1>Tasks:</h1>
    <Task v-for="task in myData.tasks" :task-data="task" :big="true"></Task>
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
