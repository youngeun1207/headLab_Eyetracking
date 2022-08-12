function createSequence() {
    const GREEN = 65280; //#00FF00
    const CYAN = 65535; //#00FFFF
    const RED = 65536; //#0F0000
    const BLUE = 1; // #000001
    const YELLOW = 16776960; // #FFFF00

    const canvas = document.createElement('canvas');
    canvas.id = 'sequence';
    canvas.className = 'sequence';

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.zIndex = 3;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    checkStartPoint(ctx);

    var sampling = 32;
    var color = YELLOW;
    var flag = false;

    for (var i = sampling; i < gazeData.length; i += sampling) {
        colorCode = changeToColorCode(color);
        if (!flag) {
            color -= RED;
            if(color <= GREEN){
                flag = true;
            }
        } else{
            color += BLUE;
            if(color >= CYAN){
                flag = false;
                color = YELLOW;
            }
        }
        drawLineWithArrows(ctx, editXCoordinate(gazeData[i - sampling].x), editYCoordinate(gazeData[i - sampling].y),
            editXCoordinate(gazeData[i].x), editYCoordinate(gazeData[i].y), 5, 8, colorCode);
    }
    document.body.appendChild(canvas);
}

function checkStartPoint(ctx){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(gazeData[0].x, gazeData[0].y, 5, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
}

function editXCoordinate(x) {
    if (x < 0) {
        x = 0;
    }
    if (x > window.innerWidth) {
        x = window.innerWidth;
    }
    return (x);
}

function editYCoordinate(y) {
    if (y < 0) {
        y = 0;
    }
    if (y > window.innerHeight) {
        y = window.innerHeight;
    }
    return (y);
}

function changeToColorCode(color) {
    color = color.toString(16);
    while (color.length < 6) {
        color = addPadding(color);
    }
    colorCode = "#" + color;
    return colorCode;
}

function addPadding(colorCode) {
    colorCode = "0" + colorCode;
    return colorCode;
}

function drawLineWithArrows(ctx, x0, y0, x1, y1, aWidth, aLength, color) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var angle = Math.atan2(dy, dx);
    var length = Math.sqrt(dx * dx + dy * dy);

    ctx.lineWidth = 1;
    ctx.strokeStyle = color;

    ctx.translate(x0, y0);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);

    ctx.moveTo(length-aLength,-aWidth);
    ctx.lineTo(length,0);
    ctx.lineTo(length-aLength,aWidth);

    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}