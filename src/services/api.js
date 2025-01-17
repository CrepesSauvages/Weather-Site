import axios from 'axios'

const API_KEY = 'd50fb900c8a54a89b41190059251301'
const BASE_URL = 'https://api.weatherapi.com/v1'

export const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY
  }
})

export const getWeather = async (city) => {
  try {
    const response = await weatherApi.get('/forecast.json', {
      params: {
        q: city,
        days: 7,
        aqi: 'yes'
      }
    })
    return response.data
  } catch (error) {
    console.error('Erreur API:', error)
    throw error
  }
} 

// Fonction pour obtenir l'historique des températures
export const getTemperatureHistory = async (city, days = 7) => {
  try {
    const response = await weatherApi.get('/history.json', {
      params: {
        q: city,
        days: days,
        aqi: 'yes'
      }
    })
    return response.data
  } catch (error) {
    console.error('Erreur API température:', error)
    throw error
  }
}

// Fonction pour obtenir les données de qualité de l'air
export const getAirQuality = async (city) => {
  try {
    const response = await weatherApi.get('/current.json', {
      params: {
        q: city,
        aqi: 'yes'
      }
    })
    return response.data.current.air_quality
  } catch (error) {
    console.error('Erreur API qualité air:', error)
    throw error
  }
}

// Fonction pour obtenir les prévisions horaires
export const getHourlyForecast = async (city) => {
  try {
    const response = await weatherApi.get('/forecast.json', {
      params: {
        q: city,
        days: 1,
        aqi: 'yes',
        hour: 24
      }
    })
    return response.data.forecast.forecastday[0].hour
  } catch (error) {
    console.error('Erreur API prévisions:', error)
    throw error
  }
} 