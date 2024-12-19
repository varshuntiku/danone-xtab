#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from tool_impl.charts.basechart import BaseChart


class Card(BaseChart):
    """This class deals with card visualisation

    Attributes:
        df: Dataframe
        chartType: Type of chart
        metaData: Dataframe metadata
        title: chart Title

    Methods:
        __init__: class object constructor
        getChart: Returns chart object dictionary

    """

    def __init__(self, df, chartType, metaData, title):
        super().__init__(df, chartType, metaData, title)

    def getChart(self):
        """Card

        Returns:
            Dict: chart object dictionary
        """
        data = {
            "values": [self.df[i].tolist() for i in self.df.columns],
            "columns": [BaseChart.generateAxisLabels(col, self.metaData) for col in list(self.df.columns)],
        }
        return {"data": data, "layout": {}}
