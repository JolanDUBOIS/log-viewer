from pathlib import Path

from . import logger
from ..state import SessionState
from ..models import LogsData

class LogsManager:
    """Manages the currently loaded logs data in the session."""

    def __init__(self, session_state: SessionState):
        self.session = session_state

    def get(self) -> LogsData | None:
        """ Returns the currently loaded logs data in the session. """
        logger.info("Getting logs data from session")
        return self.session.logs

    def set(self, logs_data: LogsData) -> None:
        """ Sets the logs data in the session. """
        if not isinstance(logs_data, LogsData):
            logger.error("Invalid logs data provided, must be an instance of LogsData.")
            return
        logger.info("Setting logs data in session")
        self.session.logs = logs_data

    def clear(self) -> None:
        """ Clears the logs data in the session. """
        logger.info("Clearing logs data from session")
        self.session.logs = None

    def get_columns(self) -> list[str]:
        """ Returns the columns of the currently loaded logs data. """
        logs_data = self.get()
        if logs_data is None:
            logger.debug("No logs data available to extract columns.")
            return []
        return logs_data.columns

    def load_from_file(self, file_path: Path) -> None:
        """ Loads logs data from a file and sets it in the session. """
        if not file_path.exists():
            logger.error(f"File {file_path} does not exist.")
            return
        try:
            with file_path.open('r') as f:
                lines = f.readlines()
            logs_data = LogsData(lines=lines)
            self.set(logs_data)
            logger.info(f"Logs data loaded from {file_path}")
        except Exception as e:
            logger.error(f"Failed to load logs data from {file_path}: {e}")
            raise ValueError(f"Failed to load logs data from {file_path}: {e}")
