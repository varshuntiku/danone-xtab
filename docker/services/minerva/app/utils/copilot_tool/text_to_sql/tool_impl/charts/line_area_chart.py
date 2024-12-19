#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import pandas as pd
import plotly.graph_objects as go
from tool_impl.charts.basechart import BaseChart
from tool_impl.charts.chart_builder import ChartBuilder


class LineAreaChart(BaseChart):
    """This class deals with Line and Area charts

    Attributes:
        df: Dataframe
        chartType: Type of chart
        metaData: Dataframe metadata
        title: chart Title

    Methods:
        __init__: class object constructor
        fillMissingDates: Fills missing dates if any
        getChart: Returns chart object dictionary

    """

    def __init__(self, df, chartType, metaData, title):
        super().__init__(df, chartType, metaData, title)

    def fillMissingDates(values, date_values, date_range):
        missing_dates = [x for x in date_range if x not in date_values]
        missing_date_index = [date_range.index(x) for x in missing_dates]
        for i, j in zip(missing_date_index, missing_dates):
            date_values.insert(i, j)
            values.insert(i, 0)
        return values, date_values

    def getChart(self):
        """Line/Area chart

        Returns:
            Dict: chart object dictionary
        """
        timeCol = next(col for col in self.metaData if col["dataValue"] == "time")
        numericalCol = next(
            col for col in self.metaData if (col["data_type"] == "continuous" and col["dataValue"] != "time")
        )

        if self.chartType == "line":
            chart = ChartBuilder(chart_type_attr="Scatter", title="dummy_title")
            chart.add_trace(
                mode="lines",
                x=self.df[timeCol["name"]].tolist(),
                y=self.df[numericalCol["name"]].tolist(),
                name=numericalCol["name"],
                # type=self.chartType,
            )
        else:
            # separate logic for series present as separate columns and series present as subset of same column/dataframe
            if self.chartType in ["multiline-format", "area-format"]:
                numCols = [
                    col for col in self.metaData if (col["data_type"] == "continuous" and col["dataValue"] != "time")
                ]
                self.df[timeCol["name"]] = pd.to_datetime(self.df[timeCol["name"]])
                self.df[timeCol["name"]] = self.df[timeCol["name"]].dt.strftime("%d %B %Y")

                groupedDf = {
                    col["name"]: pd.DataFrame(
                        {
                            timeCol["name"]: self.df[timeCol["name"]],
                            numericalCol["name"]: self.df[col["name"]],
                        }
                    )
                    for col in numCols
                }
            else:
                catCol = next(
                    col for col in self.metaData if (col["data_type"] == "categorical" and col["dataValue"] != "time")
                )
                groupedDf = dict(tuple(self.df.groupby(catCol["name"])))
            unique_dates = self.df[timeCol["name"]].unique().tolist()
            chart = ChartBuilder(chart_type_attr="Scatter", title="dummy_title")
            for uniqueVal in groupedDf.keys():
                subsetDf = groupedDf[uniqueVal]
                yvalues = subsetDf[numericalCol["name"]].tolist()
                xvalues = subsetDf[timeCol["name"]].tolist()
                if len(xvalues) != len(unique_dates):
                    yvalues, xvalues = LineAreaChart.fillMissingDates(yvalues, xvalues, unique_dates)

                chart.add_trace(
                    x=xvalues,
                    y=yvalues,
                    mode="lines",
                    stackgroup=None if self.chartType in ["multiline", "multiline-format"] else "one",
                    text=uniqueVal,
                    showlegend=True,
                    name=uniqueVal,
                )

        chart.update_layout(
            autosize=True,
            hovermode="closest",
            title=go.layout.Title(text=self.title),
            xaxis=go.layout.XAxis(
                title=go.layout.xaxis.Title(text=timeCol["name"].upper()),
                autorange=True,
                showticklabels=True,
                tickmode="auto",
                showgrid=False,
                tickangle=45 if len(chart.data[0]["x"]) > 15 else 0,
                type="category",
            ),
            yaxis=go.layout.YAxis(
                title=go.layout.yaxis.Title(
                    text="" if self.chartType in ["multiline-format", "area-format"] else numericalCol["name"].upper()
                ),
                showgrid=False,
                autorange=True,
                gridwidth=1,
            ),
            legend=go.layout.Legend(
                x=1,
                y=1.1,
                xanchor="auto",
                yanchor="auto",
                orientation="h",
                traceorder="normal",
                valign="top",
            ),
            hoverlabel=go.layout.Hoverlabel(font={"size": 17}),
            showlegend=False if self.chartType == "line" else True,
        )

        fig = chart.build()
        return fig.to_dict()
