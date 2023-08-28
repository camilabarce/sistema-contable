// Importamos los controladores
const mostrarCuentas = require('./mostrarCuentasController');
const rellenarOptions = require('./optionsGrupoBloqueController');
const obtenerRubros = require('./optionRubrosController');
const modificarCuenta = require('./modificarCuentaController');
const agregarCuenta = require('./agregarCuentaController');
const borrarCuenta = require('./borrarCuentaController');
const generarPDF = require('./generarPdfController');
const inicio = require('./inicioAplicacion');

// Controlador general (orquestador)
const cuentaController = {
  mostrarCuentas,
  rellenarOptions,
  obtenerRubros,
  modificarCuenta,
  agregarCuenta,
  borrarCuenta,
  generarPDF,
  inicio
};

// El 'orquestador' es un mediador entre los controladores y nuestro 'app.js'.

module.exports = cuentaController; // Exportamos el orquestador.




/*
- ¡IGNORAR ESTE BLOQUE!

- Es un bloque antiguo que contiene al objeto sin modularizar (solo lo dejamos por curiosidad). 

- En este contexto 'cuentaController' actua como objeto y 'obtenerCuentas/agregarCuentas' como métodos.

// Objeto que actúa como controlador
const cuentaController = {
  // Método 'obtenerCuentas'
  obtenerCuentas: (req, res) => {
    // Obtenemos los datos de las cuentas desde la base de datos utilizando el stored procedure
    conexion.query('CALL obtenerCuentas(?, ?, ?)', [grupoOption, bloqueOption, rubroOption], (error, results) => {
      if (error) throw error;

      const cuentas = results.map((data) => {
        return new Cuenta(data.codigo, data.nombre, data.tipo);
      });

      // Enviamos las cuentas como respuesta en formato JSON
      res.json(cuentas);
    });
  },
  // Método 'agregarCuenta'
  agregarCuenta: (req, res) => {
    // Con un bloque similar al anterior podemos agregar una nueva cuenta a la base de datos
  }
};

module.exports = cuentaController; //Exportamos el objeto
*/

