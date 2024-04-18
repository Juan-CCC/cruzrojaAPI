const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/user.routes');
const morgan = require('morgan');
const config = require('./config');

const app = express();

// ConfiguraciÃ³n del puerto
app.set('port', config.port);

// Middlewares
app.use(cors({
  //origin: 'https://r-cruz-roja-r73k.vercel.app',
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Agregar encabezados CORS a todas las respuestas
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(userRoutes);

module.exports = app;
