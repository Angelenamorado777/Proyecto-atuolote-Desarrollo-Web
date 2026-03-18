const express = require('express');
const app = express();
require('dotenv').config();

const authRoute = require('./routes/authRoute');
const clientesRoute = require('./routes/clientesRoute');

app.use(express.json());



app.use('/', authRoute);

app.use('/', clientesRoute);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});