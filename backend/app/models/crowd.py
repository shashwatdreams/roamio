from datetime import datetime
from backend.app.db import db

crowd_collection = db["crowd_reports"]

class CrowdReport:
    def __init__(self, station, time, crowd_level, train_id=None, additional_info=None):
        self.station = station
        self.time = time
        self.crowd_level = crowd_level
        self.train_id = train_id
        self.additional_info = additional_info

    def save(self):
        crowd_collection.insert_one({
            "station": self.station,
            "time": self.time,
            "crowd_level": self.crowd_level,
            "train_id": self.train_id,
            "additional_info": self.additional_info,
        })