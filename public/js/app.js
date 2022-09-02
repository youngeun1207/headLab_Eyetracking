import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js';
import 'https://www.gstatic.com/firebasejs/8.8.1/firebase-storage.js';

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const erase = document.getElementById("jsEraser");
const clear = document.getElementById("jsClear");
const saveBtn = document.getElementById("jsSave");
const exitBtn = document.getElementById("jsExit");

const dpr = window.devicePixelRatio;

const INITIAL_COLOR = "2c2c2c";
const CANVAS_WIDTH = document.getElementById("canvas-container").offsetWidth * dpr;
const CANVAS_HEIGHT = document.getElementById("canvas-container").offsetHeight * dpr;

let today = new Date();

ctx.scale(dpr, dpr);

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 5;
ctx.lineJoin = 'round';

var currentColor;

let painting = false;
let filling = false;
let erasing = false;

function stopPainting() {
    painting = false;
}

function startPaintingMobile(event) {
    painting = true;
    const rect = event.target.getBoundingClientRect();

    ctx.beginPath();
    var x = (event.touches[0].clientX - window.pageXOffset - rect.left) * dpr;
    var y = (event.touches[0].clientY - window.pageYOffset - rect.top) * dpr;
    ctx.moveTo(x, y);
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    const x = event.offsetX * dpr;
    const y = event.offsetY * dpr;

    if (erasing && painting) {
        currentColor = ctx.fillStyle;
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
    }
    if (!painting) {
        ctx.beginPath();   //경로 생성
        ctx.moveTo(x, y);   //선 시작 좌표
    } else {
        ctx.lineTo(x, y);   //선 끝 좌표
        ctx.lineCap = 'round';
        ctx.stroke();   //선 그리기.
    }
}



function onTouchMove(event) {
    const rect = event.target.getBoundingClientRect();
    var x, y = 0;

    if (window.innerHeight < window.innerWidth) {
        x = event.touches[0].clientX - window.pageXOffset - rect.left;
        y = event.touches[0].clientY - window.pageYOffset - rect.top;
    } else {
        x = event.touches[0].clientX - window.pageXOffset - rect.left;
        y = event.touches[0].clientY - window.pageYOffset - rect.top;
    }

    x *= dpr;
    y *= dpr;
    if (erasing && painting) {
        currentColor = ctx.fillStyle;
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
    }
    if (painting) {
        ctx.lineTo(x, y);   //선 끝 좌표
        ctx.lineCap = 'round';
        ctx.stroke();   //선 그리기.
    }
}

function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    Array.from(colors).forEach(color => color.style.border = "none");
    event.target.style.border = "2px solid #f2f2f2";

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
}

function handleModeClick() {
    if (erasing === true) {
        erasing = false;
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
        erase.style.background = "rgba(255, 219, 85)";
    }
    else if (filling === true) {
        filling = false;
        mode.innerText = "붓";
    } else {
        filling = true;
        mode.innerText = "채우기";
    }
}

function handleEraserClick() {
    erasing = true;
    erase.style.background = "rgb(255, 200, 0)";
}

function handleClearClick() {
    currentColor = ctx.fillStyle;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = currentColor;
}

function handleCanvasClick() {
    if (filling) {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

function handleCM(event) {
    event.preventDefault();
}

function handleSaveClick() {
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = image;
    link.download = "PaintJS";
    link.click();
}

function getOffsets(id){
    var target = document.getElementById(id);

    var left = target.offsetLeft;
    var top = target.offsetTop;

    const offset = {
        l: left,
        r: left + target.offsetWidth,
        t: top,
        b: top + target.offsetHeight

    }
    return offset;
}

function saveOffsets(){
    var offset = {
        controler: getOffsets('controls'),
        canvas: getOffsets('jsCanvas'),
        reference: getOffsets('fit-picture')
    }
    return offset;
}

function handleExitClick(event) {
    writeData();
    webgazer.end();
}

function saveScreenShot(storageRef) {
    html2canvas(document.querySelector("#body")).then(canvas => {
        canvas.toBlob(function(blob) {
            var file_path = storageRef.child('screenshot/' + userID.id + today.getHours() + today.getMinutes());
            file_path.put(blob);
        });
    });
}

function saveDrawing(storageRef) {
    canvas.toBlob(function(blob) {
        var file_path = storageRef.child('drawing/' + userID.id + today.getHours() + today.getMinutes());
        file_path.put(blob);
    });
}

async function saveImageDB() {
    var storage = firebase.app().storage("gs://iboda-eyetracking.appspot.com");
    var storageRef = storage.ref();

    saveDrawing(storageRef);
    saveScreenShot(storageRef);
}

function getWindowsize(){
    const windowSize = {
        x: window.innerWidth,
        y: window.innerHeight
    }
    return windowSize
}

function writeData() {
    const db = getDatabase(app);
    db.ref('data').push({
        id: userID,
        gaze_data: gazeData,
        reference_index: referenceTimestamp,
        drawing: 'drawing/' + userID.id + today.getHours() + today.getMinutes(),
        screenshot: 'screenshot/' + userID.id + today.getHours() + today.getMinutes(),
        offsets: saveOffsets(),
        window_size: getWindowsize()
    });
    saveImageDB();
}



if (canvas) {
    canvas.addEventListener("touchstart", startPaintingMobile);
    canvas.addEventListener("touchend", stopPainting);
    canvas.addEventListener("touchmove", onTouchMove);
    canvas.addEventListener("tap", handleCanvasClick);

    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mousemove", onMouseMove);

    canvas.addEventListener("mouseout", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);

    canvas.addEventListener("click", handleCanvasClick);

    canvas.addEventListener("contextmenu", handleCM)
}

Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));

if (range) {
    range.addEventListener("input", handleRangeChange);
}

if (mode) {
    mode.addEventListener("click", handleModeClick);
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
}

if (erase) {
    erase.addEventListener("click", handleEraserClick);
}

if (clear) {
    clear.addEventListener("click", handleClearClick);
}

if (exitBtn) {
    exitBtn.addEventListener("click", handleExitClick, {once : true});
}