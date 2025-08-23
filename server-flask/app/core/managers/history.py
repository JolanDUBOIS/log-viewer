import json
from pathlib import Path

from . import logger
from ..state import SessionState
from ..paths import LOG_HISTORY_PATH
from ..models import FileRecordsCollection, FileRecord


class HistoryManager:
    """ TODO """

    def __init__(self, session_state: SessionState, history_path: Path = LOG_HISTORY_PATH):
        self.session = session_state
        self.history_path = history_path

    def get(self) -> FileRecordsCollection:
        """ Returns the history of file records. """
        return self.session.history

    def get_by_path(self, path: str | Path) -> FileRecord | None:
        """ Returns a FileRecord from history by its path. """
        return self.session.history.get(path)

    def set(self, file_record: FileRecord) -> None:
        """ Adds or replaces a FileRecord in the history. """
        self.session.history.set(file_record)
        logger.info(f"Added FileRecord to history: {file_record}")
        self.save()

    def set_from_dict(self, file_data: dict) -> FileRecord:
        """ Adds or replaces a FileRecord in the history from a dictionary. """
        try:
            file_record = FileRecord(**file_data)
            self.set(file_record)
            return file_record
        except Exception as e:
            logger.error(f"Failed to create FileRecord from data: {e}")
            raise ValueError("Invalid file data provided.")

    def remove(self, file: FileRecord | str | Path) -> FileRecord | None:
        """ Removes a FileRecord from the history by object or path. """
        if isinstance(file, FileRecord):
            file_record = file
        else:
            file_record = self.session.history.get(file)

        if not file_record or not self.session.history.has(file_record):
            logger.warning(f"FileRecord {file} not found in history.")
            return None

        self.session.history.remove(file_record)
        logger.info(f"Removed FileRecord from history: {file_record}")
        self.save()
        return file_record

    def has(self, file: FileRecord | str | Path) -> bool:
        """ Checks if a FileRecord has in the history by object or path. """
        if isinstance(file, FileRecord):
            return self.session.history.has(file.path)
        return self.session.history.has(file)

    def load(self) -> None:
        """ Loads the history from the log history file. """
        if not self.history_path.exists():
            logger.info(f"Log history file {self.history_path} does not exist. Creating a new one.")
            self.history_path.write_text("[]")
            self.session.history = FileRecordsCollection()
            return
        try:
            with self.history_path.open('r', encoding='utf-8') as file:
                data = json.load(file)
                self.session.history = FileRecordsCollection.from_list(data)
                logger.info(f"History loaded from {self.history_path}")
        except Exception as e:
            logger.error(f"Error loading history from {self.history_path}: {e}")
            raise e

    def save(self) -> None:
        """ Saves the current history to the log history file. """
        serializable_data = self.session.history.to_list()
        try:
            with self.history_path.open('w', encoding='utf-8') as file:
                json.dump(serializable_data, file, indent=4)
                logger.info(f"History saved to {self.history_path}")
        except Exception as e:
            logger.error(f"Error saving history to {self.history_path}: {e}")
            raise e
