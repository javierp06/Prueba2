require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Conversion = require('./models/Conversion');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let isMongoConnected = false;
const localHistory = [];

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://javierp191999_db_user:MRzdcwhl4ptA3TqL@cluster0.96ocxfm.mongodb.net/')
    .then(() => {
        console.log('MongoDB conectado');
        isMongoConnected = true;
    })
    .catch(err => {
        console.log('Fallo la conexion a MongoDB o no esta configurada. Usando almacenamiento en memoria.');
        console.error('Error de conexion a MongoDB:', err);
    });

app.get('/api/history', async (req, res) => {
    try {
        if (isMongoConnected) {
            const history = await Conversion.find().sort({ date: -1 }).limit(10);
            res.json(history);
        } else {
            const history = [...localHistory].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
            res.json(history);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/convert', async (req, res) => {
    const { fromCurrency, toCurrency, amount, result, rate } = req.body;

    if (isMongoConnected) {
        const conversion = new Conversion({
            fromCurrency,
            toCurrency,
            amount,
            result,
            rate
        });

        try {
            const newConversion = await conversion.save();
            res.status(201).json(newConversion);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    } else {
        const newConversion = {
            _id: Date.now().toString(),
            fromCurrency,
            toCurrency,
            amount,
            result,
            rate,
            date: new Date()
        };
        localHistory.push(newConversion);
        res.status(201).json(newConversion);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
