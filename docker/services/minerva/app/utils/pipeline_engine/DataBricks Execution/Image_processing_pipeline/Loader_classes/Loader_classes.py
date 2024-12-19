import logging
from io import BytesIO

import Loader_classes.base_class as base_class
import requests
from Loader_classes.ppt_preprocessing.image_preprocessing import (
    create_imageprocessing_folders,
    delete_imageprocessing_folders,
    download_ppt_convert_pdf,
    generate_images_ppt_and_upload,
)
from pptx import Presentation


class PdfLoader(base_class.Loader):
    extention = "pdf"

    def preprocess(self, file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
        pass

    def postprocess(self, document_id, app_id, temp_folder_path_preprocessing):
        pass

    def load(self, file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
        return True


class WordDocLoader(base_class.Loader):
    extention = "docx"

    def preprocess(self, file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
        pass

    def postprocess(self, document_id, app_id, temp_folder_path_preprocessing):
        pass

    def load(self, file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
        return True


class TextFileLoader(base_class.Loader):
    extention = "txt"

    def preprocess(self, file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
        pass

    def postprocess(self, document_id, app_id, temp_folder_path_preprocessing):
        pass

    def load(self, file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
        return True


class PPTFileLoader(base_class.Loader):
    extention = "pptx"

    def preprocess(self, file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
        create_imageprocessing_folders(document_id, app_id, temp_folder_path_preprocessing)
        temp_dir_path_pdf, flag_pdf_convert = download_ppt_convert_pdf(
            file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing
        )
        if flag_pdf_convert:
            return None
        else:
            return document_id

    def postprocess(self, document_id, app_id, temp_folder_path_preprocessing):
        delete_imageprocessing_folders(document_id, app_id, temp_folder_path_preprocessing)

    def load(self, file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
        flag_processed_ppt = self.content(file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing)
        if flag_processed_ppt:
            return True
        else:
            return False

    def content(self, file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
        try:
            response = requests.get(file_path)
            ppt_object = BytesIO(response.content)
            ppt_obj = Presentation(ppt_object)
            total_slides = len(ppt_obj.slides)
            flag_processed_ppt = True
            if blob_Metadata is not None:
                generate_images_ppt_and_upload(
                    total_slides, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing
                )
        except Exception as e:
            logging.error(e)
            flag_processed_ppt = False
        try:
            self.postprocess(document_id, app_id, temp_folder_path_preprocessing)
        except Exception as e:
            logging.error(e)
        return flag_processed_ppt
