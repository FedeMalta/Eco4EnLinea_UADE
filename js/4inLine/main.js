"use strict";
addEventListener('DOMContentLoaded', (event) => {

    let play = document.getElementById('btnGame');
    let section = document.querySelector('.theGame');
    let restart = document.getElementById('restartButton');
    let actualGame = document.querySelector('.actualGame');
    let error = document.getElementById('errorPersonajes');

    //Al hacer click en el botón de play se inicializa el juego mediante el form
    play.addEventListener('click', () => {
        
        let form = document.getElementById('gameForm');
        let data = new FormData(form);

        let num = data.get('gameType');

        let name1 = data.get('name1');
        if (name1 == '') {
            name1 = 'Jugador 1';
        }

        let name2 = data.get('name2');
        if (name2 == '') {
            name2 = 'Jugador 2';
        }

        let charPlayer1 = data.get('char1');
        let img1 = new Image();
        let charPlayer2 = data.get('char2');
        let img2 = new Image();


        if (charPlayer1 != null) {
            img1.src = charPlayer1;
        } else {
            img1.src = "img/gameDetail/characters/Chip.png";
        };


        if (charPlayer2 != null) {
            img2.src = charPlayer2;
        } else {
            img2.src = "img/gameDetail/characters/Chip (2).png";
        }

        

        if (charPlayer1 != charPlayer2) {
            error.innerHTML = ""
            actualGame.style.visibility="visible";
            let juego = new Juego(num);
            juego.init(img1, img2, name1, name2);

            //En el caso de que haya ganador, se termine el tiempo, se cambie tamaño de pantalla o  
            //se clickee en el botón de reinicio se corta el intervalo que dibuja el juego. 
            let interval = setInterval(function () {
            restart.addEventListener('click', () => {
                juego.hayTiempo = false;
                clearInterval(interval);
                actualGame.style.visibility="hidden";
                section.classList.remove('hide');
            });
            if (juego.winner || !juego.hayTiempo) {
                clearInterval(interval);
            }
                juego.draw();
            }, 20);

            let interval2 = setInterval(function () {
            window.addEventListener('resize', () => {
                juego.hayTiempo = false;
                clearInterval(interval2);
                actualGame.style.visibility="hidden";
                section.classList.remove('hide');
            });
            if (juego.winner || !juego.hayTiempo) {
                clearInterval(interval2);
            }
                juego.draw();
            }, 20);

            section.classList.add('hide');
        } else {
            error.innerHTML = "Error. No pueden ser el mismo equipo."
        }

        
    })
});