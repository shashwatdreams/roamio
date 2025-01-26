from flask import Flask, send_from_directory, abort
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  

FRONTEND_DIR = os.path.join(os.path.expanduser("~"), "repos/roamio/frontend")


from backend.app.routes.crowd_reporting import crowd_reporting_bp
app.register_blueprint(crowd_reporting_bp, url_prefix="/api/crowd")

@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def serve_static_files(path):
    try:
        return send_from_directory(FRONTEND_DIR, path)
    except Exception:
        return abort(404)  

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)  