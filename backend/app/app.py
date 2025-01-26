from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Database connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "roamio")
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
crowd_collection = db["crowd_reports"]

# Route: Get crowd reports from the last 30 minutes
@app.route("/api/crowd", methods=["GET"])
def get_crowd_reports():
    try:
        # Define the time window for recent reports
        time_window = int(request.args.get("minutes", 30))
        time_limit = datetime.utcnow() - timedelta(minutes=time_window)

        # Query the database for reports
        reports = list(crowd_collection.find(
            {"time": {"$gte": time_limit}},
            {"_id": 0, "station": 1, "crowd_level": 1, "time": 1}
        ))

        return jsonify(reports), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route: Submit a crowd report
@app.route("/api/crowd/report_crowd", methods=["POST"])
def report_crowd():
    try:
        data = request.json
        station = data.get("station")
        crowd_level = data.get("crowd_level")

        # Validate input
        if not station or not isinstance(crowd_level, (int, float)):
            return jsonify({"error": "Invalid input"}), 400

        # Save report to the database
        crowd_collection.insert_one({
            "station": station,
            "time": datetime.utcnow(),
            "crowd_level": crowd_level,
            "train_id": data.get("train_id"),
            "additional_info": data.get("additional_info"),
        })

        return jsonify({"message": "Report submitted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Home route
@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Crowd Reporting API"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))