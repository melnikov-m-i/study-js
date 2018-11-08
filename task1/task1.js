document.addEventListener("DOMContentLoaded", ready);

function ready() {
    var elSquare = document.querySelector('.square');

    document.querySelector('.bt-random-color').addEventListener('click', function() {
        var randomColor = {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255)
        };

        elSquare.style.backgroundColor = "rgb(" + randomColor.r + ", " + randomColor.g + ", " + randomColor.b + ")";
    });

    document.getElementById('width').addEventListener('input', function(event) {
        if(isNaN(event.target.value) || event.target.value < 0) {
            alert('Введите натуральное число');
            event.target.value = 0;
        }

        elSquare.style.width = event.target.value + "px";
    });

    document.getElementById('height').addEventListener('input', function(event) {
        if(isNaN(event.target.value) || event.target.value < 0) {
            alert('Введите натуральное число');
            event.target.value = 0;
        }

        elSquare.style.height = event.target.value + "px";
    });
};
