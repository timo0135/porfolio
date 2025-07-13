<script setup>

</script>

<template>
  <div class="menubar">
    <div class="menubar-items">
      <div class="apple-menu">
        <img
          class="apple-icon"
          src="@/assets/apple.png"
          alt="Apple Logo"

        />
      </div>
      <div class="menu-item active">Finder</div>
      <div class="menu-item">Fichier</div>
      <div class="menu-item">Édition</div>
      <div class="menu-item">Aller</div>
    </div>
  </div>
</template>

<style scoped>
.menubar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  z-index: 9999;
  font-size: 13px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

.menubar-items {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 8px;
  gap: 16px;
}

.apple-menu {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.apple-icon {
  width: 1.25em;
  height: 1.25em;
}

.menu-item {
  padding: 0 8px;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: default;
  transition: background-color 0.1s;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.active {
  font-weight: bold;
}
</style>
