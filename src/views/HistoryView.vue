<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 dark:text-white">Historique des recherches</h2>
    
    <div v-if="history.length" class="space-y-4">
      <div 
        v-for="(item, index) in history" 
        :key="index"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-xl font-semibold dark:text-white">
              {{ item.location.name }}, {{ item.location.country }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Recherché le {{ formatDate(item.timestamp) }}
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-2xl font-bold dark:text-white">
                {{ item.current.temp_c }}°C
              </p>
              <p class="text-gray-600 dark:text-gray-400">
                {{ item.current.condition.text }}
              </p>
            </div>
            <img 
              :src="item.current.condition.icon" 
              :alt="item.current.condition.text"
              class="w-12 h-12"
            >
          </div>
        </div>
      </div>
    </div>

    <div 
      v-else 
      class="text-center py-8 text-gray-600 dark:text-gray-400"
    >
      Aucun historique disponible
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryView',
  data() {
    return {
      history: []
    }
  },
  methods: {
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleString('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    }
  },
  mounted() {
    this.history = JSON.parse(localStorage.getItem('weatherHistory') || '[]')
  }
}
</script> 