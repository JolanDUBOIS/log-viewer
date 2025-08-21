from dataclasses import dataclass, field

from . import logger
from .filters import Filter, TextFilter


VALID_TYPES = {"text", "number", "datetime", "category"}

@dataclass
class Column:
    name: str
    alias: str | None = None
    visible: bool = True
    type: str = "text"
    filter: Filter = field(default_factory=TextFilter)

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
        if self.type is None or not isinstance(self.type, str):
            logger.error(f"Invalid column type: {self.type}. Must be a non-empty string.")
            raise ValueError(f"Invalid column type: {self.type}. Must be a non-empty string.")
        if self.type not in VALID_TYPES:
            logger.error(f"Invalid column type: {self.type}. Must be one of {VALID_TYPES}.")
            raise ValueError(f"Invalid column type: {self.type}. Must be one of {VALID_TYPES}.")

    def _validate_filter(self):
        """ Validate the filter type against the column type. """
        if self.filter is None or not isinstance(self.filter, Filter):
            logger.error(f"Invalid filter: {self.filter}. Must be an instance of Filter.")
            raise ValueError(f"Invalid filter: {self.filter}. Must be an instance of Filter.")
        if self.type != self.filter._type:
            logger.error(f"Column type '{self.type}' does not match filter type '{self.filter._type}' if a filter is set.")
            raise ValueError(f"Column type '{self.type}' does not match filter type '{self.filter._type}' if a filter is set.")

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
        col_type = data.get("type", "text")
        return cls(
            name=data["name"],
            alias=data.get("alias"),
            visible=data.get("visible", True),
            type=col_type,
            filter=Filter.from_dict(col_type, data["filter"])
        )
