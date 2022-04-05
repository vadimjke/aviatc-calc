// Airport changed
$("#sairport").change(function () {

    if ($('#minwTt').length) {
        $('#minwTt').remove();
        $('#questTt').remove();
    }

    let city = $("#not-moscow option:selected").text();

    let dop = getMargin("dop");
    let nakl = getMargin("nakl");

    $("#nakl").text(nakl + " руб.");
    $("#dop").text(dop + " руб.");

    blockInputs("stop");

    let mWeight = getMinWeight();
    $("#inputWeight").val(mWeight);

    let questTt = document.createElement("i");
    questTt.innerHTML = "?";
    questTt.className = "wat";
    questTt.id = "questTt";

    let minwTt = document.createElement("span");
    minwTt.innerHTML = "Минимальный вес: " + mWeight + " кг";
    minwTt.id = "minwTt";

    $("#sairport-tt").append(questTt).append(minwTt);
    $("#sairport").data("selected", city);

    calc();

})

// Main Calc function
function calc(e) {
    let calcWeight, sum, weightPrice;

    let weight = $("#inputWeight").val();
    let width = $("#inputWidth").val();
    let height = $("#inputHeight").val();
    let depth = $("#inputDepth").val();
    let volume = $("#inputVolume").val();

    weight = parseInt(weight);

    let udelVes = getUdelVes();
    let margin = getMargin("total");
    let data = loadData();

    let city = $("#not-moscow option:selected").text();
    let airport = $("#sairport option:selected").text();

    let volumeWeight = (width * height * depth) / 1000000 * udelVes;

    if (e == "vol") {
        // calc volume

        calcWeight = volume * udelVes;

        removeSelection()

        $("#inputVolume").css("font-weight", "bold");
        $("#inputVolume").css("border", "1px solid #444");

    }
    else if (e == "dim") {
        // calc dimensions

        removeSelection()

        $("#inputWidth").css("font-weight", "bold");
        $("#inputWidth").css("border", "1px solid #444");
        $("#inputHeight").css("font-weight", "bold");
        $("#inputHeight").css("border", "1px solid #444");
        $("#inputDepth").css("font-weight", "bold");
        $("#inputDepth").css("border", "1px solid #444");

        if (volumeWeight < weight) {
            calcWeight = weight;
        }
        else {
            calcWeight = volumeWeight
        }
    }
    else {
        if (volumeWeight < weight) {
            calcWeight = weight;
        }
        else {
            calcWeight = volumeWeight
        }
    }

    switch (true) {
        case (calcWeight < 50):
            data.forEach((el, i) => {
                if (el.City === city && el.Airport === airport) {
                    weightPrice = parseInt(el.Ves50);
                }
            })
            break;
        case (calcWeight < 100 && calcWeight >= 50):
            data.forEach((el, i) => {
                if (el.City === city && el.Airport === airport) {
                    weightPrice = parseInt(el.Ves100);
                }
            })
            break;
        case (calcWeight >= 100 && calcWeight < 300):
            data.forEach((el, i) => {
                if (el.City === city && el.Airport === airport) {
                    weightPrice = parseInt(el.Ves100300);
                }
            })
            break;
        case (calcWeight < 500 && calcWeight >= 300):
            data.forEach((el, i) => {
                if (el.City === city && el.Airport === airport) {
                    weightPrice = parseInt(el.Ves500);
                }
            })
            break;
        case (calcWeight < 1000 && calcWeight >= 500):
            data.forEach((el, i) => {
                if (el.City === city && el.Airport === airport) {
                    weightPrice = parseInt(el.Ves1000);
                }
            })
            break;
        case (calcWeight >= 1000):
            data.forEach((el, i) => {
                if (el.City === city && el.Airport === airport) {
                    weightPrice = parseInt(el.Ves1000);
                }
            })
            break;
    }

    sum = weightPrice * calcWeight + margin;
    sum = Math.round(sum);

    // Debug
    // console.log("wprice = " + weightPrice + " | calcWeight = " + calcWeight + " | sum = " + sum + " | margin = " + margin);

    displaySum = sum + " руб.";
    $("#displaysum").text(displaySum);
}

