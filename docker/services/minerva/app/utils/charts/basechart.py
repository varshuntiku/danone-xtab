#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import re
from abc import ABC, abstractmethod


class BaseChart(ABC):
    """This is an abstract class

    Attributes:
        df: Dataframe
        chartType: Type of chart
        metaData: Dataframe metadata
        question: User query

    Methods:
        __init__: class object constructor
        getChart: abstract method
        generateChartTitle: generates chart title
        generateAxisLabels: generates axis labels

    """

    def __init__(self, df, chartType, metaData, question):
        self.df = df
        self.chartType = chartType
        self.metaData = metaData
        self.question = question

    @abstractmethod
    def getChart(self):
        pass

    def generateChartTitle(question):
        question = question.lower()
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
                chartTitle = re.sub(pattern, replacement, question)
                break
            else:
                chartTitle = question
            return chartTitle.upper()

    def generateAxisLabels(text_input, metaData):
        """
        Remove underscores from axis titles. Replace aggregation functions as - sum of, count of, etc. Uppercase the final text
        Add prefix/suffix to axis name
        """
        text_input = text_input.lower()
        add_on_text = ""
        try:
            colObj = next(col for col in metaData if (col["name"] == text_input))
            if colObj["prefix"] is not None and colObj["prefix"] != "":
                add_on_text = add_on_text + " (" + colObj["prefix"] + ")"
            elif colObj["suffix"] is not None and colObj["suffix"] != "":
                add_on_text = add_on_text + " (" + colObj["suffix"] + ")"
        except Exception as e:
            print("error appending prefix/suffix to axes name - ", e)
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
