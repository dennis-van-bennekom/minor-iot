(function() {
    Chart.defaults.global.animation.duration = 0;
    
    var $soundChart = $('.js-sound-chart');
    
    var labels = calculatePast(24, 'hours', 'hh');
    
    var data = {
        labels: labels,
        datasets: [
            {
                label: "Geluid",
                fill: true,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.5)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [0, 3, 9, 7, 6, 5, 4, 8, 6, 3, 0, 3, 9, 7, 6, 5, 4, 8, 6, 3, 4, 2, 1, 6]
            }
        ]
    };
    
    var soundChart = new Chart($soundChart, {
        type: 'line',
        data: data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 10
                    }
                }]
            }
        }
    });
    
    function calculatePast(amount, type, format) {
        var past = [];
        
        for (var i = 0; i < amount; i++) {
            past.unshift(moment().subtract(i, type).format(format));
        } 
        
        return past;
    }
    
    var $timespan = $('.js-timespan');
    $timespan.on('click', function(e) {
        e.preventDefault();
        
        $timespan.removeClass('current');
        $(e.target).addClass('current');
        
        var timespan = $(e.target).data('timespan');
       
        var labels = [];
        
        switch(timespan) {
            case 'day':
                labels = calculatePast(24, 'hours', 'hh');
                break;
            case 'week':
                labels = calculatePast(7, 'days', 'dd');
                break;
            case 'month':
                labels = calculatePast(32, 'days', 'DD');
                break;
        }
        
        soundChart.data.labels = labels;
        soundChart.update();
    });
    
    // TODO
}());