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
import re

import duckdb
import pandas as pd
from app.utils.charts.bar_chart import BarChart
from app.utils.charts.card import Card
from app.utils.charts.data_table import DataTable
from app.utils.charts.geo_chart import GeoChart
from app.utils.charts.heatmap_chart import HeatMapChart
from app.utils.charts.line_area_chart import LineAreaChart
from app.utils.charts.pie_chart import PieChart
from app.utils.charts.scatter_chart import ScatterChart
from app.utils.charts.sunburst_treemap_chart import SunburstTreemapChart
from app.utils.config import get_settings
from pandas.api.types import (
    is_bool_dtype,
    is_datetime64_any_dtype,
    is_numeric_dtype,
    is_object_dtype,
    is_string_dtype,
)
from sqlalchemy import create_engine

theme_config = get_settings()


class WidgetGenerator:
    """This class generates chart objects.

    Attributes:
        config(dict): Tool configuration dictionary
        sql_query(str): SQL query string
        user_query(str): User query string
        df: A pandas dataframe
        metadata(list[dict]): Holds column metadata
        charts(list[str]): list of relevant chart types
        chart_title(str): Chart title
        chart_objects(dict): Chart object dictionary

    Methods:
        __init__: class object constructor
        getChart: Returns chart object dictionary
        queryData: Connects to database and retrieves dataframe based on the SQL query
        dataMetadata: generates column metadata
        getChartTypes: generates list of relevant chart types
        generateChartTitle: Generates chart title
        generateChartObjects: Generates chart objects

    """

    def __init__(
        self,
        config,
        sql_query,
        user_query,
        query_dataframe=None,
        copilot_dataframe=None,
    ):
        """ChartGenerator Constructor"""
        self.config = config
        self.sql_query = sql_query
        self.user_query = user_query
        self.df = None
        self.query_dataframe = query_dataframe
        self.error = None
        self.widgets = None
        if copilot_dataframe is not None:
            self.df = copilot_dataframe
        else:
            self.queryData()
        if self.df is not None:
            self.dataMetadata()
            self.getWidgetTypes()
            self.generateWidgetTitle()
            self.generateWidgetObjects()

    def queryData(self):
        """Connects to database and retrieves dataframe based on the SQL query"""

        if self.query_dataframe is not None:
            try:
                self.df = duckdb.query(self.sql_query).df()
                self.df = self.df.fillna(0)
            except Exception as e:
                self.error = str(e)
                logging.error("Error querying CSV dataframe " + str(e))
        else:
            try:
                db_engine = create_engine(
                    self.config["config"]["context_db_connection_uri"],
                    connect_args={
                        "options": "-csearch_path={}".format(self.config["config"]["context_db_connection_schema"])
                    },
                )
                # conn = db_engine.raw_connection()
                with db_engine.connect() as connection:
                    self.df = pd.read_sql_query(self.sql_query, connection).round(1)
                    self.df = self.df.fillna(0)
            except Exception as e:
                self.error = str(e)
                logging.error("Error querying Database " + str(e))
            finally:
                db_engine.dispose()

    def dataMetadata(self):
        """Generated dataframe metadata"""
        colMetadata = []
        for col in self.df.columns:
            # Adding min_ to handle time based aggregation columns
            colObj = next(
                (
                    x
                    for x in self.config["config"]["context"]["columns"]
                    if (x["name"] == col)
                    or (("min_" + x["name"]) == col)
                    or (("sum_" + x["name"]) == col)
                    or (("avg_" + x["name"]) == col)
                    or (("count_" + x["name"]) == col)
                ),
                None,
            )

            if colObj is not None:
                if colObj["type"] == "datetime":
                    self.df[colObj["name"]] = self.df[colObj["name"]].astype(str)
                    dataType = "categorical"
                    dataValue = "time"
                else:
                    dataType = colObj["type"]
                    dataValue = "attribute"
                suffix = colObj["suffix"] if "suffix" in colObj else ""
                prefix = colObj["prefix"] if "prefix" in colObj else ""

            else:
                # for non defined columns - check for data type and time columns and assign col types
                suffix = ""
                prefix = ""
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
                if is_numeric_dtype(self.df[col]):
                    if is_bool_dtype(self.df[col]):
                        dataType = "categorical"
                        dataValue = "attribute"
                    else:
                        dataType = "continuous"
                        dataValue = "metric"
                elif is_datetime64_any_dtype(self.df[col]):
                    dataType = "categorical"
                    dataValue = "time"
                    self.df[col] = self.df[col].dt.date.astype(str)
                elif is_string_dtype(self.df[col]):
                    if col in ["week", "year", "quarter", "date", "month"]:
                        dataType = "categorical"
                        dataValue = "time"
                    else:
                        dataType = "categorical"
                        dataValue = "attribute"
                elif is_object_dtype(self.df[col]):
                    if isinstance(self.df[col][0], datetime.date):
                        dataType = "categorical"
                        dataValue = "time"
                        # parse date colums
                        self.df[col] = self.df[col].astype(str)
                    else:
                        dataType = "categorical"
                        dataValue = "attribute"
                else:
                    dataType = "categorical"
                    dataValue = "attribute"

            colMetadata.append(
                {
                    "name": col,
                    "dataType": dataType,
                    "dataValue": dataValue,
                    "suffix": suffix,
                    "prefix": prefix,
                }
            )
        # sort list based on datatype - continuous or categorical
        self.metadata = sorted(colMetadata, key=lambda k: k["dataType"])

    def getWidgetTypes(self):
        """Generates relevant chart types based on dataframe metadata"""
        columnCombination = [x["dataType"] for x in self.metadata]
        columnValues = [x["dataValue"] for x in self.metadata]
        sorted_columnCombination = sorted(columnCombination)
        # dataframe columns rearranged based on sorted columns
        sortedMetadata = sorted(self.metadata, key=lambda k: k["dataType"])
        columns_name = [x["name"] for x in sortedMetadata]
        df = self.df.reindex(columns=columns_name)
        chartsTime = []
        charts = []

        def name_type_mapper(items):
            return [{"name": el, "type": el if el in ["card", "dataTable"] else "chart"} for el in items]

        if len(df) == 1 and len(df.columns) < 3:
            charts = ["card"]
            chartsTime = ["card"]
        elif sorted_columnCombination == sorted(["continuous", "continuous"]):
            charts = ["scatter"]
        elif sorted_columnCombination == sorted(["continuous", "continuous", "categorical"]):
            charts = ["scatter-categorical"]
        elif sorted_columnCombination == sorted(["continuous", "continuous", "continuous"]):
            charts = ["bubble"]
            chartsTime = ["multiline-format"]
        elif sorted_columnCombination == sorted(["continuous", "continuous", "continuous", "categorical"]):
            charts = ["bubble-categorical"]
        elif sorted_columnCombination == sorted(["continuous", "categorical"]):
            if len(pd.unique(df.iloc[:, 0])) > 12:
                chartsTime = ["line"]
            else:
                chartsTime = ["line", "bar", "pie"]
            charts = ["bar", "pie"]
        elif sorted_columnCombination == sorted(["categorical", "categorical", "continuous"]):
            if len(pd.unique(df.iloc[:, 0])) >= 12 or len(pd.unique(df.iloc[:, 1])) >= 12:
                charts = ["sunburst", "treemap"]
                chartsTime = ["area", "multiline", "sunburst", "treemap"]
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
                chartsTime = ["area", "multiline", "heatmap", "sunburst", "treemap"]
        elif sum(1 for x in sorted_columnCombination if x == "continuous") == 1:
            charts = ["sunburst", "treemap"]
            chartsTime = ["sunburst", "treemap"]
        else:
            # default data table is added later
            charts = []
            chartsTime = []

        charts.append("dataTable")
        chartsTime.append("dataTable")

        self.columnCombination = columnCombination
        if "time" in columnValues:
            self.widgetTypes = name_type_mapper(chartsTime)
        else:
            self.widgetTypes = name_type_mapper(charts)

    def generateWidgetTitle(self):
        """Generates chart title from user query"""
        question = self.user_query.lower().replace("?", "")
        patterns = [
            (r"what are the ", ""),
            (r"what is the ", ""),
            (r"how many", ""),
            (r"who are the", ""),
            (r"what were the ", ""),
            (r"which ", ""),
            (r"what was the", ""),
            (r"how were the", ""),
            (r"plot me", ""),
            (r"plot the ", ""),
            (r"plot my", ""),
            (r"can you plot me", ""),
            (r"can you plot my", ""),
            (r"can you show me", ""),
            (r"can you show my", ""),
            (r"can you plot", ""),
            (r"can you show", ""),
            (r"show me", ""),
            (r"how is", ""),
            (r"plot", ""),
            (r"compare", ""),
            (r"how have i", ""),
            (r"pull me", ""),
        ]
        for pattern, replacement in patterns:
            if re.match(pattern, question):
                text = re.sub(pattern, replacement, question)
                self.title = text
                break
            else:
                self.title = question

    def generateWidgetObjects(self):
        """Generates chart objects"""
        self.widgets = []
        for el in self.widgetTypes:
            try:
                self.widgets.append(
                    {
                        "name": el["name"],
                        "type": el["type"],
                        "title": self.title,
                        "value": getChartObject(
                            self.df,
                            el["name"],
                            self.metadata,
                            self.user_query,
                            self.sql_query,
                            self.config["config"]["context"],
                        ),
                    }
                )
            except Exception as e:
                logging.error("Error Generating chart object - {el}".format(el=str(el)) + str(e))
        if len(self.widgets) == 0:
            self.widgets = None


