import { exitBtn, handleExitClick } from "./canvas.js";
import { gazeData } from "./eyetracking.js";
import { saveDrawing } from "./firebase.js";
import { reference } from "./reference.js";

let timerId;
let time = 0;
const stopwatch = document.getElementById("stop-watch");
let  hour, min, sec;

export let timestamp = {
    min1: null,
    min3: null,
    min5: null,
    min7: null
}


function printTime() {
    time++;
    stopwatch.innerText = getTimeFormatString();
}

function getTimeFormatString() {
    hour = parseInt(String(time / (60 * 60)));
    min = parseInt(String((time - (hour * 60 * 60)) / 60));
    sec = time % 60;

    if (min == 1 && sec == 0){
        saveDrawing("_1");
        timestamp.min1 = gazeData.length;
    }
    if (min == 3 && sec == 0){
        saveDrawing("_3");
        timestamp.min3 = gazeData.length;
    }
    if(min == 5 && sec == 0){
        if(reference){
            saveDrawing("_5");
            timestamp.min5 = gazeData.length;
        } else{
            handleExitClick();
            exitBtn.removeEventListener('click', handleExitClick);
        }
    }
    if (min == 7 && sec == 0){
        saveDrawing("_7");
        timestamp.min7 = gazeData.length;
    }
    if (min == 10 && sec == 0){
        handleExitClick();
        exitBtn.removeEventListener('click', handleExitClick);
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