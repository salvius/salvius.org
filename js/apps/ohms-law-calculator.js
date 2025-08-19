function calculate() {
    let V = parseFloat(document.getElementById("voltage").value);
    let I = parseFloat(document.getElementById("current").value);
    let R = parseFloat(document.getElementById("resistance").value);
    let P = parseFloat(document.getElementById("power").value);

    if (!isNaN(V) && !isNaN(I)) {
        R = V / I;
        P = V * I;
    } else if (!isNaN(V) && !isNaN(R)) {
        I = V / R;
        P = V * I;
    } else if (!isNaN(I) && !isNaN(R)) {
        V = I * R;
        P = V * I;
    } else if (!isNaN(P) && !isNaN(V)) {
        I = P / V;
        R = V / I;
    } else if (!isNaN(P) && !isNaN(I)) {
        V = P / I;
        R = V / I;
    } else if (!isNaN(P) && !isNaN(R)) {
        I = Math.sqrt(P / R);
        V = I * R;
    }

    document.getElementById("voltage").value = V ? V.toFixed(2) : "";
    document.getElementById("current").value = I ? I.toFixed(2) : "";
    document.getElementById("resistance").value = R ? R.toFixed(2) : "";
    document.getElementById("power").value = P ? P.toFixed(2) : "";
}

function resetForm() {
    document.getElementById("voltage").value = "";
    document.getElementById("current").value = "";
    document.getElementById("resistance").value = "";
    document.getElementById("power").value = "";
}
