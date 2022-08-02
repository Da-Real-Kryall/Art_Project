import flask, os

app = flask.Flask(__name__)

port=8123
host="0.0.0.0"

@app.route('/')
def index():
    return flask.render_template('index.html')
# route for favicon.ico
@app.route('/favicon.ico')
def favicon():
    return flask.send_file(os.getcwd()+'/root/static/images/favicon.ico')

app.run(host=host, port=port, debug=True)