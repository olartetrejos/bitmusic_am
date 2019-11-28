const Cancion = require('../modelo/cancion')

function crearCancion(req, res) {
    var cancion = new Cancion()
    var parametros = req.body

    cancion.titulo = parametros.titulo;
    cancion.numero = parametros.numero;
    cancion.duracion = parametros.duracion;
    cancion.url = null;
    cancion.genero = parametros.genero;
    cancion.artista = parametros.artista;
    cancion.album = parametros.album;

    cancion.save((err, cancionNueva) => {
        if (err) {
            // estado de la respuesta del servidor
            // 500 -> errores propios del servidor
            res.status(500).send({
                message: "Error en el servidor "
            });
        } else {
            if (!cancionNueva) {
                // 404 -> Página no encontrada
                res.status(404).send({
                    message: "No se pudo crear la cancion"
                });
            } else {
                // 200 -> OK
                res.status(200).send({
                    // modelo Usuario : Nuevo Usuario que se va a guardar
                    cancion: cancionNueva
                });
            }
        }
    });
}
module.exports = {
    crearCancion
};
