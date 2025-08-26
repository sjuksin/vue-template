<script lang="ts" setup>
import BaseModal from '@/components/modals/BaseModal.vue'
import { type Component } from 'vue'
import ModalA from '@/components/modals/ModalA.vue'
import ModalB from '@/components/modals/ModalB.vue'
import { type ModalId, useModalStore } from '@/stores/modal.ts'

const modalStore = useModalStore()

const modalComponents: { [key in ModalId]: Component } = {
  'a': ModalA,
  'b': ModalB
}

</script>

<template>
  <transition mode="out-in" name="modal">
    <BaseModal v-if="modalStore.current" :key="modalStore.current.id">
      <component :is="modalComponents[modalStore.current.id]"/>
    </BaseModal>
  </transition>
</template>

<style lang="scss" scoped>
</style>
