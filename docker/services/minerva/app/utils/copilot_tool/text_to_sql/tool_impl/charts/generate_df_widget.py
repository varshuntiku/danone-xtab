#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import datetime
import logging

import pandas as pd
from pandas.api.types import (
    is_bool_dtype,
    is_datetime64_any_dtype,
    is_numeric_dtype,
    is_object_dtype,
    is_string_dtype,
)
from tool_impl.charts.bar_chart import BarChart
from tool_impl.charts.card import Card
from tool_impl.charts.data_table import DataTable
from tool_impl.charts.geo_chart import GeoChart
from tool_impl.charts.heatmap_chart import HeatMapChart
from tool_impl.charts.line_area_chart import LineAreaChart
from tool_impl.charts.pie_chart import PieChart
from tool_impl.charts.scatter_chart import ScatterChart
from tool_impl.charts.sunburst_treemap_chart import SunburstTreemapChart

# from flask.current_app import logging


class DataframeVizGenerator:
    """This class generates chart objects."""

    def __init__(self, data_frame, title=""):
        """ChartGenerator Constructor"""
        self.data_frame = data_frame
        self.title = title
        self.data_frame_metadata = self.generate_dataframe_metadata(data_frame=self.data_frame)
        self.column_combination, self.chart_types = self.get_graph_types(
            data_frame=data_frame, data_frame_metadata=self.data_frame_metadata
        )
        self.chart_objects = self.generate_chart_objects(
            data_frame=data_frame,
            data_frame_metadata=self.data_frame_metadata,
            chart_types=self.chart_types,
            title=self.title,
        )

    def generate_dataframe_metadata(self, data_frame):
        """Generated dataframe metadata"""
        col_metadata = []
        for col in data_frame.columns:
            """
            1. Check for numeric -
                - boolean = categorical
                - others = continuous
            2. Check for string =
                - check col names for date cols = time
                - others = categorical
            3. Check for object -
                - check for datetime = time
                - other = categorical
            4. check for datetime = time
            5. Others = categorical
            """
            data_value = None
            if is_numeric_dtype(data_frame[col]):
                if is_bool_dtype(data_frame[col]):
                    data_type = "categorical"
                else:
                    data_type = "continuous"
            elif is_datetime64_any_dtype(data_frame[col]):
                data_type = "categorical"
                data_value = "time"
                data_frame[col] = data_frame[col].dt.date.astype(str)
            elif is_string_dtype(data_frame[col]):
                if col.lower() in ["week", "year", "quarter", "date", "month"]:
                    data_type = "categorical"
                    data_value = "time"
                else:
                    data_type = "categorical"
            elif is_object_dtype(data_frame[col]):
                if isinstance(data_frame[col][0], datetime.date):
                    data_type = "categorical"
                    data_value = "time"
                    # parse date colums
                    data_frame[col] = data_frame[col].astype(str)
                else:
                    data_type = "categorical"
            else:
                data_type = "categorical"
            col_metadata.append(
                {
                    "name": col,
                    "data_type": data_type,
                    "data_value": data_value,
                }
            )
        # sort list based on datatype - continuous or categorical
        col_metadata = sorted(col_metadata, key=lambda k: k["data_type"])
        return col_metadata

    def get_graph_types(self, data_frame, data_frame_metadata):
        """Generates relevant chart types based on dataframe metadata"""
        column_combination = [x["data_type"] for x in data_frame_metadata]
        column_values = [x["data_value"] for x in data_frame_metadata]
        sorted_column_combination = sorted(column_combination)
        columns_name = [x["name"] for x in data_frame_metadata]
        df = data_frame.reindex(columns=columns_name)
        charts_time = []
        charts = []

        def name_type_mapper(items):
            return [{"name": el, "type": el if el in ["card", "dataTable"] else "chart"} for el in items]

        if len(df) == 1 and len(df.columns) < 3:
            charts = ["card"]
            charts_time = ["card"]
        elif sorted_column_combination == sorted(["continuous", "continuous"]):
            charts = ["scatter"]
        elif sorted_column_combination == sorted(["continuous", "continuous", "categorical"]):
            charts = ["scatter-categorical"]
        elif sorted_column_combination == sorted(["continuous", "continuous", "continuous"]):
            charts = ["bubble"]
            charts_time = ["multiline-format"]
        elif sorted_column_combination == sorted(["continuous", "continuous", "continuous", "categorical"]):
            charts = ["bubble-categorical"]
        elif sorted_column_combination == sorted(["continuous", "categorical"]):
            if len(pd.unique(df.iloc[:, 0])) > 12:
                charts_time = ["line"]
            else:
                charts_time = ["line", "bar", "pie"]
            charts = ["bar", "pie"]
        elif sorted_column_combination == sorted(["categorical", "categorical", "continuous"]):
            if len(pd.unique(df.iloc[:, 0])) >= 12 or len(pd.unique(df.iloc[:, 1])) >= 12:
                charts = ["sunburst", "treemap"]
                charts_time = ["area", "multiline", "sunburst", "treemap"]
            else:
                charts = [
                    "stacked bar",
                    "grouped bar",
                    "100 stack",
                    "horizontal stacked",
                    "horizontal grouped",
                    "100-horizontal stack",
                    "heatmap",
                    "sunburst",
                    "treemap",
                ]
                charts_time = ["area", "multiline", "heatmap", "sunburst", "treemap"]
        elif sum(1 for x in sorted_column_combination if x == "continuous") == 1:
            charts = ["sunburst", "treemap"]
            charts_time = ["sunburst", "treemap"]
        else:
            # default data table is added later
            pass
        # add data table for all combinations
        if charts != ["card"]:
            charts.append("dataTable")
            charts_time.append("dataTable")
        if "time" in column_values:
            chart_types = name_type_mapper(charts_time)
        else:
            chart_types = name_type_mapper(charts)
        return column_combination, chart_types

    def generate_chart_objects(self, data_frame, data_frame_metadata, chart_types, title):
        """Generates chart objects"""
        widgets = []
        for el in chart_types:
            try:
                widgets.append(
                    {
                        "name": el["name"],
                        "type": el["type"],
                        "title": title,
                        "value": self.getChartObject(
                            df=data_frame,
                            chart_type=el["name"],
                            data_frame_metadata=data_frame_metadata,
                            title=title,
                        ),
                    }
                )
            except Exception as e:
                logging.error("Error Generating chart object - {el}".format(el=str(el)) + str(e))
        return widgets

    def getChartObject(self, df, chart_type, data_frame_metadata, title):
        """gets chart object dictionaries based on chart types"""
        df = self.parseDfDate(df)
        if chart_type in ["pie"]:
            inst = PieChart(df, chart_type, data_frame_metadata, title)
            response = inst.getChart()
        elif chart_type in [
            "stacked bar",
            "grouped bar",
            "horizontal stacked",
            "horizontal grouped",
            "100-horizontal stack",
            "100 stack",
            "bar",
        ]:
            inst = BarChart(df, chart_type, data_frame_metadata, title)
            response = inst.getChart()
        elif chart_type in ["line", "multiline", "area", "multiline-format", "area-format"]:
            inst = LineAreaChart(df, chart_type, data_frame_metadata, title)
            response = inst.getChart()
        elif chart_type in ["geo-choropleth", "geo-bubble"]:
            inst = GeoChart(df, chart_type, data_frame_metadata, title)
            response = inst.getChart()
        elif chart_type in ["sunburst", "treemap"]:
            inst = SunburstTreemapChart(df, chart_type, data_frame_metadata, title)
            response = inst.getChart()
        elif chart_type in ["heatmap"]:
            inst = HeatMapChart(df, chart_type, data_frame_metadata, title)
            response = inst.getChart()
        elif chart_type in [
            "scatter",
            "scatter-categorical",
            "bubble",
            "bubble-categorical",
        ]:
            inst = ScatterChart(df, chart_type, data_frame_metadata, title)
            response = inst.getChart()
        elif chart_type in ["card"]:
            inst = Card(df, chart_type, data_frame_metadata, title)
            response = inst.getChart()

        elif chart_type in ["dataTable"]:
            inst = DataTable(df, chart_type, data_frame_metadata, title)
            response = inst.getChart()
        return response

    def parseDfDate(self, df):
        """
        Convert datetime columns in the DataFrame to string format.

        Args:
            df (pandas.DataFrame): The DataFrame to be processed.

        Returns:
            pandas.DataFrame: The DataFrame with datetime columns converted to string format.
        """
        for x in df.select_dtypes(include=["datetime64", "object"]).columns.tolist():
            df[x] = df[x].astype(str)
        return df
