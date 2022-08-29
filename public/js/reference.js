var reference = false;

function loadFile(input) {
    var file = input.files[0];
    var newImage = document.createElement("img");
    newImage.setAttribute("class", 'fit-picture');

    newImage.src = URL.createObjectURL(file);

    var container = document.getElementById('fit-picture');
    if(container.childElementCount > 0){
        container.replaceChild(newImage, container.lastElementChild);
    }
    else{
        container.appendChild(newImage);
    }
    reference = true;
};