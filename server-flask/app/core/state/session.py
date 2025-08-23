from . import logger
from ..models import Column, FileRecord, FileRecordsCollection, LogsData


class SessionState:
    """ TODO """

    def __init__(self):
        self.history: FileRecordsCollection = FileRecordsCollection()
        self.active_file: FileRecord | None = None
        self.columns: list[Column] = []
        self.sorting_column: str | None = None
        self.logs: LogsData | None = None

    def has_column(self, col_name: str) -> bool:
        """ Return True if a column with this name exists. """
        logger.debug(f"Checking if column exists: '{col_name}' in {self.columns}.")
        return any(col.name == col_name for col in self.columns)
