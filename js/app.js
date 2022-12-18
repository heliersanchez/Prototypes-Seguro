//* CONSTRUCTORES
function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

// Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {
  /*
    1. Americano = 1.15
    2. Asiatico = 1.05
    3. Europeo = 1.35
  */

  let totalSeguro;
  const PRECIO_BASE = 2000;

  switch (this.marca) {
    case "1":
      totalSeguro = PRECIO_BASE * 1.15;
      break;
    case "2":
      totalSeguro = PRECIO_BASE * 1.05;
      break;
    case "3":
      totalSeguro = PRECIO_BASE * 1.35;
    default:
      break;
  }

  // Calcular años de diferencia
  const diferencia = new Date().getFullYear() - this.year;

  // Cada año que la diferencia es mayor, el costo va a reducir un 3%
  totalSeguro -= (diferencia * 3 * totalSeguro) / 100;

  /*
    Si el seguro es basico se multiplica por 30%
    Si el seguro es completo se multiplica por 50%
  */

  if (this.tipo == "basico") {
    totalSeguro *= 1.3;
  } else totalSeguro *= 1.5;

  return totalSeguro;
};

function UI() {}

//Llenar opciones de los años
UI.prototype.llenarOpciones = () => {
  for (let i = actualYear; i > actualYear - 20; i--) {
    const optionYear = document.createElement("OPTION");
    optionYear.value = i;
    optionYear.textContent = i;

    selectYear.appendChild(optionYear);
  }
};

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const alerta = document.querySelector(".mensaje");

  if (alerta) {
    return;
  }

  const spinner = document.querySelector("#cargando");
  spinner.setVisible = true;

  const divMensaje = document.createElement("DIV");
  if (tipo === "error") {
    divMensaje.classList.add("error");
  } else divMensaje.classList.add("correcto");

  divMensaje.classList.add("mensaje", "mt-10");
  divMensaje.textContent = mensaje;

  formulario.insertBefore(divMensaje, document.querySelector("#resultado"));

  setTimeout(() => {
    divMensaje.remove();
  }, 3000);
};

UI.prototype.mostrarResultado = (costoSeguro, seguro) => {
  const { marca, year, tipo } = seguro;

  const marcaNombre =
    marca === "1" ? "Americano" : marca === "2" ? "Asiatico" : "Europeo";

  const imprimirResumen = document.createElement("DIV");
  imprimirResumen.classList.add("mt-10");
  imprimirResumen.innerHTML = `
    <p class="header">Tu resumen:</p>
    <p class="font-bold">Marca: <span class='font-normal'> ${marcaNombre} </span></p>
    <p class="font-bold">Año: <span class='font-normal'> ${year} </span></p>
    <p class="font-bold">Tipo: <span class='font-normal'> ${tipo} </span></p>
    <p class="font-bold">Total: <span class='font-normal'> $${costoSeguro} </span></p>
    
  `;

  const divResultado = document.querySelector("#resultado");

  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none";
    divResultado.appendChild(imprimirResumen);
  }, 3000);
};

//? SELECTORES
const selectYear = document.querySelector("#year");
const formulario = document.querySelector("#cotizar-seguro");

const actualYear = new Date().getFullYear();
const ui = new UI();

//? LISTENERS
document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones();
});

eventListeners();

function eventListeners() {
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  const marca = document.querySelector("#marca").value;
  const year = document.querySelector("#year").value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje(
      "Faltan datos, todos los campos son requeridos.",
      "error"
    );
    return;
  } else {
    const divResultado = document.querySelector("#resultado div");
    if (divResultado != null) {
      divResultado.remove();
    }

    ui.mostrarMensaje("Validando", "correcto");
    const seguro = new Seguro(marca, year, tipo);
    const costoSeguro = seguro.cotizarSeguro();
    ui.mostrarResultado(costoSeguro, seguro);
  }
}
