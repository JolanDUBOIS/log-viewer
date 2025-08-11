from dataclasses import dataclass, field


@dataclass
class TextFilter:
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

@dataclass
class NumberFilter:
    _type: str = "number"
    min: float = None
    max: float = None

    def to_dict(self) -> dict:
        """ Convert the filter to a dictionary representation. """
        return {
            "type": self._type,
            "min": self.min,
            "max": self.max,
        }

@dataclass
class DateTimeFilter:
    _type: str = "datetime"
    from_: str = None
    until: str = None

    def to_dict(self) -> dict:
        """ Convert the filter to a dictionary representation. """
        return {
            "type": self._type,
            "from": self.from_,
            "until": self.until,
        }

@dataclass
class CategoryFilter:
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

Filter = TextFilter | NumberFilter | DateTimeFilter | CategoryFilter