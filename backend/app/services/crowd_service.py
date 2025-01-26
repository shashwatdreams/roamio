from backend.app.models.crowd import crowd_collection
from datetime import datetime, timedelta

def get_recent_crowd_reports(station, time_window=60):
    try:
        time_limit = datetime.utcnow() - timedelta(minutes=time_window)
        reports = crowd_collection.find({
            "station": station,
            "time": {"$gte": time_limit}
        })
        return list(reports)
    except Exception as e:
        print(f"Error fetching reports: {e}")
        return []

def calculate_average_crowd_level(station, time_window=60):
    reports = get_recent_crowd_reports(station, time_window)
    if not reports:
        return None

    try:
        total_crowd = sum(
            report.get("crowd_level", 0) for report in reports if isinstance(report.get("crowd_level"), (int, float))
        )
        return total_crowd / len(reports)
    except Exception as e:
        print(f"Error calculating average: {e}")
        return None