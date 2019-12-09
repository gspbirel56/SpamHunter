

function getPrediction() {

    // send the request, get the prediction, etc. etc. etc...
    if (document.getElementById("message").value != '')
    {
        var data = JSON.stringify({
            "message": document.getElementById('message').value
        });
        console.log(data)

        var url = "http://localhost:8080"
        var endpoint = "/predict"
        var replyObj

        var http = new XMLHttpRequest();

        http.open("POST", url + endpoint, true);
        http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        http.onreadystatechange = function () {
            var DONE = 4;       // 4 means that the request is done
            var OK = 200;       // 200 means a successful return

            if (http.readyState == DONE && http.status == OK && http.responseText) {
                // JSON string
                replyString = http.responseText;

                // JSON -> JS object
                replyObj = JSON.parse(replyString);
                console.log(replyString)
                document.getElementById('prediction').innerHTML = replyObj.prediction;
                // make the hidden buttons visible
                document.getElementById("hiddenButtons").style.visibility = "visible";
                // enable the correctPrediction buttons ("This message is actually a ____!")
                document.getElementById("report_ham").disabled = false
                document.getElementById("report_spam").disabled = false
            }
        }

        http.send(data);
    }
}


function correctPrediction(correctLabel) {

    // send the request to the ml
    if (document.getElementById("message").value != '')
    {
        var data = JSON.stringify({
            "message": document.getElementById('message').value,
            label: correctLabel
        });
        console.log(data)

        var url = "http://localhost:8080"
        var endpoint = "/correctPrediction"
        var replyObj

        var http = new XMLHttpRequest();

        http.open("POST", url + endpoint, true);
        http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        http.onreadystatechange = function () {
            var DONE = 4;       // 4 means that the request is done
            var OK = 200;       // 200 means a successful return

            if (http.readyState == DONE && http.status == OK && http.responseText) {
                // JSON string
                replyString = http.responseText;

                // JSON -> JS object
                replyObj = JSON.parse(replyString);
                console.log(replyString)

                // disable the correctPrediction buttons ("This message is actually a ____!")
                document.getElementById("report_ham").disabled = true
                document.getElementById("report_spam").disabled = true
            }
        }

        http.send(data);
    }
}

// todo get these actual from ml.py
function getTopFiveAlgorithms() {
    var url = "http://localhost:8080"
    var endpoint = "/getAlgorithms"
    var replyObj

    var http = new XMLHttpRequest();

    http.open("GET", url + endpoint, true);
    http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    http.onreadystatechange = function () {
        var DONE = 4;       // 4 means that the request is done
        var OK = 200;       // 200 means a successful return

        if (http.readyState == DONE && http.status == OK && http.responseText) {
            // JSON string
            replyString = http.responseText;

            // JSON -> JS object
            replyObj = JSON.parse(replyString);
            console.log(replyObj)
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

            document.getElementById("alg1_acc").innerHTML = "<b>" + replyObj.accuracy[0] + "</b>";
            document.getElementById("alg2_acc").innerText = replyObj.accuracy[1];
            document.getElementById("alg3_acc").innerText = replyObj.accuracy[2];
            document.getElementById("alg4_acc").innerText = replyObj.accuracy[3];
            document.getElementById("alg5_acc").innerText = replyObj.accuracy[4];

            document.getElementById("alg1_precision").innerHTML = "<b>" + replyObj.precision[0] + "</b>";
            document.getElementById("alg2_precision").innerText = replyObj.precision[1];
            document.getElementById("alg3_precision").innerText = replyObj.precision[2];
            document.getElementById("alg4_precision").innerText = replyObj.precision[3];
            document.getElementById("alg5_precision").innerText = replyObj.precision[4];

            document.getElementById("alg1_recall").innerHTML = "<b>" + replyObj.recall[0] + "</b>";
            document.getElementById("alg2_recall").innerText = replyObj.recall[1];
            document.getElementById("alg3_recall").innerText = replyObj.recall[2];
            document.getElementById("alg4_recall").innerText = replyObj.recall[3];
            document.getElementById("alg5_recall").innerText = replyObj.recall[4];                        

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
    http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

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
}

// when the Clear button is pressed, clear the message textarea
function clearIndex() {
    document.getElementById("message").value = "";
    document.getElementById("hiddenButtons").style.visibility = "hidden";
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