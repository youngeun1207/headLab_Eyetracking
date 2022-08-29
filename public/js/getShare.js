function getOffsets(id){
    var target = document.getElementById(id);

    var left = target.offsetLeft;
    var right = left + target.offsetWidth;
    var top = target.offsetTop;
    var bottom = top + target.offsetHeight;

    return(offset = {l:left, r:right, t:top, b:bottom});
}

function getGazeShare(targetId){
    var offset = getOffsets(targetId);
    var cnt = 0;
    var i = 0;
    if(targetId == 'fit-picture'){
        i = referenceTimestamp;
    }
    for(; i < gazeData.length; i++){
        if(i < 0){
            break;
        }
        var x = gazeData[i].x;
        var y = gazeData[i].y;
        if(x > offset.l  && x < offset.r && y > offset.t && y < offset.b){
            cnt++;
        }
    }
    return cnt / gazeData.length * 100;
}

function showShareData(){
    swal.fire({
            title: "시선 점유율",
            text: "캔버스: " + String(getGazeShare('jsCanvas')) + "\n" +
                  "컨트롤: " + String(getGazeShare('controls')) + "\n" +
                  "참고 이미지: " + String(getGazeShare('fit-picture')) + "\n"
        }).then(isConfirm => {}
    );
}