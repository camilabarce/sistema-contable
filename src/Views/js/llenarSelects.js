
// Consumimos la api y rellenamos los nombres y los values de los 'options' dinamicamente con la base de datos.
// Pueden ver esta prueba ingresando a 'localhost:3000'

const grupoSelect = document.getElementById('grupoSelect');
const bloqueSelect = document.getElementById('bloqueSelect');
const rubroSelect = document.getElementById('rubroSelect');

//Escuchamos los eventos de la ventana
window.addEventListener('DOMContentLoaded', () => {

  fetch('/optionsGrupoBloque') //Consumimos la api para rellenar los <select> / <option>
  .then(response => response.json())
  .then(data => {
    const grupo = data.grupo;
    const bloque = data.bloque;

    grupo.forEach(data => { //Creamos un <option> para Grupo
      const option = document.createElement('option');
      option.value = data.id_grupo;
      option.className = 'options';
      option.textContent = data.nombre_grupo;
      grupoSelect.appendChild(option);
    });

    // Creamos un objeto 'relaciones' entre grupoValue y los valores a filtrar (en este caso 'id_bloque').
    const relaciones = {
      1: [1, 2],         // Grupo 1 | Bloque 1 y 2
      2: [1, 2],         // Grupo 2 | Bloque 1 y 2
      3: [5],            // Grupo 3 | Bloque 5
      4: [3, 4]          // Grupo 4 | Bloque 3 y 4
    };

    // Sección que condiciona a los select
    grupoSelect.addEventListener('change', () => {
      const grupoValue = grupoSelect.value;
      const contieneGrupo = relaciones.hasOwnProperty(grupoValue); //Analizamos si 'relaciones' contiene el 'grupoValue' dentro de sus propiedades.
      bloqueSelect.innerHTML = ''; // Vaciamos el select de 'bloque'. Lo llenaremos con el uso de 'grupo'.

      // Verificamos si hay una relación definida para el 'grupoValue' actual
      if (contieneGrupo) {
        // Verificamos si el 'id_bloque' se encuentra en las propiedades de 'relaciones'
        const bloquesFiltrados = bloque.filter(data => relaciones[grupoValue].includes(data.id_bloque));
        bloquesFiltrados.forEach(data => { // Creamos un <option> con los datos del nuevo arreglo 'bloquesFiltrados'
          const option = document.createElement('option');
          option.value = data.id_bloque;
          option.className = 'options';
          option.textContent = data.nombre_bloque;
          bloqueSelect.appendChild(option);
        });
      }

      actualizarRubros(); // Actualizamos el estado de rubros
    });
  })
  .catch(error => {
    console.error(error);
  });

});

bloqueSelect.addEventListener('change', () => {
  rubroSelect.innerHTML = ''; 
  actualizarRubros();
});

//Funcion para actualizar <select> de Rubros
const actualizarRubros = () => {
  const grupoValue = grupoSelect.value;
  const bloqueValue = bloqueSelect.value;
  rubroSelect.innerHTML = ''; // Vaciamos el select de 'rubro' por cada cambio de grupo y bloque

  fetch(`/optionRubros/${grupoValue}/${bloqueValue}`) // Consumimos api para rubros aprovechando los recursos de la api anterior
    .then(response => response.json())
    .then(data => {
      const rubro = data.rubro;
      rubro.forEach(data => {
        const option = document.createElement('option');
        option.value = data.id_rubro;
        option.className = 'options';
        option.textContent = data.nombre_rubro;
        rubroSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error(error);
    });
};


/*

- BLOQUE ANTIGUO QUE CONDICIONABA A LOS <select>
- Aprovechamos la repetición de la lógica de impresión de los <option> y buscamos un alternativa que lo simplifique.


  fetch('/rellenarOptions')
    .then(response => response.json())
    .then(data => {
      const grupo = data.grupo;
      const bloque = data.bloque;

      grupo.forEach(data => {
        const option = document.createElement('option');
        option.value = data.id_grupo;
        option.textContent = data.nombre_grupo;
        grupoSelect.appendChild(option);
      });

      // Sección que condiciona a los select
      grupoSelect.addEventListener('change', () => {
        const grupoValue = grupoSelect.value;
        bloqueSelect.innerHTML = ''; //Vaciamos el select de 'bloque'. Lo llenaremos con el uso de 'grupo'.

        //Filtramos los bloques para 'Activo' y 'Pasivo'
        if (grupoValue == 1 || grupoValue == 2) {
          const bloqueFiltrado = bloque.filter(data => data.id_bloque == 1 || data.id_bloque == 2);
          bloqueFiltrado.forEach(data => {
            const option = document.createElement('option');
            option.value = data.id_bloque;
            option.textContent = data.nombre_bloque;
            bloqueSelect.appendChild(option);
          });
          //Filtramos los bloques para 'Patrimonio neto'
        } else if (grupoValue == 3) { 
          const bloqueFiltrado = bloque.filter(data => data.id_bloque == 5);
          bloqueFiltrado.forEach(data => {
            const option = document.createElement('option');
            option.value = data.id_bloque;
            option.textContent = data.nombre_bloque;
            bloqueSelect.appendChild(option);
          });
          // Filtramos los bloques para 'resultados'
        } else if (grupoValue == 4) { 
          const bloqueFiltrado = bloque.filter(data => data.id_bloque == 3 || data.id_bloque == 4);
          bloqueFiltrado.forEach(data => {
            const option = document.createElement('option');
            option.value = data.id_bloque;
            option.textContent = data.nombre_bloque;
            bloqueSelect.appendChild(option);
          });
        } 

        actualizarRubros(); // Actualizamos el estado de rubros      
      });
        })

    .catch(error => {
      console.error(error);
    });*/