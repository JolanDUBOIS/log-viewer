import logging
logger = logging.getLogger(__name__)

from flask import Flask

from .core.state import SessionState
from .core.services import FileSessionService, LogService
from .core.managers import ActiveFileManager, HistoryManager, ColumnsManager

def create_app(file: str = None) -> Flask:
    app = Flask(__name__)

    # Session state
    session_state = SessionState()

    # Managers
    history_manager = HistoryManager(session_state)
    active_file_manager = ActiveFileManager(session_state, history_manager)
    columns_manager = ColumnsManager(session_state)

    # Load initial state from file if provided
    if file:
        active_file_manager.set_by_path(file)

    # Services
    file_session_service = FileSessionService(active_file_manager)
    log_service = LogService(active_file_manager)

    # Register managers and services with the app context
    app.session_state = session_state
    app.history_manager = history_manager
    app.active_file_manager = active_file_manager
    app.columns_manager = columns_manager
    app.file_session_service = file_session_service
    app.log_service = log_service

    # Load initial state
    history_manager.load()
    columns_manager.load()

    from .routes import session_routes
    app.register_blueprint(session_routes)

    return app
