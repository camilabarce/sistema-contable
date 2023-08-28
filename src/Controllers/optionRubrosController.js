const conexion = require('../Database/conexion');

//Controlador para rellenar el option de Rubro (Depende del controlador 'optionsGrupoBloque', ya que usaremos sus ID´s)
const obtenerRubros = (req, res) => {
    const options = {}; // Objeto en el cual insertaremos los datos
    const idGrupo = req.params.idGrupo;
    const idBloque = req.params.idBloque;

    conexion.query('CALL rubrosSelect(?, ?)', [idGrupo, idBloque], (error, rubros) => {
      if (error) throw error;
      options.rubro = rubros[0];

      //Para ver por consola
      console.log("\nRubros obtenidos: ", options);

      res.json(options);
    });
};
  
  module.exports = obtenerRubros;
  