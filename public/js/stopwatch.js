import { handleExitClick } from "./canvas.js";

let timerId;
let time = 0;
const stopwatch = document.getElementById("stop-watch");
let  hour, min, sec;


function printTime() {
    time++;
    stopwatch.innerText = getTimeFormatString();
}

function getTimeFormatString() {
    hour = parseInt(String(time / (60 * 60)));
    min = parseInt(String((time - (hour * 60 * 60)) / 60));
    sec = time % 60;
    if(min == 5 && sec == 0){
        handleExitClick();
    }

    return String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0');
}

export function startTimer() {
    printTime();
    stopTimer();
    timerId = setTimeout(startTimer, 1000);
}

export function stopTimer() {
    if (timerId != null) {
        clearTimeout(timerId);
    }
}