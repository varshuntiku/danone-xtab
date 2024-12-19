import errno
import logging
import os
import shutil


def remove_file(file_path):
    try:
        os.remove(file_path)
        logging.info(f"File removed: {file_path}")
    except OSError as e:
        if e.errno != errno.ENOENT:  # Ignore "File not found" error
            logging.error(f"Error removing file {file_path}: {e}")
            raise


def remove_folder(folder_path):
    try:
        shutil.rmtree(folder_path)
        logging.info(f"Folder removed: {folder_path}")
    except OSError as e:
        if e.errno != errno.ENOENT:  # Ignore "Folder not found" error
            logging.error(f"Error removing folder {folder_path}: {e}")
            raise
