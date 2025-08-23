from __future__ import annotations
from typing import TYPE_CHECKING
from pathlib import Path

from ..models import FileRecordsCollection

from . import logger
if TYPE_CHECKING:
    from ..managers import ActiveFileManager, HistoryManager, LogsManager
    from ..models import FileRecord, LogsData


class FileCoordinatorService:
    """ Service to handle file coordination tasks such as setting and retrieving active files. """
    
    def __init__(self, active_file_manager: ActiveFileManager, history_manager: HistoryManager, logs_manager: LogsManager):
        self.active_file_manager = active_file_manager
        self.history_manager = history_manager
        self.logs_manager = logs_manager

    def get_active_file(self) -> FileRecord | None:
        """ Returns the currently active file record. """
        return self.active_file_manager.get()

    def get_history(self, path: str | Path | None = None) -> FileRecordsCollection | None:
        """ Returns the history of file records, optionally filtered by path. """
        if path:
            file_record = self.history_manager.get_by_path(path)
            return FileRecordsCollection([file_record]) if file_record else None
        return self.history_manager.get()

    def get_logs(self) -> LogsData | None:
        """ Returns the logs data for the currently active file. """
        return self.logs_manager.get()

    def set_active_file(self, file_data: dict) -> FileRecord:
        """ TODO """
        try:
            file_record = self.active_file_manager.set_by_dict(file_data)
            self.history_manager.set(file_record)
            self.logs_manager.load_from_file(file_record.path)
            return file_record
        except Exception as e:
            logger.error(f"Failed to set active file: {e}")
            raise ValueError("Invalid file data provided.")

    def clear_active_file(self) -> None:
        """ TODO """
        try:
            self.active_file_manager.clear()
            self.logs_manager.clear()
            logger.info("Cleared active file from session")
        except Exception as e:
            logger.error(f"Failed to clear active file: {e}")
            raise ValueError("Failed to clear active file.")

    def update_history(self, file_data: dict) -> FileRecord | None:
        """ TODO """
        try:
            if not self.history_manager.has(file_data.get('path')):
                logger.error(f"FileRecord with path {file_data.get('path')} does not exist in history. Cannot update.")
                return None
            return self.history_manager.set_from_dict(file_data)
        except Exception as e:
            logger.error(f"Failed to update history with file data: {e}")
            raise ValueError("Invalid file data provided.")

    def remove_from_history(self, file_path: str | Path) -> FileRecord | None:
        """ Removes a file record from history by its path. """
        try:
            file_record = self.history_manager.remove(file_path)
            if file_record:
                logger.info(f"Removed file record from history: {file_record.path}")
            return file_record
        except Exception as e:
            logger.error(f"Failed to remove file record from history: {e}")
            raise ValueError("Failed to remove file record from history.")
