// ------------ VARIABLES --------------
const tablero = document.querySelector('.tablero');
const victoriasR = document.querySelector('#victoriasRojo');
const victoriasA = document.querySelector('#victoriasAmarillo');
let hijos, arreglo, terminado = true, tableroArray = [], id, ejeY, x, y, color, gano = false;
let turno = 1;
let victoriasRojo = 0, victoriasAmarillo = 0;

// ----------- EVENTOS -----------------

// Cuando inicia la pagina crea el tablero y comienza el marcador en 0's
$(document).ready(function(){
    ImprimirMarcador();
    CrearTablero();
})

// Funcion que reinicia el marcador 
$('#reiniciar-victorias').click(function(){
    victoriasRojo = 0;
    victoriasAmarillo = 0;
    ImprimirMarcador();
    Reiniciar();
})

// Funcion que reinicia la partida
$('#btn-reiniciar').click(function(){
    Reiniciar();
})

/* Aquie empieza el proceso al darle click a cualquier columna del tablero, revisa donde diste click 
y dependiendo de la columna manda un objeto a la funcion que crea un array */
$('.x').click(function(){
    id = $(this).attr('id');
    switch(id){
        case 'x1': 
            const x1 = document.querySelector('#x1');
            crearArray(columna1) 
            break;
        case 'x2': 
            const x2 = document.querySelector('#x2');
            crearArray(columna2)
            break;
        case 'x3':
            const x3 = document.querySelector('#x3');
            crearArray(columna3)
            break;
        case 'x4': 
        const x4 = document.querySelector('#x4');
            crearArray(columna4)
            break;
        case 'x5':
            const x5 = document.querySelector('#x5');
            crearArray(columna5)
            break;
        case 'x6': 
            const x6 = document.querySelector('#x6');
            crearArray(columna6)
            break;
        case 'x7': 
            const x7 = document.querySelector('#x7');
            crearArray(columna7)
            break;
    }
})

// ------------- CLASES ---------------------
class Columna {
    constructor(posicion, filaOcupada, elemento){
        this.posicion = posicion;
        this.filaOcupada = filaOcupada;
        this.elemento = elemento;
    }
}

// ---------------- OBJETOS -----------------
const columna1 = new Columna(0, -1, x1);
const columna2 = new Columna(1, -1, x2);
const columna3 = new Columna(2, -1, x3);
const columna4 = new Columna(3, -1, x4);
const columna5 = new Columna(4, -1, x5);
const columna6 = new Columna(5, -1, x6);
const columna7 = new Columna(6, -1, x7);


// -------------- FUNCIONES --------------------

/* Esta funcion crea un array de dos dimensiones que funciona como un tablero para revisar las posiciones */ 
function CrearTablero(){
    $(tablero.children).each(function(index, item){
        tableroArray[index] = [];
        $(item.children).each(function(i, hijo){
            tableroArray[index].push(hijo);
        })
    });
}

/* Crea un array con los hijos de la columna que sera mandado para realizar la animacion de la ficha cayendo */
function crearArray(columna){
    if(columna.filaOcupada == 5){
        console.log('No se pueden meter mas fichas');
    }else{
        if(terminado){
            arreglo = [];
            $(columna.elemento.children).each(function(index, item){
                $(item.children).each(function(i, circulo){
                    arreglo.push(circulo);
                })
            })
            crearAnimacion(arreglo, columna);
        }else{
            console.log('Espere...');
        }
    }
}

/* Recibe un array y el objeto columna para crear la animacion de la ficha */
const crearAnimacion = async (arr, columna) => {
    if(gano == false){
        terminado = false;
        if(turno % 2 == 0){
            for(let i = 5; i > columna.filaOcupada; i--){
                arr[i].classList.add('amarilla');
                await (new Promise(r => setTimeout(r, 65)));
                arr[i].classList.remove('amarilla');
            }
            columna.filaOcupada += 1;
            pintarLugar(columna, arr);   
        }else{
            for(let i = 5; i > columna.filaOcupada; i--){
                arr[i].classList.add('roja');
                await (new Promise(r => setTimeout(r, 65)));
                arr[i].classList.remove('roja');
            }
            columna.filaOcupada += 1;
            pintarLugar(columna, arr);
        }
        turno += 1;
        terminado = true;
    }
    
}

// Pinta el ultimo espacio de la ficha y almacena su valor
function pintarLugar(columna, arr){
    ejeY = columna.filaOcupada;
    if(turno % 2 == 0){
        $(arr[ejeY]).addClass('amarilla');
        IterarTblero();
    }else{
        $(arr[ejeY]).addClass('roja');
        IterarTblero();
    }
    
}

/* Itera sobre el array de dos dimensiones y por cada uno de sus elementos llama a una funcion para
empezar a revisar el tablero */ 
function IterarTblero(){
    $(tableroArray).each(function(index, item){
        x = index;
        $(item).each(function(index,item){
            y = index;
            if($(item.children).hasClass('roja')){
                color = 'roja';
                revisarConexion(x, y, color);
            }else if($(item.children).hasClass('amarilla')){
                color = 'amarilla';
                
                revisarConexion(x, y, color);
            }
        })
    })
}

