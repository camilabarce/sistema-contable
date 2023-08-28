const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'plan_de_cuentas'
});

conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('Conexion exitosa');
    }
});

module.exports = conexion;
