<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <!-- En-tête -->
    <div class="flex items-center mb-6">
      <router-link to="/" class="mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </router-link>
      <h1 class="text-xl">Mode Voyage</h1>
    </div>

    <!-- Recherche de villes -->
    <div class="space-y-4 mb-6">
      <div v-for="(city, index) in cities" :key="index" class="relative">
        <city-search 
          @select="city => handleCitySelect(index, city)"
          :placeholder="'Ville ' + (index + 1)"
        />
        <button 
          v-if="cities.length > 1" 
          @click="removeCity(index)"
          class="absolute right-2 top-2 p-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <button 
        v-if="cities.length < 3"
        @click="addCity"
        class="w-full py-2 px-4 rounded-xl bg-blue-600 text-white"
      >
        Ajouter une ville
      </button>
    </div>

    <!-- Comparaison des villes -->
    <div class="space-y-4">
      <div v-for="weather in weatherData" :key="weather.location.name"
           class="bg-gray-800 rounded-2xl p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{{ weather.location.name }}</h2>
          <span class="text-2xl font-bold">{{ weather.current.temp_c }}°C</span>
        </div>

        <!-- Détails météo -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm opacity-70">Ressenti</div>
            <div>{{ weather.current.feelslike_c }}°C</div>
          </div>
          <div>
            <div class="text-sm opacity-70">Humidité</div>
            <div>{{ weather.current.humidity }}%</div>
          </div>
          <div>
            <div class="text-sm opacity-70">Vent</div>
            <div>{{ weather.current.wind_kph }} km/h</div>
          </div>
          <div>
            <div class="text-sm opacity-70">Précipitations</div>
            <div>{{ weather.current.precip_mm }} mm</div>
          </div>
        </div>

        <!-- Recommandations vestimentaires -->
        <div class="mt-4 p-3 bg-gray-700 rounded-xl">
          <h3 class="font-medium mb-2">Recommandations</h3>
          <ul class="text-sm space-y-1">
            {{ getClothingRecommendations(weather.current) }}
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import CitySearch from '../components/weather/CitySearch.vue'
import { getWeather } from '../services/api'

export default {
  name: 'TravelModeView',
  components: {
    CitySearch
  },
  setup() {
    const cities = ref([{ name: null }])
    const weatherData = ref([])

    const addCity = () => {
      if (cities.value.length < 3) {
        cities.value.push({ name: null })
      }
    }

    const removeCity = (index) => {
      cities.value = cities.value.filter((_, i) => i !== index)
      weatherData.value = weatherData.value.filter((_, i) => i !== index)
    }

    const handleCitySelect = async (index, city) => {
      cities.value[index] = city
      try {
        const data = await getWeather(city.name)
        weatherData.value[index] = data
      } catch (error) {
        console.error('Erreur:', error)
      }
    }

    const getClothingRecommendations = (current) => {
      const temp = current.temp_c
      const isRaining = current.precip_mm > 0
      const recommendations = []

      if (temp < 10) {
        recommendations.push('Manteau chaud')
        recommendations.push('Écharpe et gants')
      } else if (temp < 20) {
        recommendations.push('Veste légère')
        recommendations.push('Pull')
      } else {
        recommendations.push('Vêtements légers')
        recommendations.push('T-shirt')
      }

      if (isRaining) {
        recommendations.push('Parapluie')
        recommendations.push('Imperméable')
      }

      return recommendations.join(', ')
    }

    return {
      cities,
      weatherData,
      addCity,
      removeCity,
      handleCitySelect,
      getClothingRecommendations
    }
  }
}
</script> 