from . import logger
from ..state import SessionState


class SortingColumnManager:
    """ TODO """

    def __init__(self, session_state: SessionState):
        self.session = session_state

    def get(self) -> str | None:
        """ Returns the currently set sorting column in the session. """
        logger.info("Getting sorting column from session")
        return self.session.sorting_column

    def set(self, column: str) -> None:
        """ Sets the sorting column in the session. """
        if not self._check_valid_column(column):
            logger.error(f"Invalid column '{column}', cannot set as sorting column.")
            return
        logger.info(f"Setting sorting column: {column}")
        self.session.sorting_column = column

    def clear(self):
        """ Clears the sorting column in the session. """
        logger.info("Clearing sorting column from session")
        self.session.sorting_column = None

    def _check_valid_column(self, column: str) -> bool:
        """ Check if the column exists in the session's columns. """
        if not column or not self.session.has_column(column):
            return False
        return True
