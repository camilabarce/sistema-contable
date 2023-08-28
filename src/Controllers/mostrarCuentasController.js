const conexion = require('../Database/conexion');
const Cuenta = require('../Models/modeloImpreso');

//Controlador para mostrar las cuentas en la tabla HTML
const mostrarCuentas = (req, res) => {
    const { grupoOption, bloqueOption, rubroOption } = req.params; //Capturamos los valores de la ruta

    //Obtenemos los datos de las cuentas desde la base de datos utilizando el stored procedure
    conexion.query('CALL mostrarCuentas(?, ?, ?)', [grupoOption, bloqueOption, rubroOption], (error, results) => {
        if (error) throw error;
      
        const cuentas = results[0].map((data) => {
          return new Cuenta(data.codigo, data.nombre, data.tipo, data.saldo); //Instanciamos el objeto ubicado en 'src/Models/imprimirCuenta.js'
        });

        //Para ver por consola
        console.log("\nCuentas que se verán en la tabla: ", cuentas); 

        res.json(cuentas); //Enviamos las cuentas como respuesta en formato JSON

      });
  };
  
  module.exports = mostrarCuentas; // Exportamos el controlador
  