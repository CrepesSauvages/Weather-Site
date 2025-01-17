<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <!-- En-tête -->
    <div class="flex items-center mb-6">
      <router-link to="/" class="mr-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </router-link>
      <h1 class="text-xl">Statistiques</h1>
    </div>

    <!-- Graphique des températures -->
    <div class="bg-gray-800 rounded-2xl p-4 mb-6">
      <h2 class="text-lg mb-4">Évolution des températures</h2>
      <div class="relative h-60">
        <canvas ref="tempChart"></canvas>
      </div>
    </div>

    <!-- Records -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-800 rounded-2xl p-4">
        <h3 class="text-sm opacity-70 mb-1">Record de chaleur</h3>
        <div class="text-2xl font-bold">{{ maxTemp }}°C</div>
        <div class="text-sm opacity-70">{{ maxTempDate }}</div>
      </div>
      <div class="bg-gray-800 rounded-2xl p-4">
        <h3 class="text-sm opacity-70 mb-1">Record de froid</h3>
        <div class="text-2xl font-bold">{{ minTemp }}°C</div>
        <div class="text-sm opacity-70">{{ minTempDate }}</div>
      </div>
    </div>

    <!-- Tendances -->
    <div class="bg-gray-800 rounded-2xl p-4">
      <h2 class="text-lg mb-4">Tendances</h2>
      <div class="space-y-4">
        <div v-for="trend in trends" :key="trend.label" class="flex items-center">
          <div class="w-32 text-sm opacity-70">{{ trend.label }}</div>
          <div class="flex-1 bg-gray-700 rounded-full h-2">
            <div class="bg-blue-500 h-full rounded-full" :style="{ width: trend.value + '%' }"></div>
          </div>
          <div class="w-16 text-right text-sm">{{ trend.value }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'StatsView',
  setup() {
    const tempChart = ref(null)
    const maxTemp = ref(35)
    const minTemp = ref(2)
    const maxTempDate = ref('15 juillet 2023')
    const minTempDate = ref('5 janvier 2023')
    const trends = ref([
      { label: 'Jours ensoleillés', value: 65 },
      { label: 'Jours pluvieux', value: 25 },
      { label: 'Jours nuageux', value: 45 },
      { label: 'Qualité de l\'air', value: 80 }
    ])

    onMounted(() => {
      const ctx = tempChart.value.getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'],
          datasets: [{
            label: 'Température moyenne',
            data: [8, 10, 15, 18, 22, 25, 28],
            borderColor: '#3498db',
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
    })

    return {
      tempChart,
      maxTemp,
      minTemp,
      maxTempDate,
      minTempDate,
      trends
    }
  }
}
</script> 