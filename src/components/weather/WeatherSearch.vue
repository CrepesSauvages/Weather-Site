<template>
  <div class="mb-6">
    <input 
      type="text" 
      v-model="searchQuery"
      @keyup.enter="onSearch"
      placeholder="Rechercher une ville..."
      class="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white dark:border-gray-700"
    >
  </div>
</template>

<script>
export default {
  name: 'WeatherSearch',
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    onSearch() {
      if (this.searchQuery.trim()) {
        this.$emit('search', this.searchQuery)
      }
    }
  }
}
</script> 