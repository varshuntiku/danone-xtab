import logging
from io import BytesIO

import Loader_classes.base_class as base_class
import Loader_classes.ppt_preprocessing.ppt_extractor as ppt_extractor
import Loader_classes.ppt_preprocessing.summary_utils as utils
import requests
from langchain.document_loaders import Docx2txtLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter


class PdfLoader(base_class.Loader):
    extention = "pdf"

    def load(self, file_path, llm_obj, app_id, document_id, temp_folder_path_preprocessing):
        try:
            loader = PyPDFLoader(file_path)
            return self.text_splitter.transform_documents(loader.load())
        except Exception as e:
            logging.error(e)
            return []


class WordDocLoader(base_class.Loader):
    extention = "docx"

    def load(self, file_path, llm_obj, app_id, document_id, temp_folder_path_preprocessing):
        try:
            loader = Docx2txtLoader(file_path)
            return self.text_splitter.transform_documents(loader.load())
        except Exception as e:
            logging.error(e)
            return []


class TextFileLoader(base_class.Loader):
    extention = "txt"

    def load(self, file_path, llm_obj, app_id, document_id, temp_folder_path_preprocessing):
        try:
            text_content = requests.get(file_path).text
            return self.text_splitter.create_documents([text_content])
        except Exception as e:
            logging.error(e)
            return []


class PPTFileLoader(base_class.Loader):
    extention = "pptx"

    def text_splitter_ppt_func(self):
        self.Text_splitter_ppt = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
        )
        return self.Text_splitter_ppt

    def load(self, file_path, llm_obj, app_id, document_id, temp_folder_path_preprocessing):
        text_content_list, metadata_list, flag_processed_ppt = self.content(
            file_path, llm_obj, app_id, document_id, temp_folder_path_preprocessing
        )
        if flag_processed_ppt:
            if metadata_list == []:
                return self.text_splitter_ppt_func().create_documents(texts=text_content_list)
            else:
                return self.text_splitter_ppt_func().create_documents(texts=text_content_list, metadatas=metadata_list)
        else:
            return []

    def content(self, file_path, llm_obj, app_id, document_id, temp_folder_path_preprocessing):
        try:
            response = requests.get(file_path)
            ppt_object = BytesIO(response.content)
            metadata_list = []
            flag_processed_ppt = True
            corpus_list = []
            pptx_extractor_obj = ppt_extractor.Extractor(
                ppt_object, app_id, document_id, temp_folder_path_preprocessing
            )
            slides_shapes_info = pptx_extractor_obj.extract_shapes()
            title_slide_text, slide_prefix, processed_slides_shapes_info = pptx_extractor_obj.process_slides(
                slides_shapes_info
            )

            for slide_number, slide_shapes_info in processed_slides_shapes_info.items():
                Image_name = "Pageimage_" + str(app_id) + "_" + str(document_id) + "_" + str(slide_number) + ".png"
                metadata_list.append({"slide_number": slide_number, "image_name": Image_name})
                corpus = ""
                try:
                    if slide_shapes_info:
                        corpus = corpus + title_slide_text + "\n" if title_slide_text is not None else corpus
                        corpus = (
                            corpus + slide_prefix[slide_number] + "\n"
                            if slide_prefix.get(slide_number, None)
                            else corpus
                        )

                        slide_skeletons = utils.get_skeletons(slide_shapes_info)
                        for skeleton_type, slide_skeleton in slide_skeletons.items():
                            if skeleton_type.startswith("chart_with_title"):
                                corpus += slide_skeleton + "\n"
                                continue

                            elif skeleton_type.startswith("chart_without_title"):
                                slide_additional_context = slide_skeleton.split("ADDITIONAL CONTEXT:")[1]
                                slide_skeleton = slide_skeleton.split("ADDITIONAL CONTEXT:")[0]
                                slide_narration_prompt = f"""Analyze the provided canvas, which features various components such as text boxes, placeholder for plots, and flowcharts positioned based on their coordinates. Your task is to generate the title of the plot represented by the 'PLOT PLACEHOLDER,' which is a holder Plotly figure object. Your response should only include the title of the plot, excluding any extra information.

        Guidelines:
        If the canvas lacks sufficient information or is unsuitable for storytelling, respond with 'I can't generate a title.'

        Canvas:
        {slide_skeleton}
        """
                                slide_narration = llm_obj.predict(slide_narration_prompt)
                                slide_narration = "" if "i can't" in slide_narration.lower() else slide_narration
                                slide_additional_context = slide_additional_context[
                                    slide_additional_context.find("plotly json:") + 12 :
                                ].strip()
                                slide_narration = slide_narration.replace("\n\n", "\n").strip()
                                corpus += f"{slide_narration} - {slide_additional_context}" + "\n"

                            else:
                                slide_narration_prompt = f"""Generate a coherent narrative by examining the provided canvas or flowchart, which includes a variety of elements such as text boxes, smartarts, charts(as plotly json), table(table). Pay special attention to headers and subheaders when constructing the narrative.

        Follow these guidelines:

        JSON Tables: If the canvas contains JSON tables, present them in JSON format. Ensure that the JSON output accurately reflects the data within each table.

        Flowcharts: If the canvas features flowcharts, analyze the flowchart's processes and connections. Pay particular attention to headers and subheaders in the flowchart to create a comprehensive and logical narrative that explains how the various elements interact.

        Inadequate Information: If the provided canvas or flowchart lacks sufficient information or is unsuitable for storytelling, respond with 'I can't generate a story'.

        Canvas:
        {slide_skeleton}
        """
                                slide_narration = llm_obj.predict(slide_narration_prompt)
                                slide_narration = (
                                    utils.get_all_texts(slide_shapes_info)
                                    if "i can't" in slide_narration.lower()
                                    else slide_narration
                                )
                                slide_narration = slide_narration.replace("\n\n", "\n").strip()
                                corpus += f"{slide_narration}" + "\n"

                        corpus = corpus.strip()
                        corpus += "\n"
                except Exception as e:
                    logging.warning(e)
                corpus_list.append(corpus)
        except Exception as e:
            logging.error(e)
            flag_processed_ppt = False
        return corpus_list, metadata_list, flag_processed_ppt
