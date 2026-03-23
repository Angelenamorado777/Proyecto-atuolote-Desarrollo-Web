const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');

router.get('/api/vehiculos', (req, res) => {
    const query = 'SELECT * FROM vehiculos';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los vehículos:', error);
            return res.status(500).json({ message: 'Error al obtener los vehículos' });
        }
        return res.json(results);
    });
});


router.get('/api/vehiculos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM vehiculos WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al obtener el vehículo:', error);
            return res.status(500).json({ message: 'Error al obtener el vehículo' });
        } 
        if (results.length === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        } return res.json(results[0]);
    });
});

router.get('/api/vehiculos/:id/precios', async (req, res) => {
    const { id } = req.params;
    const apiKey = process.env.EXCHANGE_API_KEY;

    try {
        // 1. Obtener el vehículo de la BD
        const db = require('../config/db');
        db.query('SELECT * FROM vehiculos WHERE id = ?', [id], async (error, results) => {
            if (error) return res.status(500).json({ message: 'Error al obtener el vehículo' });
            if (results.length === 0) return res.status(404).json({ message: 'Vehículo no encontrado' });

            const vehiculo = results[0];
            const precioUSD = vehiculo.precio;

            // 2. Obtener tasas de cambio
            const response = await axios.get(
                `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
            );

            const rates = response.data.conversion_rates;

            // 3. Devolver el precio en múltiples monedas
            return res.json({
                vehiculo: {
                    id: vehiculo.id,
                    marca: vehiculo.marca,
                    modelo: vehiculo.modelo,
                    anio: vehiculo.anio,
                },
                precios: {
                    USD: precioUSD,
                    HNL: +(precioUSD * rates.HNL).toFixed(2),
                    EUR: +(precioUSD * rates.EUR).toFixed(2),
                    MXN: +(precioUSD * rates.MXN).toFixed(2),
                    GTQ: +(precioUSD * rates.GTQ).toFixed(2),
                }
            });
        });

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ message: 'Error al obtener tasas de cambio' });
    }
});


router.post('/api/vehiculos', authMiddleware,  (req, res) => {
    const { marca, modelo, anio, precio, disponible,  } = req.body;

    if (!marca || !modelo || !anio || !precio) {
        return res.status(400).json({ message: 'Marca, modelo, año y precio son obligatorios' });
    }

    const query = `INSERT INTO vehiculos (marca, modelo, anio, precio, disponible) VALUES (?, ?, ?, ?, ?)`;

    db.query(
        query,
        [marca, modelo, anio, precio, disponible || 1],
        (error, results) => {
            if (error) {
                console.error('Error al crear el vehículo:', error);
                return res.status(500).json({ message: 'Error al crear el vehículo' });
            }

            return res.status(201).json({
                message: 'Vehículo creado correctamente',
                id: results.insertId
            });
        }
    );
});

router.put('/api/vehiculos/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const { marca, modelo, anio, precio, disponible } = req.body;
    if (!marca && !modelo && !anio && !precio && disponible === undefined) {
     return res.status(400).json({ message: 'Debes enviar al menos un campo a actualizar' });
    }

    const query = `UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, precio = ?, disponible = ? WHERE id = ?`;

    db.query(query, [marca, modelo, anio, precio, disponible ?? 1, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar el vehículo:', error);
            return res.status(500).json({ message: 'Error al actualizar el vehículo' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        return res.json({ message: 'Vehículo actualizado correctamente' });
    });
});

router.delete('/api/vehiculos/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM vehiculos WHERE id = ?`;
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar el vehículo:', error);
            return res.status(500).json({ message: 'Error al eliminar el vehículo' });
        }
         if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        return res.json({ message: 'Vehículo eliminado correctamente' });
    });
});   

module.exports = router;