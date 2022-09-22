import { canvas, getWindowsize, saveOffsets } from "./canvas.js";
import { gazeData } from "./eyetracking.js";
import { path } from "./index.js";
import { reference } from "./reference.js";
import { timestamp } from "./stopwatch.js";
import { personalInfo, userID } from "./user_info.js";

const firebaseConfig = {
    apiKey: "AIzaSyBR0yFjUp3Rp6XrkVW7fuaYCjNU7t1xRB0",
    authDomain: "iboda-eyetracking.firebaseapp.com",
    databaseURL: "https://iboda-eyetracking-default-rtdb.firebaseio.com",
    projectId: "iboda-eyetracking",
    storageBucket: "iboda-eyetracking.appspot.com",
    messagingSenderId: "350140103230",
    appId: "1:350140103230:web:73c058e0544c0ad0072f6f",
    measurementId: "G-5S6M0YT4GH"
};

const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.app().storage("gs://iboda-eyetracking.appspot.com");
const storageRef = storage.ref();

export async function readStorage(path) {
    return await storageRef.child(path).getDownloadURL();
}

export async function writeData() {
    const db = firebase.database(app);
    const dataRef = db.ref('data').push({
        id: userID,
        gaze_data: gazeData,
        is_reference: reference,
        personal_info: personalInfo,
        process_index: timestamp,
        drawing: 'drawing/' + path,
        screenshot: 'screenshot/' + path,
        offsets: saveOffsets(),
        window_size: getWindowsize()
    });
    const refKey = dataRef.key;
    const usersRef = db.ref('key_info').child(refKey);
    usersRef.set({
        id: userID,
        is_reference: reference
    });
    await saveImageDB();
}

export async function saveScreenShot() {
    html2canvas(document.querySelector("#body"), {
        allowTaint: true,
        useCORS: true,
    }).then(canvas => {
        canvas.toBlob(function(blob) {
            var file_path = storageRef.child('screenshot/' + path);
            file_path.put(blob);
        });
    });
}

export async function saveDrawing(time) {
    canvas.toBlob(function(blob) {
        var file_path = storageRef.child('drawing/' + path + time);
        file_path.put(blob);
    });
}

export async function saveImageDB() {
    const time = '_end';
    await saveDrawing(time);
    await saveScreenShot();
}