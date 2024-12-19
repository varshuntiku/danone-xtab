class HuggingFaceModelDTO:
    """
    Data Tranformation Object for the Huggingface models.
    """

    def __init__(self, huggingface_model):
        self.id = huggingface_model["id"]
        self.downloads = huggingface_model["downloads"]
        self.likes = huggingface_model["likes"]
        self.lastModified = huggingface_model["lastModified"]
        self.pipeline_tag = huggingface_model["pipeline_tag"] if "pipeline_tag" in huggingface_model else None
        self.avatarUrl = huggingface_model["authorData"]["avatarUrl"] if "author" in huggingface_model else None


class PaginatedHuggingfaceModelDTO:
    """
    Data Tranformation Object for Paginated Huggingface models.
    """

    def __init__(self, huggingface_model, models_list):
        self.models = models_list
        self.numItemsPerPage = huggingface_model["numItemsPerPage"]
        self.numTotalItems = huggingface_model["numTotalItems"]
        self.pageIndex = huggingface_model["pageIndex"]
