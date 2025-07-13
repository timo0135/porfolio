Voici le code modifié de `DesktopView.vue` pour gérer les animations du dock comme sur macOS :

```vue
<script setup>
import { ref } from 'vue'
import DockComponent from '@/components/DockComponent.vue'
import TopBarComponent from '@/components/TopBarComponent.vue'
import WindowComponent from '@/components/WindowComponent.vue'

const activeWindows = ref([])
const activeWindowId = ref(null)
const isFullscreen = ref(false)
const showTopBar = ref(true)
const showDock = ref(true)
const dockRef = ref(null)

const openWindow = (application) => {
  const windowId = Date.now()
  activeWindows.value.push({
    id: windowId,
    application
  })
  activeWindowId.value = windowId
  dockRef.value?.setAppOpen(application.name, true)
}

const closeWindow = (windowId) => {
  const window = activeWindows.value.find(w => w.id === windowId)
  const app = window?.application
  const remainingWindows = activeWindows.value.filter(w =>
    w.id !== windowId && w.application.name === app.name
  )

  if (remainingWindows.length === 0) {
    dockRef.value?.setAppOpen(app.name, false)
  }

  activeWindows.value = activeWindows.value.filter(w => w.id !== windowId)
}

const activateWindow = (windowId) => {
  activeWindowId.value = windowId
}

const handleFullscreenChange = (status) => {
  isFullscreen.value = status
  showTopBar.value = !status
  showDock.value = !status
}

let topBarTimeout
let dockTimeout

const handleMouseMove = (e) => {
  if (!isFullscreen.value) return

  if (e.clientY < 2) {
    clearTimeout(topBarTimeout)
    showTopBar.value = true
    topBarTimeout = setTimeout(() => {
      if (!isFullscreen.value) return
      showTopBar.value = false
    }, 2000)
  } else if (e.clientY > window.innerHeight - 2) {
    clearTimeout(dockTimeout)
    showDock.value = true
    dockTimeout = setTimeout(() => {
      if (!isFullscreen.value) return
      showDock.value = false
    }, 2000)
  }
}
</script>

<template>
  <div @mousemove="handleMouseMove">
    <Transition name="fade">
      <TopBarComponent v-show="showTopBar" />
    </Transition>

    <WindowComponent
      v-for="window in activeWindows"
      :key="window.id"
      :application="window.application"
      :isActive="window.id === activeWindowId"
      :topBarHeight="showTopBar ? '24px' : '0'"
      @close="closeWindow(window.id)"
      @click="activateWindow(window.id)"
      @fullscreen-change="handleFullscreenChange"
    />

    <Transition name="fade">
      <DockComponent
        ref="dockRef"
        v-show="showDock"
        @open-app="openWindow"
      />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

Les modifications principales sont :
- Ajout d'une référence au dock avec `dockRef`
- Mise à jour de l'état des apps dans le dock à l'ouverture et à la fermeture
- Gestion des fenêtres multiples pour une même application
- Maintien de l'état visuel du dock en fonction des fenêtres actives

Cette version s'intègre avec le composant `DockComponent.vue` existant qui gère déjà les animations et l'affichage des indicateurs.
