const conexion = require('../Database/conexion');

//Controlador para rellenar el option de Rubro (Depende del controlador 'optionsGrupoBloque', ya que usaremos sus ID´s)
const agregarCuenta = (req, res) => {
    const {nuevaCuenta, grupoOption, bloqueOption, rubroOption} =  req.params; // Objeto en el cual insertaremos los datos
    
    conexion.query('CALL agregarCuenta(?, ?, ?, ?)', [nuevaCuenta, grupoOption, bloqueOption, rubroOption], (error, cuenta) => {
      if (error) throw error;
      
      //Para ver por consola
      console.log("\nResultado de agregarCuenta: ", cuenta);

      res.json(cuenta);
    });
};
  
  module.exports = agregarCuenta;
  