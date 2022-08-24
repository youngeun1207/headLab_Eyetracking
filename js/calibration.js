var PointCalibrate = 0;
var CalibrationPoints = {};
var calibrationEnd = false;
/*
 * Clear the canvas and the calibration button.
 */
function ClearCanvas() {
    $(".Calibration").hide();
    var canvas = document.getElementById("plotting_canvas");
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

/*
 * Show the instruction of using calibration at the start up screen.
 */
function PopUpInstruction() {
    ClearCanvas();
    swal({
        title: "Calibration",
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
  * Show the help instructions right at the start.
*/
function helpModalShow() {
    swal({
        title: "Start",
        text: "조정을 시작하시겠습니까?",
        buttons: {
            confirm: true
        }
    }).then(isConfirm => {
        Restart();
    });
}

/*
 * Sets store_points to true, so all the occuring prediction
 * points are stored
 */
function store_points_variable() {
    webgazer.params.storingPoints = true;
}

/*
* Sets store_points to false, so prediction points aren't
* stored any more
*/
function stop_storing_points_variable() {
    webgazer.params.storingPoints = false;
}

/*
 * This function calculates a measurement for how precise 
 * the eye tracker currently is which is displayed to the user
 */
function calculatePrecision(past50Array) {
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
function calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY) {
    for (x = 0; x < 50; x++) {
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
function calculateAverage(precisionPercentages) {
    var precision = 0;
    for (x = 0; x < 50; x++) {
        precision += precisionPercentages[x];
    }
    precision = precision / 50;
    return precision;
}

/*
* Load this function when the index page starts.
* This function listens for button clicks on the html page
* checks that all buttons have been clicked 5 times each, and then goes on to measuring the precision
*/
$(document).ready(function () {
    ClearCanvas();
    helpModalShow();
    $(".Calibration").click(function () { // click event on the calibration buttons

        var id = $(this).attr('id');

        if (!CalibrationPoints[id]) { // initialises if not done
            CalibrationPoints[id] = 0;
        }
        CalibrationPoints[id]++; // increments values

        if (CalibrationPoints[id] == 1) { //only turn to yellow after 5 clicks
            $(this).css('background-color', 'yellow');
            $(this).prop('disabled', true); //disables the button
            PointCalibrate++;
        } else if (CalibrationPoints[id] < 5) {
            //Gradually increase the opacity of calibration points when click to give some indication to user.
            var opacity = 0.2 * CalibrationPoints[id] + 0.2;
            $(this).css('opacity', opacity);
        }

        //Show the middle calibration point after all other points have been clicked.
        if (PointCalibrate == 8) {
            $("#Pt5").show();
        }

        if (PointCalibrate >= 9) { // last point is calibrated
            //using jquery to grab every element in Calibration class and hide them except the middle point.
            $(".Calibration").hide();
            $("#Pt5").show();

            // clears the canvas
            var canvas = document.getElementById("plotting_canvas");
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            // notification for the measurement process
            swal({
                title: "Calculating measurement",
                text: "마우스를 움직이지 말고 가운데 점을 5초 동안 응시하세요.",
                closeOnEsc: false,
                allowOutsideClick: false,
                closeModal: true
            }).then(isConfirm => {
                // makes the variables true for 5 seconds & plots the points
                $(document).ready(function () {

                    store_points_variable(); // start storing the prediction points

                    sleep(1000).then(() => {
                        stop_storing_points_variable(); // stop storing the prediction points
                        var past50 = webgazer.getStoredPoints(); // retrieve the stored points
                        var precision_measurement = calculatePrecision(past50);
                        swal({
                            title: "Your accuracy measure is " + precision_measurement + "%",
                            allowOutsideClick: false,
                            buttons: {
                                cancel: "Recalibrate",
                                confirm: true,
                            }
                        }).then(isConfirm => {
                            if (isConfirm) {
                                //clear the calibration & hide the last middle button
                                ClearCanvas();
                                // canvas.remove();
                                canvas.style.height = "0px";
                                webgazer.showVideoPreview(false);
                                document.getElementById("webgazerVideoContainer").style.zIndex = "-1";
                                webgazer.showPredictionPoints(false);

                                calibrationEnd = true;

                            } else {
                                //use restart function to restart the calibration
                                webgazer.clearData();
                                ClearCalibration();
                                ClearCanvas();
                                ShowCalibrationPoint();
                            }
                        });
                    });
                });
            });
        }
    });
});

/**
 * Show the Calibration Points
 */
function ShowCalibrationPoint() {
    $(".Calibration").show();
    $("#Pt5").hide(); // initially hides the middle button
}

/**
* This function clears the calibration buttons memory
*/
function ClearCalibration() {
    // Clear data from WebGazer

    $(".Calibration").css('background-color', 'red');
    $(".Calibration").css('opacity', 0.2);
    $(".Calibration").prop('disabled', false);

    CalibrationPoints = {};
    PointCalibrate = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}