window.onload = function() {

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line'
    });
    
    function addDataInChart(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach(function(dataset) {
            dataset.data.push(data);
        });
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

    var arDataOfCpu = [];

    function start() {
        setTimeout(function go() {
            getDataOfCpu().then(function(cpu) {
                if(cpu !== null) {
                    if(cpu == 0 && arDataOfCpu.length == 0) {
                        return;
                    }

                    if(cpu == 0 && arDataOfCpu.length != 0) {
                        cpu = arDataOfCpu[arDataOfCpu.length - 1]
                    }

                    arDataOfCpu.push(cpu);
                    //addDataInChart(chart, label, data) ;
                }
            });
            setTimeout(go, 5000);
        }, 5000);
    }

};


