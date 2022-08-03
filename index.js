import jsPsych from "https://unpkg.com/jspsych@7.3.0";
import htmlKeyboardResponse from "https://unpkg.com/@jspsych/plugin-html-keyboard-response@1.1.1";

const jsPsych = initJsPsych();

const trial = {
  type: htmlKeyboardResponse,
  stimulus: 'Hello world!',
}

jsPsych.run([trial]);
