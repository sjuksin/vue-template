<script lang="ts" setup>
import { useModalStore } from '@/stores/modal.ts'

const modalStore = useModalStore()

const handleClose = () => {
  modalStore.close()
}
</script>

<template>
  <div :class="modalStore.current?.class ?? ''" class="modal-backdrop">
    <div class="modal">
      <slot/>
      <div class="btn-close" @click="handleClose">X</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
