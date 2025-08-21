from flask import Flask

from .core.state import SessionState
from .core.services import FileSessionService, LogService, FileCoordinatorService
from .core.managers import ActiveFileManager, HistoryManager, ColumnsManager, SortingColumnManager


class MyApp(Flask):
    session_state: SessionState
    history_manager: HistoryManager
    sorting_column_manager: SortingColumnManager
    active_file_manager: ActiveFileManager
    columns_manager: ColumnsManager
    fc_service: FileCoordinatorService
