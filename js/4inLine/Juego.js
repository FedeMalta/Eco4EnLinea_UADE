"use strict";

class Juego {

    constructor(num) {
        this.player1 = new Jugador();
        this.player2 = new Jugador();
        this.num = num;
        this.player1.setTurn(true);
        this.player2.setTurn(false);
        this.tableroView = [];
        this.matrix = [];
        this.winner = false;
        this.hayTiempo = true;
    }

    //Inicializa el objeto
    init(img1, img2, name1, name2) {
        this.player1.setInfo(name1, img1, this.num);
        this.player2.setInfo(name2, img2, this.num);
        this.generateBoard(this.num - 1, this.num);
        this.generateMatrix(this.num - 1, this.num);
        this.player1.init((this.num * (this.num - 1)) / 2, 12, 50);
        let columnasFichas = Math.ceil(((this.num * (this.num - 1)) / 2) / 11);
        let inicioFichas2 = board.width - (columnasFichas * 48) - ((columnasFichas - 1) * 7) - 12;
        this.player2.init((this.num * (this.num - 1)) / 2, Math.floor(inicioFichas2), 50);
        this.initEvents();
        this.initCounter();
    }

    //Inicializa el timer, el cual se corta cuando termina el tiempo o gana un jugador
    initCounter() {
        let counterSeg = document.getElementById("counterSeg");
        let seg = 11;
        let counterMin = document.getElementById("counterMin");
        let min = 5;
        counterSeg.innerText = seg;
        counterMin.innerText = min;
        let player = null;
        let self = this;

        let interval = setInterval(function () {
            if (self.hayTiempo) {
                if (min >= 0) {
                    if (seg == 0) {
                        min--;
                        seg = 59;
                        if (min >= 0 && seg >= 0) {
                            counterMin.innerText = min;
                            counterSeg.innerText = seg;
                        }
                    } else {
                        seg--;
                        counterSeg.innerText = seg;
                    }
                } else {
                    self.hayTiempo = false;
                    if (counterMin.innerHTML == 0 && counterSeg.innerHTML == 0) {
                        setTimeout(() => {
                            self.endGame(player);
                        }, 20);
                    }
                    clearInterval(interval);
                }
            } else {
                clearInterval(interval);
            }

        }, 1000);

    }

    //Limpia el canvas
    clearCanvas() {
        ctx.clearRect(0, 0, 1150, 580);
    }

