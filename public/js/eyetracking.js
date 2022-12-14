import { calibrationEnd, ClearCalibration, PopUpInstruction } from "./calibration.js";

let gaze_data; 

export let gazeData = [];

export async function startWebgaze() {
  //start the webgazer tracker
  await webgazer
      .setGazeListener(function(data) { 
        if(calibrationEnd){
          if(data != null){
            gazeData.push(
              gaze_data = {
                x: data.x,
                y: data.y
              }
            );
          }
        }
          // console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
          // console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
      })
      // .saveDataAcrossSessions(true)
      .begin();
      webgazer.showVideoPreview(true) /* shows all video previews */
          .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
          .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

  //Set up the webgazer video feedback.
  let setup = function() {
      //Set up the main canvas. The main canvas is used to calibrate the webgazer.
      const canvas = document.getElementById("plotting_canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = 'fixed';
  };
  setup();
};


window.onbeforeunload = function() {
  webgazer.end();
}

/**
* Restart the calibration process by clearing the local storage and reseting the calibration point
*/
export function Restart(){
  webgazer.clearData();
  ClearCalibration();
  PopUpInstruction();
}