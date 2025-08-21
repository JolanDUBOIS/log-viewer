import logging
logger = logging.getLogger(__name__)

from flask import Flask

from .core.state import SessionState
from .core.services import FileCoordinatorService
from .core.managers import ActiveFileManager, HistoryManager, ColumnsManager, SortingColumnManager, LogsManager


def create_app(file: str = None) -> Flask:
    app = Flask(__name__)

    # Session state
    session_state = SessionState()

    # Managers
    history_manager = HistoryManager(session_state)
    active_file_manager = ActiveFileManager(session_state, history_manager)
    columns_manager = ColumnsManager(session_state)
    sorting_column_manager = SortingColumnManager(session_state)
    logs_manager = LogsManager(session_state)

    # Load initial state from file if provided
    if file:
        active_file_manager.set_by_path(file)

    # Services
    fc_service = FileCoordinatorService(active_file_manager, history_manager, logs_manager)

    # Register managers and services with the app context
    app.session_state = session_state
    app.history_manager = history_manager
    app.active_file_manager = active_file_manager
    app.columns_manager = columns_manager
    app.sorting_column_manager = sorting_column_manager
    app.fc_service = fc_service

    # Load initial state
    history_manager.load()
    columns_manager.load()

    from .routes import session_routes
    app.register_blueprint(session_routes)

    return app
