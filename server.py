# ml import
import ml

# Flask import
from flask import Flask
app = Flask(__name__)


@app.route('/')
@app.route('/index')
def display_greeting():
    return "Hey!"


# Run the app!
if __name__ == '__main__':
    app.run(port = 8080)
    ml.preprocessing()
    ml.mlinit()