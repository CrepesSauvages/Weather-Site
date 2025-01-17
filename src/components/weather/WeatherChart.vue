<template>
  <div class="bg-gray-800 rounded-3xl p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg">Temperature</h3>
      <router-link to="/temperature-report" class="text-blue-400 text-sm">View Report ></router-link>
    </div>
    
    <div class="relative h-40">
      <!-- Ligne du graphique -->
      <svg class="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
        <path
          :d="chartPath"
          fill="none"
          stroke="#3498db"
          stroke-width="2"
        />
        <!-- Points sur le graphique -->
        <circle
          v-for="(point, index) in chartPoints"
          :key="index"
          :cx="point.x"
          :cy="point.y"
          r="3"
          fill="#3498db"
        />
      </svg>
      
      <!-- Labels des heures -->
      <div class="flex justify-between mt-2">
        <div v-for="(hour, index) in hourlyData" :key="index" class="text-xs opacity-80">
          {{ formatHour(hour.time) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeatherChart',
  props: {
    hourlyData: {
      type: Array,
      required: true
    }
  },
  computed: {
    chartPoints() {
      const maxTemp = Math.max(...this.hourlyData.map(h => h.temp_c))
      const minTemp = Math.min(...this.hourlyData.map(h => h.temp_c))
      const range = maxTemp - minTemp

      return this.hourlyData.map((hour, index) => {
        const x = (index / (this.hourlyData.length - 1)) * 300
        const y = 100 - ((hour.temp_c - minTemp) / range) * 80
        return { x, y }
      })
    },
    chartPath() {
      return `M ${this.chartPoints.map(p => `${p.x},${p.y}`).join(' L ')}`
    }
  },
  methods: {
    formatHour(timestamp) {
      return new Date(timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit'
      })
    }
  }
}
</script> 