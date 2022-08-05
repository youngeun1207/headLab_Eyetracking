var jsPsych = initJsPsych({
    extensions: [
      {type: jsPsychExtensionWebgazer}
    ]
  });

  var preload = {
    type: jsPsychPreload,
    images: ['img/bunny.jpeg']
  }

  var camera_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>In order to participate you must allow the experiment to use your camera.</p>
      <p>You will be prompted to do this on the next screen.</p>
      <p>If you do not wish to allow use of your camera, you cannot participate in this experiment.<p>
      <p>It may take up to 30 seconds for the camera to initialize after you give permission.</p>
    `,
    choices: ['Got it'],
  }

  var init_camera = {
    type: jsPsychWebgazerInitCamera
  }

  var calibration_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>Now you'll calibrate the eye tracking, so that the software can use the image of your eyes to predict where you are looking.</p>
      <p>You'll see a series of dots appear on the screen. Look at each dot and click on it.</p>
    `,
    choices: ['Got it'],
  }

  var calibration = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: [
      [25,25],[75,25],[50,50],[25,75],[75,75]
    ],
    repetitions_per_point: 1,
    randomize_calibration_order: true
  }

  var validation_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>Now we'll measure the accuracy of the calibration.</p>
      <p>Look at each dot as it appears on the screen.</p>
      <p style="font-weight: bold;">You do not need to click on the dots this time.</p>
    `,
    choices: ['Got it'],
    post_trial_gap: 1000
  }

  var validation = {
    type: jsPsychWebgazerValidate,
    validation_points: [
      [25,25],[75,25],[50,50],[25,75],[75,75]
    ],
    roi_radius: 200,
    time_to_saccade: 1000,
    validation_duration: 2000,
    data: {
      task: 'validate'
    }
  }

  var recalibrate_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>The accuracy of the calibration is a little lower than we'd like.</p>
      <p>Let's try calibrating one more time.</p>
      <p>On the next screen, look at the dots and click on them.<p>
    `,
    choices: ['OK'],
  }

  var recalibrate = {
    timeline: [recalibrate_instructions, calibration, validation_instructions, validation],
    conditional_function: function(){
      var validation_data = jsPsych.data.get().filter({task: 'validate'}).values()[0];
      return validation_data.percent_in_roi.some(function(x){
        var minimum_percent_acceptable = 50;
        return x < minimum_percent_acceptable;
      });
    },
    data: {
      phase: 'recalibration'
    }
  }

  var calibration_done = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>Great, we're done with calibration!</p>
    `,
    choices: ['OK']
  }

  var begin = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>The next screen will show an image to demonstrate adding the webgazer extension to a trial.</p>
      <p>Just look at the image while eye tracking data is collected. The trial will end automatically.</p>
      <p>Press any key to start.</p>
    `
  }

  var trial = {
    type: jsPsychSketchpad,
    prompt_location: 'abovecanvas',
    stroke_color_palette: ['red', 'blue'],
    stroke_color: 'red',
    canvas_width: window.innerWidth*0.6,
    canvas_height: window.innerHeight*0.6,
    canvas_border_width: 1,
    extensions: [
        {
          type: jsPsychExtensionWebgazer, 
          params: {targets: ['#jspsych-sketchpad']}
        }
      ]
  }
  

//   var trial = {
//     type: jsPsychCanvasKeyboardResponse,
//     stimulus: function(canvas) {
//         // const canvas = document.getElementById("jsCanvas");
//         const ctx = canvas.getContext("2d");
//         const colors = document.getElementsByClassName("jsColor");
//         const range = document.getElementById("jsRange");
//         const mode = document.getElementById("jsMode");
//         const erase = document.getElementById("jsEraser");
//         const clear = document.getElementById("jsClear");
//         const saveBtn = document.getElementById("jsSave");

//         const INITIAL_COLOR = "2c2c2c";
//         const CANVAS_WIDTH = 600;
//         const CANVAS_HEIGHT = 600;

//         canvas.width = CANVAS_WIDTH;
//         canvas.height =CANVAS_HEIGHT;

//         // if(window.innerWidth <= 1024){
//         //     canvas.width = CANVAS_SIZE*0.7;
//         //     canvas.height =CANVAS_SIZE*0.7;

//         //     document.getElementById("controls_btns").style.flexDirection = "column";
//         //     document.getElementById("controls_btns").style.marginBottom = "auto";
//         // }

//         ctx.strokeStyle = INITIAL_COLOR;
//         ctx.fillStyle = INITIAL_COLOR;
//         ctx.lineWidth = 2.5;

//         let painting = false;
//         let filling = false;
//         let earsing = false;

//         function stopPainting(){
//             painting = false;
//         }

//         function startPaintingMobile(event){
//             painting = true;
//             const rect = event.target.getBoundingClientRect();
            
//             ctx.beginPath();
//             ctx.moveTo(event.touches[0].clientX - window.pageXOffset - rect.left,
//                 event.touches[0].clientY - window.pageYOffset - rect.top);
//         }

//         function startPainting(){
//             painting = true;
//         }

