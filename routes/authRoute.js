const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const router = express.Router();

// POST - Registro
router.post('/api/registro', async (req, res) => {
  const { nombre, apellido, correo, password, rol } = req.body;

  if (!nombre || !apellido || !correo || !password) {
    return res.status(400).json({ status: 400, message: 'Todos los campos son obligatorios...' });
  }

  const sql = 'SELECT correo FROM usuarios WHERE correo = ?';
  pool.query(sql, [correo], async (error, results) => {
    if (error) {
      return res.status(500).json({ status: 500, message: 'Error en la consulta SQL...' });
    }

    if (results.length > 0) {
      return res.status(400).json({ status: 400, message: 'El correo ya está registrado...' });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const sqlInsert = 'INSERT INTO usuarios (nombre, apellido, correo, password_hash, rol) VALUES (?, ?, ?, ?, ?)';
    pool.query(sqlInsert, [nombre, apellido, correo, hash, rol || 'vendedor'], (error, results) => {
      if (error) {
        return res.status(500).json({ status: 500, message: 'Error al registrar el usuario...' });
      }
      return res.status(201).json({ status: 201, message: 'Usuario registrado exitosamente' });
    });
  });
});

// POST - Login
router.post('/api/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ status: 400, message: 'Correo y contraseña son obligatorios...' });
  }

  const sql = 'SELECT * FROM usuarios WHERE correo = ?';
  pool.query(sql, [correo], async (error, results) => {
    if (error) {
      return res.status(500).json({ status: 500, message: 'Error en la consulta SQL...' });
    }

    if (results.length === 0) {
      return res.status(401).json({ status: 401, message: 'Credenciales inválidas...' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ status: 401, message: 'Credenciales inválidas...' });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ status: 200, message: 'Inicio de sesión exitoso', token: token });
  });
});


router.get('/api/gethash/:texto', async (req, res) => {
  const hash = await bcrypt.hash(req.params.texto, 10);
  res.send(hash);
});



module.exports = router;