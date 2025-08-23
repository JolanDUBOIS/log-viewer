import os
import argparse
import logging

from .app import create_app
from .utils import launch_chromeless_app


logger = logging.getLogger(__name__)

def parse_args():
    parser = argparse.ArgumentParser(description="Run the Flask backend.")
    parser.add_argument("--port", type=int, default=5000, help="Port to run the Flask app on")
    parser.add_argument("--app", action='store_true', help="Run the app in development mode with headless Chrome")
    parser.add_argument("--file", type=str, default=None, help="Path to the log file to be processed")
    return parser.parse_args()

if __name__ == "__main__":
    # Parse command line arguments
    args = parse_args()

    if args.app and os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        launch_chromeless_app("http://localhost:5173")

    # Create Flask app and run it
    app = create_app(file=args.file)
    logger.info(f"Starting Flask app on port {args.port}")
    app.run(host='127.0.0.1', port=args.port, debug=True)
