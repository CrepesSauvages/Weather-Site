<template>
  <div class="p-4">
    <div class="grid grid-cols-2 gap-4">
      <div v-for="widget in activeWidgets" 
           :key="widget.id"
           class="bg-gray-800 rounded-2xl p-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-medium">{{ widget.title }}</h3>
          <button @click="toggleWidget(widget.id)" class="text-sm text-blue-400">
            Masquer
          </button>
        </div>
        
        <component 
          :is="widget.component"
          v-bind="widget.props"
        />
      </div>
    </div>

    <!-- Menu de personnalisation -->
    <div class="mt-4">
      <button 
        @click="showCustomize = true"
        class="bg-blue-500 text-white rounded-full px-4 py-2 text-sm"
      >
        Personnaliser les widgets
      </button>

      <div v-if="showCustomize" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-gray-900 rounded-3xl p-6 w-full max-w-md">
          <h2 class="text-xl mb-4">Personnaliser les widgets</h2>
          
          <div class="space-y-2">
            <div v-for="widget in allWidgets" 
                 :key="widget.id"
                 class="flex items-center justify-between p-2 rounded"
            >
              <span>{{ widget.title }}</span>
              <label class="switch">
                <input 
                  type="checkbox"
                  :checked="isWidgetActive(widget.id)"
                  @change="toggleWidget(widget.id)"
                >
                <span class="slider round"></span>
              </label>
            </div>
          </div>

          <button 
            @click="showCustomize = false"
            class="mt-4 w-full bg-blue-500 text-white rounded-full py-2"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'WidgetGrid',
  props: {
    weather: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const showCustomize = ref(false)
    const activeWidgetIds = ref(
      JSON.parse(localStorage.getItem('activeWidgets')) || 
      ['temperature', 'precipitation', 'uv', 'air']
    )

    const allWidgets = [
      {
        id: 'temperature',
        title: 'Température',
        component: 'temperature-widget',
        props: { weather: props.weather }
      },
      {
        id: 'precipitation',
        title: 'Précipitations',
        component: 'precipitation-widget',
        props: { weather: props.weather }
      },
      {
        id: 'uv',
        title: 'Index UV',
        component: 'uv-widget',
        props: { weather: props.weather }
      },
      {
        id: 'air',
        title: 'Qualité de l\'air',
        component: 'air-quality-widget',
        props: { weather: props.weather }
      }
    ]

    const activeWidgets = computed(() => 
      allWidgets.filter(widget => activeWidgetIds.value.includes(widget.id))
    )

    const toggleWidget = (id) => {
      if (activeWidgetIds.value.includes(id)) {
        activeWidgetIds.value = activeWidgetIds.value.filter(w => w !== id)
      } else {
        activeWidgetIds.value.push(id)
      }
      localStorage.setItem('activeWidgets', JSON.stringify(activeWidgetIds.value))
    }

    const isWidgetActive = (id) => activeWidgetIds.value.includes(id)

    return {
      showCustomize,
      allWidgets,
      activeWidgets,
      toggleWidget,
      isWidgetActive
    }
  }
}
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3498db;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style> 