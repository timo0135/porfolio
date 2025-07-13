<script setup>
import { ref } from 'vue'

const emit = defineEmits(['open-app'])
const openApps = ref(new Set())
const bounceApps = ref(new Set())

const applications = ref([
  {
    name: 'Finder',
    icon: 'src/assets/finder.png',
  },
  {
    name: 'Terminal',
    icon: 'src/assets/terminal.png',
  },
  {
    name: 'Réglages Système',
    icon: 'src/assets/settings.png',
  },
  {
    name: 'GitHub',
    icon: 'src/assets/github.png',
  },
  {
    name: 'Linkedin',
    icon: 'src/assets/linkedin.png',
  },
])

const openApplication = (application) => {
  bounceApps.value.add(application.name)
  setTimeout(() => {
    bounceApps.value.delete(application.name)
    openApps.value.add(application.name)
  }, 500)
  emit('open-app', application)
}

defineExpose({
  setAppOpen: (appName, isOpen) => {
    if (isOpen) {
      openApps.value.add(appName)
    } else {
      openApps.value.delete(appName)
    }
  }
})
</script>

<template>
  <div id="dock">
    <div class="dock-container">
      <div
        v-for="(application, index) in applications"
        :key="index"
        class="dock-item"
        :class="{
          'is-open': openApps.has(application.name),
          'is-bouncing': bounceApps.has(application.name)
        }"
        @click="openApplication(application)"
      >
        <img
          :src="application.icon"
          :alt="application.name"
          :title="application.name"
        />
        <div class="indicator" v-if="openApps.has(application.name)"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#dock {
  position: fixed;
  left: 50%;
  bottom: 0.5em;
  transform: translateX(-50%);
  z-index: 1000;
}

.dock-container {
  display: flex;
  gap: 0.5em;
  padding: 0.5em;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  border-radius: 1.2em;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease-out;
}

.dock-item img {
  width: 4em;
  height: 4em;
  border-radius: 1em;
  transition: all 0.2s ease-out;
}

.dock-item.is-open {
  transform: translateY(-4px);
}

.indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
}

.dock-container:hover .dock-item {
  transform: translateY(0px);
}

.dock-item:hover {
  transform: scale(1.5) translateY(-10px) !important;
}

.dock-item:hover ~ .dock-item {
  transform: translateX(15px);
}

.dock-container:hover .dock-item:not(:hover) {
  transform: scale(1);
}

@keyframes bounce {
  0%, 100% { transform: translateY(-4px); }
  50% { transform: translateY(-12px); }
}

.is-bouncing {
  animation: bounce 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
}
</style>
