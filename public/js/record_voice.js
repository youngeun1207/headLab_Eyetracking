import { saveVoice } from "./firebase.js";
import { path } from "./index.js";

let mediaRecorder = null;

const audioArray = [];

export async function recordVoice() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
        audioArray.push(event.data);
    }
    mediaRecorder.onstop = (event) => {
        const blob = new Blob(audioArray, { "type": "audio/mpeg codecs=opus" });

        const file = new File(audioArray, `${path}.mp3`, { "type": "audio/mpeg codecs=opus" });
        saveVoice(file);

        audioArray.splice(0);
    }

    // 녹음 시작
    mediaRecorder.start();
}

export async function stopRecording() {
    mediaRecorder.stop();
}