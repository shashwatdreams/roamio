from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

app.config["MONGO_URI"] = "mongodb://localhost:27017/roamio_db"
mongo = PyMongo(app)

@app.route('/')
def home():
    return 'Welcome to Roamio - Metro Crowd Prediction App!'

@app.route('/report_crowd', methods=['POST'])
def report_crowd():
    data = request.json  

    datareport = {
        "timestamp": data['timestamp'],
        "station": data['station'],
        "crowd_level": data['crowd_level'],
        "latitude": data['latitude'],
        "longitude": data['longitude']
    }
    
    mongo.db.crowd_reports.insert_one(datareport)
    return jsonify({"message": "Report submitted successfully"}), 200

@app.route('/get_predictions', methods=['GET'])
def get_predictions():

    predictions = [
        {"station": "Station A", "crowd_level": "Moderately Crowded"},
        {"station": "Station B", "crowd_level": "Very Crowded"}
    ]
    return jsonify(predictions)

if __name__ == "__main__":
    app.run(debug=True)