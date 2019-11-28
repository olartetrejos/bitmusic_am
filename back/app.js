/*
    Va a contener toda la lógica de ruteo de Express
    Declaración de rutas, uso de la librería body-parser
    Permisos de acceso a cualquier cliente (Permisos a Angular)
*/

const express = require('express'); // Importamos Express
const bodyParser = require('body-parser'); // Permite analizar datos de URL

const app = express(); // Application Express

// Configurar las rutas de acceso a cada función de nuestra aplicación
const usuarioRutas = require('./rutas/usuarioRutas');
const cancionRutas = require ('./rutas/cancionRutas');

// Analizar los datos que se están enviando por la URL con body-parser
app.use(bodyParser.json());


// Configurar permisos de acceso a cualquier cliente

// Consumo de las rutas
app.use('/api', usuarioRutas); // acá estamos usando todas las rutas del usuario que activan las funciones
// /api/registro
app.use('/api', cancionRutas);
module.exports = app; // Exportamos todo el archivo app
