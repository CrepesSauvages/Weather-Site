<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- En-tête -->
    <div class="p-6">
      <div class="flex items-center mb-6">
        <router-link to="/" class="mr-4">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </router-link>
        <h1 class="text-xl">Next 7 Days</h1>
      </div>

      <!-- Prévisions quotidiennes -->
      <div v-if="forecastData" class="space-y-4">
        <div v-for="day in forecastData.forecast.forecastday" :key="day.date" 
             class="bg-gray-800 rounded-3xl p-4 flex justify-between items-center">
          <div>
            <div class="text-sm opacity-80">{{ formatDay(day.date) }}</div>
            <div class="flex items-center mt-1">
              <img :src="day.day.condition.icon" class="w-8 h-8 mr-2" :alt="day.day.condition.text">
              <span>{{ day.day.condition.text }}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xl">{{ Math.round(day.day.maxtemp_c) }}°</div>
            <div class="text-sm opacity-80">{{ Math.round(day.day.mintemp_c) }}°</div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        Chargement des prévisions...
      </div>
    </div>
  </div>
</template>

<script>
import { getWeather } from '../services/api'

export default {
  name: 'ForecastView',
  data() {
    return {
      forecastData: null
    }
  },
  methods: {
    formatDay(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      })
    },
    async fetchForecast() {
      try {
        const city = localStorage.getItem('lastCity') || 'Paris'
        const data = await getWeather(city)
        this.forecastData = data
      } catch (error) {
        console.error('Erreur lors du chargement des prévisions:', error)
      }
    }
  },
  mounted() {
    this.fetchForecast()
  }
}
</script> 