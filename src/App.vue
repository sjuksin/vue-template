<script setup lang="ts">

import { useUiStore } from '@/stores/ui.ts'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppModals from '@/components/modals/AppModals.vue'

const route = useRoute()
const uiStore = useUiStore()

onMounted(() => {
  uiStore.init()
})

watch(route, () => {
  // При любых изменениях роута скрываем все диалоги
  uiStore.closeCurrentModal()
}, { flush: 'pre' })

</script>

<template>
  <div
      class="app"
      :class="[uiStore.layoutClass]"
  >
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
    <AppModals/>
  </div>
</template>

<style scoped>
</style>
