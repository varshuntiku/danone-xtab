#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import plotly.graph_objects as go
from tool_impl.charts.basechart import BaseChart
from tool_impl.charts.chart_builder import ChartBuilder


class PieChart(BaseChart):
    """This class deals with Pie chart

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
        """Pie chart

        Returns:
            Dict: chart object dictionary
        """
        numericalCol = next(col for col in self.metaData if col["data_type"] == "continuous")
        catCol = next(col for col in self.metaData if col["data_type"] == "categorical")

        chart = ChartBuilder(chart_type_attr="Pie", title="dummy_title")
        chart.add_trace(
            type="pie",
            values=self.df[numericalCol["name"]].tolist(),
            labels=self.df[catCol["name"]].tolist(),
            textinfo="label+percent",
            name=catCol["name"],
            hole=0.45,
            textposition="inside",
        )
        chart.update_layout(
            autosize=True,
            showlegend=False,
            title=go.layout.Title(text=self.title),
            hoverlabel=go.layout.Hoverlabel(font={"size": 17}),
        )
        fig = chart.build()
        return fig.to_dict()
