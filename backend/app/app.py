from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)

CORS(app)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/roamio")
DB_NAME = os.getenv("DB_NAME", "roamio")

mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client[DB_NAME]

from backend.app.routes.crowd_reporting import crowd_reporting_bp
app.register_blueprint(crowd_reporting_bp, url_prefix="/api/crowd")

@app.route("/")
def home():
    return {"message": "Welcome to the Roamio Backend API"}

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)