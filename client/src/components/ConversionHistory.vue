<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const history = ref([]);

const fetchHistory = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/history');
    history.value = response.data;
  } catch (err) {
    console.error('Error al obtener historial', err);
  }
};

onMounted(() => {
  fetchHistory();
  setInterval(fetchHistory, 2000);
});
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-6">
    <h3 class="text-xl font-bold mb-4 text-gray-800">Historial de Conversiones</h3>
    <ul class="divide-y divide-gray-200">
      <li v-for="item in history" :key="item._id" class="py-2">
        <div class="flex justify-between">
          <span class="font-medium">{{ item.amount }} {{ item.fromCurrency }} ➔ {{ item.result }} {{ item.toCurrency }}</span>
          <span class="text-gray-500 text-sm">{{ new Date(item.date).toLocaleTimeString() }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
