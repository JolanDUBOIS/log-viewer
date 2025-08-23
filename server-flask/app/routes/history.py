from typing import cast
from flask import request, jsonify
from flask import current_app as flask_current_app
import traceback

from . import logger, session_routes
from ..app_types import MyApp


current_app: MyApp = cast(MyApp, flask_current_app)

@session_routes.get("/history")
def get_history():
    logger.info("Fetching session history")
    try:
        history_list = current_app.fc_service.get_history()
        logger.debug(f"History fetched: {history_list}")
        return jsonify({"history": history_list.to_list()}), 200
    except Exception as e:
        logger.error(f"Failed to fetch history: {e}")
        logger.debug(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

@session_routes.get("/history/<path:file_path>")
def get_history_item(file_path: str):
    try:
        items = current_app.fc_service.get_history(file_path)
        logger.debug(f"History item fetched for {file_path}: {items}")
        if not items:
            return jsonify({"error": "FileRecord not found"}), 404
        return jsonify(items[0].to_dict()), 200
    except Exception as e:
        logger.error(f"Failed to fetch history item {file_path}: {e}")
        logger.debug(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

@session_routes.put("/history/<path:file_path>")
def update_history_item(file_path: str):
    data = request.json
    if not data:
        return jsonify({"error": "Missing JSON payload"}), 400
    # TODO - Maybe check that data["path"] matches file_path
    data["path"] = file_path  # ensure the dict has the correct path
    try:
        updated = current_app.fc_service.update_history(data)
        if not updated:
            return jsonify({"error": "FileRecord not found"}), 404
        return jsonify(updated.to_dict()), 200
    except Exception as e:
        logger.error(f"Error updating file record {file_path}: {e}")
        logger.debug(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

@session_routes.delete("/history/<path:file_path>")
def delete_history_item(file_path: str):
    try:
        removed = current_app.fc_service.remove_from_history(file_path)
        if not removed:
            return jsonify({"error": "FileRecord not found"}), 404
        return jsonify(removed.to_dict()), 200
    except Exception as e:
        logger.error(f"Error removing file record {file_path}: {e}")
        logger.debug(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500
