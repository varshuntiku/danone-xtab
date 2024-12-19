import plotly.graph_objects as go


class ChartBuilder:
    """Builder class for chart objects"""

    def __init__(self, chart_type_attr, title="chart"):
        self.chart_type_attr = chart_type_attr
        self.data = []
        self.layout = go.Layout(title=title)

    def add_trace(self, **kwargs):
        trace = getattr(go, self.chart_type_attr)(**kwargs)
        self.data.append(trace)

    def update_layout(self, **kwargs):
        fig = go.Figure(data=self.data, layout=self.layout)
        fig.update_layout(**kwargs)
        self.layout = fig.layout

    def build(self):
        fig = go.Figure(data=self.data, layout=self.layout)
        return fig
