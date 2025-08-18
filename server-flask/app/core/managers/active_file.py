from pathlib import Path

from . import logger
from .history import HistoryManager
from ..state import SessionState
from ..models import FileRecord


class ActiveFileManager:
    """ TODO """

    def __init__(self, session_state: SessionState, history_manager: HistoryManager):
        self.session = session_state
        self.history_manager = history_manager

    def get(self) -> FileRecord | None:
        """ Returns the currently active file in the session. """
        logger.info("Getting active file from session")
        return self.session.active_file

    def set(self, file_record: FileRecord) -> None:
        """ Sets the currently active file in the session. """
        logger.info(f"Setting active file: {file_record.path}")
        file_record.update_read_at()
        self.session.active_file = file_record
        self.history_manager.add(file_record)

    def set_by_path(self, path: Path | str) -> None:
        """ Sets the currently active file in the session by its path. """
        file_record = FileRecord(path=Path(path))
        self.set(file_record)

    def clear(self) -> None:
        """ Clears the currently active file in the session. """
        logger.info("Clearing active file from session")
        self.session.active_file = None
