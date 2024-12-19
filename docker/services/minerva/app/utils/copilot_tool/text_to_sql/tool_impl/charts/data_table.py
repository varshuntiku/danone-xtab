from tool_impl.charts.basechart import BaseChart


class DataTable(BaseChart):
    """This class deals with datatable

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
        """Datatable

        Returns:
            Dict: chart object dictionary
        """
        data = {
            "values": [self.df[i].tolist() for i in self.df.columns],
            "columns": list(self.df.columns),
        }
        return {"data": data, "layout": {}}