def parseDfDate(df):
    "casts dataframe columns into string type"
    for x in df.select_dtypes(include=["datetime64", "object"]).columns.tolist():
        df[x] = df[x].astype(str)
    return df


def getChartObject(df, chartType, metaData, question, sqlQuery, tenant_context, theme="dark"):
    """gets chart object dictionaries based on chart types"""

    if chartType in ["pie"]:
        inst = PieChart(parseDfDate(df), chartType, metaData, question)
        response = inst.getChart()
    elif chartType in [
        "stacked bar",
        "grouped bar",
        "horizontal stacked",
        "horizontal grouped",
        "100-horizontal stack",
        "100 stack",
        "bar",
    ]:
        inst = BarChart(parseDfDate(df), chartType, metaData, question)
        response = inst.getChart()
    elif chartType in ["line", "multiline", "area", "multiline-format", "area-format"]:
        inst = LineAreaChart(df, chartType, metaData, question)
        response = inst.getChart()
    elif chartType in ["geo-choropleth", "geo-bubble"]:
        inst = GeoChart(df, chartType, metaData, question)
        response = inst.getChart()
    elif chartType in ["sunburst", "treemap"]:
        inst = SunburstTreemapChart(parseDfDate(df), chartType, metaData, question)
        response = inst.getChart()
    elif chartType in ["heatmap"]:
        inst = HeatMapChart(parseDfDate(df), chartType, metaData, question)
        response = inst.getChart()
    elif chartType in [
        "scatter",
        "scatter-categorical",
        "bubble",
        "bubble-categorical",
    ]:
        inst = ScatterChart(parseDfDate(df), chartType, metaData, question)
        response = inst.getChart()
    elif chartType in ["card"]:
        inst = Card(df, chartType, metaData, question)
        response = inst.getChart()

    elif chartType in ["dataTable"]:
        inst = DataTable(df, chartType, metaData, question)
        response = inst.getChart()
    # chart formatting
    if chartType not in ["dataTable", "card"]:
        response = getChartTheme(response, theme, chartType, metaData)
    return response


