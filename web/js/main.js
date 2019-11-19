
document.addEventListener('DOMContentLoaded', loadGraphs())

// todo fix this to actually send the message data
function getPrediction() {
    var url = "http://localhost:8080"
    var endpoint = "/predict"

    var http = new XMLHttpRequest();

    http.open("GET", url + endpoint, true);

    http.onreadystatechange = function() {
        var DONE = 4;       // 4 means that the request is done
        var OK = 200;       // 200 means a successful return
        if (http.readyState == DONE && http.status == OK && http.responseText) {
            // JSON string
            replyString = http.responseText;

            // JSON -> JS obj
            replyObj = JSON.parse(replyString);

            document.getElementById("prediction").innerText = replyObj.prediction;  // signifies that we need a string called prediction from the backend
        }
        else {
            console.log("Error getting prediction from the backend server. (Is it running?)");
        }
    }
}

// todo fix this to actually send the message data
function correctPrediction(correctLabel) {
    

    // debug
    var message = document.getElementById('message').value;
    console.log(message + " is " + correctLabel);

    // starter code
    var url = "http://localhost:8080"
    var endpoint = "/correctPrediction"

    var http = new XMLHttpRequest();

    http.open("GET", url + endpoint, true);

    http.onreadystatechange = function() {
        var DONE = 4;       // 4 means that the request is done
        var OK = 200;       // 200 means a successful return
        if (http.readyState == DONE && http.status == OK && http.responseText) {
            // JSON string
            replyString = http.responseText;

            // JSON -> JS obj
            replyObj = JSON.parse(replyString);

            document.getElementById("prediction").innerText = replyObj.prediction;  // signifies that we need a string called prediction from the backend
        }
        else {
            console.log("Error correcting prediction from the backend server. (Is it running?)");
        }
    }
}

// todo get these actual from ml.py
function getTopFiveAlgorithms() {
    var url = "http://localhost:8080"
    var endpoint = "/getAlgorithms"

    var http = new XMLHttpRequest();

    http.open("GET", url + endpoint, true);

    http.onreadystatechange = function () {
        var DONE = 4;       // 4 means that the request is done
        var OK = 200;       // 200 means a successful return

        if (http.readyState == DONE && http.status == OK && http.responseText) {
            // JSON string
            replyString = http.responseText;

            // JSON -> JS object
            replyObj = JSON.parse(replyString);

            // put the algorithm names in their ranked order
            document.getElementById("alg1_name").innerHTML = "<b>" + replyObj.name[0] + "</b>";
            document.getElementById("alg2_name").innerText = replyObj.name[1];
            document.getElementById("alg3_name").innerText = replyObj.name[2];
            document.getElementById("alg4_name").innerText = replyObj.name[3];
            document.getElementById("alg5_name").innerText = replyObj.name[4];

            // put the algorithms' F1 scores in their ranked order
            document.getElementById("alg1_f1").innerHTML = "<b>" + replyObj.f1[0] + "</b>";
            document.getElementById("alg2_f1").innerText = replyObj.f1[1];
            document.getElementById("alg3_f1").innerText = replyObj.f1[2];
            document.getElementById("alg4_f1").innerText = replyObj.f1[3];
            document.getElementById("alg5_f1").innerText = replyObj.f1[4];
        }
    }

    http.send();

    // for debug purposes until the server communication is implemented
    //var placeholder_name = "qaoweifj";
    //var placeholder_f1 = "75.43%";
    //document.getElementById("alg1_name").innerText = placeholder_name;
    //document.getElementById("alg1_f1").innerText = placeholder_f1;
}

// todo get actual values from ml.py
function getTopFiveWords() {
    var url = "http://localhost:8080"
    var endpoint = "/getWords"

    var http = new XMLHttpRequest();

    http.open("GET", url + endpoint, true);

    http.onreadystatechange = function () {
        var DONE = 4;       // 4 means that the request is done
        var OK = 200;       // 200 means a successful return

        if (http.readyState == DONE && http.status == OK && http.responseText) {
            // JSON string
            replyString = http.responseText;

            // JSON -> JS object
            replyObj = JSON.parse(replyString);

            // put the algorithm names in their ranked order
            document.getElementById("top1").innerText = replyObj.words[0];
            document.getElementById("top2").innerText = replyObj.words[1];
            document.getElementById("top3").innerText = replyObj.words[2];
            document.getElementById("top4").innerText = replyObj.words[3];
            document.getElementById("top5").innerText = replyObj.words[4];
        }
    }
    http.send();
}

// called on index.html load: gets the top 5 algorithms and the top 5 words from server.py
function initializeIndex() {
    getTopFiveAlgorithms();
    getTopFiveWords();
}

// when the Clear button is pressed, clear the message textarea
function clearIndex() {
    document.getElementById("message").value = "";
}

function loadGraphs(){
    var myChart = Highcharts.chart('other_visualizations', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });
}