<template>
  <!-- Navigation mobile -->
  <nav class="md:hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <!-- Partie supérieure fixe -->
    <div class="p-4 shadow-lg">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-bold flex items-center">
          <svg class="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
          </svg>
          Météo App
        </h1>
        <button @click="$emit('toggle-menu')" 
                class="focus:outline-none bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 6h16M4 12h16m-7 6h7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Menu déroulant -->
    <div v-if="isMenuOpen" 
         class="animate-slideDown">
      <div class="p-4 space-y-3">
        <router-link to="/" 
                     class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>Accueil</span>
        </router-link>

        <router-link to="/forecast" 
                     class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>Prévisions</span>
        </router-link>

        <router-link to="/travel" 
                     class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
          </svg>
          <span>Mode Voyage</span>
        </router-link>

        <router-link to="/stats" 
                     class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <span>Statistiques</span>
        </router-link>

        <button @click="$emit('toggle-dark-mode')" 
                class="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
          <svg v-if="isDarkMode" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
          <span>Mode {{ isDarkMode ? 'Clair' : 'Sombre' }}</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Navigation desktop -->
  <nav class="hidden md:block bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <h1 class="text-xl font-bold flex items-center">
          <svg class="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
          </svg>
          Météo App
        </h1>
        
        <div class="flex items-center space-x-4">
          <router-link to="/" 
                       class="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
            Accueil
          </router-link>
          <router-link to="/forecast" 
                       class="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
            Prévisions
          </router-link>
          <router-link to="/travel" 
                       class="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
            Mode Voyage
          </router-link>
          <router-link to="/stats" 
                       class="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
            Statistiques
          </router-link>
          <button @click="$emit('toggle-dark-mode')" 
                  class="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <svg v-if="isDarkMode" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TheHeader',
  props: {
    isDarkMode: Boolean,
    isMenuOpen: Boolean
  }
}
</script>

<style scoped>
.router-link-active {
  @apply bg-white/20 font-medium;
}

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 