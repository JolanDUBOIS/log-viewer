from abc import ABC, abstractmethod
from dataclasses import dataclass, field

from . import logger


@dataclass
class Filter(ABC):
    _type: str = field(init=False)

    @abstractmethod
    def to_dict(self) -> dict:
        """ Convert the filter to a dictionary representation. """
        pass

    @classmethod
    def from_dict(cls, col_type: str, data: dict):
        """ Create a filter instance from a dictionary. """
        if col_type == "text":
            return TextFilter.from_dict(data)
        elif col_type == "number":
            return NumberFilter.from_dict(data)
        elif col_type == "datetime":
            return DateTimeFilter.from_dict(data)
        elif col_type == "category":
            return CategoryFilter.from_dict(data)
        else:
            logger.error(f"Unknown filter type: {col_type}")
            raise ValueError(f"Unknown filter type: {col_type}")

@dataclass
class TextFilter(Filter):
    _type: str = "text"
    include: str = ""
    exclude: str = ""

    def to_dict(self) -> dict:
        """ Convert the filter to a dictionary representation. """
        return {
            "type": self._type,
            "include": self.include,
            "exclude": self.exclude,
        }

    @classmethod
    def from_dict(cls, data: dict):
        """ Create a TextFilter instance from a dictionary. """
        return cls(
            include=data.get("include", ""),
            exclude=data.get("exclude", "")
        )

@dataclass
class NumberFilter(Filter):
    _type: str = "number"
    min: float | None = None
    max: float | None = None

    def to_dict(self) -> dict:
        """ Convert the filter to a dictionary representation. """
        return {
            "type": self._type,
            "min": self.min,
            "max": self.max,
        }

    @classmethod
    def from_dict(cls, data: dict):
        """ Create a NumberFilter instance from a dictionary. """
        return cls(
            min=data.get("min"),
            max=data.get("max")
        )

@dataclass
class DateTimeFilter(Filter):
    _type: str = "datetime"
    from_: str = ""
    until: str = ""

    def to_dict(self) -> dict:
        """ Convert the filter to a dictionary representation. """
        return {
            "type": self._type,
            "from": self.from_,
            "until": self.until,
        }

    @classmethod
    def from_dict(cls, data: dict):
        """ Create a DateTimeFilter instance from a dictionary. """
        return cls(
            from_=data.get("from"),
            until=data.get("until")
        )

@dataclass
class CategoryFilter(Filter):
    _type: str = "category"
    selected: set = field(default_factory=set)
    all: set = field(default_factory=set)

    def to_dict(self) -> dict:
        """ Convert the filter to a dictionary representation. """
        return {
            "type": self._type,
            "selected": list(self.selected),
            "all": list(self.all),
        }

    @classmethod
    def from_dict(cls, data: dict):
        """ Create a CategoryFilter instance from a dictionary. """
        return cls(
            selected=set(data.get("selected", [])),
            all=set(data.get("all", []))
        )
