"use strict";
/*"Cooming soon" Timer for hero release*/
function countdown() {
    let timer = document.getElementById("timer");
    let i = 27;
    setInterval(function() {
        timer.innerText = i;
        if (i == 0) {
            timer.innerText = `00`;
            i = 59;
        } else if (i >= 10) {
            i--;
        } else {
            timer.innerText = `0${i}`;
            i--;
        }
    }, 1000);
}

countdown();