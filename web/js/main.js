
function getPrediction() {

    // send the request, get the prediction, etc. etc. etc...
    if (document.getElementById("message").value != '')
    {
        var data = JSON.stringify({
            "message": document.getElementById('message').value
        });

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

    // disable the correctPrediction buttons ("This message is actually a ____!")
    document.getElementById("report_ham").disabled = true
    document.getElementById("report_spam").disabled = true
    // send the label
    document.getElementById("prediction").innerText = "Retraining models. This may take a while!"

    // send the request to the ml
    if (document.getElementById("message").value != '')
    {
        var data = JSON.stringify({
            "message": document.getElementById('message').value,
            label: correctLabel
        });

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

                document.getElementById("prediction").innerText = replyObj.response

                // reinitialize the index: this will give us updated visualization statistics
                initializeIndex()
            }
        }

        
        // send the request
        http.send(data);
    }
}

// todo get these actual from ml.py
function getTopAlgorithms() {
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
            // put the algorithm names in their ranked order
            // document.getElementById("alg1_name").innerHTML = "<b>" + replyObj.name[0] + "</b>";
            document.getElementById("alg1_name").innerText = replyObj.name[0];
            document.getElementById("alg2_name").innerText = replyObj.name[1];
            document.getElementById("alg3_name").innerText = replyObj.name[2];
            document.getElementById("alg4_name").innerText = replyObj.name[3];

            // // put the algorithms' F1 scores in their ranked order
            // document.getElementById("alg1_f1").innerHTML = "<b>" + replyObj.f1[0] + "</b>";
            document.getElementById("alg1_f1").innerText = replyObj.f1[0];
            document.getElementById("alg2_f1").innerText = replyObj.f1[1];
            document.getElementById("alg3_f1").innerText = replyObj.f1[2];
            document.getElementById("alg4_f1").innerText = replyObj.f1[3];



            // document.getElementById("alg1_acc").innerHTML = "<b>" + replyObj.accuracy[0] + "</b>";
            document.getElementById("alg1_acc").innerText = replyObj.accuracy[0];
            document.getElementById("alg2_acc").innerText = replyObj.accuracy[1];
            document.getElementById("alg3_acc").innerText = replyObj.accuracy[2];
            document.getElementById("alg4_acc").innerText = replyObj.accuracy[3];

            // document.getElementById("alg1_precision").innerHTML = "<b>" + replyObj.precision[0] + "</b>";
            document.getElementById("alg1_precision").innerText = replyObj.precision[0];
            document.getElementById("alg2_precision").innerText = replyObj.precision[1];
            document.getElementById("alg3_precision").innerText = replyObj.precision[2];
            document.getElementById("alg4_precision").innerText = replyObj.precision[3];

            // document.getElementById("alg1_recall").innerHTML = "<b>" + replyObj.recall[0] + "</b>";
            document.getElementById("alg1_recall").innerText = replyObj.recall[0];
            document.getElementById("alg2_recall").innerText = replyObj.recall[1];
            document.getElementById("alg3_recall").innerText = replyObj.recall[2];
            document.getElementById("alg4_recall").innerText = replyObj.recall[3];                        

            $('#algsTable').DataTable();

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

            
            loadWordGraph(replyObj);
        }
    }
    http.send();
}

// called on index.html load: gets the top 5 algorithms and the top 5 words from server.py
function initializeIndex() {
    getTopAlgorithms();
    getTopFiveWords();
    getConfusionMatrices();
}

// when the Clear button is pressed, clear the message textarea
function clearIndex() {
    document.getElementById("message").value = "";
    document.getElementById("hiddenButtons").style.visibility = "hidden";
    document.getElementById("prediction").innerText = ""
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
            categories: [topAlgs.name[0], topAlgs.name[1], topAlgs.name[2], topAlgs.name[3]]
        },
        yAxis: {
            title: {
                text: 'F1 Scores'
            }
        },
        series: [{
            name: 'Run1',
            data: [topAlgs.f1[0], topAlgs.f1[1], topAlgs.f1[2], topAlgs.f1[3]]
        }
        //,
        // {
        //     name: 'Run2',
        //     data: [parseInt(topAlgs.f1[4]), parseInt(topAlgs.f1[3]), parseInt(topAlgs.f1[2]), parseInt(topAlgs.f1[1]), parseInt(topAlgs.f1[0])]
        // }
    ]
    });
}

function getConfusionMatrices() {
    var url = "http://localhost:8080"
    var endpoint = "/getConfusionMatrix"

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

            document.getElementById("alg1_con_name").innerText = 'Perceptron'
            document.getElementById('alg1_tn').innerText = replyObj["Perceptron"][0][0]
            document.getElementById('alg1_fp').innerText = replyObj["Perceptron"][0][1]
            document.getElementById('alg1_fn').innerText = replyObj["Perceptron"][1][0]
            document.getElementById('alg1_tp').innerText = replyObj["Perceptron"][1][1]

            document.getElementById("alg2_con_name").innerText = 'Stochastic Gradient Descent'
            document.getElementById('alg2_tn').innerText = replyObj["Stochastic Gradient Descent"][0][0]
            document.getElementById('alg2_fp').innerText = replyObj["Stochastic Gradient Descent"][0][1]
            document.getElementById('alg2_fn').innerText = replyObj["Stochastic Gradient Descent"][1][0]
            document.getElementById('alg2_tp').innerText = replyObj["Stochastic Gradient Descent"][1][1]

            document.getElementById("alg3_con_name").innerText = 'Neural Network'
            document.getElementById('alg3_tn').innerText = replyObj["Neural Network"][0][0]
            document.getElementById('alg3_fp').innerText = replyObj["Neural Network"][0][1]
            document.getElementById('alg3_fn').innerText = replyObj["Neural Network"][1][0]
            document.getElementById('alg3_tp').innerText = replyObj["Neural Network"][1][1]

            document.getElementById("alg4_con_name").innerText = 'Decision Tree'
            document.getElementById('alg4_tn').innerText = replyObj["Decision Tree"][0][0]
            document.getElementById('alg4_fp').innerText = replyObj["Decision Tree"][0][1]
            document.getElementById('alg4_fn').innerText = replyObj["Decision Tree"][1][0]
            document.getElementById('alg4_tp').innerText = replyObj["Decision Tree"][1][1]

            $('#confusion_table').DataTable()

            // document.getElementById("confusion_matrices").innerText = "Decision tree confusion matrix:\n" + replyObj["Decision Tree"] +
            // "\nNeural Network confusion matrix:\n" + replyObj["Neural Network"] +
            //  "\nPerceptron confusion matrix:\n" + replyObj["Perceptron"] +
            //  "\nStochastic gradient descent confusion matrix:\n" + replyObj["Stochastic Gradient Descent"]
        }
    }
    http.send();
}

function loadWordGraph(topWords){

    var data = []

    var i = 0
    var j = 100
    for (i; i < 25; i++){
        data[i] = {
            name: topWords.words[i],
            weight: j
        }
        j = j - 2
    }

    console.log(data)
    
    Highcharts.chart('top_words', {
        series: [{
            type: 'wordcloud',
            data: data,
            name: 'Rank',
            rotation: {
                from: 0,
                to: 90
            },
            spiral: 'rectangular',
            placementStrategy: 'center'
        }],
        title: {
            text: 'Top Words'
        }
    })
      
}