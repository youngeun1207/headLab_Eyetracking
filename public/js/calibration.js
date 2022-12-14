export let CalibrationPoints = {};
export let calibrationEnd = false;

export function ClearCanvas() {
    $(".Calibration").hide();
    const canvas = document.getElementById("plotting_canvas");
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

export function setCalibrationEnd(value){
    calibrationEnd = value;
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
    const windowHeight = $(window).height();
    const windowWidth = $(window).width();

    // Retrieve the last 50 gaze prediction points
    const x50 = past50Array[0];
    const y50 = past50Array[1];

    // Calculate the position of the point the user is staring at
    const staringPointX = windowWidth / 2;
    const staringPointY = windowHeight / 2;

    const precisionPercentages = new Array(50);
    calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY);
    const precision = calculateAverage(precisionPercentages);

    // Return the precision measurement as a rounded percentage
    return Math.round(precision);
};

/*
 * Calculate percentage accuracy for each prediction based on distance of
 * the prediction point from the centre point (uses the window height as lower threshold 0%)
 */
export function calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY) {
    for (let x = 0; x < 50; x++) {
        // Calculate distance between each prediction and staring point
        const xDiff = staringPointX - x50[x];
        const yDiff = staringPointY - y50[x];
        const distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

        // Calculate precision percentage
        const halfWindowHeight = windowHeight / 2;
        let precision = 0;
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
    let precision = 0;
    for (let x = 0; x < 50; x++) {
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