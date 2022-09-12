import { Restart, startWebgaze } from "./eyetracking.js";

export var userID = {
    division: null,
    class: null,
    id: null
};

export var CalibrationPoints = {};
export var calibrationEnd = false;

export function ClearCanvas() {
    $(".Calibration").hide();
    var canvas = document.getElementById("plotting_canvas");
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

export function setCalibrationEnd(value){
    calibrationEnd = value;
}

export async function inputDivision() {
    const { value: division } = await swal.fire({
        title: '소속을 선택해주세요',
        input: 'select',
        inputOptions: {
            test: 'Test',
            disability: '장애',
            genius: '영재'
        },
        inputPlaceholder: '소속 선택',
        showCancelButton: false,
        allowOutsideClick: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value != '') {
                    resolve()
                } else {
                    resolve('소속 선택은 필수입니다.')
                }
            })
        }
    }).then()

    if(division){
        userID.division = division;
    }
}

export async function inputClass() {
    const { value: color } = await swal.fire({
        title: '반을 선택해주세요',
        input: 'select',
        inputOptions: {
            red: '빨강',
            orange: '주황',
            yellow: '노랑',
            yellowGreen: '연두',
            green: '초록',
            blue: '파랑',
            sky: '하늘',
            pink: '분홍',
            purple: '보라',
            white: '하양'
        },
        inputPlaceholder: '반 선택',
        showCancelButton: false,
        allowOutsideClick: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value != '') {
                    resolve()
                } else {
                    resolve('반 선택은 필수입니다.')
                }
            })
        }
    }).then()
        
    if (color) {
        userID.class = color;
     }
}

export async function inputID() {
    const { value: id } = await swal.fire({
        title: '아이디를 입력해주세요',
        input: 'text',
        inputPlaceholder: 'ID 입력',
        inputAttributes: {
            maxlength: 10,
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        allowOutsideClick: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value !== '') {
                    resolve()
                } else {
                    resolve('아이디 입력은 필수입니다.')
                }
            })
        }
    })
    if (id) {
        userID.id = id;
        startWebgaze();
        Restart();
    }
}

export async function inputUserInfo() {
    await inputDivision();
    await inputClass();
    await inputID();
    console.log(userID);
}

/*
 * Show the instruction of using calibration at the start up screen.
 */
export function PopUpInstruction() {
    ClearCanvas();
    swal.fire({
        title: "조정",
        focusConfirm: false,
        text: "화면의 9개의 점이 노란색이 될 때까지 각 점을 5번 클릭해주세요.",
        buttons: {
            cancel: false,
            confirm: true
        }
    }).then(isConfirm => {
        ShowCalibrationPoint();
    });

}

/*
 * Sets store_points to true, so all the occuring prediction
 * points are stored
 */
export function store_points_variable() {
    webgazer.params.storingPoints = true;
}

/*
* Sets store_points to false, so prediction points aren't
* stored any more
*/
export function stop_storing_points_variable() {
    webgazer.params.storingPoints = false;
}

/*
 * This function calculates a measurement for how precise 
 * the eye tracker currently is which is displayed to the user
 */
export function calculatePrecision(past50Array) {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    // Retrieve the last 50 gaze prediction points
    var x50 = past50Array[0];
    var y50 = past50Array[1];

    // Calculate the position of the point the user is staring at
    var staringPointX = windowWidth / 2;
    var staringPointY = windowHeight / 2;

    var precisionPercentages = new Array(50);
    calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY);
    var precision = calculateAverage(precisionPercentages);

    // Return the precision measurement as a rounded percentage
    return Math.round(precision);
};

/*
 * Calculate percentage accuracy for each prediction based on distance of
 * the prediction point from the centre point (uses the window height as lower threshold 0%)
 */
export function calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY) {
    for (var x = 0; x < 50; x++) {
        // Calculate distance between each prediction and staring point
        var xDiff = staringPointX - x50[x];
        var yDiff = staringPointY - y50[x];
        var distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

        // Calculate precision percentage
        var halfWindowHeight = windowHeight / 2;
        var precision = 0;
        if (distance <= halfWindowHeight && distance > -1) {
            precision = 100 - (distance / halfWindowHeight * 100);
        } else if (distance > halfWindowHeight) {
            precision = 0;
        } else if (distance > -1) {
            precision = 100;
        }

        // Store the precision
        precisionPercentages[x] = precision;
    }
}

/*
 * Calculates the average of all precision percentages calculated
 */
export function calculateAverage(precisionPercentages) {
    var precision = 0;
    for (var x = 0; x < 50; x++) {
        precision += precisionPercentages[x];
    }
    precision = precision / 50;
    return precision;
}

/**
 * Show the Calibration Points
 */
export function ShowCalibrationPoint() {
    $(".Calibration").show();
    $("#Pt5").hide(); // initially hides the middle button
}

/**
* This function clears the calibration buttons memory
*/
export function ClearCalibration() {
    // Clear data from WebGazer
    $(".Calibration").css('background-color', 'red');
    $(".Calibration").css('opacity', 0.4);
    $(".Calibration").prop('disabled', false);

    CalibrationPoints = {};
}

export function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}