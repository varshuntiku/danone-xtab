# pylint: disable=line-too-long
"""
This module contains a collection of utility functions and helper classes.
"""
import logging
import math
import os
import shutil
import zipfile


def extract_smartart_xmls_from_pptx(pptx_file, app_id, document_id, temp_folder_path_preprocessing):
    """
    Extract SmartArt XMLs from a PowerPoint presentation.

    This function takes the path to a PowerPoint file (.pptx) as input and extracts
    the XMLs associated with SmartArt graphics found within the presentation. SmartArt
    is a feature in PowerPoint used to create visually appealing diagrams and
    flowcharts.
    """
    if temp_folder_path_preprocessing is not None:
        temp_dir_current = temp_folder_path_preprocessing
    else:
        temp_dir_current = os.getcwd()
    temp_name = str(app_id) + "_" + str(document_id) + "_" + "tmp"
    temp_dir = os.path.join(temp_dir_current, temp_name)
    os.mkdir(temp_dir)

    try:
        with zipfile.ZipFile(pptx_file, "r") as zip_ref:
            zip_ref.extractall(temp_dir)
    except Exception as e:
        shutil.rmtree(temp_dir)
        raise Exception(e)
    diagrams_folder = os.path.join(temp_dir, "ppt", "diagrams")

    try:
        drawing_files = [file for file in os.listdir(diagrams_folder) if file.startswith("drawing")]
    except Exception as e:
        logging.warning(e)
        shutil.rmtree(temp_dir)
        return None

    try:
        xml_objs = {}
        for drawing_file in drawing_files:
            with open(os.path.join(diagrams_folder, drawing_file), "r", encoding="utf-8") as xml_file:
                xml_data = xml_file.read()
                xml_objs[int(drawing_file.split("drawing")[-1].split(".xml")[0])] = xml_data
    except Exception as e:
        shutil.rmtree(temp_dir)
        raise Exception(e)
    shutil.rmtree(temp_dir)
    return xml_objs


