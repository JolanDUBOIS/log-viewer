import logging
from pathlib import Path

from flask import Flask

from .logging_setup import setup_logging
from .core.state import SessionState
from .core.services import FileCoordinatorService
from .core.managers import ActiveFileManager, HistoryManager, ColumnsManager, SortingColumnManager, LogsManager


logger = logging.getLogger(__name__)

def create_app(file: str = None) -> Flask:
    app = Flask(__name__)
    
    logging_config_path = Path(__file__).parent.parent / 'config' / 'logging.yml'
    setup_logging(logging_config_path)

    # Session state
    logger.debug("Initializing session state")
    session_state = SessionState()

    # Managers
    logger.debug("Setting up managers")
    history_manager = HistoryManager(session_state)
    active_file_manager = ActiveFileManager(session_state)
    columns_manager = ColumnsManager(session_state)
    sorting_column_manager = SortingColumnManager(session_state)
    logs_manager = LogsManager(session_state)

    # Services
    logger.debug("Creating FileCoordinatorService")
    fc_service = FileCoordinatorService(active_file_manager, history_manager, logs_manager)

    # Load initial state from file if provided
    if file:
        logger.debug(f"Loading initial state from file: {file}")
        fc_service.set_active_file({'path': file})

    # Register managers and services with the app context
    logger.debug("Registering managers and services with the app context")
    app.session_state = session_state
    app.history_manager = history_manager
    app.active_file_manager = active_file_manager
    app.columns_manager = columns_manager
    app.sorting_column_manager = sorting_column_manager
    app.fc_service = fc_service

    # Load initial state
    logger.debug("Loading initial state for managers")
    history_manager.load()
    columns_manager.load()

    # Register blueprints
    logger.debug("Registering blueprints")
    from .routes import session_routes
    app.register_blueprint(session_routes)

    return app
