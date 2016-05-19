(function() {
    var active = 'day';
    
    Chart.defaults.global.animation.duration = 0;
    
    var $soundChart = $('.js-sound-chart');
    
    var data = {
        labels: [],
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
                data: []
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
    
    var $timespan = $('.js-timespan');
    $timespan.on('click', function(e) {
        e.preventDefault();
        
        $timespan.removeClass('current');
        $(e.target).addClass('current');
        
        var timespan = $(e.target).data('timespan');
       
        switch(timespan) {
            case 'day':
                active = 'day';
                getDay();
                break;
            case 'week':
                active = 'week';
                getWeek();
                break;
            case 'month':
                active = 'month';
                getMonth();
                break;
        }
    });
    
    function getSound(callback) {
        $.get('sound.txt', function(data) {
           data = data.split('\n');
           
           data = data.map(function(sound) {
              sound = sound.split('-');
              sound[0] = new Date(sound[0]);
              sound[1] = parseInt(sound[1]);
              
              return sound;
           });
           
           callback(data);
        });
    }
    
    function getDay() {
        getSound(function(data) {
            var labels = [];
            var sounds = [];
            
            var pastHour = moment(data[0][0]).format('HH:00');
            var avarage = 0;
            var total = 0;
            var amount = 0;
            data.forEach(function(sound, index) {
               var hour = moment(sound[0]).format('HH:00');
               
               if (pastHour !== hour || index === data.length - 1) {
                   avarage = (total / amount).toFixed(2);
                   labels.unshift(pastHour);
                   sounds.unshift(avarage);
                   
                   pastHour = hour;
                   
                   avarage = 0;
                   total = sound[1];
                   amount = 1;
               } else {
                   total += sound[1];
                   amount += 1;
               }
            });
            
            labels = _.takeRight(labels, 24);
            sounds = _.takeRight(sounds, 24);
            
            soundChart.data.labels = labels;
            soundChart.data.datasets[0].data = sounds;
            soundChart.update();
        });
    }
    
    function getWeek() {
        getSound(function(data) {
            var labels = [];
            var sounds = [];
            
            var pastDay = moment(data[0][0]).format('dd');
            var avarage = 0;
            var total = 0;
            var amount = 0;
            data.forEach(function(sound, index) {
               var day = moment(sound[0]).format('dd');
               
               if (pastDay !== day || index === data.length - 1) {
                   avarage = (total / amount).toFixed(2);
                   labels.unshift(pastDay);
                   sounds.unshift(avarage);
                   
                   pastDay = day;
                   
                   avarage = 0;
                   total = sound[1];
                   amount = 1;
               } else {
                   total += sound[1];
                   amount += 1;
               }
            });
            
            labels = _.takeRight(labels, 7);
            sounds = _.takeRight(sounds, 7);
            
            soundChart.data.labels = labels;
            soundChart.data.datasets[0].data = sounds;
            soundChart.update();
        });
    }
    
    function getMonth() {
        getSound(function(data) {
            var labels = [];
            var sounds = [];
            
            var pastDay = moment(data[0][0]).format('Do');
            var avarage = 0;
            var total = 0;
            var amount = 0;
            data.forEach(function(sound, index) {
               var day = moment(sound[0]).format('Do');
               
               if (pastDay !== day || index === data.length - 1) {
                   avarage = (total / amount).toFixed(2);
                   labels.unshift(pastDay);
                   sounds.unshift(avarage);
                   
                   pastDay = day;
                   
                   avarage = 0;
                   total = sound[1];
                   amount = 1;
               } else {
                   total += sound[1];
                   amount += 1;
               }
            });
            
            labels = _.takeRight(labels, 31);
            sounds = _.takeRight(sounds, 31);
            
            soundChart.data.labels = labels;
            soundChart.data.datasets[0].data = sounds;
            soundChart.update();
        });
    }
    
    setInterval(function() {
        switch(active) {
            case 'day':
                getDay();
                break;
            case 'week':
                getWeek();
                break;
            case 'month':
                getMonth();
                break;
        }
    }, 5000);
    
    getDay();
}());