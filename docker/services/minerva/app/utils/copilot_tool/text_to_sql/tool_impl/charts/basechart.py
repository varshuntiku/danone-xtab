#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from abc import ABC, abstractmethod


class BaseChart(ABC):
    """This is an abstract class

    Attributes:
        df: Dataframe
        chartType: Type of chart
        metaData: Dataframe metadata
        title: chart Title

    Methods:
        __init__: class object constructor
        getChart: abstract method
        generateChartTitle: generates chart title
        generateAxisLabels: generates axis labels

    """

    def __init__(self, df, chartType, metaData, title):
        self.df = df
        self.chartType = chartType
        self.metaData = metaData
        self.title = title

    @abstractmethod
    def getChart(self):
        pass

    def generateAxisLabels(text_input, metaData):
        """
        Remove underscores from axis titles. Replace aggregation functions as - sum of, count of, etc. Uppercase the final text
        Add prefix/suffix to axis name
        """
        text_input = text_input.lower()
        add_on_text = ""
        colObj = next(col for col in metaData if (col["name"] == text_input))
        if "prefix" in colObj:
            if colObj["prefix"] is not None and colObj["prefix"] != "":
                add_on_text = add_on_text + " (" + colObj["prefix"] + ")"
        if "suffix" in colObj:
            if colObj["suffix"] is not None and colObj["suffix"] != "":
                add_on_text = add_on_text + " (" + colObj["suffix"] + ")"

        axis_title = text_input.replace("sum_", "sum of ")
        axis_title = axis_title.replace("avg_", "Average ")
        axis_title = axis_title.replace("count_", "count of ")
        axis_title = axis_title.replace("(distinct)", " of distinct ")
        axis_title = axis_title.replace("_", " ")
        axis_title = axis_title.replace("(", "")
        axis_title = axis_title.replace(")", "")
        axis_title = axis_title.upper()
        axis_title = axis_title + add_on_text
        return axis_title