    //Crea el tablero con una imagen de la casilla en cada posición
    generateBoard(row, col) {
        this.clearCanvas();
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let img = new Image();
                img.src = 'img/gameDetail/Fractal.png';
                this.tableroView.push(img);
            }
        }
    }

    //Crea la matriz de fichas insertadas y la inicializa en null
    generateMatrix(row, col) {
        for (let i = 0; i < row; i++) {
            let row = [];
            for (let j = 0; j < col; j++) {
                row[j] = null;
            }
            this.matrix.push(row);
        }
    }

    //Agrega una ficha a la matriz en caso de que la columna tenga casillas vacias
    //en la columna determinada, y luego de insertarla verifica si el jugador gano.
    //En caso de que no haya ganado, cambia de turno para el otro jugador.
    addToMatrix(ficha, col, player) {
        let fila = this.num - 2;
        let insertado = false;
        while (fila >= 0 && !insertado) {
            if (this.matrix[0][col] != null) {
                ficha.returnToPos();
                ficha.setCol(-1);
                ficha.setUso(false);
                ficha.setPasadaAJuego(false);
                ficha.setEnMatriz(false);
            }
            if (this.matrix[fila][col] == null) {
                this.matrix[fila][col] = ficha;
                insertado = true;
                this.refreshBoard(ficha, fila, col, player);
                this.winner = this.checkWinner(ficha, fila, col);
                if (this.winner) {
                    player.setWinner();
                    this.hayTiempo = false;
                }
                else {
                    if (this.player1.turn) {
                        //console.log("turno del 2");
                        this.player1.setTurn(false);
                        this.player2.setTurn(true);
                    } else {
                        //console.log("turno del 1");
                        this.player2.setTurn(false);
                        this.player1.setTurn(true);
                    }
                }
            }
            fila--;
        }
    }

    //Cada vez que se inserta una ficha, se actualiza la posicion de esta con este metodo
    refreshBoard(ficha, fila, col, player) {
        let mitadTablero = (this.num / 2) * 50;
        let inicioTablero = (board.width / 2) - mitadTablero;
        let pos = player.chips.indexOf(ficha);
        let posX = inicioTablero + (col * 50) + 2;
        let posY = 65 + (fila * 50);
        player.chips[pos].setPosX(posX);
        player.chips[pos].setPosY(posY);
    }

    //Verifica si un jugador gano segun la ultima ficha que inserto en la matriz
    checkWinner(ficha, fila, col) {
        let count = 0;
        //Verificación por columna
        let fila1 = fila;
        while (fila1 <= this.num - 2) {
            if (this.matrix[fila1][col].char.src == ficha.char.src) {
                count++;
                if (count == this.num - 3) {
                    return true;
                }
            } else {
                count = 0;
                fila1 = this.num;
            }
            fila1++;
        }
        //Verificación por fila
        count = 0;
        let col1 = col;
        while (col1 >= 0 && this.matrix[fila][col1 - 1] != null && this.matrix[fila][col1 - 1].char.src == ficha.char.src) {
            col1--;
        }
        while (col1 <= this.num - 1 && this.matrix[fila][col1] != null) {
            if (this.matrix[fila][col1].char.src == ficha.char.src) {
                count++;
                if (count == this.num - 3)
                    return true;
            } else {
                count = 0;
                col1 = this.num;
            }
            col1++;
        }

        //Verificación por diagonal desde abajo hacia arriba
        count = 0;
        let col3 = col;
        let fila3 = fila;
        while (col3 - 1 >= 0 && fila3 + 1 <= this.num - 2 && this.matrix[fila3 + 1][col3 - 1] != null && this.matrix[fila3 + 1][col3 - 1].char.src == ficha.char.src) {
            col3--;
            fila3++;
        }

        while (col3 <= this.num - 1 && fila3 >= 0 && this.matrix[fila3][col3] != null) {
            if (this.matrix[fila3][col3].char.src == ficha.char.src) {
                count++;
                if (count == this.num - 3)
                    return true;
            } else {
                count = 0;
                col3 = this.num;
                fila3 = this.num;
            }
            col3++;
            fila3--;
        }

        //Verificación por diagonal desde arriba hacia abajo
        count = 0;
        let col2 = col;
        let fila2 = fila;
        while (col2 >= 0 && fila2 >= 0 && this.matrix[fila2 - 1][col2 - 1] != null && this.matrix[fila2 - 1][col2 - 1].char.src == ficha.char.src) {
            col2--;
            fila2--;
        }

        while (col2 <= this.num - 1 && fila2 <= this.num - 2 && this.matrix[fila2][col2] != null) {
            if (this.matrix[fila2][col2].char.src == ficha.char.src) {
                count++;
                if (count == this.num - 3)
                    return true;
            } else {
                return false;
            }
            col2++;
            fila2++;
        }

    }

    //Si hay ganador o termina el tiempo del juego, dibuja un mensaje de aviso en el canvas
    endGame(player) {
        ctx.font = "40px Poppins";
        ctx.fillStyle = "rgba(145, 191, 143, 0.8)";
        ctx.fillRect(0, 0, 1150, 580);
        ctx.fillStyle = "rgba(60, 130, 58, 1)";
        if (player != null) {
            ctx.fillText("WINNER", 480, 250);
            ctx.fillText(player.getName(), 480, 300);
        } else {
            ctx.fillText("GAME OVER", 450, 300);
            ctx.fillText("Time out", 480, 250);
        }
    }

    //Dibuja el juego: nombres, tablero y fichas
    draw() {
        this.clearCanvas();
        //drawNames
        ctx.font = "15px Poppins";
        ctx.fillText(this.player1.getName(), 110, 25);
        ctx.fillText(this.player2.getName(), board.width - 240, 25);
        //drawBoard
        let mitadTablero = (this.num / 2) * 50;
        let posX = (board.width / 2) - mitadTablero - 12;
        let posY = 50;
        let row = this.num - 1;
        let col = this.num;
        let pos = 0;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let img = this.tableroView[pos];
                ctx.drawImage(img, posX, posY, 78, 78);
                posX += 50;
                if (posX == (board.width / 2) - mitadTablero - 12 + 50 * col) {
                    posX = (board.width / 2) - mitadTablero - 12;
                    posY += 50;
                }
                pos++;
            }
        }
        //drawFichas
        this.player1.draw();
        this.player2.draw();

        if (this.winner) {
            if (this.player1.winner)
                this.endGame(this.player1);
            else
                this.endGame(this.player2);
        }

    }

    //Inicializa el evento mouseup en el canvas
    initEvents() {
        board.addEventListener("mouseup", (e) => {
            this.mouseUp(e)
        });
    }

    //Verifica cual de las fichas de cada jugador fue la ultima insertada.
    //Es la insertada si su posicion en columna no es igual a -1 y su atributo enMatriz se encuentra como falso.
    //Luego de verificar que cumpla esas condiciones, la agrega a la matriz y enMatriz se vuelve verdadero.
    mouseUp(e) {
        //Fichas Matriz Player 1
        for (let index = 0; index < this.player1.chips.length; index++) {
            if (this.player1.chips[index].getCol() != -1 && this.player1.chips[index].enMatriz == false) {
                this.player1.chips[index].setEnMatriz(true);
                this.addToMatrix(this.player1.chips[index].getFicha(), this.player1.chips[index].getCol(), this.player1);
            }
        }
        //Fichas Matriz Player 2
        for (let index = 0; index < this.player2.chips.length; index++) {
            if (this.player2.chips[index].getCol() != -1 && this.player2.chips[index].enMatriz == false) {
                this.player2.chips[index].setEnMatriz(true);
                this.addToMatrix(this.player2.chips[index].getFicha(), this.player2.chips[index].getCol(), this.player2);
            }
        }
    }




}
