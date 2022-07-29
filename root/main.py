import flask, os

#os.chdir(__file__[:-7]+"/root/")
app = flask.Flask(__name__)

port=8080
host="localhost"

@app.route('/')
def index():
    return flask.render_template('index.html')

app.run(host=host, port=port, debug=True)