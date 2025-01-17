<template>
  <div class="min-h-screen" :class="{ 'dark': isDarkMode }">
    <div class="bg-white dark:bg-gray-900 min-h-screen">
      <the-header 
        :is-dark-mode="isDarkMode" 
        :is-menu-open="isMenuOpen"
        @toggle-dark-mode="toggleDarkMode"
        @toggle-menu="toggleMenu"
      />
      <main class="container mx-auto p-4">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import TheHeader from './components/layout/TheHeader.vue'

export default {
  name: 'App',
  components: {
    TheHeader
  },
  data() {
    return {
      isDarkMode: false,
      isMenuOpen: false
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('darkMode', this.isDarkMode)
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    }
  },
  mounted() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true'
  }
}
</script>