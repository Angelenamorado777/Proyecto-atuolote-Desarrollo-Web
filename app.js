const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const authRoute = require('./routes/authRoute');
const vehiculosRoute = require('./routes/vehiculosRoute');



app.use(express.json());
app.use(cors());

app.use('/', vehiculosRoute);
app.use('/', authRoute);





const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});