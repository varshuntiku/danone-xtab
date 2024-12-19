import os

from dotenv import load_dotenv
from infra_manager.core.cloud.azure.fileshare_service import FileShareService

load_dotenv()

try:
    share_service = FileShareService(
        os.environ.get("STORAGE_CONN_STRING"),
        os.environ.get("FILESHARE_NAME"),
        "",
    )
    print("Copying Directory with Files.")
    # Copying Directory with Files
    status = share_service.copy_directory(source_dir="base-exec", target_dir="exec-env/exec30")
    print(status)
    # Copying only mentioned Files from Directory
    print("Copying only mentioned Files from Directory.")
    status = share_service.copy_files(
        source_folder="fileshare-copy-test/fileshare-source",
        target_folder="fileshare-copy-test/fileshare-target",
        file_names=["config"],
    )
    print(status)
    # Creating New File and Writing Content
    print("Creating New File and Writing Content")
    status = share_service.create_file("checks", "fileshare-copy-test/fileshare-target", "txt", content="Writing data.")
    print(status)
except Exception as e:
    raise e
