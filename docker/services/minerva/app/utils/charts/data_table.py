from app.utils.charts.basechart import BaseChart


class DataTable(BaseChart):
    """This class deals with datatable

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
        """Datatable

        Returns:
            Dict: chart object dictionary
        """
        data = {
            "values": [self.df[i].tolist() for i in self.df.columns],
            "columns": list(self.df.columns),
        }
        return {"data": data, "layout": {}}
