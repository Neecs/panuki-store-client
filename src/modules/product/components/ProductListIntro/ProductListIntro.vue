<script setup lang="ts">
defineProps<{ count: number }>()
</script>

<template>
  <section class="intro">
    <div class="eyebrow-row">
      <span class="eyebrow">New season</span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <h1>Colorful finds for<br /><span class="pop">happy</span> days.</h1>
    <p class="count">{{ count }} piezas &middot; hecho a mano</p>
  </section>
</template>

<style scoped src="./ProductListIntro.css"></style>
