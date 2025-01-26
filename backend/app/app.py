from flask import Flask, render_template, send_from_directory, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime
import os

app = Flask(
    __name__,
    template_folder="templates",
)

CORS(app, resources={r"/api/*": {"origins": "*"}})

data = pd.read_csv('NYC_subway_traffic_2017-2021.csv')

# Preprocess the data
data['Datetime'] = pd.to_datetime(data['Datetime'], format='%m/%d/%Y %H:%M', errors='coerce')
data['Date'] = data['Datetime'].dt.date
data['Time'] = data['Datetime'].dt.time
data['Hour'] = data['Datetime'].dt.hour
data['Day_of_Week'] = data['Datetime'].dt.day_name()

aggregated_data = data.groupby(
    ['Stop Name', 'Line', 'Hour', 'Day_of_Week'], as_index=False
).agg({
    'Entries': 'mean',
    'Exits': 'mean'
}).rename(columns={
    'Entries': 'Avg_Entries',
    'Exits': 'Avg_Exits'
})

# Prediction function
def predict_subway_traffic(date_time, start_stop, end_stop):
    try:
        # Parse date & time
        dt = datetime.strptime(date_time, '%Y-%m-%d %H:%M')
        day_of_week = dt.strftime('%A')  # Get the day of the week
        hour = dt.hour                   # Get the hour

        # Filter data for the specific hour and day
        start_data = aggregated_data[
            (aggregated_data['Stop Name'] == start_stop) &
            (aggregated_data['Day_of_Week'] == day_of_week) &
            (aggregated_data['Hour'] == hour)
        ]

        end_data = aggregated_data[
            (aggregated_data['Stop Name'] == end_stop) &
            (aggregated_data['Day_of_Week'] == day_of_week) &
            (aggregated_data['Hour'] == hour)
        ]

        if start_data.empty:
            start_data = aggregated_data[
                (aggregated_data['Stop Name'] == start_stop) &
                (aggregated_data['Day_of_Week'] == day_of_week)
            ].mean(numeric_only=True)

        if end_data.empty:
            end_data = aggregated_data[
                (aggregated_data['Stop Name'] == end_stop) &
                (aggregated_data['Day_of_Week'] == day_of_week)
            ].mean(numeric_only=True)

        # Check if fallback data is valid
        if not start_data.empty and not end_data.empty:
            prediction = {
                "Start Stop": {
                    "Avg_Entries": start_data['Avg_Entries'] if 'Avg_Entries' in start_data else start_data['Entries'],
                    "Avg_Exits": start_data['Avg_Exits'] if 'Avg_Exits' in start_data else start_data['Exits']
                },
                "End Stop": {
                    "Avg_Entries": end_data['Avg_Entries'] if 'Avg_Entries' in end_data else end_data['Entries'],
                    "Avg_Exits": end_data['Avg_Exits'] if 'Avg_Exits' in end_data else end_data['Exits']
                }
            }
        else:
            prediction = {
                "Error": (
                    "Fallback data is also unavailable. This might indicate a data gap "
                    "for the selected stop names or day."
                )
            }
    except Exception as e:
        prediction = {
            "Error": f"An error occurred while processing the request: {e}"
        }

    return prediction

# Define routes
@app.route("/")
def home():
    try:
        return render_template("planning.html")
    except Exception as e:
        return f"Error serving planning.html: {e}", 500

@app.route("/static/<path:path>")
def serve_static_files(path):
    try:
        return send_from_directory(app.static_folder, path)
    except Exception as e:
        return f"Error serving {path}: {e}", 404

@app.route("/api/predict", methods=["POST"])
def predict_api():
    data = request.json
    date_time = data.get("date_time")
    start_stop = data.get("start_stop")
    end_stop = data.get("end_stop")

    prediction = predict_subway_traffic(date_time, start_stop, end_stop)
    return jsonify(prediction)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)