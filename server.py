# os import
import os

# ml import
import ml

# Flask import
from flask import Flask, send_from_directory, request
app = Flask(__name__)

# Endpoint to load index.html
@app.route('/')
@app.route('/index')
def display_greeting():
    #return contents of /web/index.html
    return send_from_directory('web', 'index.html')

# Endpoint to load js files
@app.route('/js/main.js')
def get_script():
    doctype = 'text/js'
    return send_from_directory('web/js', 'main.js', mimetype=doctype)

# Return the prediction label to the frontend
@app.route('/predict')
def predict():
    json = request.get_json()
    message = json["message"]
    return message # just for debugging, for now... TODO implement the ml code here for prediction

# TODO hopefully it's obvious that these functions need to be implemented
@app.route('/correctPrediction')
def correctPrediction():
    return "Yes, dear"

@app.route('/getAlgorithms')
def getTopFiveAlgorithms():
    name = ["This (in use)", "Comes", "From", "The", "Server"]
    f1 = ["5", "4", "3", "2", "1"]
    val = {
        "name": name,
        "f1": f1
    }
    return val

@app.route('/getWords')
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