<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- En-tête avec ville et température principale -->
    <div class="p-6 bg-blue-500 rounded-b-3xl">
      <div class="flex justify-between items-center mb-4">
        <button class="p-2" @click="showSearch = true">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
        <button class="p-2" @click="getCurrentLocation">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
      </div>

      <!-- Modal de recherche -->
      <div v-if="showSearch" 
           class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
        <div class="bg-gray-900 w-full mx-4 rounded-3xl p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl">Rechercher une ville</h2>
            <button @click="showSearch = false" class="p-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <city-search @select="handleCitySelect" />
        </div>
      </div>

      <div class="text-center mb-8">
        <h1 class="text-2xl mb-2">{{ weather?.location?.name || 'Chargement...' }}</h1>
        <p class="text-sm opacity-80">{{ weather?.current?.condition?.text || 'Mostly Sunny' }}</p>
      </div>

      <div class="flex justify-center items-center mb-8">
        <div class="text-center">
          <div class="text-7xl font-light mb-4">{{ weather?.current?.temp_c || '--' }}°</div>
          <div class="flex justify-center space-x-6">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <span>{{ weather?.current?.wind_kph || '--' }}km/h</span>
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
              <span>{{ weather?.current?.humidity || '--' }}%</span>
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <span>{{ weather?.current?.vis_km || '--' }}km</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Prévisions horaires -->
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg">Today</h2>
        <router-link to="/forecast" class="text-blue-400 text-sm">Next 7 Days ></router-link>
      </div>
      
      <div class="flex space-x-4 overflow-x-auto pb-4">
        <div v-for="hour in hourlyForecast" :key="hour.time" 
             class="flex-shrink-0 w-20 bg-gray-800 rounded-3xl p-4 text-center"
             :class="{ 'bg-blue-500': hour.isNow }">
          <div class="text-sm mb-2">{{ formatHour(hour.time) }}</div>
          <img :src="hour.condition.icon" class="w-8 h-8 mx-auto mb-2" :alt="hour.condition.text">
          <div class="text-lg">{{ Math.round(hour.temp_c) }}°</div>
        </div>
      </div>
    </div>

    <!-- Graphique de température -->
    <div class="p-6">
      <weather-chart :hourly-data="hourlyForecast" />
    </div>

    <!-- Qualité de l'air -->
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg">Air Quality</h2>
        <router-link to="/air-quality-report" class="text-blue-400 text-sm">View Report ></router-link>
      </div>
      
      <div class="bg-gray-800 rounded-3xl p-4">
        <div class="flex items-center mb-2">
          <div class="text-2xl font-bold mr-2">{{ weather?.current?.air_quality?.['gb-defra-index'] || '--' }}</div>
          <div class="text-sm opacity-80">(O₃/Ozone)</div>
        </div>
        <p class="text-sm opacity-80">Air quality is acceptable; however, sensitive groups may experience minor health effects.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getWeather } from '../services/api'
import CitySearch from '../components/weather/CitySearch.vue'
import WeatherChart from '../components/weather/WeatherChart.vue'

export default {
  name: 'HomeView',
  components: {
    CitySearch,
    WeatherChart
  },
  data() {
    return {
      weather: null,
      hourlyForecast: [],
      showSearch: false
    }
  },
  methods: {
    formatHour(timestamp) {
      return new Date(timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    async fetchWeather(city = 'Paris') {
      try {
        const response = await getWeather(city)
        this.weather = response
        localStorage.setItem('lastCity', city)
        this.hourlyForecast = response.forecast.forecastday[0].hour.map(hour => ({
          time: hour.time,
          temp_c: hour.temp_c,
          isNow: new Date(hour.time).getHours() === new Date().getHours(),
          condition: hour.condition
        }))
      } catch (error) {
        console.error('Erreur:', error)
      }
    },
    async getCurrentLocation() {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
          })
          
          const { latitude, longitude } = position.coords
          await this.fetchWeather(`${latitude},${longitude}`)
        } catch (error) {
          console.error('Erreur de géolocalisation:', error)
          await this.fetchWeather('Paris')
        }
      } else {
        console.log('Géolocalisation non supportée')
        await this.fetchWeather('Paris')
      }
    },
    handleCitySelect(city) {
      this.showSearch = false
      this.fetchWeather(city.name)
    }
  },
  mounted() {
    this.getCurrentLocation()
  }
}
</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style> 