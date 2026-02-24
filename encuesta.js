const btnCerrar = document.getElementById("cerrar");
const btnReiniciar = document.getElementById("reiniciar");
const contador = document.getElementById("contador");
const favoritos = document.getElementById("favoritos");
const contenedorMarcas = document.getElementById("marcas");

let totalFavoritos = 0;
let fav = 0;

fetch("encuesta.xml").then((response) => response.text())
    .then((data) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/html");
        const marcas = xml.getElementsByTagName("marca");

        for (let marca of marcas){

            const nombre = marca.getElementsByTagName("nombre")[0].textContent;
            const conteo = marca.getElementsByTagName("conteo")[0].textContent;

            contenedorMarcas.innerHTML += `

            <div data-product data-votos="0"
            data-ganador="false" data-nombre =${nombre}>
                <p>${nombre}</p>
                <p id= "contar" >${conteo}</p>
                <button class="fav">Añadir a favoritos</button>
            </div>
            `;
        }

        funcionalidadBotones();

    });

function funcionalidadBotones(){

    const botones = document.querySelectorAll(".fav");

    botones.forEach((boton) => {
        boton.addEventListener("click", votarFavorito);
    });
}

function votarFavorito(evento){

    const marca = evento.target.parentElement;

        marca.dataset.fav = "true";
        totalFavoritos++;

    actualizarContador();
    contadorIndividual(marca);
}

function actualizarContador(){
    contador.innerText = `Contador: ${totalFavoritos}`;
}

function contadorIndividual(evento){
	
	let contadorFav = Number(evento.dataset.votos);
	contadorFav++;
	evento.dataset.votos = contadorFav; 
	const texto = evento.querySelector("#contar")
	texto.innerHTML = `Numero de favoritos: ${contadorFav}`

    if (contadorFav > fav){
        fav = contadorFav;
        ganadorAct = evento.dataset.nombre;
        evento.dataset.ganador = true;
        favoritos.innerHTML = `Favorito:  ${ganadorAct}`
    }
}
