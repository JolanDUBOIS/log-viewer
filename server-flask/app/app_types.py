from flask import Flask

from .core.state import SessionState
from .core.services import FileSessionService, LogService
from .core.managers import ActiveFileManager, HistoryManager, ColumnsManager


class MyApp(Flask):
    session_state: SessionState
    history_manager: HistoryManager
    active_file_manager: ActiveFileManager
    columns_manager: ColumnsManager
    file_session_service: FileSessionService
    log_service: LogService
