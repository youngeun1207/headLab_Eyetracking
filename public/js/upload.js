import 'https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js';
import 'https://www.gstatic.com/firebasejs/8.8.1/firebase-storage.js';

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

firebase.initializeApp(firebaseConfig);
const storage = firebase.app().storage("gs://iboda-eyetracking.appspot.com");
const storageRef = storage.ref();


function uploadFile() {
    var file = document.querySelector('#image').files[0];
    var filename = document.getElementById('fileName').value;
    
    var path = storageRef.child(filename);
    path.put(file)
}

const btn = document.getElementById("submit");
if (btn) {
    btn.addEventListener('click',uploadFile)
};

