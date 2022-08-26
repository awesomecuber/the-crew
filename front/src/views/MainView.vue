<script setup lang="ts">
import { socketKey } from "@/keys";
import uuid from "@/uuid";
import { computed } from "@vue/reactivity";
import type { Player } from "back/player";
import type { StrippedGameState } from "back/strippedGameState";
import type { StrippedPlayer } from "back/strippedPlayer";
import { inject, ref, type Ref } from "vue";
import Me from "../components/Me.vue";
import Other from "../components/Other.vue";

const socket = inject(socketKey);
socket?.emit("requestGameState", uuid);

socket?.on("pong", () => {
  alert("you got PONGED");
});

const gameState: Ref<StrippedGameState | null> = ref(null);
socket?.on("update", (state) => (gameState.value = state));

socket?.on("error", (msg) => alert(`THERE WAS AN ERROR: ${msg}`));

const me = computed<Player | null>(() => {
  let possiblyMe: Player | null = null;
  gameState.value?.players.forEach((player) => {
    if (isMainPlayer(player)) {
      possiblyMe = player;
    }
  });
  return possiblyMe;
});

const others = computed<StrippedPlayer[]>(() => {
  let others: StrippedPlayer[] = [];
  gameState.value?.players.forEach((player) => {
    if (!isMainPlayer(player)) {
      others.push(player);
    }
  });
  return others;
});

function isMainPlayer(player: Player | StrippedPlayer): player is Player {
  return typeof player.hand === "object";
}
</script>

<template>
  <div class="main-view">
    <div>
      <h1>Me!</h1>
      <Me v-if="me !== null" :my-data="me"></Me>
    </div>
    <div class="others">
      <h2>Others:</h2>
      <Other v-for="other in others" :other-data="other"></Other>
    </div>
    <div>
      <button @click="socket?.emit('ping')">PING</button>
      <button @click="socket?.emit('joinGame', uuid)">Join Game!</button>
    </div>
  </div>
</template>

<style>
.main-view {
  min-height: 100vh;
  display: inline-flex;
  flex-direction: column;
}

.others {
  display: inline-flex;
  flex-direction: column;
}
</style>
