
// todo fix this to actually send the message data
function getPrediction() {

    var data = JSON.stringify({
        "message": "Hi"
      });
      
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      });
      
      xhr.open("GET", "http://localhost:8080/predict");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("User-Agent", "PostmanRuntime/7.19.0");
      xhr.setRequestHeader("Accept", "*/*");
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.setRequestHeader("Postman-Token", "25701512-a7b7-46d3-b614-d82adfe63972,89b19c6f-e712-4c75-9485-f81c5d2b9d3c");
      xhr.setRequestHeader("Host", "localhost:8080");
      xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
      xhr.setRequestHeader("Content-Length", "20");
      xhr.setRequestHeader("Connection", "keep-alive");
      xhr.setRequestHeader("cache-control", "no-cache");
      
      xhr.send(data);

    /*
    var url = "http://localhost:8080";
    var endpoint = "/predict";

    var http = new XMLHttpRequest();
    var data = JSON.stringify({
        "message": document.getElementById("message").value
    });

    http.open("GET", url + endpoint, true);

    http.onreadystatechange = function() {
        var DONE = 4;       // 4 means that the request is done
        var OK = 200;       // 200 means a successful return
        if (http.readyState == DONE && http.status == OK && http.responseText) {
            // JSON string
            replyString = http.responseText;

            // JSON -> JS obj
            replyObj = JSON.parse(replyString);

            // change the prediction label
            document.getElementById("prediction").innerText = replyObj.prediction;  // signifies that we need a string called prediction from the backend
        }
    }
    http.send(data);
    */
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
    var replyObj

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

            loadAlgGraph(replyObj)
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
            
            console.log(replyObj)
            loadWordGraph(replyObj);
        }
    }
    http.send();
}

// called on index.html load: gets the top 5 algorithms and the top 5 words from server.py
function initializeIndex() {
    getTopFiveAlgorithms();
    getTopFiveWords();
    //loadGraphs(topAlgs);
}

// when the Clear button is pressed, clear the message textarea
function clearIndex() {
    document.getElementById("message").value = "";
}

function loadAlgGraph(topAlgs){

    var algChart = Highcharts.chart('top_algorithms', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Top Algorithms'
        },
        xAxis: {
            categories: [topAlgs.name[0], topAlgs.name[1], topAlgs.name[2], topAlgs.name[3], topAlgs.name[4]]
        },
        yAxis: {
            title: {
                text: 'F1 Scores'
            }
        },
        series: [{
            name: 'Run1',
            data: [parseInt(topAlgs.f1[0]), parseInt(topAlgs.f1[1]), parseInt(topAlgs.f1[2]), parseInt(topAlgs.f1[3]), parseInt(topAlgs.f1[4])]
        },
        {
            name: 'Run2',
            data: [parseInt(topAlgs.f1[4]), parseInt(topAlgs.f1[3]), parseInt(topAlgs.f1[2]), parseInt(topAlgs.f1[1]), parseInt(topAlgs.f1[0])]
        }]
    });
}

function loadWordGraph(topWords){

    Highcharts.chart('top_words', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Top Words'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Chance of spam',
            colorByPoint: true,
            data: [{
                name: topWords.words[0],
                y: 60.0,
                sliced: true,
                selected: true
            }, {
                name: topWords.words[1],
                y: 20.0
            }, {
                name: topWords.words[2],
                y: 10.0
            }, {
                name: topWords.words[3],
                y: 5.0
            }, {
                name: topWords.words[4],
                y: 5.0
            }]
        }]
    });
}