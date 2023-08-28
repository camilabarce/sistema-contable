const conexion = require('../Database/conexion');

//Controlador para modificar nombre de la cuenta.
const borrarCuenta = (req, res) => {
    const {codigoCuenta, grupoOption, bloqueOption, rubroOption} = req.params;
 
    //Obtenemos los datos de las cuentas desde la base de datos utilizando el stored procedure
    conexion.query('CALL borrarCuenta(?, ?, ?, ?)', [codigoCuenta, grupoOption, bloqueOption, rubroOption], (error, results) => {
        if (error) throw error;

        //Para ver por consola
        console.log("\nResultado de borrar cuenta: ", results);

        res.json({codigoCuenta});
      });
      
  };
  
  module.exports = borrarCuenta; // Exportamos el controlador
  