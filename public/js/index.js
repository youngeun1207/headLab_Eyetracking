import 'https://www.gstatic.com/firebasejs/8.8.1/firebase-storage.js';
import "https://cdn.jsdelivr.net/npm/sweetalert2@11.4.29/dist/sweetalert2.all.min.js";
import "https://www.gstatic.com/firebasejs/8.8.1/firebase-auth.js";

import { canvas, colors, erase, exitBtn, handleCM, handleColorClick, handleEraserClick, handleExitClick, handleRangeChange, handleSaveClick, onMouseMove, onTouchMove, range, saveBtn, startPainting, startPaintingMobile, stopPainting, handlePaintClick, paint } from './canvas.js';
import { calculatePrecision, CalibrationPoints, ClearCalibration, ClearCanvas, setCalibrationEnd, ShowCalibrationPoint, sleep, stop_storing_points_variable, store_points_variable } from './calibration.js';
import { startTimer } from './stopwatch.js';
import { inputUserInfo, userID } from './user_info.js';
import { Restart, startWebgaze } from './eyetracking.js';
import { selectVersion } from './reference.js';
import { recordVoice } from './record_voice.js';

const REPEAT = 5;
let PointCalibrate = 0;

let today = new Date();
export let path;
export let accuracy;

$(document).ready( async function () {
    ClearCanvas();
    await inputUserInfo();
    await selectVersion();
    startWebgaze();
    Restart();

    path = userID.id + today.getHours() + today.getMinutes() + today.getSeconds();
    $(".Calibration").click(function () { // click event on the calibration buttons

        const id = $(this).attr('id');

        if (!CalibrationPoints[id]) { // initialises if not done
            CalibrationPoints[id] = 0;
        }
        CalibrationPoints[id]++; // increments values

        if (CalibrationPoints[id] == REPEAT) { //only turn to yellow after 5 clicks
            $(this).css('background-color', 'rgb(255, 219, 85)');
            $(this).prop('disabled', true); //disables the button
            PointCalibrate++;
        } else if (CalibrationPoints[id] < REPEAT) {
            //Gradually increase the opacity of calibration points when click to give some indication to user.
            let opacity = 0.15 * CalibrationPoints[id] + 0.4;
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
            const canvas = document.getElementById("plotting_canvas");
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            // notification for the measurement process
            swal.fire({
                title: "시선 추적 정확도 측정",
                text: "마우스를 움직이지 말고 가운데 점을 5초 동안 응시하세요.",
                allowOutsideClick: false,
                closeModal: true
            }).then(isConfirm => {
                // makes the variables true for 5 seconds & plots the points
                $(document).ready(function () {

                    store_points_variable(); // start storing the prediction points

                    sleep(REPEAT*1000).then(() => {
                        stop_storing_points_variable(); // stop storing the prediction points
                        let past50 = webgazer.getStoredPoints(); // retrieve the stored points
                        let precision_measurement = calculatePrecision(past50);
                        swal.fire({
                            title: "당신의 시선 추적 정확도는 " + precision_measurement + "%",
                            focusConfirm: false,
                            allowOutsideClick: false,
                            showDenyButton: true,
                            confirmButtonText: 'OK',
                            denyButtonText: `재조정`
                        }).then((result) => {
                            if (result.isConfirmed) {
                                //clear the calibration & hide the last middle button
                                accuracy = precision_measurement;
                                ClearCanvas();
                                canvas.style.height = "0px";
                                webgazer.showVideoPreview(false);
                                document.getElementById("webgazerVideoContainer").style.zIndex = "-1";
                                webgazer.showPredictionPoints(false);

                                setCalibrationEnd(true);
                                swal.fire({
                                    title: "그림을 그리는 동안 지금의 자세를 유지해 주세요."
                                })
                                startTimer();
                                recordVoice();

                            } else if (result.isDenied) {
                                //use restart function to restart the calibration
                                webgazer.clearData();
                                PointCalibrate = 0;
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


if (canvas) {
    canvas.addEventListener("touchstart", startPaintingMobile);
    canvas.addEventListener("touchend", stopPainting);
    canvas.addEventListener("touchmove", onTouchMove);

    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mousemove", onMouseMove);

    canvas.addEventListener("mouseout", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);

    canvas.addEventListener("contextmenu", handleCM)
}

Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));

if (range) {
    range.addEventListener("input", handleRangeChange);
}

if (paint) {
    paint.addEventListener("click", handlePaintClick);
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
}

if (erase) {
    erase.addEventListener("click", handleEraserClick);
}

// if (clear) {
//     clear.addEventListener("click", handleClearClick);
// }

if (exitBtn) {
    exitBtn.addEventListener("click", handleExitClick);
}