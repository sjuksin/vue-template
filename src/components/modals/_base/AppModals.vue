<script lang="ts" setup>
import { type Component } from 'vue'
import ModalExample from '@/components/modals/ModalExample.vue'
import { type ModalType, useModalStore } from '@/stores/modal'

const modalStore = useModalStore()

const modalComponents: { [key in ModalType]: Component } = {
  'example': ModalExample,
  'example2': ModalExample,
}
</script>

<template>
  <transition mode="out-in" name="modal">
    <component
        v-if="modalStore.current"
        :is="modalComponents[modalStore.current.type]"
    />
  </transition>
</template>

<style lang="scss" scoped>
</style>
