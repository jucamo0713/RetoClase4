const PORT = process.env.PORT || 3000;
const express =   require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/', require('./routes/routes'));

app.get("/", (req, res) => {
    res.json("Bienvenido a mi Gurdaropa");
  });

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});