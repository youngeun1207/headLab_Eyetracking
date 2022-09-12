
export var reference = false;

export function loadFile(input) {
    // var file = input.files[0];
    // var newImage = document.createElement("img");
    // newImage.setAttribute("class", 'fit-picture');

    // newImage.src = URL.createObjectURL(file);

    // var container = document.getElementById('fit-picture');
    // if(container.childElementCount > 0){
    //     container.replaceChild(newImage, container.lastElementChild);
    // }
    // else{
    //     container.appendChild(newImage);
    // }
    // reference = true;

    if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = e => {
            var newImage = document.createElement("img");
            newImage.setAttribute("class", 'fit-picture');

            var container = document.getElementById('fit-picture');
            
            newImage.src = e.target.result
            if (container.childElementCount > 0) {
                container.replaceChild(newImage, container.lastElementChild);
            }
            else {
                container.appendChild(newImage);
            }
            reference = true;
        }
        reader.readAsDataURL(input.files[0])
    }
};

export function setReference(value) {
    reference = value;
}