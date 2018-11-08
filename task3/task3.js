'use strict';

document.addEventListener("DOMContentLoaded", ready);

function ready() {
    var form = document.querySelector('.filter form');
    var fieldFromPrice = form.elements['fromPrice'];
    var fieldToPrice = form.elements['toPrice'];
    var dataOfProducts;

    fieldFromPrice.addEventListener('input', function() {
        if(/\D+/g.test(fieldFromPrice.value)) {
            fieldFromPrice.value = "";
            alert('Поле "Цена от:" должно содержать только натуральное число');
        }
    });

    fieldToPrice.addEventListener('input', function() {
        if(/\D+/g.test(fieldToPrice.value)) {
            fieldToPrice.value = "";
            alert('Поле "Цена до:" должно содержать только натуральное число');
        }
    });

    getDataOfProducts().then(function(data) {
        dataOfProducts = data;
        generateTable(dataOfProducts);
    });

    document.querySelector('.filter input[type="button"]').addEventListener('click', function() {
        var resultFilter;

        if(dataOfProducts === null) {
            resultFilter = null;
        } else {
            if(parseInt(fieldFromPrice.value) == 0 && parseInt(fieldToPrice.value) == 0) {
                resultFilter = dataOfProducts;
            } else {
                resultFilter = dataOfProducts.filter(function(product) {
                    return product.price >= parseInt(fieldFromPrice.value) &&
                        product.price <= (parseInt(fieldToPrice.value) || Infinity);
                });
            }
        }

        generateTable(resultFilter);
    });
};

function generateTable(products) {
    let container = document.querySelector('.products');
    let table = document.createElement('table');

    if(products === null) {
        container.innerHTML = 'Нет данных, так как произошла ошибка при их загрузке';
    } else if(products.length == 0) {
        container.innerHTML = 'Нет данных, попадающих под условие фильтра';
    } else {
        table.createTHead().insertRow(0).insertAdjacentHTML("afterBegin",
            "<th>ID</th><th>Название</th><th>Количество</th><th>Цена за единицу</th><th>Сумма</th>");

        let tBody = document.createElement("tbody");

        for(let i = 0; i < products.length; i++) {
            let row = tBody.insertRow(i);
            let cell = row.insertCell(0);
            cell.innerHTML = i + 1;
            cell = row.insertCell(-1);
            cell.innerHTML = products[i].name;
            cell = row.insertCell(-1);
            cell.innerHTML = products[i].quantity;
            cell = row.insertCell(-1);
            cell.innerHTML = products[i].price;
            cell = row.insertCell(-1);
            cell.innerHTML = products[i].quantity * products[i].price;
        }

        table.appendChild(tBody);
        container.replaceChild(table, container.firstChild);
    }
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