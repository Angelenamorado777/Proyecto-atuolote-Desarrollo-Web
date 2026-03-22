const express = require ('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

router.get('/api/clientes', (req, res) => {

 pool.query('SELECT * FROM clientes', (error, results) => {
 if (error)return res.status(500).json({status: 500, menssage: "Error al obtener a los clientes"})
 return res.status(200).json({status: 200, data: results});
 });

});

router.get('/api/clientes/:id', (req, res) => {
  const id = req.params.id;

  pool.query('SELECT * FROM clientes WHERE id = ?', [id], (error, results) => {
    if (error) return res.status(500).json({ status: 500, message: "Error al solicitar el cliente"});
    return res.status(200).json({status: 200, data: results});
  });
});

router.post('/api/clientes', (req, res) => {
 const {nombre, apellido, correo, telefono, direccion} = req.body

 if (!nombre || !apellido || !correo) {
    return res.status(400).json({status: 400, message: 'Faltan campos obligatorios'})
 }
  const sql = 'INSERT INTO clientes (nombre, apellido, correo, telefono, direccion) VALUES (?,?,?,?,?)';
  pool.query(sql, [nombre, apellido, correo, telefono, direccion], (error, results) => {
   if (error) {
    return res.status(400).json({status: 400, message: 'Error al registrar el cliente'});
   }
   return res.status(201).json({status: 201, message: 'Se registro el cliente'});

  });
});

router.put('/api/clientes/:id', (req, res) => {
  const {nombre, apellido, correo, telefono, direccion} = req.body;
  const id = req.params.id;
  const sql = 'UPDATE clientes SET nombre=?, apellido=?, correo=?, telefono=?, direccion=? WHERE id=?'
  pool.query(sql, [nombre, apellido, correo, telefono, direccion, id], (error) => {
   if (error) {
    return res.status(400).json({status: 400, message: 'Error al actualizar al cliente'});
   }
   return res.status(200).json({status: 200, message: 'Se actualizo correctamente el cliente'});
 });
});

router.delete('/api/clientes/:id', (req, res) => {

  const id = req.params.id;
  pool.query('DELETE FROM clientes WHERE id=?', [id], (error) => {
   if (error) {
    return res.status(500).json({status: 500, message: 'No se pudo eliminar al cliente'});
   }
   return res.status(200).json({status: 200, message: 'El cliente se elimino correctamente'});
 });
});

router.get('/api/consultas/cliente/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM consultas WHERE id_cliente = ? ORDER BY fecha DESC';

  pool.query(sql, [id], (error, results) => {
    if (error) return res.status(500).json({status: 500, message: 'Error al obtener las consultas'});
    return res.status(200).json({status: 200, data: results});
  });
});


router.post('/api/consultas', (req, res) => {
  const { id_cliente, mensaje, tipo } = req.body; 
  if (!id_cliente || !mensaje || !tipo) {
   return res.status(400).json({ status: 400, message: 'Faltan datos en la consulta' });
  }
  const sql = 'INSERT INTO consultas (id_cliente, mensaje, tipo) VALUES (?, ?, ?)';
  
  pool.query(sql, [id_cliente, mensaje, tipo], (error) => {
   if(error)return res.status(500).json({status: 500, message:'No se pudo registrar la consulta'});
    return res.status(201).json({status: 201, message:'Consulta registrada correctamente'});
  });
});

module.exports = router;

