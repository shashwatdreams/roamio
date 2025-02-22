from flask import Flask, render_template
from flask_cors import CORS
import os

app = Flask(
    __name__,
    template_folder="templates", 
    static_folder="static"      
)

CORS(app, resources={r"/api/*": {"origins": "*"}})

from backend.app.routes.crowd_reporting import crowd_reporting_bp
app.register_blueprint(crowd_reporting_bp, url_prefix="/api/crowd")

@app.route("/")
def home():
    try:
        return render_template("index.html")
    except Exception as e:
        return f"Error serving index.html: {e}", 500

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/report")
def report():
    return render_template("report.html")

@app.route("/map")
def map_view():
    return render_template("map.html")

@app.route('/predict')
def predict():
    return render_template('predict.html')

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)