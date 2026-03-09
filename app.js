const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'autolote_user',
    password: 'autolote1234',
    database: 'autolote_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        return;
    }
    console.log('Conexión exitosa a MySQL');
});






const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});