def getChartTheme(chartObject, theme, chartType, metaData):
    """generates chart theme"""
    if "xaxis" in chartObject["layout"] and "title" in chartObject["layout"]["xaxis"]:
        chartObject["layout"]["xaxis"]["title"]["font"] = {
            "color": theme_config.COLOR_THEME["light"]["primary_font_color"]
            if theme == "light"
            else theme_config.COLOR_THEME["dark"]["primary_font_color"],
            "family": "Roboto",
        }

    if "yaxis" in chartObject["layout"] and "title" in chartObject["layout"]["yaxis"]:
        chartObject["layout"]["yaxis"]["title"]["font"] = {
            "color": theme_config.COLOR_THEME["light"]["primary_font_color"]
            if theme == "light"
            else theme_config.COLOR_THEME["dark"]["primary_font_color"],
            "family": "Roboto",
        }

    if "legend" in chartObject["layout"] and "title" in chartObject["layout"]["legend"]:
        chartObject["layout"]["legend"]["title"]["font"] = {
            "color": theme_config.COLOR_THEME["light"]["primary_font_color"]
            if theme == "light"
            else theme_config.COLOR_THEME["dark"]["primary_font_color"],
            "family": "Roboto",
        }

    # font
    chartObject["layout"]["font"] = {
        "family": "Roboto",
        "color": theme_config.COLOR_THEME["light"]["primary_font_color"]
        if theme == "light"
        else theme_config.COLOR_THEME["dark"]["primary_font_color"],
    }
    chartObject["layout"]["paper_bgcolor"] = (
        theme_config.COLOR_THEME["light"]["paper_bg_color"]
        if theme == "light"
        else theme_config.COLOR_THEME["dark"]["paper_bg_color"]
    )
    # colorway
    if chartType in [
        "pie",
        "stacked bar",
        "grouped bar",
        "horizontal stacked",
        "horizontal grouped",
        "100-horizontal stack",
        "100 stack",
        "bar",
        "sunburst",
        "treemap",
        "line",
        "multiline",
        "area",
        "multiline-format",
        "area-format",
        "scatter",
        "scatter-categorical",
        "bubble",
        "bubble-categorical",
    ]:
        chartObject["layout"]["colorway"] = theme_config.COLOR_THEME["light"]["colorway"]
    # background colors
    chartObject["layout"]["paper_bgcolor"] = (
        theme_config.COLOR_THEME["light"]["paper_bg_color"]
        if theme == "light"
        else theme_config.COLOR_THEME["dark"]["paper_bg_color"]
    )
    chartObject["layout"]["plot_bgcolor"] = theme_config.COLOR_THEME["light"]["plot_bg_color"]
    # gridColor and marker for bar charts
    if chartType in [
        "stacked bar",
        "grouped bar",
        "100 stack",
        "bar",
        "line",
        "multiline",
        "area",
        "multiline-format",
        "area-format",
        "scatter",
        "scatter-categorical",
        "bubble",
        "bubble-categorical",
    ]:
        if "yaxis" in chartObject["layout"]:
            chartObject["layout"]["yaxis"]["gridcolor"] = (
                theme_config.COLOR_THEME["light"]["grid_color"]
                if theme == "light"
                else theme_config.COLOR_THEME["dark"]["grid_color"]
            )
        else:
            chartObject["layout"]["yaxis"] = {
                "gridcolor": theme_config.COLOR_THEME["light"]["grid_color"]
                if theme == "light"
                else theme_config.COLOR_THEME["dark"]["grid_color"]
            }
        if chartType in ["bar", "line"]:
            chartObject["data"][0]["marker"] = {
                "color": theme_config.COLOR_THEME["light"]["colorway"][0],
                "line": {
                    "color": theme_config.COLOR_THEME["light"]["colorway"][0],
                    "width": 1.5,
                },
            }
    if chartType in [
        "horizontal stacked",
        "horizontal grouped",
        "100-horizontal stack",
        "scatter",
        "scatter-categorical",
        "bubble",
        "bubble-categorical",
    ]:
        if "xaxis" in chartObject["layout"]:
            chartObject["layout"]["xaxis"]["gridcolor"] = (
                theme_config.COLOR_THEME["light"]["grid_color"]
                if theme == "light"
                else theme_config.COLOR_THEME["dark"]["grid_color"]
            )
        else:
            chartObject["layout"]["xaxis"] = {
                "gridcolor": theme_config.COLOR_THEME["light"]["grid_color"]
                if theme == "light"
                else theme_config.COLOR_THEME["dark"]["grid_color"]
            }

    # sunburst, treemap
    if chartType in ["sunburst", "treemap"]:
        chartObject["data"][0]["outsidetextfont"]["color"] = theme_config.COLOR_THEME["light"]["sunburst_font_color"]
    # heatmap
    if chartType == "heatmap":
        chartObject["data"][0]["colorscale"] = theme_config.COLOR_THEME["light"]["colorscale"]

    return chartObject
