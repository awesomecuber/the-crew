<script setup lang="ts">
import type { Task } from "back/task";
import { computed, inject } from "vue";
import Card from "./Card.vue";

const props = defineProps<{
  taskData: Task;
  big: boolean;
}>();

const emit = defineEmits<{
  (e: "click", taskData: Task): void;
}>();

const sizeStyle = computed(() => {
  if (props.big) {
    return {
      width: "5rem",
      height: "8rem",
    };
  }
  return {
    width: "3rem",
    height: "4rem",
  };
});
</script>

<template>
  <div class="task">
    <Card
      @click="$emit('click', taskData)"
      :card-data="taskData.card"
      :big="big"
    ></Card>
    <h3>Token: {{ taskData.token }}</h3>
  </div>
</template>

<style scoped>
.task {
  border: 2px solid lightblue;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 2px;
  cursor: pointer;
}
</style>
