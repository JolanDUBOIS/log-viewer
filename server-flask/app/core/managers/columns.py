import json
from pathlib import Path

from . import logger
from ..state import SessionState
from ..models import Column
from ..paths import COLUMNS_CONFIG_PATH


class ColumnsManager:
    """ TODO """

    def __init__(self, session_state: SessionState, col_config_path: Path = COLUMNS_CONFIG_PATH):
        self.session = session_state
        self.col_config_path = col_config_path

    def get(self, name: str) -> Column | None:
        """ Returns a Column by name. """
        for column in self.session.columns:
            if column.name == name:
                return column
        logger.debug(f"Column with name {name} not found")
        return None

    def add(self, column: Column) -> Column:
        """ Adds a Column to the session state. If name already exists, it will be replaced. """
        self.session.columns = [col for col in self.session.columns if col.name != column.name]
        self.session.columns.append(column)
        return column

    def load(self) -> None:
        """ Loads the column configuration from the config file. """
        if not self.col_config_path.exists():
            logger.info(f"Column config file {self.col_config_path} does not exist. Creating a new one.")
            self.col_config_path.write_text("[]")
            self.session.columns = []
            return
        try:
            with self.col_config_path.open('r', encoding='utf-8') as file:
                data = file.read()
                self.session.columns = [Column(**col) for col in json.loads(data)]
                logger.info(f"Columns loaded from {self.col_config_path}")
        except Exception as e:
            logger.error(f"Error loading columns from {self.col_config_path}: {e}")
            raise e

    def save(self) -> None:
        """ Saves the current columns to the config file. """
        serializable_data = [col.to_config() for col in self.session.columns]
        try:
            with self.col_config_path.open('w', encoding='utf-8') as file:
                json.dump(serializable_data, file, indent=4)
                logger.info(f"Columns saved to {self.col_config_path}")
        except Exception as e:
            logger.error(f"Error saving columns to {self.col_config_path}: {e}")
            raise e
