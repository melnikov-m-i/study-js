(function() {
    document.addEventListener("DOMContentLoaded", ready);

    var myPlacemark;

    function ready() {
        document.querySelector('.contact-form input[type="button"]').addEventListener('click', function() {
            var messageArea = document.querySelector('.message-area');
            var errors = validateForm(document.querySelector('.contact-form form'));

            if(errors.length) {
                messageArea.innerHTML = '<p class="errors-order">' + errors.join('<br/>') + '</p>';
            } else {
                messageArea.innerHTML = "<p class='success-order'>Заказ оформлен!</p>";
            }
        });

        ymaps.ready(init);
    };

    function validateForm(form) {
        var validators = {
            fio: {
                required: true,
                messageNoValidation: "Не заполнено поле ФИО",
                validate: function (fio) {
                    return fio.trim() !== '';
                }
            },
            phone: {
                required: true,
                messageNoValidation: "Телефон должен содержать только числа",
                validate: function (phone) {
                    return /^\d+$/g.test(phone);
                }
            },
            email: {
                required: false,
                messageNoValidation: "Email должен содержать символ собаки (@)",
                validate: function (email) {
                    return email.indexOf('@') > 0;
                }
            },
            comment: {
                required: false,
                messageNoValidation: "Комментарий к заказу должен быть не более 500 символов",
                validate: function (comment) {
                    return comment.trim().length <= 500;
                }
            },
            map: {
                required: true,
                messageNoValidation: "Не отмечен адрес дооставки",
                validate: function (placeMark) {
                    return placeMark === undefined ? false : true;
                }
            }
        };

        var errors = [];

        for (let fieldName in validators) {
            if (form.elements.hasOwnProperty(fieldName)) {
                if (validators[fieldName].required) {
                    errors.push('Не заполнено поле ' + form.elements[fieldName].placeholder);
                } else if (!validators[fieldName].validate(form.elements[fieldName].value)) {
                    errors.push(validators[fieldName].messageNoValidation);
                }
            } else if (fieldName === 'map') {
                if (!validators[fieldName].validate(myPlacemark)) {
                    errors.push(validators[fieldName].messageNoValidation);
                }
            }
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

        myMap.events.add('click', function (e) {
            var coords = e.get('coords');

            var strCoords = [
                coords[0].toPrecision(6),
                coords[1].toPrecision(6)
            ].join(', ');

            var propertiesPlacemark = {
                balloonContentBody: '<p>Координаты доставки: ' + strCoords + '</p>',
                hintContent: strCoords
            };

            if(myPlacemark === undefined) {
                propertiesPlacemark.balloonContentHeader = "Доставка";
                myPlacemark = new ymaps.Placemark(coords, propertiesPlacemark);
                myMap.geoObjects.add(myPlacemark);
            } else {
                myPlacemark.geometry.setCoordinates(coords);
                myPlacemark.properties.set(propertiesPlacemark);
            }
        });
    }
})();
