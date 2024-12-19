import json


class WidgetDTO:
    def __init__(self, widget):
        self.id = widget.id
        self.widget_index = widget.widget_index
        self.widget_key = widget.widget_key
        self.is_label = widget.is_label
        self.config = json.loads(widget.config) if widget.config else False


class ArchivedUiacListDTO:
    """
    DTO to return archived UIAC list
    """

    def __init__(self, record, type):
        self.id = record.AppScreenWidgetValue.id
        self.widget_value = json.loads(record.AppScreenWidgetValue.widget_value)
        self.widget_id = record.AppScreenWidgetValue.widget_id
        self.widget_title = json.loads(record.AppScreenWidget.config).get("title", "")
        self.screen_id = record.AppScreen.id
        self.screen_title = record.AppScreen.screen_name
        self.is_deleted_screen = True if record.AppScreen.deleted_at else False
        self.type = type
