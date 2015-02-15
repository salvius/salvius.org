var TEMPLATE = '<div class="btn-group">' +
    '<a href="#" class="btn btn-lg btn-primary twitter"><i class="fa fa-twitter"></i></a>' +
    '<a href="#" class="btn btn-lg btn-info facebook"><i class="fa fa-facebook"></i></a>' +
    '<a href="#" class="btn btn-lg btn-danger pinterest"><i class="fa fa-pinterest"></i></a>' +
'</div>';

$(".share").sharrre({
    share: {
      facebook: true,
      twitter: true,
      pinterest: true,
    },
    url: "http://salvius.github.io/",
    enableTracking: true,
    enableHover: false,
    template: TEMPLATE,
    render: function(api, options) {

        var twitter_percent = (options.count.twitter) + "%";
        var facebook_percent = (options.count.facebook) + "%";
        var pinterest_percent = (options.count.pinterest) + "%";

        $(".progress-bar-twitter").css("width", twitter_percent);
        $(".progress-bar-facebook").css("width", facebook_percent);
        $(".progress-bar-pinterest").css("width", pinterest_percent);
        $(".total").text(options.total);

        $(api.element).on("click", ".twitter", function() {
            api.simulateClick();
            api.openPopup("twitter");
        });
        $(api.element).on("click", ".facebook", function() {
            api.simulateClick();
            api.openPopup("facebook");
        });
        $(api.element).on("click", ".pinterest", function() {
            api.simulateClick();
            api.openPopup("pinterest");
        });
    }
});


/*var current_page = document.URL;

function twitter() {
    $.getJSON("https://cdn.api.twitter.com/1/urls/count.json?url=" + current_page, function(data) {
        console.log("twitter", data);
    });
}

function facebook() {
    $.getJSON("http://graph.facebook.com/?id=" + current_page, function(data) {
        console.log("facebook", data);
    });
}

function pinterest() {
    $.getJSON("http://api.pinterest.com/v1/urls/count.json?callback=&url=" + current_page, function(data) {
        console.log("pinterest", data);
    });
}

twitter();
facebook();
pinterest();*/
