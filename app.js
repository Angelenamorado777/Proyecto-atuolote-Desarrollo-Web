const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const authRoute = require('./routes/authRoute');
const clientesRoute = require('./routes/clientesRoute');

app.use(express.json());
app.use(cors());


app.use('/', authRoute);

app.use('/', clientesRoute);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});