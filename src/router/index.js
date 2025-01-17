import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ForecastView from '../views/ForecastView.vue'
import TravelModeView from '../views/TravelModeView.vue'
import StatsView from '../views/StatsView.vue'
import TemperatureReportView from '../views/TemperatureReportView.vue'
import AirQualityReportView from '../views/AirQualityReportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/forecast',
      name: 'forecast',
      component: ForecastView
    },
    {
      path: '/travel',
      name: 'travel',
      component: TravelModeView
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView
    },
    {
      path: '/temperature-report',
      name: 'temperature-report',
      component: TemperatureReportView
    },
    {
      path: '/air-quality-report',
      name: 'air-quality-report',
      component: AirQualityReportView
    }
  ]
})

export default router 