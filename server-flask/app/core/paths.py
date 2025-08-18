from platformdirs import user_cache_dir, user_config_dir
from pathlib import Path

APP_NAME = "logviewer"
CACHE_DIR = Path(user_cache_dir(APP_NAME))
CONFIG_DIR = Path(user_config_dir(APP_NAME))

CACHE_DIR.mkdir(parents=True, exist_ok=True)
CONFIG_DIR.mkdir(parents=True, exist_ok=True)

COLUMNS_CONFIG_PATH = CACHE_DIR / "column_config.json"
LOG_HISTORY_PATH = CACHE_DIR / "log_history.json"
APP_CONFIG_PATH = CONFIG_DIR / "app_config.json"

## Dev note:
# ~/.cache/logviewer/column_config.json
# ~/.cache/logviewer/log_history.json
# ~/.config/logviewer/app_config.json
