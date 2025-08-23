from typing import cast, TYPE_CHECKING
import traceback

from flask import request, jsonify
from flask import current_app as flask_current_app

from . import logger, session_routes
from ..app_types import MyApp
if TYPE_CHECKING:
    from ..core.managers.sorting_column import InvalidColumnError


current_app: MyApp = cast(MyApp, flask_current_app)

@session_routes.get('/sorting-column')
def get_sorting_column():
    """ Get the current sorting column from the session. """
    logger.info("Fetching sorting column")
    try:
        sorting_column = current_app.sorting_column_manager.get()
        return jsonify({"sorting_column": sorting_column}), 200
    except Exception as e:
        logger.error(f"Error fetching sorting column: {e}")
        logger.debug(traceback.format_exc())
        return jsonify({"error": "Failed to fetch sorting column"}), 500

@session_routes.post('/sorting-column')
def set_sorting_column():
    """ Set the sorting column in the session. """
    logger.info("Setting sorting column")

    data = request.json
    if not data or "sorting_column" not in data:
        logger.error("Missing JSON payload")
        return jsonify({"error": "Missing JSON payload"}), 400

    column_name = data.get("sorting_column")
    if not column_name:
        logger.error("No sorting column name provided")
        return jsonify({"error": "No sorting column name provided"}), 400

    try:
        current_app.sorting_column_manager.set(column_name)
    except InvalidColumnError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Error setting sorting column: {e}")
        logger.debug(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500
    return jsonify({"sorting_column": column_name, "status": "success"}), 200

# TODO - Clear sorting column route