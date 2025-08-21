from pathlib import Path

from . import logger
from ..state import SessionState
from ..models import FileRecord


class ActiveFileManager:
    """ TODO """

    def __init__(self, session_state: SessionState):
        self.session = session_state

    def get(self) -> FileRecord | None:
        """ Returns the currently active file in the session. """
        logger.info("Getting active file from session")
        return self.session.active_file

    def set(self, file_record: FileRecord) -> FileRecord:
        """ Sets the currently active file in the session. """
        if not isinstance(file_record, FileRecord):
            logger.error("Invalid file record provided, must be an instance of FileRecord.")
            return

        logger.info(f"Setting active file: {file_record.path}")
        file_record.update_read_at()
        self.session.active_file = file_record
        return file_record

    def set_by_path(self, path: Path | str) -> FileRecord:
        """ Sets the currently active file in the session by its path. """
        file_record = FileRecord(path=Path(path))
        return self.set(file_record)

    def set_by_dict(self, file_data: dict) -> FileRecord:
        """ Sets the currently active file in the session using a file data dict. """
        try:
            file_record = FileRecord.from_dict(file_data)
        except Exception as e:
            logger.error(f"Failed to create FileRecord from data: {e}")
            raise ValueError("Invalid file data provided.")
        return self.set(file_record)

    def set_by_dict(self, file_data: dict) -> FileRecord:
        """ Sets the currently active file in the session using a file data dict. """

    def clear(self) -> None:
        """ Clears the currently active file in the session. """
        logger.info("Clearing active file from session")
        self.session.active_file = None
