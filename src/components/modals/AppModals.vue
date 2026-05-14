<script lang="ts" setup>
import BaseModal from '@/components/modals/BaseModal.vue'
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
    <BaseModal v-if="modalStore.current" :key="modalStore.current.type">
      <component :is="modalComponents[modalStore.current.type]"/>
    </BaseModal>
  </transition>
</template>

<style lang="scss" scoped>
</style>