/* Esta funcion llama a varias funciones para que cada una de ellas revise en una direccion distinta
si es que tiene fichas del mismo color a sus distintos lados */
function revisarConexion(x, y, color){
    const opcion1 = Derecha(x, y, color, 0);
    if(opcion1 == false){
        const opcion2 = ArribaDerecha(x, y, color, 0);
        if(opcion2 == false){
            const opcion3 = Arriba(x, y, color, 0);
            if(opcion3 == false){
                const opcion4 = ArribaIzq(x, y, color, 0);
            }
        }
    }
}

/* Funcion que revisa en la direccion horizontal */
function Derecha(x, y, color, conexion){
    x += 1;
    if(x <= 6){
        if($(tableroArray[x][y].children).hasClass(color)){
            conexion += 1;
            if(conexion == 3){
                Ganador(x, y, color, 'derecha');
            }else{
                Derecha(x, y, color, conexion);
            }
            return true;
        }else{
            return false;
        }
    }
}

/* Funcion que revisa en diagonal hacia la derecha */
function ArribaDerecha(x, y, color, conexion){
    x += 1;
    y += 1;
    if(x <= 6 && y <= 5){
        if($(tableroArray[x][y].children).hasClass(color)){
            conexion += 1;
            if(conexion == 3){
                Ganador(x, y, color, 'arribaDerecha');
            }else{
                ArribaDerecha(x, y, color, conexion);
            }
            return true;
        }else{
            return false;
        }
    }
    
}

/* Funcion que revisa hacia arriba */
function Arriba(x, y, color, conexion){
    y += 1;
    if(y <= 5){
        if($(tableroArray[x][y].children).hasClass(color)){
            conexion += 1;
            if(conexion == 3){
                Ganador(x, y, color, 'arriba');
            }else{
                Arriba(x, y, color, conexion);
            }
            return true;
        }else{
            return false;
        }
    }
}

/* Funcion que revias en diagonal a la izquierda */
function ArribaIzq(x, y, color, conexion){
    x -= 1;
    y += 1;
    if(x >= 0 && y <= 5){
        if($(tableroArray[x][y].children).hasClass(color)){
            conexion += 1;
            if(conexion == 3){
                Ganador(x, y, color, 'arribaIzquierda');
            }else{
                ArribaIzq(x, y, color, conexion);
            }
            return true;
        }else{
            return false;
        }
    }
}

/* Funcion que revisa cuales son las fichas que realizaron la conexion para resaltarlas y mostrar donde
gano el jugador */
function Ganador(x, y, color, direccion){
    gano = true;
    switch(direccion){
        case 'derecha':
            for(let i = x; i >= x-3; i--){
                $(tableroArray[i][y].children).addClass('borde-blanco');
            }
            SumarVictoria(color);
            break;
        case 'arribaDerecha':
            for(let i = x; i >= x-3; i--){
                $(tableroArray[i][y].children).addClass('borde-blanco');
                y -= 1;
            }
            SumarVictoria(color);
            break;
        case 'arriba':
            for(let i = y; i >= y-3; i--){
                $(tableroArray[x][i].children).addClass('borde-blanco');
            }
            SumarVictoria(color);
            break;
        case 'arribaIzquierda':
            for(let i = x; i <= x+3; i++){
                $(tableroArray[i][y].children).addClass('borde-blanco');
                y -= 1;
            }
            SumarVictoria(color);
            break;
    }
}

/* Funcion que suma 1 al marcador de victorias */
function SumarVictoria(color){
    if(gano == true){
        if(color == 'roja'){
            victoriasRojo += 1;
            ImprimirMarcador();
        }else{
            victoriasAmarillo += 1;
            ImprimirMarcador();
        }
    }
}

/* Funcion que Imprime el marcador en el DOM */
function ImprimirMarcador(){
    victoriasR.innerHTML = `${victoriasRojo}`;
    victoriasA.innerHTML = `${victoriasAmarillo}`;
}

/* Funcion que reinicia la partida */
function Reiniciar(){
    gano = false;
    CrearTablero();
    turno = 1;
    columna1.filaOcupada = -1;
    columna2.filaOcupada = -1;
    columna3.filaOcupada = -1;
    columna4.filaOcupada = -1;
    columna5.filaOcupada = -1;
    columna6.filaOcupada = -1;
    columna7.filaOcupada = -1;

    $(tableroArray).each(function(index, item){
        x = index;
        $(item).each(function(index,item){
            y = index;
            if($(item.children).hasClass('roja')){
                $(item.children).removeClass('roja');
                $(item.children).removeClass('borde-blanco');
            }else if($(item.children).hasClass('amarilla')){
                $(item.children).removeClass('amarilla');
                $(item.children).removeClass('borde-blanco');
            }
        })
    })
}