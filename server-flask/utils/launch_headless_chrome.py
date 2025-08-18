import subprocess
import os

from . import logger


def launch_chromeless_app(frontend_url: str):
    # WSL2: launch Windows Chrome in app mode
    chrome_path = r"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
    if not os.path.exists(chrome_path):
        logger.error("Chrome not found at: %s", chrome_path)
        return

    cmd = [chrome_path, f'--app={frontend_url}']

    try:
        subprocess.Popen(cmd)
        logger.info("Launching headless Chrome in app mode...")
    except Exception as e:
        logger.error("Failed to launch Chrome:", e)
