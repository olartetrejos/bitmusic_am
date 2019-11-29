const express = require ('express');
const CancionControl = require('../control/cancionControl');

var api= express.Router()

api.post('/registrar-cancion', CancionControl.crearCancion);
api.get('/obtener-cancion',CancionControl.buscarCancion);
api.get('/listar-canciones',CancionControl.buscarGenero);
api.put('/editar-cancion/:id',CancionControl.actualizarCancion);
api.delete('/eliminar-cancion/:id',CancionControl.eliminarCancion);



module.exports = api;