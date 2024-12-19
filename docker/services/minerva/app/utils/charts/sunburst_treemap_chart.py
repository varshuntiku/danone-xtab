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
import plotly.graph_objects as go
from app.utils.charts.basechart import BaseChart
from app.utils.charts.chart_builder import ChartBuilder


class SunburstTreemapChart(BaseChart):
    """This class deals with sunburst and treemap charts

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
        """Sunburst/Treemap chart

        Returns:
            Dict: chart object dictionary
        """
        categoricalCols = [col["name"] for col in self.metaData if col["dataType"] == "categorical"]
        numericalCol = next(col for col in self.metaData if col["dataType"] == "continuous")
        fig = (
            px.sunburst(self.df, path=categoricalCols, values=numericalCol["name"])
            if self.chartType == "sunburst"
            else px.treemap(self.df, path=categoricalCols, values=numericalCol["name"])
        )

        chart = (
            ChartBuilder(chart_type_attr="Sunburst", title="dummy_title")
            if self.chartType == "sunburst"
            else ChartBuilder(chart_type_attr="Treemap", title="dummy_title")
        )
        chart.add_trace(
            type=self.chartType,
            labels=fig["data"][0]["labels"].tolist(),
            parents=fig["data"][0]["parents"].tolist(),
            values=fig["data"][0]["values"].tolist(),
            ids=fig["data"][0]["ids"].tolist(),
            outsidetextfont={"size": 20},
            branchvalues="total",
            insidetextfont={"size": 13, "family": "Arial"},
            marker={"line": {"width": 2}},
        )
        chart.update_layout(
            autosize=True,
            showlegend=False,
            hoverlabel=go.layout.Hoverlabel(font={"size": 17}),
            margin=go.layout.Margin(l=100, r=100, pad=5),
            title=go.layout.Title(text=BaseChart.generateChartTitle(self.question)),
        )

        fig = chart.build()
        return fig.to_dict()
