<script lang="ts" setup>
import { useModalStore } from '@/stores/modal'
import { onKeyStroke } from '@vueuse/core'

// --------------- Props -----------------------

const props = withDefaults(defineProps<{
  width?: string
  showClose?: boolean // Отобразить крестик
  closeOnClick?: boolean // Закрывать модалку кликом на backdrop
  closeOnEsc?: boolean // Закрывать модалку клавишей Esc
  className?: string // css-класс для кастомизации, ставится на внешний контейнер (backdrop)
}>(), {
  showClose: true,
  closeOnClick: false,
  closeOnEsc: true,
})

// --------------- State -----------------------

const modalStore = useModalStore()

// --------------- Handlers --------------------

function handleClose () {
  modalStore.close()
}

function handleBackdropClick (e: MouseEvent, closeOnClickModal?: boolean) {
  if (e.target !== e.currentTarget) return // Игнорируем клик на контейнер
  if (closeOnClickModal) modalStore.close()
}

onKeyStroke('Escape', () => {
  if (props.closeOnEsc) modalStore.close()
})
</script>

<template>
  <div
      class="modal-backdrop"
      :class="className"
      @click="handleBackdropClick($event, closeOnClick)"
  >
    <div
        class="modal-container"
        :style="width ? { width } : undefined"
    >
      <slot/>
      <div v-if="showClose" class="btn-close" @click="handleClose">X</div>
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
