import { readStorage } from "./firebase.js";

export var reference = false;

// export function loadFile(input) {
//     if (input.files && input.files[0]) {
//         const reader = new FileReader()
//         reader.onload = e => {
//             var newImage = document.createElement("img");
//             newImage.setAttribute("class", 'fit-picture');

//             var container = document.getElementById('fit-picture');
            
//             newImage.src = e.target.result
//             if (container.childElementCount > 0) {
//                 container.replaceChild(newImage, container.lastElementChild);
//             }
//             else {
//                 container.appendChild(newImage);
//             }
//             reference = true;
//         }
//         reader.readAsDataURL(input.files[0])
//     }
// };

export async function selectVersion(){
    await swal.fire({
        title: '참고 이미지를 사용하시겠습니까?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: '예',
        denyButtonText: `아니요`,
      }).then((result) => {
        if (result.isConfirmed) {
            reference = true;
        }
      })
    if(reference){
        await loadFile();
    }
}

async function loadFile(){
    var newImage = document.createElement("img");
    newImage.setAttribute("class", 'fit-picture');
    newImage.src = await readStorage(await chooseReference());

    const container = document.getElementById('fit-picture');
    container.appendChild(newImage);

    console.log(newImage.src)
}

async function chooseLevel(){
    const { value: level } = await swal.fire({
        title: '난이도를 선택해주세요',
        input: 'radio',
        inputOptions: {
            1: "진입",
            2: "심화",
            3: "확장"
        },
        inputValidator: (value) => {
          if (!value) {
            return '난이도 선택은 필수입니다.'
          }
        }
      })
      if (level) {
        return level;
      }
}

async function chooseReference(){
    const level = await chooseLevel();

    const { value: topic } = await swal.fire({
        title: '주제를 선택해주세요',
        input: 'select',
        inputOptions: {
            architecture: '건축물',
            transportation: '교통수단',
            animal: '동물',
            plant: '식물',
            person: '인물'
        },
        inputPlaceholder: '주제 선택',
        showCancelButton: false,
        allowOutsideClick: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value != '') {
                    resolve()
                } else {
                    resolve('주제 선택은 필수입니다.')
                }
            })
        }
    }).then() 
    if (topic) {
        return "reference/" + topic + "_level" + level + ".jpg";
    }
}