window.onload = function() {

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Загруженность CPU(%)',
                fill: false,
                borderColor: 'orange',
                pointBorderColor: 'orange',
                pointBackgroundColor: 'rgba(255,150,0,0.5)',
                pointRadius: 5,
                pointHoverRadius: 10,
                pointHitRadius: 30,
                pointBorderWidth: 2,
                pointStyle: 'rectRounded',
                data: []
            }],
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'График "Загруженность CPU"',
                fontSize: 18
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'minute',
                        displayFormats: {
                            second: 'HH: mm: ss',
                            minute: 'HH: mm: ss',
                            hour: 'HH: mm: ss',
                            day: 'll'
                        },
                        tooltipFormat: 'DD.MM.YYYY HH:mm:ss'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Дата'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Загруженность CPU(%)'
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    startDrawChart(chart);

};

function addDataInChart(chart, data) {
    chart.data.datasets[0].data.push(data);
    chart.update();
}

function getDataOfCpu() {
    return fetch('http://exercise.develop.maximaster.ru/service/cpu/')
        .then(function(response) {
            var contentType = response.headers.get("content-type");

            if(contentType && contentType.includes("text/html")) {
                return response.text();
            }

            throw new TypeError("Ошибка, получили не Text");
        })
        .catch(function(error) {
            alert(error.message);
            return null;
        });
}

function startDrawChart(chart) {
    var countRequest = 0;
    var countRequestOfError = 0;

    setTimeout(function go() {
        getDataOfCpu().then(function(cpu) {
            if(cpu !== null) {
                countRequest += 1;

                if(cpu == 0) {
                    countRequestOfError += 1;

                    let arDataOfCpu = chart.data.datasets[0].data;

                    if(arDataOfCpu.length != 0) {
                        cpu = arDataOfCpu[arDataOfCpu.length - 1].y;
                    }
                    else {
                        return;
                    }
                }

                addDataInChart(chart, {x: new Date(), y: cpu}) ;
                document.querySelector('.info-request').innerHTML = "Число запросов: " + countRequest +
                    ". Процент запросов, вернувших ошибку: " + (countRequestOfError/countRequest*100).toPrecision(2) + "%";
            }
        });
        setTimeout(go, 5000);
    }, 5000);
}


