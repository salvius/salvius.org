/* Fibonacci Finger Calculator */

$("#length").on("input change", function() {

    var value = parseFloat($(this).val());

    if (!value) {
        return;
    }

    var Phi = (Math.sqrt(5) + 1) / 2;
    var phi = Phi - 1;

    function fibonacci(n) {
        if (n >= 0) {
            return Math.pow(Phi, n) / Math.sqrt(5);
        } else {
            return 0;
        }
    }

    var phalanx = $(".phalanx");

    var distal = value;
    var intermediate = distal + fibonacci(distal);
    var proximal = intermediate + distal;
    var metacarpal = proximal + intermediate;
    var carpal = metacarpal + proximal;

    phalanx.find(".distal").text(distal.toFixed(2));
    phalanx.find(".intermediate").text(intermediate.toFixed(2));
    phalanx.find(".proximal").text(proximal.toFixed(2));
    phalanx.find(".metacarpal").text(metacarpal.toFixed(2));
    phalanx.find(".carpal").text(carpal.toFixed(2));

});

/* Chrome App */

/*
var install_app = document.getElementById("chrome-install");
var launch_app = document.getElementById("chrome-launch-app");

function ShowChromeAppButtons() {
    if (chrome.app.isInstalled) {
        // App is installed. Show the launch button, hide the install button
        launch_app.style.display = "inline-block";
        install_app.style.display = "none";
    } else {
        // App is not installed. Hide the launch button, show the install button
        launch_app.style.display = "none";
        install_app.style.display = "inline-block";
    }
}

function successCallback() {
    ShowChromeAppButtons();
    ga('send', 'event', 'Downloads', 'Success', 'Chrome App');
}

function failureCallback(error) {
    ga('send', 'event', 'Downloads', 'Failure', 'Chrome App');
}

install_app.addEventListener("click", function() {
    chrome.webstore.install(undefined, successCallback, failureCallback);
    ga('send', 'event', 'Downloads', 'Installation started', 'Chrome App');
});

launch_app.addEventListener("click", function() {
    ga('send', 'event', 'Downloads', 'Launch', 'Chrome App');
});

chrome.webstore.onDownloadProgress.addListener(function(percentDownloaded) {
    console.log(percentDownloaded);
});

chrome.webstore.onInstallStageChanged.addListener(function(installStage) {
    // Will be "installing", or "downloading"
    console.log("stage", installStage);
});

ShowChromeAppButtons();
*/

$("#nav").affix({
    offset: {
        top: 435
    }
});

$("#nav").on("affixed.bs.affix", function() {
    $(".color-soil").css("margin-top", "50px");
    $(window).resize();
});

$("#nav").on("affixed-top.bs.affix", function() {
    $(".color-soil").css("margin-top", "0px");
    $(window).resize();
});

$("body").scrollspy({target: "#navbar-collapse"});
