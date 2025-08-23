import json
from dataclasses import dataclass, field

from . import logger


@dataclass
class LogsData:
    lines: list[str] = field(default_factory=list)

    @property
    def columns(self) -> list[str]:
        # Assuming the first line contains the column names
        if not self.lines:
            logger.debug("No lines available to extract columns.")
            return []
        if not hasattr(self, '_columns'):
            first_row = json.loads(self.lines[0])
            self._columns = list(first_row.keys())
        return self._columns

    def as_string(self) -> str:
        return "".join(self.lines)

    def __len__(self) -> int:
        return len(self.lines)

    def __repr__(self):
        return f"LogsData(columns={self.columns}, count={len(self.lines)})"
