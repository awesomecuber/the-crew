<script setup lang="ts">
import { socketKey } from "@/keys";
import { useCounterStore } from "@/stores/counter";
import uuid from "@/uuid";
import type { StrippedGameState } from "back/strippedGameState";
import { inject, ref, type Ref } from "vue";

const counter = useCounterStore();

const socket = inject(socketKey);
socket?.emit("requestGameState", uuid as string);

socket?.on("pong", () => {
  alert("you got PONGED");
});

let gameState: Ref<StrippedGameState | null> = ref(null);
socket?.on("update", (state) => {
  gameState.value = state;
});

socket?.on("error", (msg) => {
  alert(`THERE WAS AN ERROR: ${msg}`);
});
</script>

<template>
  <div class="about">
    <h2>UUID: {{ uuid }}</h2>
    <br />
    <h2>gameState: {{ gameState == null ? "nothing yet" : gameState }}</h2>
    <br />
    <button @click="counter.increment()">Counter: {{ counter.counter }}</button>
    <button @click="socket?.emit('ping')">PING</button>
    <button @click="socket?.emit('joinGame', uuid as string)">
      Join Game!
    </button>
  </div>
</template>

<style>
/* @media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */
</style>
