import logging
import os

from app.utils.tools.download_zip_from_blob_utils import download_from_blob
from app.utils.tools.remove_file_folder_utils import remove_file, remove_folder
from fastapi import HTTPException


def reload_index_file(index_File_Name: str):
    try:
        if os.path.exists(os.path.join("./indexes", index_File_Name.split(".zip")[0])):
            index_paths = ["./indexes/" + index_File_Name, "./indexes/" + index_File_Name.split(".zip")[0]]
            for path in index_paths:
                if os.path.exists(path):
                    if os.path.isfile(path):
                        remove_file(path)
                    elif os.path.isdir(path):
                        remove_folder(path)
                    else:
                        logging.warning(f"Unknown path type: {path}")
                else:
                    logging.warning(f"Path not found: {path}")
        download_from_blob(index_File_Name)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while reloading index files")
