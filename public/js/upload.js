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

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);
const dbRef = db.ref();
const storage = firebase.app().storage("gs://iboda-eyetracking.appspot.com");
const storageRef = storage.ref();


function uploadFile() {
    const file = document.querySelector('#image').files[0];
    const filename = document.getElementById('fileName').value;

    const path = storageRef.child(filename);
    path.put(file)
}

export async function readDatabase(dir) {
    const data = await dbRef.child(dir).get();
    if (!data.val()) console.error("err");
    return data.val();
}

async function updateDB(){
    const data = await readDatabase("key_info");
    const key_list = Object.keys(data);
    console.log(key_list);
    key_list.map(key => updateAcc(dbRef.child('data').child(key)));
}
async function updateAcc(dataRef){
    if(dataRef.accuracy){
        return;
    }
    dataRef.update({
        'accuracy': 80
    });
}

const btn = document.getElementById("submit");
if (btn) {
    btn.addEventListener('click', uploadFile)
};

