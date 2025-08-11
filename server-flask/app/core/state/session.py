from ..models import Column, FileRecord, FileRecordsCollection


class SessionState:
    """ TODO """

    def __init__(self):
        self.history: FileRecordsCollection = FileRecordsCollection()
        self.active_file: FileRecord | None = None
        self.columns: list[Column] = []
