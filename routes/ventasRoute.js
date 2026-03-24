const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');
const router = express.Router();

router.get('/api/ventas', authMiddleware, (req, res) => {

  const sql = 'SELECT v.id, v.fecha_venta, c.nombre AS cliente, u.nombre AS vendedor, ve.marca, ve.modelo, v.precio_total, v.impuestos'
    + ' FROM ventas v'
    + ' JOIN clientes c ON v.id_cliente = c.id'
    + ' JOIN usuarios u ON v.id_vendedor = u.id'
    + ' JOIN vehiculos ve ON v.id_vehiculo = ve.id;'

  pool.query(sql, [], (error, results) => {
    if (error) {
      console.log('Consulta mal estructurada');
      return res.status(500).json({ message: 'Consulta mal estructurada' });
    } else {
      res.status(200).json({ status: 200, message: 'Ventas Cargadas con exito', data: results });
    }
  });
})

router.get('/api/ventas/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);

  const sql = 'SELECT  v.id, v.fecha_venta, c.nombre AS cliente, u.nombre AS vendedor, ve.marca, ve.modelo, v.precio_total, v.impuestos'
    + ' FROM ventas v'
    + ' JOIN clientes c ON v.id_cliente = c.id'
    + ' JOIN usuarios u ON v.id_vendedor = u.id'
    + ' JOIN vehiculos ve ON v.id_vehiculo = ve.id WHERE v.id =?; '

  pool.query(sql, [id], (error, results) => {
    if (error) {
      console.log('Consulta mal estructurada');
      return res.status(500).json({ message: 'Consulta mal estructurada' });

    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    } else {
      res.status(200).json({ status: 200, message: 'Venta Cargada con exito', data: results });
    }
  });
})

router.post('/api/ventas', authMiddleware, (req, res) => {
  const venta = req.body;

  const sql = 'INSERT INTO ventas (fecha_venta, id_cliente, id_vendedor, id_vehiculo, precio_total, impuestos) VALUES (?, ?, ?, ?, ?, (? * 0.15))';


  pool.query(sql, [venta.fecha_venta, venta.id_cliente, venta.id_vendedor, venta.id_vehiculo, venta.precio_total, venta.precio_total], (error, results) => {
    if (error) {
      console.log('Consulta mal estructurada');
      return res.status(500).json({ message: 'Consulta mal estructurada' });
    } else {
      res.status(200).json({ status: 200, message: 'Venta creada con exito', data: venta });
    }

  })
});

router.put('/api/ventas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const venta = req.body;

  const sql = 'UPDATE ventas SET fecha_venta = ?, id_cliente = ?, id_vendedor = ?, id_vehiculo = ?, precio_total = ?, impuestos = (? * 0.15) WHERE id = ?';

  pool.query(sql, [venta.fecha_venta, venta.id_cliente, venta.id_vendedor, venta.id_vehiculo, venta.precio_total, venta.precio_total, id], (error, results) => {
    if (error) {
      console.log('Consulta mal estructurada');
      return res.status(500).json({ message: 'Consulta mal estructurada' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    } else {
      res.status(200).json({ status: 200, message: 'Venta actualizada con exito', data: venta });
    }

  });
});

router.delete('/api/ventas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const usuarios = req.body;

  if(usuarios.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  } 

  const sql = 'DELETE FROM ventas WHERE id = ?';

  pool.query(sql, [id], (error, results) => {
    if (error) {
      console.log('Consulta mal estructurada');
      return res.status(500).json({ message: 'Consulta mal estructurada' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    else {
      res.status(200).json({ status: 200, message: 'Venta eliminada con exito' });
    }
  });
});

module.exports = router;