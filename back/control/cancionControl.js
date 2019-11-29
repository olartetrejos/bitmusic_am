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

function buscarCancion(req,res) {
    var parametros = req.body;
    var tituloCanciones = parametros.titulo;

    Cancion.findOne({titulo:tituloCanciones.toLowerCase()}, (err,cancionEncontrada)=>{
        if (err) {
            res.status (500).send({
                message:"Error en el servidor"
            });
        }else{
            if(!cancionEncontrada){
                res.status (404).send({
                    message:"Cancion no encontrada"
                });
            }else{
                res.status(200).send({
                    cancion:cancionEncontrada
                });
            }
        }
    });
}

function buscarGenero(req, res) {
    var parametros = req.body;

    var generoCanciones = parametros.genero;
    

    Cancion.find({genero: generoCanciones.toLowerCase()},(err,cancionesEncontradas)=>{
        if (err) {
            res.status(500).send({
                message: "Error en el servidor"

            });

        } else {
            if (!cancionesEncontradas) {
                res.status(404).send({
                    message: "Canciones no encontradas"
                });
            } else {
                res.status(200).send({
                    canciones: cancionesEncontradas
                });
            }
        }
    });
   

}
function actualizarCancion(req, res) {
    var cancionId = req.params.id;
    var actualizarCancion = req.body;
    

    Cancion.findByIdAndUpdate(cancionId, actualizarCancion,(err,cancionActualizada)=>{
        if (err) {
            res.status(500).send({
                message: "Error en el servidor"

            });

        } else {
            if (!cancionActualizada) {
                res.status(404).send({
                    message: "Cancion NO actualizada"
                });
            } else {
                res.status(200).send({
                    cancion: cancionActualizada
                });
            }
        }
    });
   

}

function eliminarCancion(req, res) {
    cancionId = req.params.id;


    Cancion.findByIdAndDelete(cancionId,(err,cancionEliminada)=>{
        if (err) {
            res.status(500).send({
                message: "Error en el servidor"
            });

        } else {
            if (!cancionEliminada) {
                res.status(404).send({
                    message: "Cancion NO Eliminada"
                });
            } else {
                res.status(200).send({
                    cancion: cancionEliminada
                });
            }
        }
    });
   
}







module.exports = {
    crearCancion,
    buscarCancion,
    buscarGenero,
    actualizarCancion,
    eliminarCancion
};
