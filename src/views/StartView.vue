<script lang="ts" setup>
import { useModalStore } from '@/stores/modal'

// --------------- State -----------------------

const modalStore = useModalStore()

// --------------- Computed --------------------
// --------------- Handlers --------------------
// --------------- Watchers --------------------
// --------------- Lifecycle -------------------
</script>

<template>
  <div>
    StartView
    <br>
    <div @click="modalStore.open('a')">[Show modal A]</div>
  </div>
</template>

<style lang="scss" scoped>
</style>
