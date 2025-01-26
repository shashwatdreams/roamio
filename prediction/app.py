import streamlit as st
import pandas as pd
from datetime import datetime

# Load the dataset
@st.cache_data
def load_data():
    chunks = []
    for chunk in pd.read_csv("subway_data.csv", chunksize=100000):  # Adjust chunksize as needed
        chunks.append(chunk)
    return pd.concat(chunks, ignore_index=True)


aggregated_data = load_data()

# Prediction function
def predict_subway_traffic(date_time, start_stop, end_stop):
    try:
        # parsing date & time
        dt = datetime.strptime(date_time, '%Y-%m-%d %H:%M')
        day_of_week = dt.strftime('%A')  # Get the day of the week
        hour = dt.hour  # Get the hour

        # the specific hour and day
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

        # checking if fallback data is valid
        if not start_data.empty and not end_data.empty:
            prediction = {
                "Start Stop": {
                    "Avg_Entries": start_data.get('Avg_Entries', 0),
                    "Avg_Exits": start_data.get('Avg_Exits', 0)
                },
                "End Stop": {
                    "Avg_Entries": end_data.get('Avg_Entries', 0),
                    "Avg_Exits": end_data.get('Avg_Exits', 0)
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

# Streamlit App
st.title("Subway Traffic Predictor")

st.write("Predict the average entries and exits for subway stops based on historical data.")

if aggregated_data.empty:
    st.stop()

date_time = st.text_input("Enter the date and time (YYYY-MM-DD HH:MM):")
start_stop = st.text_input("Enter the starting subway stop:")
end_stop = st.text_input("Enter the ending subway stop:")

if st.button("Predict Traffic"):
    if date_time and start_stop and end_stop:
        prediction = predict_subway_traffic(date_time, start_stop, end_stop)

        if "Error" in prediction:
            st.error(prediction["Error"])
        else:
            st.subheader("Prediction:")

            st.write(f"**Start Stop ({start_stop}):**")
            st.write(f"  - Average Entries: {prediction['Start Stop']['Avg_Entries']}")
            st.write(f"  - Average Exits: {prediction['Start Stop']['Avg_Exits']}")

            st.write(f"**End Stop ({end_stop}):**")
            st.write(f"  - Average Entries: {prediction['End Stop']['Avg_Entries']}")
            st.write(f"  - Average Exits: {prediction['End Stop']['Avg_Exits']}")
    else:
        st.warning("Please fill in all fields before predicting.")