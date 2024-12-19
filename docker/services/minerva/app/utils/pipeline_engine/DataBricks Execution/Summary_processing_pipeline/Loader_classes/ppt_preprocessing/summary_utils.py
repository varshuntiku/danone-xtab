SUPPORTED_NON_CONNECTOR_SHAPES = ["roundRect", "textbox", "smartart_boundary", "rect", "hexagon", "table", "chart"]
SUPPORTED_CONNECTOR_SHAPES = ["rightArrow"]


def populate_skeleton(slide_shapes_info):
    max_x = max(shape_info["x"] + shape_info["width"] for shape_info in slide_shapes_info)
    max_y = max(shape_info["y"] + shape_info["height"] for shape_info in slide_shapes_info)

    skeleton = [[" " for _ in range(max_x)] for _ in range(max_y)]
    additional_texts = []
    slide_text = ""
    for shape_info in slide_shapes_info:
        if shape_info["shape_type"] in SUPPORTED_NON_CONNECTOR_SHAPES:
            x, y, width, height = shape_info["x"], shape_info["y"], shape_info["width"], shape_info["height"]
            for i in range(x, x + width):
                skeleton[y][i] = "*"
                skeleton[y + height - 1][i] = "*"
            for j in range(y, y + height):
                skeleton[j][x] = "*"
                skeleton[j][x + width - 1] = "*"
            if shape_info.get("text"):
                shape_text = shape_info.get("text")
                shape_additional_text = shape_info.get("additional_text", "")
                additional_texts.append(shape_additional_text)

                texts = shape_text.split("\n")
                text_lines = []
                for text in texts:
                    text_lines += [text[i : i + width - 2].strip() for i in range(0, len(text), width - 2)]
                for line_index, line in enumerate(text_lines):
                    text_x = x + (width // 2) - (len(line) // 2)
                    text_y = y + 1 + line_index
                    for i in range(len(line)):
                        skeleton[text_y][text_x + i] = line[i]
        elif shape_info["shape_type"] in SUPPORTED_CONNECTOR_SHAPES:
            if shape_info["shape_type"] == "rightArrow":
                middle_x = x + width // 2
                middle_y = y + height // 2
                arrow_length = width // 2
                for i in range(middle_x, middle_x + arrow_length):
                    skeleton[middle_y][i] = "="
                skeleton[middle_y][middle_x + arrow_length] = ">"
        elif shape_info["shape_type"] == "connector":
            x, y, width, height, begin_x, begin_y, end_x, end_y = (
                shape_info["x"],
                shape_info["y"],
                shape_info["width"],
                shape_info["height"],
                shape_info["begin_x"],
                shape_info["begin_y"],
                shape_info["end_x"],
                shape_info["end_y"],
            )
            if begin_y == end_y:
                [skeleton[y].__setitem__(i, "-") for i in range(x, x + width)]
            else:
                diversion_on_xaxis = True if begin_x - end_x > begin_y - end_y else False
                if not diversion_on_xaxis:
                    if begin_x - end_x < 0 and begin_y - end_y < 0:
                        diversion_on_xaxis = not (begin_x - end_x > begin_y - end_y)

                arrow_left_to_right = True if end_x - begin_x > 0 else False
                arrow_top_to_bottom = True if end_y - begin_y > 0 else False

                middle_x = (
                    int(begin_x + (end_x - begin_x) / 2) if arrow_left_to_right else int(end_x + (begin_x - end_x) / 2)
                )
                middle_y = (
                    int(begin_y + (end_y - begin_y) / 2)
                    if arrow_top_to_bottom
                    else int(end_y + abs(begin_y - end_y) / 2)
                )

                if diversion_on_xaxis:
                    diversion_line_start, diversion_line_end = (
                        (begin_x, end_x) if arrow_left_to_right else (end_x, begin_x)
                    )
                    (
                        peripheral_diversion_first_start,
                        peripheral_diversion_first_end,
                        peripheral_diversion_second_start,
                        peripheral_diversion_second_end,
                    ) = (
                        (begin_y, middle_y, middle_y, end_y)
                        if arrow_top_to_bottom
                        else (middle_y, begin_y, end_y, middle_y)
                    )
                    [skeleton[middle_y].__setitem__(i, "-") for i in range(diversion_line_start, diversion_line_end)]
                    [
                        skeleton[i].__setitem__(begin_x, "|")
                        for i in range(peripheral_diversion_first_start, peripheral_diversion_first_end)
                    ]
                    [
                        skeleton[i].__setitem__(end_x, "|")
                        for i in range(peripheral_diversion_second_start, peripheral_diversion_second_end)
                    ]

                else:
                    diversion_line_start, diversion_line_end = (
                        (begin_y, end_y) if arrow_top_to_bottom else (end_y, begin_y)
                    )
                    (
                        peripheral_diversion_first_start,
                        peripheral_diversion_first_end,
                        peripheral_diversion_second_start,
                        peripheral_diversion_second_end,
                    ) = (
                        (begin_x, middle_x, middle_x, end_x)
                        if arrow_top_to_bottom
                        else (middle_x, begin_x, end_x, middle_x)
                    )
                    [skeleton[i].__setitem__(middle_x, "|") for i in range(diversion_line_start, diversion_line_end)]
                    [
                        skeleton[begin_y].__setitem__(i, "-")
                        for i in range(peripheral_diversion_first_start, peripheral_diversion_first_end)
                    ]
                    [
                        skeleton[end_y].__setitem__(i, "-")
                        for i in range(peripheral_diversion_second_start, peripheral_diversion_second_end)
                    ]
    for row in skeleton:
        textline = "".join(row)
        if len(textline.strip()) == 0:
            continue
        slide_text += textline + "\n"
    slide_text += f"ADDITIONAL CONTEXT:\n{''.join(additional_texts)}"

    return slide_text


def get_skeletons(slide_shapes_info):
    charts_info = [shape_info for shape_info in slide_shapes_info if shape_info["shape_type"] == "chart"]
    non_charts_info = [
        shape_info
        for shape_info in slide_shapes_info
        if shape_info["shape_type"] != "chart" and not shape_info.get("chart_title")
    ]
    slide_skeletons = {}

    processed_charts_info = [
        {
            **chart_info,
            "text": "This is a placeholder for a plotly plot.",
            "additional_text": "",
        }
        if chart_info.get("chart_title")
        else chart_info
        for chart_info in charts_info
    ]
    processed_slide_shapes_info = processed_charts_info + non_charts_info
    slide_skeletons["complete_slide"] = populate_skeleton(processed_slide_shapes_info)
    if charts_info:
        processed_non_charts_info = [{**x, "additional_text": ""} for x in non_charts_info]
        for index, chart_info in enumerate(charts_info):
            if chart_info.get("chart_title", None):
                slide_skeletons[f"chart_with_title_{index}"] = chart_info["additional_text"]
            else:
                processed_chart_info = [
                    {**x, "text": "PLOT PLACEHOLDER"}
                    if x == chart_info
                    else {**x, "text": "PLOT INFO NOT AVAILABLE", "additional_text": ""}
                    for x in charts_info
                ]
                processed_slide_shapes_info = processed_non_charts_info + processed_chart_info
                slide_skeletons[f"chart_without_title_{index}"] = populate_skeleton(processed_slide_shapes_info)
    return slide_skeletons


def get_all_texts(slide_shapes_info):
    all_texts = [
        shape_info.get("text", "")
        for shape_info in slide_shapes_info
        if shape_info.get("text", "")
        not in ["This is a placeholder for a plotly plot, json of the plot is provided below."]
    ]
    return " ".join(all_texts)
