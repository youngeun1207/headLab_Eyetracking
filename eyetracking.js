window.onload = async function() {

  //start the webgazer tracker
  await webgazer.setRegression('ridge') /* currently must set regression and tracker */
      //.setTracker('clmtrackr')
      .setGazeListener(function(data, clock) {
        if(data){
          document.getElementById("gaze-point").innerText = String("x: " + data.x + "\ny: " + data.y);
        }
          // console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
          // console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
      })
      .saveDataAcrossSessions(true)
      .begin();
      webgazer.showVideoPreview(true) /* shows all video previews */
          .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
          .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

  //Set up the webgazer video feedback.
  var setup = function() {
      //Set up the main canvas. The main canvas is used to calibrate the webgazer.
      var canvas = document.getElementById("plotting_canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = 'fixed';
  };
  setup();

};

// Set to true if you want to save the data even if you reload the page.
window.saveDataAcrossSessions = true;

window.onbeforeunload = function() {
  webgazer.end();
}

/**
* Restart the calibration process by clearing the local storage and reseting the calibration point
*/
function Restart(){
  $('#helpModal').modal('hide');
  webgazer.clearData();
  ClearCalibration();
  PopUpInstruction();
}