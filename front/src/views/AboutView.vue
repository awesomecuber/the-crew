<script setup lang="ts">
import { socketKey } from "@/keys";
import { useCounterStore } from "@/stores/counter";
import { inject } from "vue";

const counter = useCounterStore();

const socket = inject(socketKey);
socket?.on("pong", () => {
  alert("you got PONGED");
});
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="counter.increment()">Counter: {{ counter.counter }}</button>
    <button @click="socket?.emit('ping')">PING</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
