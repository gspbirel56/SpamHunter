
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
            document.getElementById("alg1_name").innerText = replyObj.name[0];
            document.getElementById("alg2_name").innerText = replyObj.name[1];
            document.getElementById("alg3_name").innerText = replyObj.name[2];
            document.getElementById("alg4_name").innerText = replyObj.name[3];
            document.getElementById("alg5_name").innerText = replyObj.name[4];

            // put the algorithms' F1 scores in their ranked order
            document.getElementById("alg1_f1").innerText = replyObj.f1[0];
            document.getElementById("alg2_f1").innerText = replyObj.f1[1];
            document.getElementById("alg3_f1").innerText = replyObj.f1[2];
            document.getElementById("alg4_f1").innerText = replyObj.f1[3];
            document.getElementById("alg5_f1").innerText = replyObj.f1[4];
        }
        else {
            console.log("Error getting ranked algorithms/F1 scores from the backend server. (Is it running?)");
        }
    }

    // for debug purposes until the server communication is implemented
    //var placeholder_name = "qaoweifj";
    //var placeholder_f1 = "75.43%";
    //document.getElementById("alg1_name").innerText = placeholder_name;
    //document.getElementById("alg1_f1").innerText = placeholder_f1;
}

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
            document.getElementById("alg1_name").innerText = replyObj.name[0];
            document.getElementById("alg2_name").innerText = replyObj.name[1];
            document.getElementById("alg3_name").innerText = replyObj.name[2];
            document.getElementById("alg4_name").innerText = replyObj.name[3];
            document.getElementById("alg5_name").innerText = replyObj.name[4];

            // put the algorithms' F1 scores in their ranked order
            document.getElementById("alg1_f1").innerText = replyObj.f1[0];
            document.getElementById("alg2_f1").innerText = replyObj.f1[1];
            document.getElementById("alg3_f1").innerText = replyObj.f1[2];
            document.getElementById("alg4_f1").innerText = replyObj.f1[3];
            document.getElementById("alg5_f1").innerText = replyObj.f1[4];
        }
        else {
            console.log("Error getting ranked algorithms/F1 scores from the backend server. (Is it running?)");
        }
    }
}

function initializeIndex() {
    getTopFiveAlgorithms();
    getTopFiveWords();
}

function clearIndex() {
    document.getElementById("message").value = "";
}