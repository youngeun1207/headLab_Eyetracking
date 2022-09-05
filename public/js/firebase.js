import { canvas, gazeData, getWindowsize, referenceTimestamp, saveOffsets, userID } from "./canvas.js";

let today = new Date();

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

export async function writeData() {
    const db = firebase.database(app);
    db.ref('data').push({
        id: userID,
        gaze_data: gazeData,
        reference_index: referenceTimestamp,
        drawing: 'drawing/' + userID.id + today.getHours() + today.getMinutes(),
        screenshot: 'screenshot/' + userID.id + today.getHours() + today.getMinutes(),
        offsets: saveOffsets(),
        window_size: getWindowsize()
    });
    saveImageDB();
}

export function saveScreenShot(storageRef) {
    html2canvas(document.querySelector("#body")).then(canvas => {
        canvas.toBlob(function(blob) {
            var file_path = storageRef.child('screenshot/' + userID.id + today.getHours() + today.getMinutes());
            file_path.put(blob);
        });
    });
}

export function saveDrawing(storageRef) {
    canvas.toBlob(function(blob) {
        var file_path = storageRef.child('drawing/' + userID.id + today.getHours() + today.getMinutes());
        file_path.put(blob);
    });
}

export async function saveImageDB() {
    var storage = firebase.app().storage("gs://iboda-eyetracking.appspot.com");
    var storageRef = storage.ref();

    saveDrawing(storageRef);
    saveScreenShot(storageRef);
}