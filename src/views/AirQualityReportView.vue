<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <!-- En-tête -->
    <div class="flex items-center mb-6">
      <router-link to="/" class="mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </router-link>
      <h1 class="text-xl">Qualité de l'Air</h1>
    </div>

    <!-- Score principal -->
    <div class="bg-gray-800 rounded-2xl p-6 mb-6">
      <div class="text-center">
        <div class="relative inline-block">
          <svg class="w-32 h-32" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#444"
              stroke-width="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              :stroke="getAqiColor(aqi)"
              stroke-width="3"
              :stroke-dasharray="`${aqi}, 100`"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div>
              <div class="text-3xl font-bold">{{ aqi }}</div>
              <div class="text-sm opacity-70">AQI</div>
            </div>
          </div>
        </div>
        <div class="mt-4 text-lg font-medium" :class="getAqiTextColor(aqi)">
          {{ getAqiLabel(aqi) }}
        </div>
      </div>
    </div>

    <!-- Polluants détaillés -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div v-for="pollutant in pollutants" 
           :key="pollutant.name"
           class="bg-gray-800 rounded-2xl p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <div class="text-sm opacity-70">{{ pollutant.name }}</div>
            <div class="text-2xl font-bold">{{ pollutant.value }}</div>
          </div>
          <div :class="getPollutantStatusColor(pollutant.status)" 
               class="px-2 py-1 rounded-full text-xs">
            {{ pollutant.status }}
          </div>
        </div>
        <div class="h-2 bg-gray-700 rounded-full">
          <div class="h-full rounded-full" 
               :class="getPollutantBarColor(pollutant.status)"
               :style="{ width: `${pollutant.percentage}%` }">
          </div>
        </div>
      </div>
    </div>

    <!-- Recommandations -->
    <div class="bg-gray-800 rounded-2xl p-4 mb-6">
      <h3 class="text-lg mb-4">Recommandations</h3>
      <div class="space-y-4">
        <div v-for="(recommendation, index) in recommendations" 
             :key="index"
             class="flex items-start space-x-3">
          <div class="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    :d="recommendation.icon"/>
            </svg>
          </div>
          <div>
            <div class="font-medium">{{ recommendation.title }}</div>
            <div class="text-sm opacity-70">{{ recommendation.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historique -->
    <div class="bg-gray-800 rounded-2xl p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg">Historique</h3>
        <div class="flex space-x-2">
          <button 
            v-for="period in ['24h', '7j', '30j']" 
            :key="period"
            @click="selectedPeriod = period"
            class="px-3 py-1 rounded-full text-sm"
            :class="selectedPeriod === period ? 'bg-blue-500' : 'bg-gray-700'"
          >
            {{ period }}
          </button>
        </div>
      </div>
      <div class="relative h-48">
        <canvas ref="historyChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { getAirQuality, getTemperatureHistory } from '../services/api'

export default {
  name: 'AirQualityReportView',
  setup() {
    const historyChart = ref(null)
    const selectedPeriod = ref('24h')
    const aqi = ref(0)
    const pollutants = ref([])
    const loading = ref(true)
    const error = ref(null)

    const recommendations = ref([
      {
        title: 'Activités extérieures',
        description: '',
        icon: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 5.28c-1.23-.37-2.22-1.17-2.8-2.18l-1-1.6c-.41-.65-1.11-1-1.84-1-.78 0-1.59.5-1.78 1.44S7 23 7 23'
      },
      {
        title: 'Ventilation',
        description: '',
        icon: 'M9.5 4.5l5 5M4 19l5-5m0 0l5 5m-5-5v12m0-12V3'
      },
      {
        title: 'Groupes sensibles',
        description: '',
        icon: 'M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75'
      }
    ])

    const updateRecommendations = (aqiValue) => {
      if (aqiValue <= 50) {
        recommendations.value[0].description = 'Conditions idéales pour les activités en plein air'
        recommendations.value[1].description = 'Excellent moment pour aérer votre logement'
        recommendations.value[2].description = 'Aucune précaution particulière nécessaire'
      } else if (aqiValue <= 100) {
        recommendations.value[0].description = 'Les activités en plein air sont possibles avec modération'
        recommendations.value[1].description = 'Aérez pendant les heures les plus fraîches'
        recommendations.value[2].description = 'Les personnes sensibles devraient limiter l\'effort prolongé'
      } else {
        recommendations.value[0].description = 'Limitez les activités en extérieur'
        recommendations.value[1].description = 'Gardez les fenêtres fermées aux heures de pointe'
        recommendations.value[2].description = 'Les personnes sensibles devraient rester à l\'intérieur'
      }
    }

    const getAqiLabel = (value) => {
      if (value <= 50) return 'Excellent'
      if (value <= 100) return 'Bon'
      if (value <= 150) return 'Moyen'
      if (value <= 200) return 'Mauvais'
      return 'Très mauvais'
    }

    const getPollutantStatus = (value, pollutant) => {
      const thresholds = {
        'pm2_5': { excellent: 10, good: 25, moderate: 50 },
        'pm10': { excellent: 20, good: 50, moderate: 100 },
        'o3': { excellent: 60, good: 120, moderate: 180 },
        'no2': { excellent: 40, good: 100, moderate: 200 }
      }
      
      const t = thresholds[pollutant]
      if (value <= t.excellent) return 'Très bon'
      if (value <= t.good) return 'Bon'
      if (value <= t.moderate) return 'Moyen'
      return 'Mauvais'
    }

    const fetchAirQualityData = async () => {
      try {
        loading.value = true
        const city = localStorage.getItem('lastCity') || 'Paris'
        const data = await getAirQuality(city)
        
        // Mettre à jour l'AQI
        aqi.value = Math.round(data.pm10)  // Utiliser PM10 comme indicateur principal

        // Mettre à jour les polluants
        pollutants.value = [
          {
            name: 'PM2.5',
            value: `${data.pm2_5.toFixed(1)} µg/m³`,
            status: getPollutantStatus(data.pm2_5, 'pm2_5'),
            percentage: Math.min((data.pm2_5 / 50) * 100, 100)
          },
          {
            name: 'PM10',
            value: `${data.pm10.toFixed(1)} µg/m³`,
            status: getPollutantStatus(data.pm10, 'pm10'),
            percentage: Math.min((data.pm10 / 100) * 100, 100)
          },
          {
            name: 'O3',
            value: `${data.o3.toFixed(1)} µg/m³`,
            status: getPollutantStatus(data.o3, 'o3'),
            percentage: Math.min((data.o3 / 180) * 100, 100)
          },
          {
            name: 'NO2',
            value: `${data.no2.toFixed(1)} µg/m³`,
            status: getPollutantStatus(data.no2, 'no2'),
            percentage: Math.min((data.no2 / 200) * 100, 100)
          }
        ]

        // Mettre à jour les recommandations
        updateRecommendations(aqi.value)

        // Mettre à jour le graphique
        await updateHistoryChart(city)

      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
        error.value = 'Impossible de charger les données de qualité de l\'air'
      } finally {
        loading.value = false
      }
    }

    const updateHistoryChart = async (city) => {
      try {
        const history = await getTemperatureHistory(city, 1)
        const hourlyData = history.forecast.forecastday[0].hour

        const ctx = historyChart.value.getContext('2d')
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: hourlyData.map(h => new Date(h.time).toLocaleTimeString('fr-FR', { hour: '2-digit' })),
            datasets: [{
              label: 'AQI',
              data: hourlyData.map(h => h.air_quality?.pm10 || null),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
      } catch (error) {
        console.error('Erreur lors de la mise à jour du graphique:', error)
      }
    }

    onMounted(() => {
      fetchAirQualityData()
    })

    return {
      historyChart,
      selectedPeriod,
      aqi,
      pollutants,
      recommendations,
      loading,
      error,
      getAqiLabel,
      getPollutantStatus
    }
  }
}
</script> 