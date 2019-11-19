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
    doctype = 'application/js'
    return send_from_directory('web/js', 'main.js', mimetype=doctype)

# Return the prediction label to the frontend
@app.route('/predict')
def predict():
    json = request.get_json()
    message = json["message"]
    return message # just for debugging, for now... TODO implement the ml code here for prediction


# Run the app!
if __name__ == '__main__':
    app.run(port = 8080)
    ml.preprocessing()
    ml.mlinit()