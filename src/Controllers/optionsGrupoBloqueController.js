const conexion = require('../Database/conexion');

// Controlador para rellenar los <option> de Grupo y de Bloque
const rellenarOptions = (req, res) => {
  const options = {}; //Objeto en el cual insertaremos los datos.

  //Obtenemos los grupos
  conexion.query('SELECT id_grupo, nombre_grupo FROM grupo', (error, grupo) => {
    if (error) throw error;
    options.grupo = grupo; //Creamos una propiedad 'grupo' y le asignamos como valor el resultado de la consulta.

    //Obtenemos los bloques
    conexion.query('SELECT id_bloque, nombre_bloque FROM bloque', (error, bloque) => {
      if (error) throw error;
      options.bloque = bloque;//Hacemos lo mismo que hicimos con grupo.
      
      //Para ver en consola
      console.log("Grupos y bloques cargados en los <select>: ", options); 

      res.json(options); // Retornamos el objeto que hemos descrito debajo, pero en formato JSON.
    });
  });
  
};

module.exports = rellenarOptions; // Exportamos el controlador.


/*
  El objeto 'options' inicia vacio, pero cuando se carga con la base de datos, se ve de esta forma:

{
  grupo: [
    { id_grupo: 1, nombre_grupo: 'activo' },
    { id_grupo: 2, nombre_grupo: 'pasivo' },
    // ...
  ],
  bloque: [
    { id_bloque: 1, nombre_bloque: 'corriente' },
    { id_bloque: 2, nombre_bloque: 'no corriente' },
    // ...
  ]
}
*/