// Input events
$('#inputWeight').on('input', function (e) {

    if (this.value > 1000) {
        this.value = 1000;
    }

    calc(e);
});

$('#inputWeight').on('change', function (e) {

    let minWeight = getMinWeight();

    if (this.value < minWeight) {
        this.value = minWeight;
    }
    calc(e);
})

$('#inputVolume').on('input', function (e) {
    calc('vol');
});
$('#inputWidth').on('input', function (e) {
    calc('dim');
});
$('#inputHeight').on('input', function (e) {
    calc('dim');
});
$('#inputDepth').on('input', function (e) {
    calc('dim');
});

// Get fixed margin
function getMargin(v) {
    data = loadData();
    city = $("#not-moscow option:selected").text();
    airport = $("#sairport option:selected").text();
    if (v == "total") {
        if (city !== "Выберите город" && airport !== "Выберите аэропорт отправки") {
            data.forEach((el, i) => {
                if (el.City === city && el.Airport === airport) {
                    let dop = el.Dop.toString().replace(/ /g, '');
                    result = parseInt(dop) + parseInt(el.Avianakl);
                }
            })
        }
        else {
            result = 0;
        }
        // Debug
        // console.log(result)
        return result;
    }
    if (v == "dop") {
        if (city !== "Выберите город" && airport !== "Выберите аэропорт отправки") {
            data.forEach((el, i) => {
                if (el.City === city && el.Airport === airport) {
                    let dop = el.Dop.toString().replace(/ /g, '');
                    result = parseInt(dop);
                }
            })
        }
        else {
            result = 0;
        }

        return result;
    }
    if (v == "nakl") {
        if (city !== "Выберите город" && airport !== "Выберите аэропорт отправки") {
            data.forEach((el, i) => {
                if (el.City === city && el.Airport === airport) {
                    result = parseInt(el.Avianakl);
                }
            })
        }
        else {
            result = 0;
        }

        return result;
    }


}

// Get specific gravity
function getUdelVes() {
    data = loadData();
    city = $("#not-moscow option:selected").text();
    airport = $("#sairport option:selected").text();

    if (city !== "Выберите город" && airport !== "Выберите аэропорт отправки") {
        data.forEach((el, i) => {
            if (el.City === city && el.Airport === airport) {
                result = parseInt(el.UdVes);
            }
        })
    }
    else {
        result = 167;
    }

    return result;
}

// Remove selection
function removeSelection() {
    $("#inputVolume").css("font-weight", "normal");
    $("#inputVolume").css("border", "1px solid #B9B9B9");
    $("#inputWidth").css("font-weight", "normal");
    $("#inputWidth").css("border", "1px solid #B9B9B9");
    $("#inputHeight").css("font-weight", "normal");
    $("#inputHeight").css("border", "1px solid #B9B9B9");
    $("#inputDepth").css("font-weight", "normal");
    $("#inputDepth").css("border", "1px solid #B9B9B9");
}

// Reverse button clicked
$(document).on('click', '#reversebtn', function () {

    let csWrapper = $("#csw");
    let currentOpt = $("#not-moscow option:selected").text()
    let leftSelectNode = $("#s-opt-1").clone();
    let rightSelectNode = $("#s-opt-2").clone();
    let reverseBtn = $("#reversebtn").clone();

    csWrapper.empty();

    if (csWrapper.data("status") == "1") {
        $("#csw").append(rightSelectNode);
        $("#csw").append(reverseBtn);
        $("#csw").append(leftSelectNode);
        csWrapper.data("status", "2");
        $("#sl-1").text("Куда")
        $("#sl-2").text("Откуда")
        $("#sairport-tt").text("Аэропорт прилета")
    }
    else {
        $("#csw").append(leftSelectNode);
        $("#csw").append(reverseBtn);
        $("#csw").append(rightSelectNode);
        csWrapper.data("status", "1");
        $("#sl-2").text("Куда")
        $("#sl-1").text("Откуда")
        $("#sairport-tt").text("Аэропорт вылета")
    }

    $("#not-moscow").val(currentOpt).change();

    resetInputs();

})

