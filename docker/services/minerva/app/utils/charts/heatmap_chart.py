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
from app.utils.charts.basechart import BaseChart
from app.utils.charts.chart_builder import ChartBuilder


class HeatMapChart(BaseChart):
    """This class deals with heatmap charts.

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
        """Heatmap

        Returns:
            Dict: chart object dictionary
        """
        categoricalCols = [col["name"] for col in self.metaData if col["dataType"] == "categorical"]
        numericalCol = next(col for col in self.metaData if col["dataType"] == "continuous")
        zValues = []
        uniqueX = self.df[categoricalCols[0]].unique().tolist()
        uniqueY = self.df[categoricalCols[1]].unique().tolist()
        for y in uniqueY:
            tempList = []
            for x in uniqueX:
                subset = self.df[numericalCol["name"]][
                    (self.df[categoricalCols[0]] == x) & (self.df[categoricalCols[1]] == y)
                ]
                if len(subset.index) == 0:
                    tempList.append(None)
                elif len(subset.index) == 1:
                    tempList.append(float(subset.iloc[0]))
                elif len(subset.index) > 1:
                    tempList.append(float(subset.iloc[:, 0].mean()))
            zValues.append(tempList)

        chart = ChartBuilder(chart_type_attr="Heatmap", title="dummy_title")
        chart.add_trace(
            type="heatmap",
            z=zValues,
            x=uniqueX,
            y=uniqueY,
            colorbar=go.heatmap.ColorBar(
                title=go.heatmap.colorbar.Title(
                    text=BaseChart.generateAxisLabels(numericalCol["name"], self.metaData),
                    side="top",
                    font={"size": 15},
                )
            ),
        )

        chart.update_layout(
            autosize=True,
            showlegend=False,
            title=go.layout.Title(text=BaseChart.generateChartTitle(self.question)),
            hoverlabel=go.layout.Hoverlabel(font={"size": 17}),
            margin=go.layout.Margin(pad=5, l=100, r=150),
            xaxis=go.layout.XAxis(autorange=True, showticklabels=True, tickangle=0, tickmode="array"),
            yaxis=go.layout.YAxis(autorange=True),
        )

        fig = chart.build()
        return fig.to_dict()
