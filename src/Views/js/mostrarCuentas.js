
document.addEventListener('DOMContentLoaded', () => {

  // Consumimos la api para visualizar cuentas
  const btnVisualizar = document.getElementById('btnVisualizar');
  const cuerpoTabla = document.getElementById('cuerpo');

  // Este evento se desecadenará al presionar el botón
  btnVisualizar.addEventListener('click', () => {

    // Capturamos los values
    const grupo = grupoSelect.value;
    const bloque = bloqueSelect.value;
    const rubro = rubroSelect.value;

    if (grupo && bloque && rubro) { //Verificamos que los <select> no estén vacios

      // Vaciamos el cuerpo de la tabla para luego rellenarla con la nueva selección de cuentas
      cuerpoTabla.innerHTML = '';

      // Genero el botón de reporte para descargar el plan de cuentas
      const btnPdf = document.getElementById('btnGenerarPDF');

      // Compruebo si 'btnPdf' existe, ya que sino se va a generar por cada click (Se duplica).
      if (!btnPdf && grupo && bloque && rubro) { // Solo lo invocamos si no existe y si se elige una opcion. 
        const btnReporte = document.getElementById('btnReporte');
        const button = document.createElement('button');
        button.id = "btnGenerarPDF";
        button.className = 'btn btn-light';
        button.type = 'button';
        button.textContent = 'Descargar Plan';
        btnReporte.appendChild(button);

      }

      //Le pasamos los parámetros que requiere la ruta
      fetch(`/mostrarCuentas/${grupo}/${bloque}/${rubro}`, {
        method: 'POST' //En este caso, hay que especificar el método de envío.
      })
        .then(response => response.json())
        .then(data => {
          const tabla = data
            .map(cuenta => { // Imprimimos las cuentas (Las filas de la tabla)
              return `
              <tr>
                <th scope="row">${cuenta.codigo}</th>
                <td>${cuenta.nombre}</td>
                <td>${cuenta.tipo}</td>
                <td>$${cuenta.saldo}</td>
                <td>
                  <input type="button" value="Modificar" class="btn btn-outline-primary btnModificar"  id="btnModificar" data-codigo="${cuenta.codigo}" data-nombre="${cuenta.nombre}" data-tipo="${cuenta.tipo}">
                  <input type="button" value="Eliminar" class="btn btn-outline-danger btnEliminar" id="btnEliminar" data-codigo="${cuenta.codigo}" data-nombre="${cuenta.nombre}" data-saldo="${cuenta.saldo}">
                </td>         
              </tr>
            `;
            })
          cuerpoTabla.innerHTML += tabla.join(''); //A este join se lo usa para separar elementos de un array (En este caso, nuestros registros).

          btnReporte.addEventListener('click', async () => {

            animarCarga(); // Función que activa la animación de carga en el botón

            //Capturamos la tabla original
            const tabla = document.getElementById('table');

            // Clonamos la tabla para realizar las modificaciones sin afectar la original
            const tablaClonada = tabla.cloneNode(true);

            // Obtenemos todas las filas de la tabla clonada
            const filasTabla = tablaClonada.getElementsByTagName('tr');

            // Eliminamos la columna 'Acciones' (Para que no salgan los botones en el PDF)
            for (let i = 0; i < filasTabla.length; i++) {
              const fila = filasTabla[i];
              const ultimaCelda = fila.lastElementChild;
              if (ultimaCelda) {
                ultimaCelda.parentNode.removeChild(ultimaCelda);
              }
            }

            // Capturamos los valores del <select> de Rubro (Esto para mostrar en el PDF)
            const rubroValue = rubroSelect.options[rubroSelect.selectedIndex].text;

            // Generamos el contenido HTML de la tabla clonada consumiendo la API
            const tablaHtml = tablaClonada.outerHTML;

            try {
              const response = await fetch('/generarPDF', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tablaHtml, rubroNombre: rubroValue }) //Capturamos y convertimos la información de la tabla en un JSON
              });

              if (response.ok) { //Si hay respuesta satisfactoria:

                apagarCarga(); // Función para apagar animación

                //Blob (Binary Large OBject) es un tipo de objeto que representa datos binarios en bruto.
                const blob = await response.blob();//Obtenemos los datos cómo un objeto 'Blob'.
                const url = window.URL.createObjectURL(blob); //Creamos una URL temporal para el contenido del PDF en formato Blob.
                window.open(url, '_blank'); //Abrimos una nueva pestaña y enseñamos los datos de la URL.

                // Creamos un objeto 'FileReader' para leer el contenido del PDF como una URL
                const reader = new FileReader();
                reader.onloadend = () => {
                  // Establecemos la URL del PDF en la ventana abierta
                  newWindow.location.href = reader.result;
                };
                reader.readAsDataURL(blob);
              } else {
                apagarCarga();
                Swal.fire('Error al generar PDF', 'Intente nuevamente', 'error');
              }
            } catch (error) {
              apagarCarga();
              Swal.fire('Error al generar PDF', 'Intente nuevamente', 'error');
              console.error(error);
            }

            function animarCarga() {
              const btnReporte = document.getElementById('btnReporte');
              const loader = document.getElementById('loader'); // Agregar esta línea
              // Restablecemos el estado del botón y mostramos la animación
              btnReporte.classList.remove('show-loader');
              loader.style.display = 'block';
              // Agregamos la clase 'show-loader' para mostrar la animación de carga
              btnReporte.classList.add('show-loader');
            }

            function apagarCarga() {
              const loader = document.getElementById('loader');
              loader.style.display = 'none'; // Ocultamos la animación de carga (Para evitar loop infinito)
            }
          });

          /* 
          - Sección de alertas (Utilizamos 'Sweet Alert 2')
          - 'btnModificar' y 'btnEliminar' son clases.
          - No usamos los id porque son únicos (Solo funcionaría la alerta del primer registro y no los demás)
          - La clase permite duplicidad, es por eso que recorremos con un for y se lo aplicamos a todas las clases.
          */

          // Alerta que se activa al presionar el botón de modificar
          const btnModificar = document.getElementsByClassName('btnModificar');
          for (let i = 0; i < btnModificar.length; i++) {
            btnModificar[i].addEventListener('click', () => {

              // A 'data-codigo' y 'data-nombre' los tomamos de los atributos personalizados insertados en el botón de modificar.
              const codigo = btnModificar[i].getAttribute('data-codigo');
              const nombreActual = btnModificar[i].getAttribute('data-nombre');

              let cuentaNombre = btnModificar[i].parentNode.parentNode.querySelector('td:nth-child(2)').textContent;
              // 'cuentaNombre' es 'let' y no 'const' porque en lugar de ser constante, va variar su valor
              // btnModificar[i] = Ubicamos la fila en la que se encuentra el botón.
              // 1er parentNode = Elemento padre del botón ( En este caso un <td> )
              // 2do parentNode = Elemento padre del <td> (En este caso, la fila <tr> )
              // querySelector('td:nth-child(2)') = Accedemos al segundo hijo de la fila (El nombre de la cuenta)
              // textContent = Capturamos el texto para mostrar la cuenta que se va a modificar.

              Swal.fire({
                title: 'Modificar cuenta',
                input: 'text',
                inputValue: cuentaNombre,
                inputPlaceholder: 'Escriba el nombre',
                showCancelButton: true,
                preConfirm: (nuevoNombre) => {
                  // Hacemos la solicitud a la API para modificar el nombre
                  // encodeURIComponent = Para que no haya conflicto con caracteres especiales
                  fetch(`/modificarCuenta/${encodeURIComponent(nuevoNombre)}/${codigo}/${encodeURIComponent(nombreActual)}`, {
                    method: 'POST'
                  })
                    .then(response => response.json())
                    .then(data => {
                      // Actualizamos la tabla con los datos nuevos
                      cuentaNombre = data.nuevoNombre;
                      btnModificar[i].setAttribute('data-nombre', cuentaNombre);
                    })
                    .catch(error => {
                      console.error(error);
                    });
                }
              })
                .then(result => {
                  // Resultado después de confirmar
                  if (result && result.value) { //Verificamos que no tenga valor NULL o undefined.
                    let nombre = btnModificar[i].parentNode.parentNode.querySelector('td:nth-child(2)');
                    nombre.textContent = result.value;
                    Swal.fire('Cuenta modificada', '"' + result.value + '" se llamará a partir de ahora', 'success');
                  }
                })
            });
          }

          //Alerta que se activa al presionar el botón de eliminar
          const btnEliminar = document.getElementsByClassName('btnEliminar')
          for (let i = 0; i < btnEliminar.length; i++) {
            btnEliminar[i].addEventListener('click', () => {

              const codigo = btnEliminar[i].getAttribute('data-codigo');
              const nombre = btnModificar[i].getAttribute('data-nombre');
              const saldo = btnEliminar[i].getAttribute('data-saldo');

              if (saldo > 0) {
                Swal.fire('Acceso Denegado<br><br>', `
                <div style="text-align: justify;">
                    <b>Código:</b> ${codigo}<br><br>
                    <b>Cuenta:</b> ${nombre}<br><br>
                    <b>Saldo:</b> <b style="color: red; display="inline"> $${saldo}</b><br>
                </div><br><br>
                <p>Solo se permite borrar cuentas con <b>saldo en cero</b></p>`, 'error');
              } else {
                Swal.fire({
                  title: '¿Desea eliminar esta cuenta?<br><br>',
                  html: `<div style="text-align: justify;">
                            <b>Código:</b> ${codigo}<br><br>
                            <b>Cuenta:</b> ${nombre}<br><br>
                            <b>Saldo:</b> $${saldo}<br>
                       </div>`,
                  showCancelButton: true,
                  allowOutsideClick: false,
                  icon: 'warning',
                  confirmButtonText: 'Eliminar',
                  cancelButtonText: 'Cancelar',
                  preConfirm: (ok) => {
                    if (ok) {
                      const grupo = grupoSelect.value;
                      const bloque = bloqueSelect.value;
                      const rubro = rubroSelect.value;

                      Swal.fire('Cuenta Eliminada', `La cuenta '<b>${nombre}</b>' se ha eliminado exitosamente`, 'success');

                      fetch(`/borrarCuenta/${codigo}/${grupo}/${bloque}/${rubro}`, {
                        method: 'DELETE'
                      })
                        .catch(error => {
                          console.error(error);
                        });
                      btnVisualizar.click(); //Actualizamos la tabla simulando el click del 'btnVisualizar'
                    }
                  }
                });
              }

            });
          }
        })
        .catch(error => {
          console.error(error);
        });

    } else { // Si los <select> están vacios, ocultamos la tabla y removemos el botón de descarga.
      cuerpoTabla.innerHTML = '';
      const btnPdf = document.getElementById('btnGenerarPDF');
      if (btnPdf) {
        btnPdf.remove();
      }
    }
  });


  //Sección para agregar una nueva cuenta
  const btnAgregarCuenta = document.getElementById('btnAgregarCuenta');

  btnAgregarCuenta.addEventListener('click', () => {
    Swal.fire({
      title: 'Agregar cuenta',
      input: 'text',
      inputPlaceholder: 'Escriba el nombre',
      showCancelButton: true,
      preConfirm: (nuevaCuenta) => {
        if (nuevaCuenta) {
          const grupo = grupoSelect.value;
          const bloque = bloqueSelect.value;
          const rubro = rubroSelect.value;

          fetch(`/agregarCuenta/${encodeURIComponent(nuevaCuenta)}/${grupo}/${bloque}/${rubro}`, {
            method: 'POST'
          })
            .then(response => response.json())
            .then(data => {
              // Crear una nueva fila de tabla con los datos de la cuenta
              const nuevaFila = document.createElement('tr');
              nuevaFila.innerHTML = `
                  <th scope="row">${data.codigo}</th>
                  <td>${data.nombre}</td>
                  <td>${data.tipo}</td>
                  <td>
                    <input type="button" value="Modificar" class="btn btn-outline-primary btnModificar" id="btnModificar" data-codigo="${data.codigo}" data-nombre="${data.nombre}">
                    <input type="button" value="Eliminar" class="btn btn-outline-danger btnEliminar" id="btnEliminar">
                  </td>
                `;
              //Agregamos la nueva fila al cuerpo de la tabla
              cuerpoTabla.appendChild(nuevaFila);
              Swal.fire({
                icon: 'success',
                title: 'Cuenta agregada',
                text: 'Se ha agregado una nueva cuenta correctamente',
              });
              btnVisualizar.click(); //Actualizamos la tabla simulando el click del 'btnVisualizar'
            })
            .catch(error => {
              console.error(error);
            });
        }
      }
    });
  });
});




