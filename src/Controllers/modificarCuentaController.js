const conexion = require('../Database/conexion');

//Controlador para modificar nombre de la cuenta.
const modificarCuenta = (req, res) => {
    const {nuevoNombre, codigoCuenta, nombreActual} = req.params;
 
    //Obtenemos los datos de las cuentas desde la base de datos utilizando el stored procedure
    conexion.query('CALL modificarCuenta(?, ?, ?)', [nuevoNombre, codigoCuenta, nombreActual], (error, results) => {
        if (error) throw error;

        //Para ver por consola
        console.log("\nResultado del cambio de nombre: ", results);
        console.log("Nuevo nombre: ", nuevoNombre);
        console.log("Codigo de referencia: ", codigoCuenta);
        console.log("Nombre anterior: ", nombreActual);

        res.json({nuevoNombre});
      });
      
  };
  
  module.exports = modificarCuenta; // Exportamos el controlador
  