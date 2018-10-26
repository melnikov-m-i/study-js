window.onload = function() {
    var tfWidth = document.getElementById('width');
    var tfHeight = document.getElementById('height');
    var elSquare = document.querySelector('.square');
    var btColor = document.querySelector('.bt-random-color');

    btColor.onclick = function (event) {
        var randomColor = {
            r: Math.random() * 255,
            g: Math.random() * 255,
            b: Math.random() * 255
        };

        elSquare.style.backgroundColor = "rgb(" + randomColor.r + ", " + randomColor.g + ", " + randomColor.b + ")";
    };

    tfWidth.oninput = function(event) {
        if(isNaN(event.target.value) || event.target.value < 0) {
            alert('Введите натуральное число');
            tfWidth.value = 0;
        }

        elSquare.style.width = event.target.value + "px";
    };

    tfHeight.oninput = function(event) {
        if(isNaN(event.target.value) || event.target.value < 0) {
            alert('Введите натуральное число');
            tfHeight.value = 0;
        }

        elSquare.style.height = event.target.value + "px";
    };
};
