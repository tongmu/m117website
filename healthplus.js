function grandmaHelp() {
    alert("Help!");
}

$(document).ready(function () {
    $(function () {
        setInterval(grandmaHelp,5000)
        $('#monitorChart').highcharts({
            chart: {
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                alignTicks: false,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var heartRate = this.series[0];
                        var activity = this.series[1];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random() * 150;
                            z = Math.round(Math.random() * 3);
                            heartRate.addPoint([x, y], true, true);
                            activity.addPoint([x, z], false, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: [{
                    max: 150,
                    tickInterval: 50,
                    labels: {
                        format: '{value} bmp'
                    },
                    title: {
                        text: 'HeartRate'
                    }

            },
                {
                    labels: {
                        format: 'level {value}'
                    },
                    title: {
                        text: 'Activity'
                    },
                    max: 3,
                    tickInterval: 1
            }],
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                    name: 'Heart Rate',
                    type: 'line',
                    yAxis: 0,
                    data: (function () {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;

                        for (i = -19; i <= 0; i++) {
                            data.push({
                                x: time + i * 1000,
                                y: Math.random() * 150
                            });
                        }
                        return data;
                    })()
            },
                {
                    name: 'Activity',
                    type: 'column',
                    yAxis: 1,
                    data: (function () {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;

                        for (i = -19; i <= 0; i++) {
                            data.push({
                                x: time + i * 1000,
                                y: Math.round(Math.random() * 3)
                            });
                        }
                        return data;
                    })()
            }]
        });
    });
});