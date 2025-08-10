<script setup lang="ts">
import { useUiStore } from '@/stores/ui.ts'

const uiStore = useUiStore();
</script>

<template>
  <div>
    StartView
    <br>
    <router-link to="/second">[To Second View]</router-link>
    <br>
    <div @click="uiStore.showModal('a')">[Show modal]</div>
  </div>
</template>

<style lang="scss" scoped>
</style>
