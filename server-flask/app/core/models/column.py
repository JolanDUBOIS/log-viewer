from dataclasses import dataclass

from . import logger
from .filters import Filter


VALID_TYPES = {"text", "number", "datetime", "category"}

@dataclass
class Column:
    name: str
    alias: str | None = None
    visible: bool = True
    type: str = "text"
    filter: Filter | None = None

    def __post_init__(self):
        self.alias = self.alias or self.name
        self._validate_alias()
        self._validate_type()
        self._validate_filter()
        logger.debug(f"Column created: {self}")

    def _validate_alias(self):
        """ Validate the alias for the column. """
        if not self.alias or len(self.alias) > 100:
            logger.error(f"Invalid alias: '{self.alias}'. Must be non-empty and less than 100 characters.")
            raise ValueError(f"Invalid alias: '{self.alias}'. Must be non-empty and less than 100 characters.")

    def _validate_type(self):
        """ Validate the type of the column. """
        if self.type not in VALID_TYPES:
            logger.error(f"Invalid column type: {self.type}. Must be one of {VALID_TYPES}.")
            raise ValueError(f"Invalid column type: {self.type}. Must be one of {VALID_TYPES}.")

    def _validate_filter(self):
        """ Validate the filter type against the column type. """
        if self.filter is not None and self.type != self.filter._type:
            logger.error(f"Column type '{self.type}' does not match filter type '{self.filter._type}' if a filter is set.")
            raise ValueError(f"Column type '{self.type}' does not match filter type '{self.filter._type}' if a filter is set.")

    def update_alias(self, new_alias: str):
        """ Update the alias for the column. """
        self.alias = new_alias
        self._validate_alias()
        logger.debug(f"Alias for column '{self.name}' set to '{self.alias}'.")

    def update_type(self, new_type: str):
        """ Update the column type. """
        self.type = new_type
        self._validate_type()
        logger.debug(f"Column type for '{self.name}' updated to '{self.type}'.")
        self.update_filter(None)

    def update_filter(self, new_filter: Filter | None = None):
        """ Update the filter for the column. """
        self.filter = new_filter
        self._validate_filter()
        logger.debug(f"Filter for column '{self.name}' updated to '{self.filter}'.")

    def update_visibility(self, visible: bool):
        """ Update the visibility of the column. """
        self.visible = visible
        logger.debug(f"Visibility for column '{self.name}' set to {self.visible}.")

    def __repr__(self):
        return (f"Column(name={self.name}, alias={self.alias}, visible={self.visible}, "
                f"type={self.type}, filter={self.filter})")

    def to_dict(self) -> dict:
        """ Convert the column to a dictionary representation. """
        return {
            "name": self.name,
            "alias": self.alias,
            "visible": self.visible,
            "type": self.type,
            "filter": self.filter.to_dict() if self.filter else None
        }

    def to_config(self) -> dict:
        """ Convert the column to a configuration dictionary representation (excluding filter). """
        return {
            "name": self.name,
            "alias": self.alias,
            "visible": self.visible,
            "type": self.type
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Column':
        """ Create a Column instance from a dictionary representation. """
        return cls(
            name=data["name"],
            alias=data.get("alias"),
            visible=data.get("visible", True),
            type=data.get("type", "text"),
            filter=Filter.from_dict(data["filter"]) if data.get("filter") else None
        )
