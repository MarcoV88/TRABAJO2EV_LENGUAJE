const btnCerrar = document.getElementById("cerrar");
const btnReiniciar = document.getElementById("reiniciar");
const contador = document.getElementById("contador");
const favoritos = document.getElementById("favoritos");
const contenedorMarcas = document.getElementById("marcas");

let totalFavoritos = 0;
let fav = 0;
let ganadorAct = "";

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
            data-ganador="false" data-nombre ="${nombre}">
                <p>${nombre}</p>
                <p class="contar" >${conteo}</p>
                <button class="fav">Añadir a favoritos</button>
            </div>
            `;
        }

        funcionalidadBotones();
        btnCerrar.addEventListener("click", cerrarEncuesta);
        btnReiniciar.addEventListener("click", reiniciarEncuesta);

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
    actualizarGanador();
}

function actualizarContador(){
    contador.innerText = `Contador: ${totalFavoritos}`;
}

function contadorIndividual(evento){
	
	let contadorFav = Number(evento.dataset.votos);
	contadorFav++;
	evento.dataset.votos = contadorFav; 
	const texto = evento.querySelector(".contar")
	texto.innerHTML = `Numero de favoritos: ${contadorFav}`

    if (contadorFav > fav){
        fav = contadorFav;
        ganadorAct = evento.dataset.nombre;
        evento.dataset.ganador = true;
        favoritos.innerHTML = `Favorito:  ${ganadorAct}`
    }
}

function actualizarGanador() {
    const todasLasMarcas = document.querySelectorAll("[data-product]");
    let maxVotos = 0;
    let nuevoGanador = null;

    todasLasMarcas.forEach(marca => {
        marca.dataset.ganador = "false";
        const votos = Number(marca.dataset.votos);
        
        if (votos > maxVotos) {
            maxVotos = votos;
            nuevoGanador = marca;
        }
    });

    if (maxVotos > 0 && nuevoGanador) {
        nuevoGanador.dataset.ganador = "true";
        favoritos.innerHTML = `Favorito: ${nuevoGanador.dataset.nombre}`;
        fav = maxVotos;
        ganadorAct = nuevoGanador.dataset.nombre;
    } else if (maxVotos === 0) {
        favoritos.innerHTML = "Favorito: ";
    }   
}

function cerrarEncuesta() {
    const botones = document.querySelectorAll(".fav");
    const todasLasMarcas = document.querySelectorAll("[data-product]");
    botones.forEach(boton => {
        boton.style.opacity = "0.5";
    });
    todasLasMarcas.forEach(marca => {
        marca.style.opacity = "0.7";
    });
    let maxVotos = 0;
    let ganadorFinal = "";
    
    todasLasMarcas.forEach(marca => {
        const votos = Number(marca.dataset.votos);
        if (votos > maxVotos) {
            maxVotos = votos;
            ganadorFinal = marca.dataset.nombre;
        }
    });
    
    if (maxVotos > 0) {
        alert(`¡ENCUESTA CERRADA!\n\nEl ganador es: ${ganadorFinal}`);
    }
}

function reiniciarEncuesta() {
    const todasLasMarcas = document.querySelectorAll("[data-product]");
    const botones = document.querySelectorAll(".fav");
    
    totalFavoritos = 0;
    fav = 0;
    ganadorAct = "";
    
    todasLasMarcas.forEach(marca => {
        marca.dataset.votos = "0";
        marca.dataset.ganador = "false";
        marca.style.opacity = "1";
        marca.style.pointerEvents = "auto";
        const texto = marca.querySelector(".contar");
        texto.innerHTML = "Numero de favoritos: 0";
    });
    
    botones.forEach(boton => {
        boton.style.opacity = "1";
    });

    actualizarContador();
    favoritos.innerHTML = "Favorito: ";
}
