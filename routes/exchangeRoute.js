const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/api/exchange/:moneda', async (req, res) => {
    const { moneda } = req.params;
    const apiKey = process.env.EXCHANGE_API_KEY;

    try {
        const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
        );

        const tasa = response.data.conversion_rates[moneda.toUpperCase()];

        if (!tasa) {
            return res.status(404).json({ message: `Moneda ${moneda} no encontrada` });
        }

        return res.json({
            base: 'USD',
            moneda: moneda.toUpperCase(),
            tasa
        });

    } catch (error) {
        console.error('Error al obtener tasa de cambio:', error);
        return res.status(500).json({ message: 'Error al obtener tasa de cambio' });
    }
});

module.exports = router;
