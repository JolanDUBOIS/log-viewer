from typing import cast

from flask import request, jsonify
from flask import current_app as flask_current_app

from . import logger, session_routes
from ..app_types import MyApp


current_app: MyApp = cast(MyApp, flask_current_app)

@session_routes.get('/active-file')
def get_active_file():
    logger.info("Fetching active file")
    try:
        active_file = current_app.file_session_service.get_active_file()
    except Exception as e:
        logger.error(f"Error fetching active file: {e}")
        return jsonify({"error": "Failed to fetch active file"}), 500
    return jsonify(active_file.to_dict() if active_file else None)

@session_routes.post('/active-file/select')
def select_active_file_from_history():
    logger.info("Selecting active file from history")

    data = request.json
    if not data:
        logger.error("Missing JSON payload")
        return jsonify({"error": "Missing JSON payload"}), 400

    try:
        file_record = current_app.file_session_service.select_file(file_data=data)
        if not file_record:
            logger.error("File record not found or selection failed")
            return jsonify({"error": "File selection failed"}), 400
    except Exception as e:
        logger.error(f"Error selecting file: {e}")
        return jsonify({"error": "Internal server error"}), 500

    return jsonify(file_record.to_dict()), 200

@session_routes.post('/active-file/open')
def open_active_file_from_path():
    logger.info("Setting active file by path")

    data = request.json
    if not data or "path" not in data:
        logger.error("No path provided for opening active file")
        return jsonify({"error": "No path provided"}), 400

    path = data["path"]

    try:
        file_record = current_app.file_session_service.open_file(path=path)
        if not file_record:
            logger.error("Failed to open file at provided path")
            return jsonify({"error": "Failed to open file"}), 400
    except Exception as e:
        logger.error(f"Error opening file: {e}")
        return jsonify({"error": "Internal server error"}), 500

    return jsonify(file_record.to_dict()), 200
