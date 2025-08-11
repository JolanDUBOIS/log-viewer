from pathlib import Path

from . import logger
from ..managers import ActiveFileManager
from ..models import FileRecord


class FileSessionService:
    """ Service for managing file sessions, including active file management. """

    def __init__(self, active_file_manager: ActiveFileManager):
        self._active_file_manager = active_file_manager

    def get_active_file(self) -> FileRecord | None:
        return self._active_file_manager.get()

    def select_file(self, file_data: dict) -> FileRecord:
        """ Select a file from history or elsewhere using file data dict. """
        try:
            file_record = FileRecord.from_dict(file_data)
        except Exception as e:
            logger.error(f"Failed to create FileRecord from data: {e}")
            raise ValueError("Invalid file data provided.")
        self._active_file_manager.set(file_record)
        return file_record

    def open_file(self, path: str | Path) -> FileRecord:
        """ Open a file by its path, setting it as active and updating history. """
        self._active_file_manager.set_by_path(path)
        return self.get_active_file()
