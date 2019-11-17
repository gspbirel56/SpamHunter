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

    }
}

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

            // put the algorithms' F1 scores in their ranked order
        }
    }
}