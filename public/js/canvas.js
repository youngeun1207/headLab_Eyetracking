import { writeData } from "./firebase.js";
// import { stopRecording } from "./record_voice.js";
import { reference } from "./reference.js";
import { stopTimer } from "./stopwatch.js";

export const canvas = document.getElementById("jsCanvas");
export const ctx = canvas.getContext("2d");
export const colors = document.getElementsByClassName("jsColor");
export const range = document.getElementById("jsRange");
export const paint = document.getElementById("jsPaint");
export const erase = document.getElementById("jsEraser");
export const saveBtn = document.getElementById("jsSave");
export const exitBtn = document.getElementById("jsExit");

const dpr = window.devicePixelRatio;

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_WIDTH = document.getElementById("canvas-container").offsetWidth * dpr;
const CANVAS_HEIGHT = document.getElementById("canvas-container").offsetHeight * dpr;

ctx.scale(dpr, dpr);

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 5;
ctx.lineJoin = 'round';

let currentColor = INITIAL_COLOR;

let painting = false;
let erasing = false;


export function stopPainting() {
    painting = false;
}

export function startPaintingMobile(event) {
    painting = true;
    const rect = event.target.getBoundingClientRect();

    ctx.beginPath();
    const x = (event.touches[0].clientX - window.pageXOffset - rect.left) * dpr;
    const y = (event.touches[0].clientY - window.pageYOffset - rect.top) * dpr;
    ctx.moveTo(x, y);
}

export function startPainting() {
    painting = true;
}

export function onMouseMove(event) {
    const x = event.offsetX * dpr;
    const y = event.offsetY * dpr;

    if (!painting) {
        ctx.beginPath();   //경로 생성
        ctx.moveTo(x, y);   //선 시작 좌표
    } else {
        ctx.lineTo(x, y);   //선 끝 좌표
        ctx.lineCap = 'round';
        ctx.stroke();   //선 그리기.
    }
}



export function onTouchMove(event) {
    const rect = event.target.getBoundingClientRect();
    let x, y = 0;

    if (window.innerHeight < window.innerWidth) {
        x = event.touches[0].clientX - window.pageXOffset - rect.left;
        y = event.touches[0].clientY - window.pageYOffset - rect.top;
    } else {
        x = event.touches[0].clientX - window.pageXOffset - rect.left;
        y = event.touches[0].clientY - window.pageYOffset - rect.top;
    }

    x *= dpr;
    y *= dpr;

    if (painting) {
        ctx.lineTo(x, y);   //선 끝 좌표
        ctx.lineCap = 'round';
        ctx.stroke();   //선 그리기.
    }
}

export function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    Array.from(colors).forEach(color => color.style.border = "none");
    event.target.style.border = "2px solid #f2f2f2";

    if(erasing){
        currentColor = color;
        return;
    }
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

export function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
}

export function handlePaintClick() {
    if(!erasing){
        return;
    }
    if (erasing) {
        erasing = false;
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
        paint.style.background = "rgb(255, 200, 0)";
        erase.style.background = "rgb(255, 219, 85)";
    }
}

export function handleEraserClick() {
    if(erasing){
        return;
    }
    if(!erasing){
        console.log("er");
        currentColor = ctx.fillStyle;
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
        erasing = true;
        paint.style.background = "rgb(255, 219, 85)";
        erase.style.background = "rgb(255, 200, 0)";
    }
}

export function handleClearClick() {
    currentColor = ctx.fillStyle;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = currentColor;
}

export function handleCM(event) {
    event.preventDefault();
}

export function handleSaveClick() {
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = image;
    link.download = "PaintJS";
    link.click();
}

export function getOffsets(id){
    const target = document.getElementById(id);

    const left = target.offsetLeft;
    const top = target.offsetTop;

    const offset = {
        l: left,
        r: left + target.offsetWidth,
        t: top,
        b: top + target.offsetHeight
    }
    return offset;
}

export function saveOffsets(){
    let offset = {
        controler: getOffsets('controls'),
        canvas: getOffsets('jsCanvas'),
        reference: {l:0, r:0, t:0, b:0}
    }
    if(reference){
        offset.reference = getOffsets('fit-picture')
    }
    return offset;
}

export async function handleExitClick() {
    // 1월 테스트: 녹음 기능 제외
    // stopRecording();
    await writeData();
    webgazer.end();
    exitBtn.remove();
    swal.fire({
        title: "수고하셨습니다!"
    }).then(() => {
        stopTimer();
    });
}

export function getWindowsize(){
    const windowSize = {
        x: window.innerWidth,
        y: window.innerHeight
    }
    return windowSize
}
