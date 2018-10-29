'use strict';

window.onload = function() {

    var form = document.querySelector('.filter form');
    var fieldFromPrice = form.elements['fromPrice'];
    var fieldToPrice = form.elements['toPrice'];
    var btUpdate = document.querySelector('.filter input[type="button"]');

    fieldFromPrice.oninput = function(event) {
        if(/\D+/g.test(fieldFromPrice.value)) {
            fieldFromPrice.value = "";
            alert('Поле "Цена от:" должно содержать только натуральное число');
        }
    };

    fieldToPrice.oninput = function(event) {
        if(/\D+/g.test(fieldToPrice.value)) {
            fieldToPrice.value = "";
            alert('Поле "Цена до:" должно содержать только натуральное число');
        }
    };

    getDataOfProducts().then(function(data) {
        generateTable(data);
    });

    btUpdate.onclick = function(event) {
        getDataOfProducts().then(function(data) {
            var resultFilter;

            if(data === null) {
                resultFilter = null;
            } else {
                if(fieldFromPrice.value == 0 && fieldToPrice.value == 0) {
                    resultFilter = data;
                } else if(fieldFromPrice.value != 0 && fieldToPrice.value == 0) {
                    resultFilter = data.filter(function(product) {
                        return product.price >= fieldFromPrice.value;
                    });
                } else {
                    resultFilter = data.filter(function(product) {
                        return product.price >= fieldFromPrice.value && product.price <= fieldToPrice.value;
                    });
                }
            }

            generateTable(resultFilter);
        });
    };

    function generateTable(products) {
        var str = "";

        if(products === null) {
            str = 'Нет данных, так как произошла ошибка при их загрузке';
        } else if(products.length == 0) {
            str = 'Нет данных, попадающих под условие фильтра';
        } else {
            str = '<table><thead><tr>' +
                '<th>ID</th><th>Название</th><th>Количество</th><th>Цена за единицу</th><th>Сумма</th>' +
                '</tr></thead><tbody>';
            for(let i = 0; i < products.length; i++) {
                str += '<tr>';
                str += '<td>' + (i + 1) + '</td>';
                str += '<td>' + products[i].name + '</td>';
                str += '<td>' + products[i].quantity + '</td>';
                str += '<td>' + products[i].price + '</td>';
                str += '<td>' + products[i].quantity * products[i].price + '</td>';
                str += '</tr>';
            }
            str += '</tbody></table>';
        }

        document.querySelector('.products').innerHTML = str;
    }

    function getDataOfProducts() {
        return fetch('http://exercise.develop.maximaster.ru/service/products/')
            .then(function(response) {
                var contentType = response.headers.get("content-type");

                if(contentType && contentType.includes("application/json")) {
                    return response.json();
                }

                throw new TypeError("Ошибка, получили не JSON");
            })
            .catch(function(error) {
                alert(error.message);
                return null;
            });
    }

};