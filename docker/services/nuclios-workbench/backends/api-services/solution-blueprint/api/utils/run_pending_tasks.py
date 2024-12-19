import asyncio
import logging
import os
import struct
import tempfile
import time
from datetime import datetime, timedelta

import pytz
from api.configs.settings import get_app_settings
from api.constants.execution_environment.variables import SolutionBlueprintShareName
from infra_manager.core.cloud.azure.fileshare_service import FileShareService

settings = get_app_settings()


# Function to generate a secure random integer in a given range
def secure_random_integer(minimum, maximum):
    range_size = maximum - minimum + 1
    while True:
        random_bytes = os.urandom(4)
        random_integer = struct.unpack("I", random_bytes)[0]
        if random_integer < (2**32 - (2**32 % range_size)):
            return minimum + (random_integer % range_size)


async def lock_check():
    random_number = secure_random_integer(1, 100)
    logging.info("Running pending tasks after " + str(random_number) + " seconds")
    await asyncio.sleep(random_number)
    # This function is used to check if the lock is enabled
    temp_dir = os.path.join(tempfile.gettempdir(), "dee_lock.txt")
    logging.info(temp_dir)
    if os.path.exists(temp_dir):
        with open(temp_dir, "r") as f:
            lock_time = f.read()
        if time.time() - float(lock_time) < 300:
            return True
        else:
            os.remove(temp_dir)
            with open(temp_dir, "w") as f:
                f.write(str(time.time()))
            return False
    else:
        with open(temp_dir, "w") as f:
            f.write(str(time.time()))
        return False


async def delete_expired_zip_files(blueprint):
    file_share_service = FileShareService(settings.AZURE_FILE_SHARE_CONNECTION_STRING, None, None)
    try:
        response = await file_share_service.delete_directory_tree_from_share(
            share_name=SolutionBlueprintShareName.GOLDEN_SHARENAME.value, directory_path=f"temp/{blueprint}"
        )
        if response["status"] == "failed":
            logging.info(f"Failed to delete zip file for blueprint name: {blueprint}")
        else:
            logging.info(f"Deleted zip file for blueprint name: {blueprint}")
    except Exception as e:
        logging.exception(f"Failed to delete zip file for blueprint name {blueprint}: {e}")


async def handle_expired_zip_files():
    logging.info("Startup process to handle expired zip files is initiated.")

    utc_now = datetime.now(pytz.utc)
    timezone = pytz.timezone("Asia/Kolkata")
    local_time = utc_now.astimezone(timezone)
    datetime_validity = (local_time - timedelta(days=1)).strftime("%Y%m%d%H%M%S")
    file_share_service = FileShareService(settings.AZURE_FILE_SHARE_CONNECTION_STRING, None, None)

    try:
        blueprints = file_share_service.get_available_directories_in_specific_path(
            share_name=SolutionBlueprintShareName.GOLDEN_SHARENAME.value,
            directory_path="temp/",
        )

        for blueprint in blueprints["data"]:
            if blueprint["name"].split(".")[-1] == "zip":
                if "".join(blueprint["name"].split(".")[0].split("_")[-2:]) < datetime_validity:
                    await delete_expired_zip_files(blueprint["name"])
        logging.info("Startup process to handle expired zip files is completed successfully.")
    except Exception as e:
        logging.exception(f"Handle expired zip files failed due to {e}.")


async def init():
    # This function is used to run all pending tasks
    # It is called when the application starts
    # It is called in the lifespan context manager
    await asyncio.sleep(3)
    if await lock_check():
        logging.info("Lock is enabled, exiting")
        return
    await handle_expired_zip_files()