// Non-Moscow city changed
$(document).on('change', '#not-moscow', function () {

    let selectedCity = $("#not-moscow option:selected").text();

    if ($("#not-moscow option:selected").text() !== "Выберите город" && $("#sairport").data("selected") !== selectedCity) {

        $("#sairport").data("selected", "no");

        blockInputs();

        $("#sairport").empty();
        $("#questTt").remove();
        let aloadz = document.createElement("option");
        aloadz.innerHTML = "Загрузка...";
        aloadz.id = "aloadz";
        $("#sairport").append(aloadz);
        $("#sairport").prop("disabled", true);

        let askAirport = document.createElement("option");
        askAirport.innerHTML = "Выберите аэропорт отправки";
        askAirport.id = "askAirport";
        askAirport.value = "null";
        askAirport.setAttribute('disabled', 'disabled');
        askAirport.setAttribute('selected', 'selected');

        let selectedCity = this.value;
        let data = loadData();
        let airportz = $("#sairport");

        $("#sairport").empty();
        $("#sairport").append(askAirport);

        let airports = [];
        data.forEach((el, i) => {
            if (el.City === selectedCity) {
                airports.push(el.Airport)
            }
        })
        for (let i = 0; i < airports.length; i++) {
            let newOpt = document.createElement("option");
            newOpt.value = airports[i];
            newOpt.innerHTML = airports[i];
            airportz.append(newOpt);
        }


        $("#sairport").prop("disabled", false);

        removeSelection()
    }
    else {
        let currentOpt = $("#sairport option:selected").text()
        $("#sairport").val(currentOpt).change();
    }
})

// Getting data from Google Sheets
async function saveData() {
    let url = "https://script.google.com/macros/s/AKfycbx9PL2TgjD8sVs2R5mOp2lu8xNelCYd0hrZv6NPgPtqdLIK8qmqwM2bXnqMi7rfv-wn/exec";
    let options = {};
    let response = await fetch(url, options);
    let result = await response.json();

    result.data.shift();

    sessionStorage.gData = JSON.stringify(result.data);

    return result.data;
}

// Load data from storage
function loadData() {
    return JSON.parse(sessionStorage.gData);
}

// Getting list of cities
function listCities(arr) {
    let result = [];

    for (let i = 0; i < arr.length; i++) {
        result.push(arr[i].City)
    }

    return result;
}

// Getting min weight
function getMinWeight() {
    let city = $("#not-moscow option:selected").text();
    let airport = $("#sairport option:selected").text();
    let data = loadData();
    let result;

    data.forEach((el, i) => {
        if (el.City === city && el.Airport === airport) {
            result = parseInt(el.MinVes);
        }
    })

    return result;
}

// Appending dest points
function appendCities(arrr) {
    let arr = [...new Set(arrr)];
    let notMoscow = $("#not-moscow");
    for (let i = 0; i < arr.length; i++) {
        let newOpt = document.createElement("option");
        newOpt.value = arr[i];
        newOpt.innerHTML = arr[i];
        notMoscow.append(newOpt);
    }
}

// Block inputs
function blockInputs(action) {
    if (action == "stop") {
        $(':input[type="number"]').each(function () {
            $(this).prop('disabled', false);
        })
    }
    else {
        $(':input[type="number"]').each(function () {
            $(this).prop('disabled', true);
        })
    }
}

// Reset inputs
function resetInputs() {
    let weight = $("#inputWeight").val();
    let width = $("#inputWidth").val();
    let height = $("#inputHeight").val();
    let depth = $("#inputDepth").val();
    let volume = $("#inputVolume").val();

    $("#inputWeight").val(weight).change();
    $("#inputWidth").val(width).change();
    $("#inputHeight").val(height).change();
    $("#inputDepth").val(depth).change();
    $("#inputVolume").val(volume).change();
}

// Main Func
async function init() {
    $('#not-moscow').prop('disabled', true);

    blockInputs();

    let data = await saveData();
    let cities = listCities(data);

    $("#cityloadz").text("Выберите город");
    $('#not-moscow').prop('disabled', false);

    appendCities(cities);
}

// Launch All
window.addEventListener('DOMContentLoaded', (event) => {
    init();
});