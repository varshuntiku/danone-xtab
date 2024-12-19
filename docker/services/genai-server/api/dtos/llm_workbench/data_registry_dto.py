class DatasetDTO:
    """
    Data Tranformation Object for the Dataset Models.
    """

    def __init__(self, dataset) -> None:
        self.id = dataset.id
        self.dataset_name = dataset.dataset_name
        self.source_type = dataset.source.source_type if dataset.source else None
        self.dataset_name = dataset.dataset_name
        self.file_name = dataset.file_name
        self.file_path = dataset.file_path
        self.file_type = dataset.file_type
        self.dataset_folder = dataset.dataset_folder
        self.access_token = dataset.access_token
        self.created_at = str(dataset.created_at)
