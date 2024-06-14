"use strict";

let c = document.getElementById("canvas");

function resizeCanvas() {
    let widthPage = window.innerWidth;
    c.width = widthPage - 20;
    c.height = 500;
  
}

window.addEventListener('resize', () => {

    resizeCanvas();
    
});

resizeCanvas();
    