<script setup lang="ts">
import { socketKey } from "@/keys";
import uuid from "@/uuid";
import type { Task as TaskData } from "back/task";
import { inject } from "vue";
import Task from "./shared/Task.vue";

const socket = inject(socketKey);

const props = defineProps<{
  tasksData: TaskData[];
}>();
</script>

<template>
  <div class="main">
    <Task
      v-for="task in tasksData"
      :task-data="task"
      :big="true"
      @click="socket?.emit('pickTask', uuid, task)"
    ></Task>
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
