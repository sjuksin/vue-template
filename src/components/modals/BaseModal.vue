<script setup lang="ts">

import { useUiStore } from '@/stores/ui.ts'

const uiStore = useUiStore()

const handleClose = () => {
  uiStore.closeCurrentModal()
}
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-container">
      <slot/>
      <div class="btn-close" @click="handleClose">X</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Фон затемнения */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Контейнер модального окна */
.modal-container {
  position: relative;
  border: 2px solid black;
  border-radius: 20px;
  background: white;

  /* Auto layout */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 70px 40px 40px;

  max-height: 100vh;
}

.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 23px;
  height: 23px;
  background: lightgrey;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}
</style>
