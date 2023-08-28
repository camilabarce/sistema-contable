const puppeteer = require('puppeteer');

// Controlador para generar el PDF del plan de cuentas
const generarPDF = async (req, res) => {
  try {
    const browser = await puppeteer.launch(); //Abrimos un navegador en 2do plano
    const page = await browser.newPage(); // Creamos una página

    // Agregamos estilos CSS y estilos de Bootstrap a un HTML
    const htmlContent = `
      <html>
        <head>
        <style>
        h1{
            text-align:center;
            padding-top:5%;
            padding-bottom:2%;
            fontSize: 20;
            font-style: italic;
        }
        .hr{
          border: none;
          border-top: 3px solid black;
          margin: 10px 0;
        }
        h4{
          margin-left:4%;
          padding-bottom:3%;
        }
        .rubroNombre{
          display: inline;
          color: #2c08fa;
          text-transform: capitalize;
        }
        .table {
            margin-top: 50px;
            text-transform: uppercase;
          }
          .table thead th {
            font-weight: bold;
            color: black;
          }
          .table tbody tr {
            color: black;
            padding: 10px;
          }
          .table tbody td:nth-child(1) {
            color: black;
          }
          </style>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css">
        </head>
        <body>
        <hr class="hr">
        <h1> Plan de cuentas - Reporte <h1>
        <hr class="hr">
        <h4> Rubro: ' <p class="rubroNombre">${req.body.rubroNombre}</p> '</h4> <!-- Mostramos el nombre del rubro -->
        <hr class="hr">
        ${req.body.tablaHtml}<!--Obtenemos los datos de nuestro index.html-->
        </body>
      </html>
    `;

    await page.setContent(htmlContent); //Seteamos el contenido HTML en la página
    const pdfBuffer = await page.pdf({ format: 'A4' }); // Le damos un formato a la página
    await browser.close(); //Una vez creado el PDF, cerramos el navegador.

    res.set({
      'Content-Type': 'application/pdf', // Tipo de contenido (Para que se interprete)
      'Content-Disposition': 'inline; filename="plan_cuentas.pdf"', //Nombre de archivo
      'Content-Length': pdfBuffer.length, //Longitud del contenido
    });
    res.send(pdfBuffer); // Enviamos el contenido como respuesta
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar el PDF');
  }
};

module.exports = generarPDF;
