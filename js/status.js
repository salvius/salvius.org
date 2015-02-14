// Data urls
var build_status_url = "http://api.travis-ci.org/repos?slug=gunthercox%2Fsalvius"
var sparkfun_data_url = "http://data.sparkfun.com/output/g660DVbNLEfWGlnWWDjz.json?page=1";
var twitter_url = "twitter_activity.json"

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

window.onload = function() {
    // Set current hour
    var current_date = new Date();
    var current_hour = current_date.getHours();

    $(".js-time-now").text(current_hour.toString() + ":00");

    var map = new Datamap({element: document.getElementById('container')});
}

var buildStatus = $(".js-build-status");
var buildStatusIndicator = $(
    '<div><a class="link" target="_blank">' +
        '<div class="alert alert-info">' +
            '<i class="fa fa-trophy"></i> ' +
            '<span class="name">Unit tests</span>' +
            '<span class="status pull-right">Loading...</span>' +
        '</div>' +
    '</a></div>'
);

buildStatus.html(buildStatusIndicator);

$.ajax({
    url: build_status_url,
    jsonp: "callback",
    cache: true,
    dataType: "jsonp",
}).success(function(data) {

    var status = data[0].last_build_status;
    var indicator = buildStatusIndicator.clone();

    indicator.find(".link").attr("href", "https://travis-ci.org/" + data[0].slug);

    if (status == 0) {
        indicator.find(".alert").addClass("alert-success");
        indicator.find(".status").text("Passing");
    } else {
        indicator.find(".alert").addClass("alert-danger");
        indicator.find(".status").text("Failing");
    }

    buildStatus.html(indicator);

}).error(function() {
    var indicator = buildStatusIndicator.clone();
    indicator.find(".alert").addClass("alert-warning");
    indicator.find(".status").text("Unavailable");
    buildStatus.html(indicator);
});

new Chartist.Line(".chart-api-response-time", {
    labels: ["0.0","0.5","1.0","1.5","2.0","2.5","3.0", "3.5", "4.0", "4.5", "5.0"],
    series: [
        [3, 2, 1, 2, 4, 5, 1, 2, 1, 3, 5]
    ]
},
{
    lineSmooth: false
});

$.ajax({
    url: sparkfun_data_url,
    jsonp: "callback",
    cache: true,
    dataType: "jsonp",
}).done(function(data) {

    var frequency_data = {
        "00:00": 0, "01:00": 0, "02:00": 0, "03:00": 0, "04:00": 0, "05:00": 0,
        "06:00": 0, "07:00": 0, "08:00": 0, "09:00": 0, "10:00": 0, "11:00": 0,
        "12:00": 0, "13:00": 0, "14:00": 0, "15:00": 0, "16:00": 0, "17:00": 0,
        "18:00": 0, "19:00": 0, "20:00": 0, "21:00": 0, "22:00": 0, "23:00": 0
    }

    // Get the hour from the timestamp
    for (var i = 0; i < data.length; i++) {
        var timestamp = data[i];
        var time = timestamp["timestamp"].split("T")[1];
        var hour = time.split(":")[0] + ":00";

        frequency_data[hour] += 1;
    }

    var keys = [];
    for(var k in frequency_data) keys.push(k);

    var values = [];
    for(var k in frequency_data) values.push(frequency_data[k]);

    var data = {
        labels: keys,
        series: [
            values
        ]
    };

    var activityGraph = new Chartist.Line(".chart-activity", data);

}).error(function() {
    var message = $('<h2 class="text-danger text-center">Data unavailable</h2>');
    $(".chart-activity").css("background", "#eee").html(message);
});

new Chartist.Line(".chart-battery", {
    labels: ["0", "2", "4", "6", "8", "10", "12", "14", "16", "20", "25", "30"],
    series: [
        {
          name: "Battery Level",
          data: [12.5, 12, 12, 12, 11.5, 11, 11, 11, 10.5, 10, 9.5, 9.5]
        }
    ]
},
{
    low: 0,
    showArea: true
});

var easeOutQuad = function (x, t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
};

var $chart = $(".chart-battery");

var $toolTip = $chart.append('<div class="tooltip"></div>').find('.tooltip').hide();

$chart.on('mouseenter', '.ct-point', function() {
    var $point = $(this);
    var value = $point.attr('ct:value');
    var seriesName = $point.parent().attr('ct:series-name');

    $point.animate({'stroke-width': '50px'}, 300, easeOutQuad);
    $toolTip.html(seriesName + '<br>' + value).show();
});

$chart.on('mouseleave', '.ct-point', function() {
  var $point = $(this);

  $point.animate({'stroke-width': '20px'}, 300, easeOutQuad);
  $toolTip.hide();
});

$chart.on('mousemove', function(event) {
  $toolTip.css({
    left: event.offsetX - $toolTip.width() / 2 - 10,
    top: event.offsetY - $toolTip.height() - 40
  });
});

$.ajax({
    url: twitter_url,
    jsonp: "callback",
    cache: true,
    dataType: "jsonp",
}).always(function(data) {
    if (!data.frequency) {
        data = {"frequency": [90, 16, 16, 22, 33, 7, 15]};
    }

    new Chartist.Line(".chart-twitter", {
		labels : weekday,
        series: [
            data.frequency
        ]
    });
});

var data = {
    labels: ["Conversations", "Sensor data", "Media data"],
    series: [20, 30, 50]
};

var options = {
    labelInterpolationFnc: function(value) {
        return value[0]
    }
};

var responsiveOptions = [
    ['screen and (min-width: 640px)', {
        chartPadding: 30,
        labelOffset: 100,
        labelDirection: 'explode',
        labelInterpolationFnc: function(value) {
        return value;
    }
    }],
        ['screen and (min-width: 1024px)', {
        labelOffset: 50,
        chartPadding: 10
    }]
];

new Chartist.Pie(".chart-intelligence", data, options, responsiveOptions);


$(".navbar-nav li").on("mouseover", function() {
    $(this).addClass("active");
});

$(".navbar-nav li").on("mouseleave", function() {
    $(this).removeClass("active");
});
