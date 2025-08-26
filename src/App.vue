<script lang="ts" setup>

import { useUiStore } from '@/stores/ui.ts'
import { onMounted } from 'vue'
import AppModals from '@/components/modals/AppModals.vue'

const uiStore = useUiStore()

onMounted(() => {
  uiStore.init()
})

</script>

<template>
  <div
      :class="[uiStore.layoutClass]"
      class="app"
  >
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="fade">
        <component :is="Component"/>
      </transition>
    </router-view>
    <AppModals/>
  </div>
</template>

<style scoped>
</style>
