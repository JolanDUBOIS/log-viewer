from typing import cast

from flask import request, jsonify
from flask import current_app as flask_current_app

from . import logger, session_routes
from ..app_types import MyApp


current_app: MyApp = cast(MyApp, flask_current_app)

@session_routes.get('/history')
def get_history():
    logger.info("Fetching session history")
    try:
        history = current_app.history_manager.get()
        if not history:
            logger.error("History data not found or empty")
            return jsonify({"error": "No history available"}), 404
        return jsonify({"history": history.to_list()}), 200
    except Exception as e:
        logger.error(f"Failed to fetch history: {e}")
        return jsonify({"error": "Internal server error"}), 500

@session_routes.post('/history/add')
def add_to_history():
    logger.info("Adding file record to history")
    data = request.json
    if not data:
        logger.error("No JSON payload provided")
        return jsonify({"error": "Missing JSON payload"}), 400
    try:
        file_record = current_app.history_manager.add_from_dict(data)
        if not file_record:
            logger.error("Failed to add file record to history")
            return jsonify({"error": "Failed to add file record"}), 400
        return jsonify(file_record.to_dict()), 201
    except Exception as e:
        logger.error(f"Error adding file record to history: {e}")
        return jsonify({"error": "Internal server error"}), 500

@session_routes.delete('/history/remove')
def remove_from_history():
    logger.info("Removing file record from history")
    data = request.json
    if not data or "path" not in data:
        logger.error("No path provided in request")
        return jsonify({"error": "No path provided"}), 400
    path = data["path"]
    try:
        file_record = current_app.history_manager.remove_by_path(path)
        if file_record:
            return jsonify(file_record.to_dict()), 200
        else:
            logger.error(f"FileRecord with path {path} not found in history.")
            return jsonify({"error": "FileRecord not found"}), 404
    except Exception as e:
        logger.error(f"Error removing file record from history: {e}")
        return jsonify({"error": "Internal server error"}), 500
