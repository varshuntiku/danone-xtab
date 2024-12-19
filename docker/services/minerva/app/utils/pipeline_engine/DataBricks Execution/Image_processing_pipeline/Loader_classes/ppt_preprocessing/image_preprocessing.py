import logging
import os
import shutil
import subprocess
from io import BytesIO

import requests
from azure.storage.blob import BlobServiceClient
from pptx import Presentation
from wand.color import Color  # noqa: F401
from wand.image import Image


def upload_to_blob(image_upload_list: list, container_name: str, blob_connection_url: str):
    connection_string = blob_connection_url
    container_name = container_name
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    for image_file_list in image_upload_list:
        databricks_image_path, Image_name = image_file_list
        blob_client = blob_service_client.get_blob_client(container_name, Image_name)
        if blob_client.exists():
            blob_client.delete_blob()
        with open(databricks_image_path, "rb") as image_file:
            blob_client.upload_blob(image_file)


def create_imageprocessing_folders(document_id, app_id, temp_folder_path_preprocessing):
    temp_dir_intermediate, temp_dir_intermediate_image = generate_imageprocessing_paths(
        document_id, app_id, temp_folder_path_preprocessing
    )
    if not os.path.exists(temp_dir_intermediate):
        os.mkdir(temp_dir_intermediate)
    if not os.path.exists(temp_dir_intermediate_image):
        os.mkdir(temp_dir_intermediate_image)


def generate_imageprocessing_paths(document_id, app_id, temp_folder_path_preprocessing):
    if temp_folder_path_preprocessing is not None:
        temp_dir = temp_folder_path_preprocessing
    else:
        temp_dir = os.getcwd()
    temp_dir_intermediate = os.path.join(temp_dir, "ppt_to_pdf_" + str(app_id) + str(document_id))
    temp_dir_intermediate_image = os.path.join(temp_dir, "ppt_images_" + str(app_id) + str(document_id))
    return temp_dir_intermediate, temp_dir_intermediate_image


def delete_imageprocessing_folders(document_id, app_id, temp_folder_path_preprocessing):
    temp_dir_intermediate, temp_dir_intermediate_image = generate_imageprocessing_paths(
        document_id, app_id, temp_folder_path_preprocessing
    )
    if os.path.exists(temp_dir_intermediate):
        shutil.rmtree(temp_dir_intermediate)
    if os.path.exists(temp_dir_intermediate_image):
        shutil.rmtree(temp_dir_intermediate_image)


def generate_images_ppt_and_upload(total_slides, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
    container_name = blob_Metadata.get("container_name")
    blob_connection_url = blob_Metadata.get("blob_connection_url")
    temp_dir_intermediate, temp_dir_intermediate_image = generate_imageprocessing_paths(
        document_id, app_id, temp_folder_path_preprocessing
    )
    pdf_name = "temp_ppt" + "_" + str(app_id) + "_" + str(document_id) + ".pdf"
    temp_dir_path_pdf = os.path.join(temp_dir_intermediate, pdf_name)
    os.environ["MAGICK_TEMPORARY_PATH"] = temp_dir_intermediate_image
    image_upload_list = []
    for slidenumber in range(total_slides):
        Image_name = "Pageimage_" + str(app_id) + "_" + str(document_id) + "_" + str(slidenumber + 1) + ".png"
        Image_path = os.path.join(temp_dir_intermediate_image, Image_name)
        try:
            with Image(filename=f"{temp_dir_path_pdf}[{slidenumber}]", resolution=300) as pdf:
                format = "PNG"  # noqa: F841
                pdf.save(filename=Image_path)
            image_upload_list.append([Image_path, Image_name])
        except Exception as e:
            logging.error(e)
            logging.warning("Error in this image : " + Image_path)

    upload_to_blob(image_upload_list, container_name, blob_connection_url)


def download_ppt_convert_pdf(file_path, app_id, document_id, blob_Metadata, temp_folder_path_preprocessing):
    flag_pdf_convert = True
    try:
        temp_dir_intermediate, temp_dir_intermediate_image = generate_imageprocessing_paths(
            document_id, app_id, temp_folder_path_preprocessing
        )
        ppt_name = "temp_ppt" + "_" + str(app_id) + "_" + str(document_id) + ".pptx"
        pdf_name = "temp_ppt" + "_" + str(app_id) + "_" + str(document_id) + ".pdf"
        temp_dir_path_ppt = os.path.join(temp_dir_intermediate, ppt_name)
        temp_dir_path_pdf = os.path.join(temp_dir_intermediate, pdf_name)
        response = requests.get(file_path)
        ppt_object = BytesIO(response.content)
        ppt_obj = Presentation(ppt_object)
        total_slides = len(ppt_obj.slides)
        if file_path.startswith("https://") or file_path.startswith("http://"):
            if not os.path.exists(temp_dir_path_ppt):
                with open(temp_dir_path_ppt, "wb") as file:
                    file.write(response.content)
        else:
            if not os.path.exists(temp_dir_path_ppt):
                shutil.copy(file_path, temp_dir_path_ppt)

        timeout_wait = 60
        if total_slides > 100:
            timeout_wait = 120
        elif total_slides > 500:
            timeout_wait = 180
        try:
            a = subprocess.Popen(["unoconv", "-f", "pdf", "-e", "ExportHiddenSlides=true", temp_dir_path_ppt])
            a.wait(timeout=timeout_wait)
        except Exception as e:
            logging.warning(e)
            flag_pdf_convert = False
        try:
            a.terminate()
            a.wait()
        except Exception as e:
            logging.warning(e)
        try:
            command = "kill -9 $(lsof -t -i:2002)"
            result = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            result.communicate()
        except subprocess.CalledProcessError as e:
            print("Error executing command:", e)
    except Exception as e:
        logging.warning(e)
        flag_pdf_convert = False
    return temp_dir_path_pdf, flag_pdf_convert