//         function onMouseMove(event){
//             console.log("move");
//             const x = event.offsetX;
//             const y = event.offsetY;
//             if(earsing && painting){
//                 ctx.clearRect(x, y, ctx.lineWidth, ctx.lineWidth);
//             } else if(!painting){
//                 ctx.beginPath();   //경로 생성
//                 ctx.moveTo(x, y);   //선 시작 좌표
//             }else{
//                 // console.log("creating line in" , x ,y);
//                 ctx.lineTo(x, y);   //선 끝 좌표
//                 ctx.lineCap = 'round';
//                 ctx.stroke();   //선 그리기.
//             }
//         }

//         function onTouchMove(event){
//             console.log("t_move");
//             const rect = event.target.getBoundingClientRect();
//             var x, y = 0;

//             if(window.innerHeight < window.innerWidth){
//                 x = event.touches[0].clientX - window.pageXOffset - rect.left;
//                 y = event.touches[0].clientY - window.pageYOffset - rect.top;
//             } else {
//                 x = event.touches[0].clientX - window.pageXOffset - rect.left;
//                 y = event.touches[0].clientY - window.pageYOffset - rect.top;
//             }
//             if(earsing && painting){
//                 ctx.clearRect(x, y, ctx.lineWidth, ctx.lineWidth);
//             } else if(painting){
//                 // console.log("creating line in" , x ,y);
//                 ctx.lineTo(x, y);   //선 끝 좌표
//                 ctx.lineCap = 'round';
//                 ctx.stroke();   //선 그리기.
//             }
//         }


//         function handleColorClick(event){
//             const color = event.target.style.backgroundColor;

//             ctx.strokeStyle = color;
//             ctx.fillStyle = color;
//         }

//         function handleRangeChange(event){
//             const size = event.target.value;
//             ctx.lineWidth = size;
//         }

//         function handleModeClick(){
//             if(earsing === true){
//                 earsing = false;
//                 erase.style.background = "#ffffff";
//             }
//             else if(filling === true) {
//                 filling=false;
//                 mode.innerText="PAINT";
//             }else {
//                 filling = true;
//                 mode.innerText="FILL"
                
//             }
//         }

//         function handleEraserClick(){
//             earsing = true;
//             erase.style.background = "#c4c4c4";
//         }

//         function handleClearClick(){
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//         }

//         function handleCanvasClick(){
//             if(filling){
//                 ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
//             }
//         }

//         function handleCM(event){
//             event.preventDefault();
//         }

//         function handleSaveClick(){
//             const image = canvas.toDataURL();
//             const link = document.createElement("a");
//             link.href=image;
//             link.download ="PaintJS";
//             link.click();
//         }

//         if(canvas){
//             canvas.addEventListener("touchstart" , startPaintingMobile);
//             canvas.addEventListener("touchend" , stopPainting);
//             canvas.addEventListener("touchmove" , onTouchMove);
//             canvas.addEventListener("tap",handleCanvasClick);

//             canvas.addEventListener("mousedown" , startPainting);
//             canvas.addEventListener("mouseup" , stopPainting);
//             canvas.addEventListener("mousemove" , onMouseMove);

//             canvas.addEventListener("mouseout" , stopPainting);
//             canvas.addEventListener("mouseleave" , stopPainting);
            
//             canvas.addEventListener("click",handleCanvasClick);

//             canvas.addEventListener("contextmenu",handleCM)
//         }

//         Array.from(colors).forEach(color => color.addEventListener("click",handleColorClick));

//         if(range){
//             range.addEventListener("input",handleRangeChange);
//         }

//         if(mode){
//             mode.addEventListener("click",handleModeClick);
//         }

//         if(saveBtn){
//             saveBtn.addEventListener("click",handleSaveClick);
//         }

//         if(erase){
//             erase.addEventListener("click",handleEraserClick);
//         }

//         if(clear){
//             clear.addEventListener("click",handleClearClick);
//         }


//         function loadFile(input) {
//             var file = input.files[0];
//             var newImage = document.createElement("img");
//             newImage.setAttribute("class", 'fit-picture');

//             newImage.src = URL.createObjectURL(file);

//             var container = document.getElementById('fit-picture');
//             if(container.childElementCount > 0){
//                 container.replaceChild(newImage, container.lastElementChild);
//             }
//             else{
//                 container.appendChild(newImage);
//             }
//         };
//     },
//     require_movement: true,
//     extensions: [
//       {
//         type: jsPsychExtensionWebgazer, 
//         params: {targets: ['#jspsych-canvas-keyboard-response-stimulus']}
//       }
//     ]
//   }

  var show_data = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      var trial_data = jsPsych.data.getLastTrialData().values();
      var trial_json = JSON.stringify(trial_data, null, 2);
      var trial_json = JSON.parse(trial_json[0]).webgazer_data;
      return `<p style="margin-bottom:0px;"><strong>Trial data:</strong></p>
        <pre style="margin-top:0px;text-align:left;font-size:3px;">${trial_json}</pre>`;
    },
    require_movement: true
  };

  jsPsych.run([
    preload, 
    camera_instructions, 
    init_camera, 
    calibration_instructions, 
    calibration, 
    validation_instructions, 
    validation, 
    recalibrate,
    calibration_done,
    begin, 
    trial,
    show_data
  ]);