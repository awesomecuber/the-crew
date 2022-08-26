<script setup lang="ts">
import type { Card } from "back/card";
// import { Color } from "back/header";
import { computed, type StyleHTMLAttributes } from "vue";

const props = defineProps<{
  cardData?: Card;
  big: boolean;
}>();

const backgroundColorStyle = computed(() => {
  if (!props.cardData || props.cardData.color == -1) {
    return {
      backgroundColor: "darkslategray",
      color: "white",
    };
  }
  switch (props.cardData.color) {
    case 0:
      return {
        backgroundColor: "black",
        color: "white",
      };
    case 1:
      return {
        backgroundColor: "hotpink",
        color: "black",
      };
    case 2:
      return {
        backgroundColor: "yellow",
        color: "black",
      };
    case 3:
      return {
        backgroundColor: "aqua",
        color: "black",
      };
    case 4:
      return {
        backgroundColor: "lime",
        color: "black",
      };
  }
  return {
    backgroundColor: "darkslategray",
    color: "white",
  };
});

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
  <div class="card" :style="[backgroundColorStyle, sizeStyle]">
    <h1 v-if="cardData">{{ cardData.number }}</h1>
  </div>
</template>

<style>
.card {
  border: 2px solid lightblue;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 2px;
}
</style>
