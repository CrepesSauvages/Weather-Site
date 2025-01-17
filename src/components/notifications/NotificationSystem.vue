<template>
  <div class="fixed bottom-0 left-0 right-0 p-4 z-50">
    <div class="max-w-md mx-auto space-y-2">
      <div v-for="notification in notifications" 
           :key="notification.id"
           class="bg-gray-800 rounded-2xl p-4 shadow-lg flex items-center justify-between"
           :class="getNotificationClass(notification.type)">
        <div class="flex items-center">
          <span class="mr-3">
            <svg v-if="notification.type === 'rain'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
            </svg>
            <svg v-else-if="notification.type === 'extreme'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </span>
          <div>
            <div class="font-medium">{{ notification.title }}</div>
            <div class="text-sm opacity-80">{{ notification.message }}</div>
          </div>
        </div>
        <button @click="removeNotification(notification.id)" class="ml-4">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationSystem',
  data() {
    return {
      notifications: []
    }
  },
  methods: {
    addNotification(notification) {
      const id = Date.now()
      this.notifications.push({
        id,
        ...notification
      })
      setTimeout(() => this.removeNotification(id), 5000)
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },
    getNotificationClass(type) {
      switch(type) {
        case 'rain':
          return 'bg-blue-600 text-white'
        case 'extreme':
          return 'bg-red-600 text-white'
        case 'air':
          return 'bg-yellow-600 text-white'
        default:
          return 'bg-gray-800 text-white'
      }
    }
  }
}
</script> 