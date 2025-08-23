from __future__ import annotations
from pathlib import Path
from datetime import datetime
from dataclasses import dataclass

from . import logger


@dataclass
class FileRecord:
    path: Path
    alias: str | None = None
    read_at: str | None = None

    def __post_init__(self):
        self.path = Path(self.path).expanduser().resolve()
        self.alias = self.alias or self._alias_from_path()
        self.read_at = self.read_at or datetime.now().isoformat()
        self._check_read_at()
        logger.debug(f"FileRecord created: {self}")

    def __eq__(self, other):
        if not isinstance(other, FileRecord):
            return NotImplemented
        return self.path == other.path

    def __hash__(self):
        return hash(self.path)

    def _alias_from_path(self, n_parts: int = 4) -> str:
        """ Generate an alias from the file path. """
        try:
            return "/".join(self.path.parts[-n_parts:])
        except IndexError:
            return str(self.path)

    def _check_read_at(self):
        """ Ensure read_at is in ISO format. """
        if not self.read_at:
            logger.error("read_at cannot be None or empty.")
            raise ValueError("read_at cannot be None or empty.")
        try:
            datetime.fromisoformat(self.read_at)
        except ValueError:
            logger.error(f"Invalid read_at format: {self.read_at}")
            raise ValueError(f"Invalid read_at format: {self.read_at}")

    def update_read_at(self, when: datetime | None = None):
        """ Update the read_at timestamp to the current time or a specified time. """
        self.read_at = (when or datetime.now()).isoformat()
        logger.debug(f"Read at timestamp for file '{self.path}' updated to '{self.read_at}'.")

    def update_alias(self, new_alias: str):
        """ Update the alias for the file record. """
        if not new_alias or not new_alias.strip():
            logger.warning("Alias cannot be empty or whitespace only. Keeping the current alias.")
            return
        self.alias = new_alias
        logger.debug(f"Alias for file '{self.path}' set to '{self.alias}'.")

    def to_dict(self) -> dict:
        """ Convert the file record to a dictionary representation. """
        return {
            "path": str(self.path),
            "alias": self.alias,
            "read_at": self.read_at
        }

    @classmethod
    def from_dict(cls, data: dict) -> FileRecord:
        """ Create a FileRecord instance from a dictionary representation. """
        return cls(
            path=Path(data["path"]),
            alias=data.get("alias"),
            read_at=data.get("read_at")
        )

    def __repr__(self):
        return f"FileRecord(path={self.path}, alias={self.alias}, read_at={self.read_at})"
