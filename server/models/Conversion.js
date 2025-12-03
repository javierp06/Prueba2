const mongoose = require('mongoose');

const ConversionSchema = new mongoose.Schema({
  fromCurrency: String,
  toCurrency: String,
  amount: Number,
  result: Number,
  rate: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversion', ConversionSchema);
