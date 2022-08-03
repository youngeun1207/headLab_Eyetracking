const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const erase = document.getElementById("jsEraser");
const clear = document.getElementById("jsClear");
const saveBtn = document.getElementById("jsSave");

const INITIAL_COLOR = "2c2c2c";
const CANVAS_SIZE = 500;

canvas.width = CANVAS_SIZE;
canvas.height =CANVAS_SIZE;

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;
let earsing = false;

function stopPainting(){
    painting = false;
}

function startPaintingMobile(event){
    painting = true;
    const rect = event.target.getBoundingClientRect();
    
    ctx.beginPath();
    ctx.moveTo(event.touches[0].clientX - window.pageXOffset - rect.left,
        event.touches[0].clientY - window.pageYOffset - rect.top);
}

function startPainting(){
    painting = true;
}

function onMouseMove(event){
    console.log("move");
    const x = event.offsetX;
    const y = event.offsetY;
    if(earsing && painting){
        ctx.clearRect(x, y, ctx.lineWidth, ctx.lineWidth);
    } else if(!painting){
        ctx.beginPath();   //경로 생성
        ctx.moveTo(x, y);   //선 시작 좌표
    }else{
        // console.log("creating line in" , x ,y);
        ctx.lineTo(x, y);   //선 끝 좌표
        ctx.lineCap = 'round';
        ctx.stroke();   //선 그리기.
    }
}

function onTouchMove(event){
    console.log("t_move");
    const rect = event.target.getBoundingClientRect();
    var x, y = 0;

    if(window.innerHeight < window.innerWidth){
        x = event.touches[0].clientX - window.pageXOffset - rect.left;
        y = event.touches[0].clientY - window.pageYOffset - rect.top;
    } else {
        x = event.touches[0].clientX - window.pageYOffset - rect.top;
        y = event.touches[0].clientY - window.pageXOffset - rect.left;
    }
    if(earsing && painting){
        ctx.clearRect(x, y, ctx.lineWidth, ctx.lineWidth);
    } else if(painting){
        // console.log("creating line in" , x ,y);
        ctx.lineTo(x, y);   //선 끝 좌표
        ctx.lineCap = 'round';
        ctx.stroke();   //선 그리기.
    }
}


function handleColorClick(event){
    const color = event.target.style.backgroundColor;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function handleRangeChange(event){
    const size = event.target.value;
    ctx.lineWidth = size;
}

function handleModeClick(){
    if(earsing === true){
        earsing = false;
        erase.style.background = "#ffffff";
    }
    else if(filling === true) {
        filling=false;
        mode.innerText="PAINT";
    }else {
        filling = true;
        mode.innerText="FILL"
        
    }
}

function handleEraserClick(){
    earsing = true;
    erase.style.background = "#c4c4c4";
}

function handleClearClick(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function handleCanvasClick(){
    if(filling){
        ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
    }
}

function handleCM(event){
    event.preventDefault();
}

function handleSaveClick(){
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href=image;
    link.download ="PaintJS[🎨]";
    link.click();
}

if(canvas){
    canvas.addEventListener("touchstart" , startPaintingMobile);
    canvas.addEventListener("touchend" , stopPainting);
    canvas.addEventListener("touchmove" , onTouchMove);
    canvas.addEventListener("tap",handleCanvasClick);

    canvas.addEventListener("mousedown" , startPainting);
    canvas.addEventListener("mouseup" , stopPainting);
    canvas.addEventListener("mousemove" , onMouseMove);

    canvas.addEventListener("mouseout" , stopPainting);
    canvas.addEventListener("mouseleave" , stopPainting);
    
    canvas.addEventListener("click",handleCanvasClick);

    canvas.addEventListener("contextmenu",handleCM)
}

Array.from(colors).forEach(color => color.addEventListener("click",handleColorClick));

if(range){
    range.addEventListener("input",handleRangeChange);
}

if(mode){
    mode.addEventListener("click",handleModeClick);
}

if(saveBtn){
    saveBtn.addEventListener("click",handleSaveClick);
}

if(erase){
    erase.addEventListener("click",handleEraserClick);
}

if(clear){
    clear.addEventListener("click",handleClearClick);
}


function loadFile(input) {
    var file = input.files[0];
    var newImage = document.createElement("img");
    newImage.setAttribute("class", 'fit-picture');

    newImage.src = URL.createObjectURL(file);

    var container = document.getElementById('fit-picture');
    if(container.childElementCount > 0){
        container.replaceChild(newImage, container.lastElementChild);
    }
    else{
        container.appendChild(newImage);
    }
};