class OverlapResolver:
    """
    A class for resolving overlap between shapes on a PowerPoint (PPT) slide.

    Methods:
    - are_shapes_overlapping(shape1, shape2): Check if two shapes overlap on the slide.
    - calculate_overlap_units(shape1, shape2): Calculate the overlapping units between two shapes.
    - adjust_position(shape1, shape2, x_overlap_units, y_overlap_units, direction, operation):
      Adjust the position of shapes to resolve overlap.
    - resolve_overlap: Resolve overlapping shapes on the slide.
    """

    def __init__(self, shapes_info):
        self.shapes_info = shapes_info

    def are_shapes_overlapping(self, shape1, shape2):
        """
        Check if two shapes overlap.

        This method checks if two shapes overlap on the slide.

        Args:
        shape1 (dict): Information about the first shape.
        shape2 (dict): Information about the second shape.

        Returns:
        bool: True if the shapes overlap, False otherwise.
        """
        shape1_x1 = shape1["x"]
        shape1_x2 = shape1["x"] + shape1["width"]
        shape1_y1 = shape1["y"]
        shape1_y2 = shape1["y"] + shape1["height"]

        shape2_x1 = shape2["x"]
        shape2_x2 = shape2["x"] + shape2["width"]
        shape2_y1 = shape2["y"]
        shape2_y2 = shape2["y"] + shape2["height"]

        x_overlap = (shape1_x1 < shape2_x2) and (shape1_x2 > shape2_x1)
        y_overlap = (shape1_y1 < shape2_y2) and (shape1_y2 > shape2_y1)

        return x_overlap and y_overlap

    def calculate_overlap_units(self, shape1, shape2):
        """
        Calculate the overlapping area between two shapes.

        Args:
        shape1 (dict): Information about the first shape.
        shape2 (dict): Information about the second shape.

        Returns:
        int: The overlapping units.
        """
        x1 = max(shape1["x"], shape2["x"])
        x2 = min(shape1["x"] + shape1["width"], shape2["x"] + shape2["width"])
        y1 = max(shape1["y"], shape2["y"])
        y2 = min(shape1["y"] + shape1["height"], shape2["y"] + shape2["height"])

        x_overlap_units = max(0, x2 - x1)
        y_overlap_units = max(0, y2 - y1)

        return x_overlap_units, y_overlap_units

    def adjust_position(self, shape1, shape2, x_overlap_units, y_overlap_units, direction, operation):
        """
        Adjust the position of shapes to resolve overlap.

        Args:
        shape1 (dict): Information about the first shape.
        shape2 (dict): Information about the second shape.
        x_overlap_units (float): Overlapping area along the X-axis.
        y_overlap_units (float): Overlapping area along the Y-axis.
        direction (str): The direction to adjust the shapes ("x" or "y").
        operation (str): The type of adjustment ("add" or "sub").
        """
        if shape2["shape_type"] == "connector":
            return

        new_x = shape2["x"]
        new_y = shape2["y"]

        if direction == "x":
            if operation == "add":
                new_x += x_overlap_units
            elif operation == "subtract":
                new_x -= x_overlap_units
        elif direction == "y":
            if operation == "add":
                new_y += y_overlap_units
            elif operation == "subtract":
                new_y -= y_overlap_units

        tentative_shape2 = dict(shape2.items())
        tentative_shape2["x"] = new_x
        tentative_shape2["y"] = new_y

        for other_shape in self.shapes_info:
            if other_shape not in (shape1, shape2):
                if self.are_shapes_overlapping(other_shape, tentative_shape2):
                    return
        if direction == "x":
            shape2["x"] = new_x
        else:
            shape2["y"] = new_y

    def resolve_overlap(self, shapes_info=None):
        """
        Resolve overlapping shapes on the slide.

        This method identifies and resolves overlapping shapes on the slide.
        """
        if shapes_info:
            self.shapes_info = shapes_info
        sorting_criteria = [
            (lambda shape: shape["x"], False, "x", "add"),
            (lambda shape: shape["y"], False, "y", "add"),
            # (lambda shape: shape["x"], True, "x", "subtract"),
            # (lambda shape: shape["y"], True, "y", "subtract"),
        ]
        shapes_info = self.shapes_info

        for key_func, reverse_flag, direction, operation in sorting_criteria:
            shapes_info = sorted(shapes_info, key=key_func, reverse=reverse_flag)
            for index, shape1 in enumerate(shapes_info):
                for shape2 in shapes_info[index + 1 :]:
                    if self.are_shapes_overlapping(shape1, shape2):
                        x_overlap_units, y_overlap_units = self.calculate_overlap_units(shape1, shape2)
                        self.adjust_position(shape1, shape2, x_overlap_units, y_overlap_units, direction, operation)
        self.shapes_info = shapes_info


