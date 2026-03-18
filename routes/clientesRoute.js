const express = require('express');
const router = express.Router();
const db = require('../config/db'); // ⚠️ Asegúrate de que esta ruta a tu db.js sea correcta

// --------------------
// 👤 CLIENTES
// --------------------

// CREAR CLIENTE
router.post('/', (req, res) => {
  const { nombre, apellido, correo, telefono, direccion } = req.body;
  const sql = `INSERT INTO clientes (nombre, apellido, correo, telefono, direccion) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [nombre, apellido, correo, telefono, direccion], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ msg: 'Cliente creado' });
  });
});

// OBTENER TODOS LOS CLIENTES
router.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// OBTENER CLIENTE + SUS CONSULTAS
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT c.*, co.id AS consulta_id, co.mensaje, co.tipo, co.fecha
    FROM clientes c
    LEFT JOIN consultas co ON c.id = co.id_cliente
    WHERE c.id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ACTUALIZAR CLIENTE
router.put('/:id', (req, res) => {
  const { nombre, apellido, correo, telefono, direccion } = req.body;
  const sql = `UPDATE clientes SET nombre=?, apellido=?, correo=?, telefono=?, direccion=? WHERE id=?`;

  db.query(sql, [nombre, apellido, correo, telefono, direccion, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ msg: 'Cliente actualizado' });
  });
});

// ELIMINAR CLIENTE
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM clientes WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ msg: 'Cliente eliminado junto a sus consultas' });
  });
});

// --------------------
// 📝 CONSULTAS
// --------------------

// CREAR CONSULTA
router.post('/consultas', (req, res) => {
  const { id_cliente, mensaje, tipo } = req.body;
  const sql = `INSERT INTO consultas (id_cliente, mensaje, tipo) VALUES (?, ?, ?)`;

  db.query(sql, [id_cliente, mensaje, tipo], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ msg: 'Consulta registrada' });
  });
});

// OBTENER TODAS LAS CONSULTAS
router.get('/consultas/todas', (req, res) => {
  db.query('SELECT * FROM consultas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;