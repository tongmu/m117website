var heartrate = 0;
var activity = 0;
var button = 0;
var prevButton = 0;
var prevHeartrate = 0;
var helpNotTriggered = true;
var lowHeartrateNotTriggered = true;
var highHeartrateNotTriggered = true;
var objectID = "AkXWDhWPeD";
$("#highHeartrateWarning").collapse("hide");
$("#lowHeartrateWarning").collapse("hide");
$("#buttonWarning").collapse("hide");

function grandmaHelp() {
    alert("Help!");
}

function highHeartrate() {
    alert("Grandma's Heartrate is greater than 100bpm!")
}

function lowHeartrate() {
    alert("Grandma's Heartrate is lower than 50bpm!")
}

function readFromWebsite() {
    var TestObject = Parse.Object.extend("TestObject");
    var query = new Parse.Query(TestObject);
    query.get(objectID, {
        success: function (object) {
            prevHeartrate=heartrate;
            heartrate = object.get("heartbeat");
            activity = object.get("activity");
            prevButton = button;
            button = object.get("button");
            $("#heartrateNumber").text(+heartrate);
            switch (activity) {
            case 0:
                $("#activityLevel").text("NONE");
                $("#activity").css("border-color", "#000000");
                $("#activity").css("background-color", "#FFFFFF");
                $("#activity").css("color", "#000000");
                break;
            case 1:
                $("#activityLevel").text("LOW");
                $("#activity").css("border-color", "#3c763d");
                $("#activity").css("background-color", "#d6e9c6");
                $("#activity").css("color", "#3c763d");
                break;
            case 2:
                $("#activityLevel").text("MEDIUM");
                $("#activity").css("border-color", "#8A6D3B");
                $("#activity").css("background-color", "#faebcc");
                $("#activity").css("color", "#8A6D3B");
                break;
            case 3:
                $("#activityLevel").text("HIGH");
                $("#activity").css("border-color", "#A94442");
                $("#activity").css("background-color", "#f2dede");
                $("#activity").css("color", "#A94442");
                break;
            }
            if (heartrate > 100 || heartrate < 50) {
                $("#heartrate").css("border-color", "#A94442");
                $("#heartrate").css("background-color", "#f2dede");
                $("#heartrate").css("color", "#A94442");
            } else {
                $("#heartrate").css("border-color", "#3c763d");
                $("#heartrate").css("background-color", "#d6e9c6");
                $("#heartrate").css("color", "#3c763d");
            }

            if (heartrate > 100 && highHeartrateNotTriggered) {
                highHeartrate();
                highHeartrateNotTriggered = false;
                $("#highHeartrateWarning").collapse("show");
            }
            if (heartrate < 50 && lowHeartrateNotTriggered) {
                lowHeartrate();
                lowHeartrateNotTriggered = false;
                $("#lowHeartrateWarning").collapse("show");
            }
            if (button == 1 && helpNotTriggered) {
                grandmaHelp();
                helpNotTriggered = false;
                $("#buttonWarning").collapse("show");
            }
            if (prevButton == 1 && button == 0) {
                helpNotTriggered = true;
                $("#buttonWarning").collapse("hide");
            }
            if (prevHeartrate > 100 && heartrate <= 100) {
                console.log("turn off high heartrate");
                highHeartrateNotTriggered = true;
                $("#highHeartrateWarning").collapse("hide");
            }
            if (prevHeartrate < 50 && heartrate >= 50) {
                console.log('turn off low heartrate')
                lowHeartrateNotTriggered = true;
                $("#lowHeartrateWarning").collapse("hide");
            }
        },
        error: function (object, error) {
            console.log("ERROR");
        }
    })
}

Parse.initialize("iNlfabuNpTA2955HPt6BCi5dE1mqjaFU9kj3mBTN", "0MPcut8nTKQ7cZC13efb5HwoA4IXEJVK1Zti0SQm");

$(document).ready(function () {
    setInterval(readFromWebsite, 1000);
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    $(function () {
        $('#monitorChart').highcharts({
            chart: {
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                alignTicks: false,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var Heartrate = this.series[1];
                        var Activity = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(); // current time
                            Heartrate.addPoint([x, heartrate], true, true);
                            Activity.addPoint([x, activity], false, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'HeartRate and Activity'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: [{
                    min: 0,
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
                    min: 0,
                    tickInterval: 1
            }],
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%H:%M', this.x) + '<br/>' +
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
                    index: 1,
                    yAxis: 0,
                    color: "#9a0e0b",
                    data: (function () {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;

                        for (i = -19; i <= 0; i++) {
                            data.push({
                                x: time + i * 1000,
                                y: 0
                            });
                        }
                        return data;
                    })()
            },
                {
                    name: 'Activity',
                    type: 'column',
                    index: 0,
                    yAxis: 1,
                    data: (function () {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;

                        for (i = -19; i <= 0; i++) {
                            data.push({
                                x: time + i * 1000,
                                y: 0
                            });
                        }
                        return data;
                    })()
            }]
        });
    });
});