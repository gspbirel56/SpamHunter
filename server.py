# os import
import os

# ml import
import ml

# Flask import
from flask import Flask, send_from_directory, request
app = Flask(__name__)

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

# Return the prediction label to the frontend
@app.route('/predict', methods=["GET"])
def predict():
    json = request.get_json()
    print(json)
    message = json["message"]
    return message # just for debugging, for now... TODO integrate the code with ml.py to get a response

# TODO hopefully it's obvious that these functions need to be implemented
@app.route('/correctPrediction', methods=["POST"])
def correctPrediction():
    json = request.get_json()
    message = json["message"]
    label = json["label"]
    return label # just for debugging TODO integrate the code with ml.py to get a response

@app.route('/getAlgorithms', methods=["GET"])
def getTopFiveAlgorithms():
    name = ["This (in use)", "Comes", "From", "The", "Server"]
    f1 = ["5", "4", "3", "2", "1"]
    precision = ["1", "2", "3", "4", "5"]
    recall = ["1", "2", "3", "4", "5"]
    accuracy = ["1", "2", "3", "4", "5"]

    val = {
        "name": name,
        "f1": f1,
        "precision": precision,
        "recall": recall,
        "accuracy": accuracy
    }
    return val

@app.route('/getWords', methods=["GET"])
def getTopFiveWords():
    word = ["Larry", "Schultheis", "Larry", "Schultheis", "Larry"]
    val = {
        "words": word
    }
    return val


# Run the app!
if __name__ == '__main__':
    app.run(port = 8080)
    ml.preprocessing()
    ml.mlinit()