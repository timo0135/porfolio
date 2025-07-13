<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  application: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  topBarHeight: {
    type: String,
    default: '24px'
  }
})

const windowRef = ref(null)
const isFullscreen = ref(false)
const isMinimized = ref(false)
const position = ref({ x: 100, y: 100 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const emit = defineEmits(['close', 'click', 'fullscreen-change'])

let animationFrameId = null

onMounted(() => {
  position.value = {
    x: 100 + Math.random() * 100,
    y: 100 + Math.random() * 100
  }
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

watch(isFullscreen, (newValue, oldValue) => {
  if (!newValue && oldValue) {
    emit('fullscreen-change', false)
  } else if (newValue && !oldValue) {
    emit('fullscreen-change', true)
  }
})

const startDrag = (e) => {
  if (!isFullscreen.value && e.target.closest('.window-header')) {
    isDragging.value = true
    dragOffset.value = {
      x: e.clientX - position.value.x,
      y: e.clientY - position.value.y
    }
    emit('click')
  }
}

const handleDrag = (e) => {
  if (!isDragging.value) return

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  animationFrameId = requestAnimationFrame(() => {
    position.value = {
      x: e.clientX - dragOffset.value.x,
      y: e.clientY - dragOffset.value.y
    }
  })
}

const stopDrag = () => {
  isDragging.value = false
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen-change', isFullscreen.value)
}

const minimize = () => {
  if (isFullscreen.value) {
    emit('fullscreen-change', false)
  }
  isMinimized.value = true
}

const close = () => {
  if (isFullscreen.value) {
    emit('fullscreen-change', false)
  }
  emit('close')
}
</script>

<template>
  <div
    ref="windowRef"
    class="window"
    :class="{
      active: isActive,
      minimized: isMinimized,
      fullscreen: isFullscreen,
      dragging: isDragging
    }"
    :style="!isFullscreen ? `transform: translate3d(${position.x}px, ${position.y}px, 0)` : ''"
    @mousedown="startDrag"
  >
    <div class="window-header">
      <div class="window-controls">
        <button class="control close" @click.stop="close">
          <span class="control-icon"></span>
        </button>
        <button class="control minimize" @click.stop="minimize">
          <span class="control-icon"></span>
        </button>
        <button class="control maximize" @click.stop="toggleFullscreen">
          <span class="control-icon"></span>
        </button>
      </div>
      <div class="window-title">{{ application.name }}</div>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.window {
  position: fixed;
  width: 800px;
  height: 600px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 10px;
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.15),
  0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease-out;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  -webkit-font-smoothing: subpixel-antialiased;
}

.window.dragging {
  transition: none;
  cursor: move;
}

.window.fullscreen {
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  border-radius: 0;
  transform: none !important;
  display: flex;
  flex-direction: column;
}

.window.fullscreen .window-content {
  flex-grow: 1;
  height: auto;
}

.window-header {
  height: 28px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: rgba(236, 236, 236, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: default;
  user-select: none;
}

.window-controls {
  display: flex;
  gap: 8px;
  margin-right: 8px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  padding: 0;
  position: relative;
  cursor: pointer;
  transition: transform 0.1s;
}

.control:active {
  transform: scale(0.9);
}

.close {
  background: #ff5f57;
}

.minimize {
  background: #febc2e;
}

.maximize {
  background: #28c941;
}

.control-icon {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.control:hover .control-icon {
  opacity: 1;
  background: rgba(0, 0, 0, 0.15);
}

.window-title {
  font-size: 13px;
  color: #1f1f1f;
  text-align: center;
  flex-grow: 1;
  margin-right: 70px;
}

.window-content {
  height: calc(100% - 28px);
  overflow: auto;
  background: rgba(255, 255, 255, 0.95);
}

.window.minimized {
  transform: scale(0.7) translate(-50%, 100%);
  opacity: 0;
  pointer-events: none;
}

.window.active {
  z-index: 100;
}

@media (prefers-reduced-motion: no-preference) {
  .window {
    transition-duration: 0.15s;
  }
}
</style>
