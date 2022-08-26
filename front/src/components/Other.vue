<script setup lang="ts">
import type { StrippedPlayer } from "back/strippedPlayer";
import Card from "./Card.vue";

const props = defineProps<{
  otherData: StrippedPlayer;
}>();
</script>

<template>
  <div class="main">
    <Card v-for="i in 10" :big="false"></Card>
  </div>
</template>

<style>
.main {
  border: 2px solid red;
}
</style>
