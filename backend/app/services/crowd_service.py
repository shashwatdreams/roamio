from ..models.crowd import crowd_collection
from datetime import datetime, timedelta

def get_recent_crowd_reports(station, time_window=60):

    time_limit = datetime.now() - timedelta(minutes=time_window)
    
    reports = crowd_collection.find({
        "station": station,
        "time": {"$gte": time_limit}
    })
    
    return list(reports)

def calculate_average_crowd_level(station, time_window=60):

    reports = get_recent_crowd_reports(station, time_window)
    if not reports:
        return None
    
    total_crowd = sum(report["crowd_level"] for report in reports)
    average_crowd = total_crowd / len(reports)
    
    return average_crowd