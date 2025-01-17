<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <!-- Version mobile -->
    <div class="md:hidden">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold dark:text-white">{{ weather.location.name }}</h2>
        <p class="text-gray-600 dark:text-gray-300">{{ weather.location.country }}</p>
      </div>
      <div class="flex flex-col items-center">
        <img :src="weather.current.condition.icon" :alt="weather.current.condition.text" class="w-24 h-24">
        <p class="text-4xl font-bold dark:text-white">{{ weather.current.temp_c }}°C</p>
        <p class="text-gray-600 dark:text-gray-300">{{ weather.current.condition.text }}</p>
      </div>
    </div>

    <!-- Version desktop -->
    <div class="hidden md:flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold dark:text-white">{{ weather.location.name }}</h2>
        <p class="text-gray-600 dark:text-gray-300">{{ weather.location.country }}</p>
      </div>
      <div class="flex items-center space-x-6">
        <img :src="weather.current.condition.icon" :alt="weather.current.condition.text" class="w-24 h-24">
        <div class="text-right">
          <p class="text-4xl font-bold dark:text-white">{{ weather.current.temp_c }}°C</p>
          <p class="text-gray-600 dark:text-gray-300">{{ weather.current.condition.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeatherCard',
  props: {
    weather: {
      type: Object,
      required: true
    }
  }
}
</script> 