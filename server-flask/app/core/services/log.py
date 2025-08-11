from pathlib import Path

from . import logger
from ..managers import ActiveFileManager


class LogService:
    def __init__(self, active_file_manager: ActiveFileManager):
        self.active_file_manager = active_file_manager
        self.cache = None

    def read_logs(self) -> str:
        """ Reads the raw logs from the currently active file. """
        active_file = self.active_file_manager.get()
        if not active_file:
            logger.error("No active file set")
            raise ValueError("No active file set")

        file_path = active_file.path

        # Objective is to cache the file content to avoid reading it multiple times
        # But logs can be appended, so we need to account for that
        # For now, we will read the file every time to ensure we get the latest content

        raw_logs = self._read_file_raw(file_path)
        if self.cache is None:
            self.cache = {}
        self.cache[str(file_path)] = raw_logs
        return raw_logs

    def _read_file_raw(self, file_path: Path) -> str:
        """ Reads the raw content of the file at the given path. """
        with file_path.open('r', encoding='utf-8') as f:
            return f.read()
