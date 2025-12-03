<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const amount = ref(1);
const fromCurrency = ref('USD');
const toCurrency = ref('EUR');
const result = ref(0);
const currencies = ref([]);
const rate = ref(0);
const loading = ref(false);
const error = ref(null);

const fetchCurrencies = async () => {
  try {
    const response = await axios.get('https://open.er-api.com/v6/latest/USD');
    currencies.value = Object.keys(response.data.rates);
  } catch (err) {
    error.value = 'Error al obtener monedas';
  }
};

const convert = async () => {
  if (!amount.value) return;
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency.value}`);
    const rates = response.data.rates;
    rate.value = rates[toCurrency.value];
    result.value = (amount.value * rate.value).toFixed(2);
    
    await axios.post('http://localhost:5000/api/convert', {
      fromCurrency: fromCurrency.value,
      toCurrency: toCurrency.value,
      amount: amount.value,
      result: result.value,
      rate: rate.value
    });
    
  } catch (err) {
    error.value = 'Error al convertir moneda';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCurrencies();
});
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Conversor de Monedas</h2>
    
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2">Cantidad</label>
      <input v-model="amount" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
    </div>
    
    <div class="flex gap-4 mb-4">
      <div class="w-1/2">
        <label class="block text-gray-700 text-sm font-bold mb-2">De</label>
        <select v-model="fromCurrency" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
        </select>
      </div>
      <div class="w-1/2">
        <label class="block text-gray-700 text-sm font-bold mb-2">A</label>
        <select v-model="toCurrency" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option v-for="currency in currencies" :key="currency" :value="currency">{{ currency }}</option>
        </select>
      </div>
    </div>
    
    <button @click="convert" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" :disabled="loading">
      {{ loading ? 'Convirtiendo...' : 'Convertir' }}
    </button>
    
    <div v-if="result" class="mt-6 text-center">
      <p class="text-gray-600">Resultado:</p>
      <p class="text-3xl font-bold text-green-600">{{ amount }} {{ fromCurrency }} = {{ result }} {{ toCurrency }}</p>
      <p class="text-sm text-gray-500 mt-1">1 {{ fromCurrency }} = {{ rate }} {{ toCurrency }}</p>
    </div>

    <div v-if="error" class="mt-4 text-red-500 text-center">
      {{ error }}
    </div>
  </div>
</template>
