# pylint: disable=line-too-long
"""
PowerPoint Chart Extraction Module

This module provides a class, ExtractChart, for extracting chart data from PowerPoint slides and converting it into Plotly figures.
The ExtractChart class extends the functionality of the ExtractBase class for handling chart-specific operations.
"""
import json
import logging

import plotly.graph_objects as go
from Loader_classes.ppt_preprocessing.ppt_extractor.extract_base import ExtractBase


class ExtractChart(ExtractBase):
    """
    Extract chart data from PowerPoint slides and convert it to Plotly figures.

    This class extends the functionality of ExtractBase for extracting chart data
    and converting it to Plotly figures for visualization.

    Attributes:
        shape_properties (dict): Dictionary containing properties of the chart shape.

    Methods:
        _get_plotly_obj(self, x_values, y_info, chart_type):
            Convert PowerPoint chart data to a Plotly figure.

        _get_chart_json(self, shape):
            Extract chart data from a PowerPoint shape and convert it to a JSON representation.

        extract(self, shape):
            Extract chart data and return the shape properties with additional text.

    """

    def __init__(self):
        super().__init__()
        self.shape_properties["shape_type"] = "chart"

    def _get_plotly_obj(self, x_values, y_info, chart_type):
        """
        Convert PowerPoint chart data to a Plotly figure.

        Args:
            x_values (list): X-axis values.
            y_info (dict): A dictionary containing trace names as keys and Y-axis values as lists.
            chart_type (str): The type of chart, e.g., "SCATTER," "BAR," "BAR_STACKED," or "PIE."

        Returns:
            go.Figure: A Plotly figure representing the chart.

        """
        fig_obj = go.Figure()
        if chart_type in ("SCATTER", "LINE_MARKERS"):
            for trace_name, y_values in y_info.items():
                fig_obj.add_trace(go.Scatter(x=x_values, y=y_values, mode="lines+markers", name=trace_name))
        elif chart_type in (
            "BAR",
            "BAR_STACKED",
            "COLUMN_STACKED_100",
            "BAR_CLUSTERED",
            "COLUMN_CLUSTERED",
            "COLUMN_STACKED",
        ):
            for trace_name, y_values in y_info.items():
                fig_obj.add_trace(go.Bar(x=x_values, y=y_values, name=trace_name))
            if chart_type == "BAR_STACKED":
                fig_obj.update_layout(barmode="stack")
        elif chart_type in ("PIE", "DOUGHNUT"):
            for trace_name, y_values in y_info.items():
                fig_obj.add_trace(go.Pie(labels=x_values, values=y_values, name=trace_name))
        return fig_obj

    def _get_chart_json(self, shape):
        """
        Extract chart data from a PowerPoint shape and convert it to a JSON representation.

        Args:
            shape (pptx.chart.data.ChartDataPoint): The PowerPoint shape containing chart data.

        Returns:
            str: A JSON representation of the chart data.

        """
        supported_shapes = {
            4: "SCATTER",
            51: "BAR",
            58: "BAR_STACKED",
            -4120: "DOUGHNUT",
            53: "COLUMN_STACKED_100",
            57: "BAR_CLUSTERED",
            5: "PIE",
            52: "COLUMN_STACKED",
            65: "LINE_MARKERS",
        }
        chart_json = ""
        chart_title = None
        try:
            chart_type = supported_shapes.get(shape.chart.chart_type, None)
            if chart_type:
                y_info = {}
                for plot in shape.chart.plots:
                    x_values = [x_value[0] for x_value in plot.categories.flattened_labels]
                    x_values = [round(x, 2) if isinstance(x, float) else x for x in x_values]

                    for _, trace in enumerate(plot.series):
                        y_info[trace.name] = [round(y, 2) if isinstance(y, float) else y for y in trace.values]
                fig = self._get_plotly_obj(x_values, y_info, chart_type)
                processed_chart_dict = {"data": json.loads(fig.to_json())["data"]}
                # TODO: NEED BETTER LOGIC
                chart_title = plot.chart.chart_title.text_frame.text if plot.chart.has_title else None
                chart_title = (
                    processed_chart_dict["data"][0].get("name", None)
                    if chart_type in ("PIE", "DOUGHNUT") and not chart_title
                    else chart_title
                )
                chart_json = json.dumps(processed_chart_dict)
        except Exception as e:
            logging.warning(e)
        return chart_json, chart_title

    def extract(self, shape):
        """
        Extract chart data and return shape properties with additional text(chart json).

        Args:
            shape (pptx.shapes.graphfrm.GraphFrame): The PowerPoint shape containing chart data.

        Returns:
            dict: A dictionary containing shape properties, i.e text and additional text(chart json).

        """
        self.shape_properties.update(self.extract_coordinates(shape))
        chart_json, chart_title = self._get_chart_json(shape)
        self.shape_properties["text"] = "This is a placeholder for a plotly plot, json of the plot is provided below."
        self.shape_properties["additional_text"] = (
            chart_title + " - " + chart_json if chart_title else f"""plotly json: {chart_json}\n"""
        )
        self.shape_properties["chart_title"] = chart_title
        return self.shape_properties
