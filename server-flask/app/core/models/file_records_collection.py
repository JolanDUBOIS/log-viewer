from __future__ import annotations
from pathlib import Path

from . import logger
from .file_record import FileRecord


class FileRecordsCollection:
    """ A collection of FileRecord instances, providing methods to manage and query them. """

    def __init__(self, records: list[FileRecord] | None = None):
        self.records: list[FileRecord] = records or []

    def __contains__(self, record: FileRecord) -> bool:
        """ Check if a FileRecord is in the collection. """
        return record in self.records

    def __len__(self) -> int:
        """ Get the number of FileRecords in the collection. """
        return len(self.records)

    def __iter__(self):
        """ Iterate over the FileRecords in the collection. """
        return iter(self.records)

    def __getitem__(self, index: int) -> FileRecord:
        """ Retrieve a FileRecord by its index. """
        return self.records[index]

    def get(self, path: str | Path) -> FileRecord | None:
        """ Get a FileRecord by its path. Returns None if not found. """
        path = Path(path).expanduser().resolve()
        for record in self.records:
            if record.path == path:
                return record
        return None

    def set(self, record: FileRecord):
        """ Add a FileRecord to the collection. If it already exists, it will be replaced. """
        if record in self.records:
            self.records.remove(record)  # remove by value, not index
            logger.debug(f"Replacing existing FileRecord with new one: {record}")
        self.records.append(record)
        logger.debug(f"Added FileRecord: {record}")

    def remove(self, record: FileRecord):
        """ Remove a FileRecord from the collection. """
        if record in self.records:
            self.records.remove(record)
            logger.debug(f"Removed FileRecord: {record}")
        else:
            logger.warning(f"Attempted to remove non-existing FileRecord: {record}")

    def sort(self, key='read_at', reverse=True) -> list[FileRecord]:
        """ Returns a sorted list of FileRecords based on a specified key. """
        return sorted(self.records, key=lambda r: getattr(r, key), reverse=reverse)

    def has(self, path: str | Path) -> bool:
        """ Check if a record with the given path exists in the collection. """
        try:
            path = Path(path).expanduser().resolve()
            return any(r.path == path for r in self.records)
        except Exception as e:
            logger.error(f"Error checking if path exists in collection: {e}")
            return False

    def to_list(self) -> list[dict]:
        """ Convert the collection of FileRecords to a list of dictionaries. """
        return [record.to_dict() for record in self.records]

    @classmethod
    def from_list(cls, records: list[dict]) -> FileRecordsCollection:
        """ Create a FileRecordsCollection from a list of dictionaries. """
        collection = cls()
        for record_data in records:
            record = FileRecord.from_dict(record_data)
            collection.set(record)
        return collection
