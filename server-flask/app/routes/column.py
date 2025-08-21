from typing import cast

from flask import request, jsonify
from flask import current_app as flask_current_app

from . import logger, session_routes
from ..app_types import MyApp
from ..core.models import Column


current_app: MyApp = cast(MyApp, flask_current_app)

@session_routes.get('/column')
def get_column():
    name = request.args.get('name')
    if not name:
        logger.error("No column name provided")
        return jsonify({"error": "No column name provided"}), 400
    logger.info(f"Fetching column: {name}")

    try:
        column = current_app.columns_manager.get(name)
    except Exception as e:
        logger.error(f"Error fetching column '{name}': {e}")
        return jsonify({"error": "Internal server error"}), 500

    if not column:
        logger.error(f"Column '{name}' not found")
        return jsonify({"error": "Column not found"}), 404

    return jsonify(column.to_dict())

@session_routes.post('/column')
def update_column():
    logger.info("Updating column configuration")
    data = request.json
    if not data or 'name' not in data:
        logger.error("Invalid column data provided")
        return jsonify({"error": "Invalid column data"}), 400

    try:
        column = Column.from_dict(data) # TODO - Create an add_from_dict method in ColumnsManager and remove the call to Column here
    except Exception as e:
        logger.error(f"Failed to create Column from data: {e}")
        return jsonify({"error": "Invalid column data provided"}), 400

    try:
        column = current_app.columns_manager.add(column)
    except Exception as e:
        logger.error(f"Error updating column: {e}")
        return jsonify({"error": "Failed to update column"}), 500

    return jsonify(column.to_dict()), 200

# Theses routes update both the configuration and the filters... Maybe we should separate them?