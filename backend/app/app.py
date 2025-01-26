from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
import os

app = Flask(
    __name__,
    template_folder="templates",
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

@app.route("/static/<path:path>")
def serve_static_files(path):
    try:
        return send_from_directory(app.static_folder, path)
    except Exception as e:
        return f"Error serving {path}: {e}", 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
