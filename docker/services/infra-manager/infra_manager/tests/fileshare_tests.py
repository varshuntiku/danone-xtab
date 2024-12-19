import os

from dotenv import load_dotenv
from infra_manager.core.cloud.azure.fileshare_service import FileShareService

load_dotenv()

# test file change
file_path = "train001/trainer_log.jsonl"

try:
    detector = FileShareService(
        os.environ.get("STORAGE_CONN_STRING"),
        os.environ.get("FILESHARE_NAME"),
        file_path,
    )

    for change in detector.watch_file_changes():
        print("Recieved Change", change)

except KeyboardInterrupt:
    detector.cancel_watching()
    print("Stopping watching file changes.")
