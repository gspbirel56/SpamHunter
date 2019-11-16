# ml import
import ml

# Flask import
from flask import Flask, send_from_directory
app = Flask(__name__)


@app.route('/')
@app.route('/index')
def display_greeting():
    #return contents of /web/index.html
    return send_from_directory('web', 'index.html')


# Run the app!
if __name__ == '__main__':
    app.run(port = 8080)
    ml.preprocessing()
    ml.mlinit()