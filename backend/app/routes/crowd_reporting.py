from flask import Blueprint, request, jsonify
from ..models.crowd import CrowdReport
from backend.app.db import db
from datetime import datetime

crowd_reporting_bp = Blueprint('crowd_reporting', __name__)

@crowd_reporting_bp.route('/report_crowd', methods=['POST'])
def report_crowd():
    try:
        data = request.get_json()
        
        station = data.get('station')
        crowd_level = data.get('crowd_level')
        
        if not station or not isinstance(crowd_level, (int, float)):
            return jsonify({"error": "Invalid input"}), 400
        
        train_id = data.get('train_id', None)
        additional_info = data.get('additional_info', None)
        time = datetime.now()

        report = CrowdReport(
            station=station,
            time=time,
            crowd_level=crowd_level,
            train_id=train_id,
            additional_info=additional_info
        )
        
        report.save()
        
        return jsonify({"message": "Crowd report submitted successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500