/* 

- BLOQUE ANTIGUO DE CÓDIGO

- EN LUGAR DE ACTUALIZAR CATÁLOGO DE CUENTAS, AGLUTINA UNA CUENTA ENCIMA DE LA OTRA.

- POR SI NO SE COMPRENDE, PUEDEN PROBARLO: COMENTEN LA SECCIÓN DE CÓDIGO SUPERIOR Y DESCOMENTEN ESTA SECCIÓN.

// Consumimos la api para agregar cuentas

const btnAgregar = document.getElementById('btnAgregarCuenta');
const cuerpoTabla = document.getElementById('cuerpo');


// Variable para almacenar las combinaciones de grupo, bloque y rubro generadas 
// Con new Set() generamos combinaciones únicas (Esto para evitar duplicidad de cuentas).
const combinacionesGeneradas = new Set();

// Este evento se desecadenará al presionar el botón
btnAgregar.addEventListener('click', () => {
  // Capturamos los values
  const grupo = grupoSelect.value;
  const bloque = bloqueSelect.value;
  const rubro = rubroSelect.value;
  // Vacio el cuerpo de la tabla para luego rellenarla con la nueva selección de cuentas
  cuerpoTabla.innerHTML='';

  // Generamos una clave única para la combinación de grupo, bloque y rubro
  const claveCombinacion = `${grupo}-${bloque}-${rubro}`;

  
  // Verificamos si la combinación ya ha sido generada previamente
  if (combinacionesGeneradas.has(claveCombinacion)) {
  return; // Salimos de la función sin generar las cuentas repetidas
  }
  const btnPdf = document.getElementById('btnGenerarPDF');
  // Genero el botón de reporte para descargar el plan de cuentas (Por el momento solo visual, no funcional)
  if (!btnPdf) {  // Compruebo si no existe, ya que sino se va a generar por cada click (Se duplica)
    const btnReporte = document.getElementById('btnReporte');
    const button = document.createElement('button');
    button.id = "btnGenerarPDF";
    button.className = 'btn btn-primary';
    button.type = 'button';
    button.textContent = 'Descargar Plan';
    btnReporte.appendChild(button);
  }

  //Le pasamos los parámetros que requiere la ruta
  fetch(`/agregarCuentas/${grupo}/${bloque}/${rubro}`, { //En este caso, hay que especificar el método de envío.
    method: 'POST' 
  })
    .then(response => response.json())
    .then(data => {
      const tabla = data
        .map(cuenta => { // Imprimimos las cuentas 
          return `
            <tr>
              <th scope="row">${cuenta.codigo}</th>
              <td>${cuenta.nombre}</td>
              <td>${cuenta.tipo}</td>
              <td><input type="button" value="Modificar" class="btn btn-outline-primary btnModificar"  id="btnModificar">
              <input type="button" value="Eliminar" class="btn btn-outline-danger btnEliminar" id="btnEliminar"></td>         
            </tr>
          `;
        })
        cuerpoTabla.innerHTML += tabla.join(''); //A este join se lo usa para separar elementos de un array (En este caso, nuestros registros).

      // Agregamos la combinación generada al conjunto que tenemos arriba en new Set()
      combinacionesGeneradas.add(claveCombinacion);
      
      
      
    //- Seccion de alertas (Utilizamos 'Sweet Alert 2')
    //- 'btnModificar' y 'btnEliminar' son clases.
    //- No usamos los id porque son únicos (Solo funcionaría la alerta del primer registro y no los demás)
    //- La clase permite duplicidad, es por eso que recorremos con un for y se lo aplicamos a todas las clases.
    

    // Alerta que se activa al presionar el botón de modificar
    const btnModificar = document.getElementsByClassName('btnModificar');
    for (let i = 0; i < btnModificar.length; i++) {
      btnModificar[i].addEventListener('click', () => {

        // btnModificar[i] = Ubicamos la fila en la que se encuentra el botón
        // 1er parentNode = Elemento padre del botón ( En este caso un <td> )
        // 2do parentNode = Elemento padre del <td> (En este caso, la fila <tr> )
        // querySelector('td:nth-child(2)') = Accedemos al segundo hijo de la fila (El nombre de la cuenta)
        // textContent = Capturamos el texto
        let cuentaNombre = btnModificar[i].parentNode.parentNode.querySelector('td:nth-child(2)').textContent;
        Swal.fire({
          title: 'Modificar cuenta',
          input: 'text',
          inputValue: cuentaNombre,
          inputPlaceholder: 'Escriba el nombre',
          showCancelButton: true,
          preConfirm: (nuevoNombre) => {
            // Hacemos la solicitud a la API para modificar el nombre
            // encodeURIComponent = Para que no haya conflicto con caracteres especiales
            fetch(`/modificarNombre/${encodeURIComponent(nuevoNombre)}/${encodeURIComponent(cuentaNombre)}`,{
              method : 'POST'
            })
              .then(response => response.json())
              .then(data => {
                // Actualizamos la tabla con los datos nuevos
                cuentaNombre = data.nuevoNombre;
              })
              .catch(error => {
                console.error(error);
              });
          }
        })
        .then(result => {
          // Resultado después de confirmar
          if (result) {
            let nombre = btnModificar[i].parentNode.parentNode.querySelector('td:nth-child(2)');
            nombre.textContent = result.value; 
            Swal.fire('Cuenta modificada', '"' + result.value + '" se llamará a partir de ahora', 'success');
          }})
      });
    }
      
      //Alerta que se activa al presionar botón de eliminar
      const btnEliminar = document.getElementsByClassName('btnEliminar')
      for (let i = 0; i < btnEliminar.length; i++) {
        btnEliminar[i].addEventListener('click', () => {
          Swal.fire({
            title: '¿Desea eliminar esta cuenta?',
            showCancelButton: true 
          });
        });
      }



  })
    .catch(error => {
      console.error(error);
    });

});

*/