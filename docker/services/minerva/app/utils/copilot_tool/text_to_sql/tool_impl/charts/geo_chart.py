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


class GeoChart(BaseChart):
    """This class deals with Geo chart

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
        """Geo chart

        Returns:
            Dict: chart object dictionary
        """
        geoCol = next(col for col in self.metaData if col["dataValue"] == "geo")
        numericalCol = next(
            col for col in self.metaData if (col["data_type"] == "continuous" and col["dataValue"] != "geo")
        )
        if self.chartType == "geo-choropleth":
            chart = ChartBuilder(chart_type_attr="Choropleth", title="dummy_title")
            chart.add_trace(
                type="choropleth",
                locations=self.df[geoCol["name"]].tolist(),
                z=self.df[numericalCol["name"]].tolist(),
                text=self.df[geoCol["name"]].tolist(),
                colorbar=go.choropleth.ColorBar(
                    title=go.choropleth.colorbar.Title(
                        text=BaseChart.generateAxisLabels(numericalCol["name"], self.metaData)
                    ),
                    thickness=25,
                    len=0.7,
                    x=0.92,
                ),
                marker=go.choropleth.Marker(line={"width": 2}),
            )
        elif self.chartType == "geo-bubble":
            min = self.df[numericalCol["name"]].min()
            max = self.df[numericalCol["name"]].max()
            scaled = ((self.df[numericalCol["name"]] - min) / (max - min) * 100) + 30

            chart = ChartBuilder(chart_type_attr="Scattergeo", title="dummy_title")
            chart.add_trace(
                type="scattergeo",
                mode="markers",
                locations=self.df[geoCol["name"]].tolist(),
                text=self.df[numericalCol["name"]].tolist(),
                marker=go.scattergeo.Marker(
                    line={"width": 2},
                    size=scaled.tolist(),
                    color=self.df[numericalCol["name"]].tolist(),
                    cmin=min,
                    cmax=max,
                    colorbar=go.scattergeo.marker.ColorBar(
                        title=go.scattergeo.marker.colorbar.Title(
                            text=BaseChart.generateAxisLabels(numericalCol["name"], self.metaData)
                        ),
                        thickness=25,
                        len=0.7,
                        x=0.92,
                    ),
                ),
            )

        chart.update_layout(
            autosize=True,
            showlegend=False,
            hoverlabel=go.layout.Hoverlabel(font={"size": 17}),
            margin=go.layout.Margin(t=100, b=0, l=0, r=0),
            title=go.layout.Title(text=self.title),
            geo=go.layout.Geo(showland=True),
        )
        fig = chart.build()
        return fig.to_dict()
