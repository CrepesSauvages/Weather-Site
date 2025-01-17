<template>
  <div class="relative">
    <input 
      type="text" 
      v-model="searchQuery"
      @input="handleSearch"
      placeholder="Rechercher une ville..."
      class="w-full bg-gray-800 text-white rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
    
    <!-- Résultats de recherche -->
    <div v-if="showResults && results.length" 
         class="absolute w-full mt-2 bg-gray-800 rounded-xl shadow-lg z-50">
      <div v-for="result in results" 
           :key="result.id"
           @click="selectCity(result)"
           class="px-4 py-2 hover:bg-gray-700 cursor-pointer first:rounded-t-xl last:rounded-b-xl">
        {{ result.name }}, {{ result.country }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'

export default {
  name: 'CitySearch',
  setup(props, { emit }) {
    const searchQuery = ref('')
    const results = ref([])
    const showResults = ref(false)

    const handleSearch = debounce(async () => {
      if (searchQuery.value.length < 2) {
        results.value = []
        return
      }

      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${searchQuery.value}`
        )
        results.value = await response.json()
        showResults.value = true
      } catch (error) {
        console.error('Erreur de recherche:', error)
      }
    }, 300)

    const selectCity = (city) => {
      emit('select', city)
      searchQuery.value = ''
      showResults.value = false
    }

    // Fermer les résultats quand on clique ailleurs
    const handleClickOutside = (event) => {
      if (!event.target.closest('.city-search')) {
        showResults.value = false
      }
    }

    watch(searchQuery, () => {
      if (!searchQuery.value) {
        showResults.value = false
      }
    })

    return {
      searchQuery,
      results,
      showResults,
      handleSearch,
      selectCity
    }
  }
}
</script> 