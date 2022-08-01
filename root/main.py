import flask

app = flask.Flask(__name__)

port=8123
host="0.0.0.0"

@app.route('/')
def index():
    return flask.render_template('index.html')

app.run(host=host, port=port, debug=True)