from starlette import status
from api.schemas.solutionbp.solutionbp_schema import DefaultSolutionBlueprint, Node, OnSaveRequest
mock_user = "test_user"
mock_share_name = "test_share"
mock_directory_path = "test_directory"
mock_name = "test_name"
mock_project_id = 123

# Expected responses
mock_successful_result = {
    "status": "success",
    "status_code": status.HTTP_200_OK,
    "tree": {
        "name": mock_directory_path,
        "children": []
    }
}
mock_source_share_name = "source_share"
mock_destination_share_name = "destination_share"

mock_nodes = OnSaveRequest(project_id=1, visual_graph=["node1", "node2"], actions=[{'action': "action1", 'payload': [{'name': "payload_name", 'path': "path"}]}])

mock_node = DefaultSolutionBlueprint(
    project_id=123,
    bp_name="Mock Blueprint",
    visual_graph=[{"id": 1, "type": "node", "name": "Node 1"}],
    dir_tree=[
        Node(
            name="root",
            selected=True,
            nodeId=1,
            icon="folder",
            parentNodeId=None,
            bpn="root_bpn",
            action="add",
            child=[
                Node(
                    name="child1",
                    selected=True,
                    nodeId=2,
                    icon="file",
                    parentNodeId=1,
                    bpn="child1_bpn",
                    action="edit",
                    child=[],
                    position={"x": 10, "y": 20},
                ),
                Node(
                    name="child2",
                    selected=False,
                    nodeId=3,
                    icon="folder",
                    parentNodeId=1,
                    bpn="child2_bpn",
                    action="remove",
                    child=[
                        Node(
                            name="grandchild1",
                            selected=True,
                            nodeId=4,
                            icon="file",
                            parentNodeId=3,
                            bpn="grandchild1_bpn",
                            action="view",
                            child=[],
                            position={"x": 15, "y": 25},
                        )
                    ],
                    position={"x": 30, "y": 40},
                ),
            ],
            position={"x": 0, "y": 0},
        )
    ]
)
