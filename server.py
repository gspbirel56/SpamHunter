# os import
import os

# ml import
import ml

# Flask import
from flask import Flask, send_from_directory, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

#import json

# Endpoint to load index.html
@app.route('/')
@app.route('/index', methods=["GET"])
def display_greeting():
    #return contents of /web/index.html
    return send_from_directory('web', 'index.html')

# Endpoint to load js files
@app.route('/js/main.js', methods=["GET"])
def get_script():
    doctype = 'text/js'
    return send_from_directory('web/js', 'main.js', mimetype=doctype)

# Endpoint to return the prediction label to the frontend
@app.route('/predict', methods=["POST"])
def predict():
    json = request.get_json()
    #message = json.loads(request.get_json())
    print(json)
    message = json['message']
    #response = json.dumps({'prediction': 'spam'})
    response = {'prediction': ml.makePrediction(message)}
    return response

# TODO implement the partial fitting portion of the code here
# Endpoint to allow user to correct the prediction and partial fit with each algorithm
@app.route('/correctPrediction', methods=["POST"])
def correctPrediction():
    json = request.get_json()
    message = json["message"]
    label = json["label"]
    print(json)
    response = {'response': ml.partialFitNewData(message, label)}
    return response

# TODO make this get the actual ranking of algorithms
@app.route('/getAlgorithms', methods=["GET"])
def getTopAlgorithms():

    name = ["Perceptron", "Stochastic Gradient Descent", "Neural Network", "Decision Tree"]
    # accuracy, precision, recall, f1 = ml.getPerformanceMetrics()
    result = ml.getPerformanceMetrics()
    accuracy = result[0]
    precision = result[1]
    recall = result[2]
    f1 = result[3]

    val = {
        "name": name,
        "f1": f1,
        "precision": precision,
        "recall": recall,
        "accuracy": accuracy
    }

    return val

# TODO make this get the actual top feature words
@app.route('/getWords', methods=["GET"])
def getTopFiveWords():
    word = ml.topFive()
    
    val = {
        "words": word
    }
    return val


@app.route('/getConfusionMatrix', methods=["GET"])
def getConfusionMatrix():
    return ml.getConfusionMatrix();


# Run the app!
if __name__ == '__main__':
    app.run(port = 8080)
    ml.mlinit()