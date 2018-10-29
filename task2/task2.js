window.onload = function() {
    var btSubmit = document.querySelector('.contact-form input[type="button"]');

    btSubmit.onclick = function (event) {
        var fieldError = document.querySelector('.error-form');
        var error = validateForm();

        if(error.length) {
            var str = '';
            error.forEach(function(item){
                str += item + '<br>';
            });

            fieldError.innerHTML = str;
        }
        else {
            fieldError.innerHTML = "Заказ оформлен!";
        }
    };

    function validateForm() {
        var form = document.querySelector('.contact-form form');
        var error = [];

        if(form.elements['fio'].value === '') {
            error.push('Не заполнено поле ФИО');
        }

        if(form.elements['phone'].value === '') {
            error.push('Не заполнено поле Телефон');
        }

        if(!(/^\d+$/g.test(form.elements['phone'].value))) {
            error.push('Телефон должен содержать только числа');
        }

        if(form.elements['email'].value !== '' && form.elements['email'].value.indexOf('@') == -1) {
            error.push('Email должен содержать символ собаки (@)');
        }
 
        if(form.elements['comment'].length > 500) {
            error.push('Комментарий к заказу должен быть не более 500 символов');
        }

        return error;
    }

    ymaps.ready(init);
    function init(){
        var myMap = new ymaps.Map("map", {
            center: [54.1941, 37.6139],
            zoom: 12
        }, {
            balloonMaxWidth: 200,
            searchControlProvider: 'yandex#search'
        });

        myMap.events.add('click', function (e) {
            var coords = e.get('coords');
            var strCoods = [
                coords[0].toPrecision(6),
                coords[1].toPrecision(6)
            ].join(', ');
            var myPlacemark = new ymaps.Placemark(coords, {
                balloonContentHeader: "Доставка",
                balloonContentBody: '<p>Координаты доставки: ' + strCoods + '</p>',
                hintContent: strCoods
            });

            myMap.geoObjects.removeAll();
            myMap.geoObjects.add(myPlacemark);
        });
    }
};