<script lang="ts" setup>
import { useModalStore } from '@/stores/modal.ts'

const modalStore = useModalStore()
</script>

<template>
  <div>
    StartView
    <br>
    <router-link to="/second">[To Second View]</router-link>
    <br>
    <div @click="modalStore.open('a')">[Show modal A]</div>
    <div @click="modalStore.open('b')">[Show modal B]</div>
  </div>
</template>

<style lang="scss" scoped>
</style>
