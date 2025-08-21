from typing import cast

from flask import Response
from flask import current_app as flask_current_app

from . import logger, session_routes
from ..app_types import MyApp


current_app: MyApp = cast(MyApp, flask_current_app)

@session_routes.get('/logs')
def get_log():
    logger.info("Fetching session logs")
    try:
        logs = current_app.fc_service.get_logs()
        if logs is None:
            logger.error("No logs found")
            return "No logs available", 404
        return Response(logs, mimetype='text/plain')
    except Exception as e:
        logger.error(f"Failed to fetch logs: {e}")
        return "Internal server error", 500
