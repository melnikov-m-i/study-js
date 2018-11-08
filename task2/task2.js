document.addEventListener("DOMContentLoaded", ready);

function ready() {

    document.querySelector('.contact-form input[type="button"]').addEventListener('click', function() {
        var messageArea = document.querySelector('.message-area');
        var errors = validateForm();

        if(errors.length) {
            messageArea.innerHTML = '<p class="errors-order">' + errors.join('<br/>') + '</p>';
        } else {
            messageArea.innerHTML = "<p class='success-order'>Заказ оформлен!</p>";
        }
    });

    ymaps.ready(init);
};

function validateForm() {
    var form = document.querySelector('.contact-form form');
    var errors = [];

    for(let i = 0; i < form.elements.length; i++) {
        if(form.elements[i].required) {
            errors.push('Не заполнено поле ' + form.elements[i].placeholder);
        }
    }

    if(!(/^\d+$/g.test(form.elements['phone'].value))) {
        errors.push('Телефон должен содержать только числа');
    }

    if(form.elements['email'].value.indexOf('@') == -1) {
        errors.push('Email должен содержать символ собаки (@)');
    }

    if(form.elements['comment'].length > 500) {
        errors.push('Комментарий к заказу должен быть не более 500 символов');
    }

    return errors;
}

function init(){
    let tulaCoords = [54.1941, 37.6139];
    var myMap = new ymaps.Map("map", {
        center: tulaCoords,
        zoom: 12
    }, {
        balloonMaxWidth: 200,
        searchControlProvider: 'yandex#search'
    });

    var myPlacemark;

    myMap.events.add('click', function (e) {
        var coords = e.get('coords');

        var strCoords = [
            coords[0].toPrecision(6),
            coords[1].toPrecision(6)
        ].join(', ');

        if(myPlacemark === undefined) {
            myPlacemark = new ymaps.Placemark(coords, {
                balloonContentHeader: "Доставка",
                balloonContentBody: '<p>Координаты доставки: ' + strCoords + '</p>',
                hintContent: strCoords
            });
            myMap.geoObjects.add(myPlacemark);
        } else {
            myPlacemark.geometry.setCoordinates(coords);
            myPlacemark.properties.set({
                balloonContentBody: '<p>Координаты доставки: ' + strCoords + '</p>',
                hintContent: strCoords
            });
        }
    });
}