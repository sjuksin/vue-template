<script setup lang="ts">
import BaseModal from '@/components/modals/BaseModal.vue'
import { useUiStore } from '@/stores/ui.ts'
import { type Component } from 'vue'
import type { ModalId } from '@/extra/types.ts'
import ModalA from '@/components/modals/ModalA.vue'

const uiStore = useUiStore()

const modalComponents: { [key in ModalId]: Component } = {
  'a': ModalA,
}

</script>

<template>
  <transition name="modal" mode="out-in">
    <BaseModal v-if="uiStore.visibleModal" :key="uiStore.visibleModal">
      <component :is="modalComponents[uiStore.visibleModal]"/>
    </BaseModal>
  </transition>
</template>

<style lang="scss" scoped>
</style>
