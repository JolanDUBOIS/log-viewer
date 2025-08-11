import logging.config
from pathlib import Path

import yaml
from pythonjsonlogger import jsonlogger

from app import create_app


def setup_logging(config_file):
    with open(config_file, 'r') as f:
        config = yaml.safe_load(f.read())
        logging.config.dictConfig(config)

logging_config_path = Path(__file__).parent / 'config' / 'logging.yml'

if __name__ == "__main__":
    # Set up logging configuration
    setup_logging(logging_config_path)

    # Create Flask app and run it
    app = create_app()
    app.run(host='127.0.0.1', port=5000, debug=True)
