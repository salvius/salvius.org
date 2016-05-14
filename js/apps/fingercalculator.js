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
