"use strict";

let board = document.getElementById('canvas');
let ctx = board.getContext('2d');

class Ficha {

    constructor(posX, posY, r, pic) {
        this.r = r;
        this.posX = posX;
        this.posY = posY;
        this.oldPosX = posX;
        this.oldPosY = posY;
        this.char = pic;
        this.usada = false;
        this.col = -1;
        this.pasadaAJuego = false;
        this.enMatriz = false;
    }

    //Retorna la instancia del objeto ficha
    getFicha() {
        return this;
    }

    //Retorna la columna en que está ubicada la ficha
    getCol() {
        return this.col;
    }

    //Establece las coordenadas de la posición original de la ficha
    returnToPos() {
        this.posX = this.oldPosX;
        this.posY = this.oldPosY;
    }

    //Setea el atributo que define si una ficha se solto en la zona para insertar fichas en la matriz
    setPasadaAJuego(pasada) {
        this.pasadaAJuego = pasada;
    }

    //Setea el atributo que define si una ficha se encuentra en la matriz de fichas insertadas
    setEnMatriz(enMatriz) {
        this.enMatriz = enMatriz;
    }

    //Setea la columna en la que se ubica la ficha
    setCol(col) {
        this.col = col;
    }

    //Setea la posición de la coordenada x de la ficha
    setPosX(x) {
        this.posX = x;
    }

    //Setea la posición de la coordenada y de la ficha
    setPosY(y) {
        this.posY = y;
    }

    //Setea la imagen de la ficha
    setSrc(pic) {
        this.char = pic;
    }

    //Setea el radio de la ficha
    setR(r) {
        this.r = r;
    }

    //Marca la ficha como usada (no disponible para usar en futuras jugadas)
    setUso(usada) {
        this.usada = usada;
    }

    //Dibuja la ficha en las coordenadas x e y
    drawChip(x, y) {
        let img = this.char;
        x = this.posX;
        y = this.posY;
        ctx.drawImage(img, x, y, 49, 49);
    }


    //Chequea si la ficha está seleccionada según las coordenadas x e y
    checkSelected(x, y) {
        return x > (this.posX - this.r * 2) && x < (this.posX + this.r * 2) && (y > this.posY - this.r * 2) && y < (this.posY + this.r * 2);
    }

    //Retorna si la ficha está seleccionada
    isSelected() {
        return this.selected;
    }

    //Retorna si la ficha está usada o disponible para jugar
    isUsada() {
        return this.usada;
    }

    //Marca la ficha como seleccionada
    setSelected(selected) {
        this.selected = selected;
    }

    //Setea las coordenadas x e y de la ficha al moverla por el canvas
    move(x, y, e) {
        if (x > this.r && x < (1150 - this.r) && y > this.r && y < (580 - this.r)) {
            this.posX = x - this.r;
            this.posY = y - this.r;
        }
    }

}
