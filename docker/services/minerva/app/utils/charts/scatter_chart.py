#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#
import plotly.express as px
from app.utils.charts.basechart import BaseChart


class ScatterChart(BaseChart):
    """This class deals with Scatter chart

    Attributes:
        df: Dataframe
        chartType: Type of chart
        metaData: Dataframe metadata
        question: User query

    Methods:
        __init__: class object constructor
        getChart: Returns chart object dictionary

    """

    def __init__(self, df, chartType, metaData, question):
        super().__init__(df, chartType, metaData, question)

    def getChart(self):
        """Scatter chart

        Returns:
            Dict: chart object dictionary
        """
        numericalCol1 = next(col for col in self.metaData if col["dataType"] == "continuous")
        numericalCol2 = next(
            col for col in self.metaData if col["dataType"] == "continuous" and col["name"] != numericalCol1["name"]
        )
        if self.chartType == "scatter":
            fig = px.scatter(self.df, x=numericalCol1["name"], y=numericalCol2["name"])
            fig_dict = fig.to_dict()
            fig_dict["layout"] = {}
        elif self.chartType == "scatter-categorical":
            catCol = next(col for col in self.metaData if col["dataType"] == "categorical")
            fig = px.scatter(self.df, x=numericalCol1["name"], y=numericalCol2["name"], color=catCol["name"])
            fig_dict = fig.to_dict()
        elif self.chartType == "bubble":
            numericalCol3 = next(
                col
                for col in self.metaData
                if col["dataType"] == "continuous"
                and col["name"] != numericalCol1["name"]
                and col["name"] != numericalCol2["name"]
            )
            fig = px.scatter(self.df, x=numericalCol1["name"], y=numericalCol2["name"], size=numericalCol3["name"])
            fig_dict = fig.to_dict()
        elif self.chartType == "bubble-categorical":
            numericalCol3 = next(
                col
                for col in self.metaData
                if col["dataType"] == "continuous"
                and col["name"] != numericalCol1["name"]
                and col["name"] != numericalCol2["name"]
            )
            catCol = next(col for col in self.metaData if col["dataType"] == "categorical")
            fig = px.scatter(
                self.df,
                x=numericalCol1["name"],
                y=numericalCol2["name"],
                size=numericalCol3["name"],
                color=catCol["name"],
            )
            fig_dict = fig.to_dict()
        fig_dict["layout"]["autosize"] = True
        fig_dict["layout"]["title"] = BaseChart.generateChartTitle(self.question)
        for i in fig_dict["data"]:
            if self.chartType == "bubble-categorical" or self.chartType == "bubble":
                i["marker"]["size"] = i["marker"]["size"].tolist()
            i["x"] = i["x"].tolist()
            i["y"] = i["y"].tolist()
        return fig_dict
