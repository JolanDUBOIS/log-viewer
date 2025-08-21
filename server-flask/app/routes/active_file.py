from typing import cast

from flask import request, jsonify
from flask import current_app as flask_current_app

from . import logger, session_routes
from ..app_types import MyApp


current_app: MyApp = cast(MyApp, flask_current_app)

@session_routes.get("/active-file")
def get_active_file():
    logger.info("Fetching active file")
    try:
        active_file = current_app.fc_service.get_active_file()
        return jsonify(active_file.to_dict() if active_file else None), 200
    except Exception as e:
        logger.error(f"Failed to fetch active file: {e}")
        return jsonify({"error": "Failed to fetch active file"}), 500


@session_routes.post("/active-file")
def set_active_file():
    logger.info("Setting active file")
    data = request.json
    if not data or "path" not in data:
        logger.error("No path provided to set active file")
        return jsonify({"error": "No path provided"}), 400

    try:
        file_record = current_app.fc_service.set_active_file(data)
        return jsonify(file_record.to_dict()), 200
    except ValueError as e:
        logger.warning(f"Failed to set active file: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Error setting active file: {e}")
        return jsonify({"error": "Internal server error"}), 500
