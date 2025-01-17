<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <!-- En-tête -->
    <div class="flex items-center mb-6">
      <router-link to="/" class="mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </router-link>
      <h1 class="text-xl">Rapport de Température</h1>
    </div>

    <!-- Graphique principal -->
    <div class="bg-gray-800 rounded-2xl p-4 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg">Évolution sur 24h</h2>
        <div class="flex space-x-2">
          <button 
            v-for="period in ['24h', '7j', '30j']" 
            :key="period"
            @click="changePeriod(period)"
            class="px-3 py-1 rounded-full text-sm"
            :class="selectedPeriod === period ? 'bg-blue-500' : 'bg-gray-700'"
          >
            {{ period }}
          </button>
        </div>
      </div>
      <div class="relative h-64">
        <canvas ref="tempChart"></canvas>
      </div>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="error" class="bg-red-500 bg-opacity-20 text-red-100 p-4 rounded-xl mb-4">
      {{ error }}
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <!-- Contenu principal -->
    <div v-else>
      <!-- Statistiques détaillées -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-gray-800 rounded-2xl p-4">
          <div class="text-sm opacity-70 mb-1">Température max</div>
          <div class="text-3xl font-bold text-red-400">
            {{ maxTemp === '--' ? '--' : `${maxTemp}°C` }}
          </div>
          <div class="text-sm opacity-70">{{ maxTempTime }}</div>
        </div>
        <div class="bg-gray-800 rounded-2xl p-4">
          <div class="text-sm opacity-70 mb-1">Température min</div>
          <div class="text-3xl font-bold text-blue-400">
            {{ minTemp === '--' ? '--' : `${minTemp}°C` }}
          </div>
          <div class="text-sm opacity-70">{{ minTempTime }}</div>
        </div>
      </div>

      <!-- Analyse détaillée -->
      <div class="bg-gray-800 rounded-2xl p-4 mb-6">
        <h3 class="text-lg mb-4">Analyse de la journée</h3>
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="w-24 text-sm opacity-70">Moyenne</div>
            <div class="flex-1">
              <div class="h-2 bg-gray-700 rounded-full">
                <div 
                  class="h-full bg-blue-500 rounded-full"
                  :style="{ width: `${(avgTemp / maxTemp) * 100}%` }"
                ></div>
              </div>
            </div>
            <div class="w-16 text-right">{{ avgTemp }}°C</div>
          </div>
          <div class="flex items-center">
            <div class="w-24 text-sm opacity-70">Ressenti</div>
            <div class="flex-1">
              <div class="h-2 bg-gray-700 rounded-full">
                <div 
                  class="h-full bg-green-500 rounded-full"
                  :style="{ width: `${(feelsLike / maxTemp) * 100}%` }"
                ></div>
              </div>
            </div>
            <div class="w-16 text-right">{{ feelsLike }}°C</div>
          </div>
        </div>
      </div>

      <!-- Prévisions -->
      <div class="bg-gray-800 rounded-2xl p-4">
        <h3 class="text-lg mb-4">Tendance à venir</h3>
        <div class="flex justify-between">
          <div v-for="(forecast, index) in hourlyForecast" 
               :key="index"
               class="text-center">
            <div class="text-sm opacity-70">{{ forecast.time }}</div>
            <div class="text-xl font-bold my-2">{{ forecast.temp }}°C</div>
            <div class="text-sm" :class="getTrendColor(forecast.trend)">
              {{ forecast.trend > 0 ? '+' : ''}}{{ forecast.trend }}°
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { getTemperatureHistory, getHourlyForecast } from '../services/api'

export default {
  name: 'TemperatureReportView',
  setup() {
    const tempChart = ref(null)
    const selectedPeriod = ref('24h')
    const maxTemp = ref('--')
    const minTemp = ref('--')
    const avgTemp = ref('--')
    const feelsLike = ref('--')
    const maxTempTime = ref('--:--')
    const minTempTime = ref('--:--')
    const hourlyForecast = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchTemperatureData = async () => {
      try {
        loading.value = true
        const city = localStorage.getItem('lastCity') || 'Paris'
        
        const hourlyData = await getHourlyForecast(city)
        
        // Vérifier que nous avons des données valides
        if (hourlyData && hourlyData.length > 0) {
          // Filtrer les valeurs nulles ou undefined avant les calculs
          const validTemps = hourlyData.filter(h => h.temp_c != null && !isNaN(h.temp_c))
          
          if (validTemps.length > 0) {
            maxTemp.value = Math.max(...validTemps.map(h => h.temp_c))
            minTemp.value = Math.min(...validTemps.map(h => h.temp_c))
            avgTemp.value = Number((validTemps.reduce((acc, h) => acc + h.temp_c, 0) / validTemps.length).toFixed(1))
            
            // Obtenir la température ressentie actuelle
            const currentHour = new Date().getHours()
            const currentData = validTemps.find(h => new Date(h.time).getHours() === currentHour)
            feelsLike.value = currentData ? currentData.feelslike_c : '--'

            // Trouver les heures des températures max et min
            const maxTempHour = validTemps.find(h => h.temp_c === maxTemp.value)
            const minTempHour = validTemps.find(h => h.temp_c === minTemp.value)
            
            if (maxTempHour) {
              maxTempTime.value = new Date(maxTempHour.time).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            }
            
            if (minTempHour) {
              minTempTime.value = new Date(minTempHour.time).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            }

            // Mettre à jour le graphique
            updateChart(validTemps)

            // Préparer les prévisions futures
            const now = new Date()
            hourlyForecast.value = validTemps
              .filter(h => new Date(h.time) > now)
              .slice(0, 5)
              .map((h, i, arr) => ({
                time: new Date(h.time).toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }),
                temp: h.temp_c,
                trend: i > 0 ? Number((h.temp_c - arr[i-1].temp_c).toFixed(1)) : 0
              }))
          }
        } else {
          throw new Error('Aucune donnée de température disponible')
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err)
        error.value = 'Impossible de charger les données de température'
        // Réinitialiser les valeurs en cas d'erreur
        maxTemp.value = '--'
        minTemp.value = '--'
        avgTemp.value = '--'
        feelsLike.value = '--'
      } finally {
        loading.value = false
      }
    }

    const updateChart = (data) => {
      if (!tempChart.value) return

      const ctx = tempChart.value.getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(h => new Date(h.time).toLocaleTimeString('fr-FR', { hour: '2-digit' })),
          datasets: [{
            label: 'Température',
            data: data.map(h => h.temp_c),
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.7)'
              }
            }
          }
        }
      })
    }

    onMounted(() => {
      fetchTemperatureData()
    })

    return {
      tempChart,
      selectedPeriod,
      maxTemp,
      minTemp,
      avgTemp,
      feelsLike,
      maxTempTime,
      minTempTime,
      hourlyForecast,
      loading,
      error
    }
  }
}
</script> 