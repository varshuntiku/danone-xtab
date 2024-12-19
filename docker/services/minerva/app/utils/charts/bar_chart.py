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


class BarChart(BaseChart):
    """This class deals with bar charts

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
        """Barchart

        Returns:
            Dict: chart object dictionary
        """
        xaxisTitle = ""
        yaxisTitle = ""
        barmode = ""
        legendTitle = ""
        if self.chartType == "bar":
            numericalCol = next(col for col in self.metaData if col["dataType"] == "continuous")
            catCol = next(col for col in self.metaData if col["dataType"] == "categorical")

            chart = ChartBuilder(chart_type_attr="Bar", title="dummy_title")
            chart.add_trace(
                type="bar",
                x=self.df[catCol["name"]].tolist(),
                y=self.df[numericalCol["name"]].tolist(),
                name=catCol["name"],
            )
            xaxisTitle = catCol["name"]
            yaxisTitle = numericalCol["name"]
            legendTitle = catCol["name"]
            barmode = "stack"
        else:
            if self.chartType in ["stacked bar", "horizontal stacked"]:
                barmode = "stack"
            elif self.chartType in ["100-horizontal stack", "100 stack"]:
                barmode = "relative"
            else:
                barmode = "group"
            numericalCol = next(col for col in self.metaData if col["dataType"] == "continuous")
            catCol1 = next(col for col in self.metaData if col["dataType"] == "categorical")
            catCol2 = next(
                col for col in self.metaData if (col["dataType"] == "categorical" and col["name"] != catCol1["name"])
            )
            xaxisTitle = (
                numericalCol["name"]
                if (
                    self.chartType
                    in [
                        "horizontal grouped",
                        "horizontal stacked",
                        "100-horizontal stack",
                    ]
                )
                else catCol1["name"]
            )
            yaxisTitle = (
                catCol1["name"]
                if (
                    self.chartType
                    in [
                        "horizontal grouped",
                        "horizontal stacked",
                        "100-horizontal stack",
                    ]
                )
                else numericalCol["name"]
            )
            if self.chartType in ["100-horizontal stack", "100 stack"]:
                groupedDf = (
                    self.df.groupby([catCol1["name"], catCol2["name"]])[numericalCol["name"]]
                    .sum()
                    .rename(numericalCol["name"])
                )
                groupedDf = (groupedDf / groupedDf.groupby(level=0).sum()).reset_index()
                groupedDf[numericalCol["name"]] = groupedDf[numericalCol["name"]] * 100
                groupedDf = dict(tuple(groupedDf.groupby(catCol2["name"])))
            else:
                groupedDf = dict(tuple(self.df.groupby(catCol2["name"])))
            legendTitle = catCol1["name"]
            chart = ChartBuilder(chart_type_attr="Bar", title="dummy_title")
            for uniqueVal in self.df[catCol2["name"]].unique().tolist():
                subsetDf = groupedDf[uniqueVal]
                continuousValues = subsetDf[numericalCol["name"]].tolist()
                categoricalValues = subsetDf[catCol1["name"]].tolist()

                chart.add_trace(
                    type="bar",
                    x=continuousValues
                    if (
                        self.chartType
                        in [
                            "horizontal grouped",
                            "horizontal stacked",
                            "100-horizontal stack",
                        ]
                    )
                    else categoricalValues,
                    y=categoricalValues
                    if (
                        self.chartType
                        in [
                            "horizontal grouped",
                            "horizontal stacked",
                            "100-horizontal stack",
                        ]
                    )
                    else continuousValues,
                    name=uniqueVal,
                    text=uniqueVal,
                    showlegend=True,
                    orientation="h"
                    if (
                        self.chartType
                        in [
                            "horizontal grouped",
                            "horizontal stacked",
                            "100-horizontal stack",
                        ]
                    )
                    else "v",
                )

        chart.update_layout(
            barmode=barmode,
            autosize=True,
            hovermode="closest",
            showlegend=True,
            hoverlabel=go.layout.Hoverlabel(font={"size": 17}),
            title=go.layout.Title(text=BaseChart.generateChartTitle(self.question)),
            legend=go.layout.Legend(
                x=1,
                y=1.1,
                xanchor="auto",
                yanchor="auto",
                orientation="h",
                traceorder="normal",
                valign="top",
                title={"text": legendTitle},
            ),
            xaxis=go.layout.XAxis(
                title=go.layout.xaxis.Title(text=xaxisTitle.upper()),
                autorange=True,
                gridwidth=0.1,
                showgrid=True
                if (
                    self.chartType
                    in [
                        "horizontal grouped",
                        "horizontal stacked",
                        "100-horizontal stack",
                    ]
                )
                else False,
            ),
            yaxis=go.layout.YAxis(
                title=go.layout.yaxis.Title(text=yaxisTitle.upper()),
                autorange=True,
                gridwidth=0.1,
                showgrid=False
                if (
                    self.chartType
                    in [
                        "horizontal grouped",
                        "horizontal stacked",
                        "100-horizontal stack",
                    ]
                )
                else True,
            ),
        )
        fig = chart.build()
        return fig.to_dict()