class SlideProcessor:
    """
    A class for processing and optimizing the contents of a PowerPoint (PPT) slide.

    Attributes:
    shapes_info (list): A list of shapes and their information on the slide.
    overlap_resolver (OverlapResolver): An instance of the OverlapResolver class for resolving overlap.

    Methods:
    - remove_extra_spaces: Remove extra spaces and formatting in text shapes.
    - truncate_and_wrap_text: Adjust the size of text boxes to fit their content.
    - align_non_horizontal_connector_coordinates: Align the coordinates of connectors that are not horizontally oriented.
    - remove_zero_dimension_connectors: Remove connectors with zero width or height.
    - run_all: Execute all processing steps and return the modified shapes_info.
    """

    def __init__(self, shapes_info):
        self.shapes_info = shapes_info
        self.overlap_resolver = OverlapResolver(shapes_info)

    def normalize_shape_positions(self):
        """
        Normalize shape positions relative to the slide's minimum coordinates.

        This method identifies and removes extra spaces in text shapes and adjusts the
        positions of shapes to be relative to the slide's minimum x and y coordinates.

        The method calculates the minimum x and y coordinates of all shapes and then
        adjusts the position of each shape, so it is relative to the slide's top-left
        corner (0, 0).
        """
        min_x = min(shape["x"] for shape in self.shapes_info)
        min_y = min(shape["y"] for shape in self.shapes_info)
        for shape in self.shapes_info:
            shape["x"] -= min_x
            shape["y"] -= min_y

            if (
                shape.get("begin_x", False)
                and shape.get("begin_x", False)
                and shape.get("begin_x", False)
                and shape.get("begin_x", False)
            ):
                shape["begin_x"] -= min_x
                shape["end_x"] -= min_x
                shape["begin_y"] -= min_y
                shape["end_y"] -= min_y

    def truncate_and_wrap_text(self):
        """
        Truncate and wrap text to fit within a text box.

        It adjusts the size of the text box's content by truncating long lines and wrapping text within the given width.
        """

        for shape in self.shapes_info:
            if shape["shape_type"] == "chart":
                continue
            shape_text = shape.get("text", "")
            shape_width = shape["width"]
            try:
                texts = shape_text.split("\n")
                text_lines = []
                for text in texts:
                    if shape_width > 2:
                        text_lines += [
                            text[i : i + shape_width - 2].strip() for i in range(0, len(text), shape_width - 2)
                        ]
                shape["height"] = len(text_lines) + 2

            except Exception as e:
                logging.warning(e)
        self.shapes_info = [x for x in self.shapes_info if x["height"] != 2 or x["shape_type"] == "connector"]
        self.shapes_info = [x for x in self.shapes_info if x.get("text", "") or x["shape_type"] == "connector"]

    def align_non_horizontal_connector_coordinates(self):
        """
        Align the coordinates of connectors that are not horizontally oriented.

        This method rotates the coordinates of connectors that are not aligned with the
        horizontal plane, ensuring proper alignment with the zero-degree plane.
        """
        for shape_info in self.shapes_info:
            if shape_info["shape_type"] == "connector":
                begin_x, begin_y, end_x, end_y, rotation = (
                    shape_info["begin_x"],
                    shape_info["begin_y"],
                    shape_info["end_x"],
                    shape_info["end_y"],
                    shape_info["rotation"],
                )

                midpoint_x = (begin_x + end_x) / 2
                midpoint_y = (begin_y + end_y) / 2

                displacement_x_begin = begin_x - midpoint_x
                displacement_y_begin = begin_y - midpoint_y
                displacement_x_end = end_x - midpoint_x
                displacement_y_end = end_y - midpoint_y

                radians = math.radians(rotation)

                new_displacement_x_begin = (displacement_x_begin * math.cos(radians)) - (
                    displacement_y_begin * math.sin(radians)
                )
                new_displacement_y_begin = (displacement_x_begin * math.sin(radians)) + (
                    displacement_y_begin * math.cos(radians)
                )
                new_displacement_x_end = (displacement_x_end * math.cos(radians)) - (
                    displacement_y_end * math.sin(radians)
                )
                new_displacement_y_end = (displacement_x_end * math.sin(radians)) + (
                    displacement_y_end * math.cos(radians)
                )

                new_begin_x = round(midpoint_x + new_displacement_x_begin)
                new_begin_y = round(midpoint_y + new_displacement_y_begin)
                new_end_x = round(midpoint_x + new_displacement_x_end)
                new_end_y = round(midpoint_y + new_displacement_y_end)

                shape_info["begin_x"], shape_info["begin_y"], shape_info["end_x"], shape_info["end_y"] = (
                    new_begin_x,
                    new_begin_y,
                    new_end_x,
                    new_end_y,
                )

    def remove_zero_dimension_connectors(self):
        """
        Remove connectors with zero width or height from the shapes_info list.

        This method identifies and removes connectors in the shapes_info list that have
        zero width or zero height. Connectors with no visual presence can be excluded
        to optimize the representation of the slide.
        """
        processed_shapes_info = []
        for shape_info in self.shapes_info:
            if shape_info["shape_type"] == "connector" and (shape_info["width"] == 0 or shape_info["height"] == 0):
                continue
            processed_shapes_info.append(shape_info)
        self.shapes_info = processed_shapes_info

    def run_all(self):
        """
        Execute all processing steps and return the modified shapes_info.

        This method executes all processing steps in the specified order, including resolving
        overlap using the OverlapResolver class, and returns the modified shapes_info after processing.

        Returns:
        list: The modified shapes_info after processing.
        """
        self.normalize_shape_positions()
        self.truncate_and_wrap_text()
        self.overlap_resolver.resolve_overlap(self.shapes_info)
        self.align_non_horizontal_connector_coordinates()
        self.remove_zero_dimension_connectors()
        return self.shapes_info
