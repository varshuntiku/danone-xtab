class SolutionbpDetailDTO:
    """
    Data Tranformation Object for the Solutionbp Detail.
    """

    def __init__(self, solutionbp):
        self.id = solutionbp.id
        self.name = solutionbp.name
        self.kind = solutionbp.kind
        self.meta_data = solutionbp.meta_data
        self.filepath = solutionbp.filepath
        self.visual_graph = solutionbp.visual_graph
        self.dir_tree = solutionbp.dir_tree
        self.refs = solutionbp.refs
        self.project_id = solutionbp.project.id if solutionbp.project_id else None
