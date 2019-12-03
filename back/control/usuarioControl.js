// Importando el modelo usuario para interactuar con el
const Usuario = require('../modelo/usuario');

//modulo File System -> 32/ modulo del nucle Node
//Nos permite leer archivos externos como los puede ser html,css,js,jpg
const fs = require('fs');

//Modulo Path -> Nos permite analizar y evaluar la ruta de un archivo
const path = require ('path');

// req - request - peticion / res - response - respuesta
function crearUsuario(req, res){
    // instanciar - usar el objeto modelo Usuario
    var usuario = new Usuario();
    // guardar el cuerpo de la peticion en una variable
    // para mejor acceso a los datos que el usuario está enviando
    var parametros = req.body;

    // Para mayor organización de código vamos a guardar cada propiedad
    // del cuerpo de la petición en la variable usuario
    usuario.nombre = parametros.nombre;
    usuario.apellido = parametros.apellido;
    usuario.correo = parametros.correo;
    usuario.contrasena = parametros.contrasena;
    usuario.rol = 'usuario';
    usuario.imagen = null;

    usuario.save((err, usuarioCreado)=>{
        if(err){
            // estado de la respuesta del servidor
            // 500 -> errores propios del servidor
            res.status(500).send({
                message: "Error en el servidor :´("
            });
        } else{
            if(!usuarioCreado){
                // 404 -> Página no encontrada 
                res.status(404).send({
                    message: "No se pudo crear el usuario"
                });
            } else{
                // 200 -> OK
                res.status(200).send({
                    // modelo Usuario : Nuevo Usuario que se va a guardar
                    usuario: usuarioCreado
                });
            }
        }
    });
}

function login(req, res){
    var parametros = req.body;
    var correoUsuario = parametros.correo;
    var contraUsuario = parametros.contrasena;

    // Buscamos al usuario a través del correo. Usamos toLowerCase() para evitar problemas de datos
    Usuario.findOne({correo: correoUsuario.toLowerCase()}, (err, usuarioLogueado)=>{
        if(err){
            res.status(500).send({
                message: "Error en el servidor!!"
            });
        }else {
            if(!usuarioLogueado){
                res.status(404).send({
                    message: "No has podido iniciar sesión. Verifica que tus datos sean correctos"
                });
            }else{
                if(usuarioLogueado.contrasena != contraUsuario){
                    res.status(404).send({
                        message: "Contraseña incorrecta!"
                    });
                } else{
                    res.status(200).send({
                        usuario: usuarioLogueado
                    });
                }
            }
        }
    });
}

function actualizarUsuario(req, res){
    var usuarioId = req.params.id;
    var datosUsuarioActualizar = req.body;

    // db.coleccion.findByIdAndUpdate('a quien quiero actualizar', 'que campos / datos vas a modificar')
    Usuario.findByIdAndUpdate(usuarioId, datosUsuarioActualizar, (err, usuarioActualizado)=>{
        if(err){
            res.status(500).send({
                message: "Error en el servidor"
            });
        }else{
            if(!usuarioActualizado){
                res.status(404).send({
                    message: "No se pudo actualizar"
                });
            } else{
                res.status(200).send({
                    usuario: usuarioActualizado
                });
            }
        }
    });
} 

//Nueva linea de codigo - Funcion subir imagen del usuario
function subirImg(req,res){
   var usuarioId = req.params.id;
   var nombreArchivo = "No ha subido nada...";

   //Validar si efectivamente se esta enviando la img o el archivo y lo haremos a traves de un if 
   //req.files == req.body
   if (req.files){
       //Vamos a ir analizando la ruta del archivo , el nombre del archivo y la extension (jpg,PNG,GIF...)
       var rutaArchivo = req.files.imagen.path;
       console.log( 'variable rutaArchivo:' + rutaArchivo);

       // C:\\usuario\imagenes\miarchivo.jpg -- http:\\midominio.com\archivos\usuarios\miImagen.jpg
       var partirArchivo = rutaArchivo.split('\\');
       console.log('variable partirArchivo:'+partirArchivo);
      //Siempre que se va a trabajar como este metodo se genera un array = ['http','midominio', ...]
       var nombreArchivo = partirArchivo[2];
       console.log('variable nombreArchivo:' + nombreArchivo);

       var extensionImg = nombreArchivo.split('\.'); //array ['miImagen' , 'jpg'];
       console.log('variable extensionImg' + extensionImg);

       var extensionArchivo = extensionImg[1];
       console.log('variable extensionArchivo:' + extensionArchivo);

       /*
       A traves de una expresion regularpodemos validar si dentro de una cadena 
       existe algun caracter en especifico. En este ejemplo validamos si al final de la 
       cadena existen los caracteres jpg, png, jpeg o gif
       
       Abrimos una expresion regular con /patron/ 
       ^ - con el sombrerito indicamos que una cadena empiece por x caracter
       ej:
       */
      
      //Validar el formato del archivo a subir
        if (extensionArchivo == 'png' || extensionArchivo == 'jpg'){
            //Vamos a actualizar del usuario el campo imagen
              Usuario.findByIdAndUpdate(usuarioId,{imagen:nombreArchivo},(err, imgUsuario)=>{
                  if (err){
                      res.status(500).send({
                          message:"Error en el servidor"
                      });
                  }else{
                      if(!imgUsuario){
                          res.status(404).send({
                              message:"No se pudo guardar la imagen"
                          });
                      }else{
                          res.status(200).send({
                              imagen: nombreArchivo,
                              usuario: imgUsuario
                          });
                      }
                  }
              });
        }else{
            res.status(404).send({
                message:"No ha subido ninguna imagen"
            });
        }
    

   }else{
       res.status(404).send({
        message: "No ha subido ningun archivo"
       });
   }
}

//NUEVA LINEA - funcion mostrar archivo
//
function mostrarArchivo(req,res){
    // guardamos el nombre del archivo que estamos enviando en la url
    var archivo = req.params.imageFile; //similar a req.params.id - localhost:4000/api/mostrar/:imageFile 
    // verificando la carpeta archivos/usuarios para encontrar el archivo
    var rutaArchivo = './archivos/usuarios/' + archivo;

//Validamos si dentro de la carpeta archivos/usuario existe el archivo
//exists -> metodo propio de file system (fs)
//fs.exists('en donde quieres buscar' , (existe o no)=>{})
    fs.exists (rutaArchivo,(exists)=>{
        if(exists){
            //sendFile -> propio del modulo FS permite enviar archivos como respuesta
            //aca enviamos la imagen el  archivo como respuesta
            res.sendFile(path.resolve(rutaArchivo));
        }else{
            res.status(404).send({
            message: "No existe la imagen"
        });
    }
    });
}

module.exports = {
    crearUsuario,
    login,
    actualizarUsuario,
    subirImg,
    mostrarArchivo
};


