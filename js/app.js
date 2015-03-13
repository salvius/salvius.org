var install_app = document.getElementById("chrome-install");
var launch_app = document.getElementById("chrome-launch-app");

console.log(chrome.app.isInstalled);

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
