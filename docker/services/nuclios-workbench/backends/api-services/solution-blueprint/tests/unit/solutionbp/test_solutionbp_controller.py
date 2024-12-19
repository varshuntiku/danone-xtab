import pytest
from unittest.mock import AsyncMock, patch
from starlette import status
from tests.unit.solutionbp.mocks.solutionbp_mock import mock_successful_result, mock_name, mock_directory_path, mock_share_name, mock_project_id, mock_user, mock_destination_share_name, mock_source_share_name, mock_node, mock_nodes
from api.controllers.solutionbp.solutionbp_controller import SolutionBlueprintController


@patch("api.controllers.solutionbp.solutionbp_controller.SolutionBlueprintService")
@pytest.mark.asyncio
async def test_unit_controller_get_directory_tree(mock_solution_bp_service):
    # Setup
    controller = SolutionBlueprintController()

    # Create an async mock for the get_directory_tree service call
    mock_solution_bp_service_instance = AsyncMock()
    mock_solution_bp_service_instance.get_directory_tree.return_value = mock_successful_result
    mock_solution_bp_service.return_value = mock_solution_bp_service_instance
    controller.solution_bp_service = mock_solution_bp_service_instance

    # Call the controller method
    response = await controller.get_directory_tree(
        mock_user, mock_share_name, mock_directory_path, mock_name, mock_project_id
    )

    # Assert that response has the correct successful status and data
    assert response["status"] == "success"
    assert response["status_code"] == status.HTTP_200_OK
    assert "tree" in response
    assert response["tree"] == mock_successful_result["tree"]

    # Ensure the mocked service was called with expected parameters
    mock_solution_bp_service_instance.get_directory_tree.assert_called_once_with(
        mock_user, mock_share_name, mock_directory_path, mock_name, mock_project_id
    )


@patch("api.controllers.solutionbp.solutionbp_controller.SolutionBlueprintService")
@pytest.mark.asyncio
async def test_unit_controller_save_solution_bpn_success(mock_solution_bp_service):
    # Setup
    controller = SolutionBlueprintController()

    # Configure the mock service
    mock_solution_bp_service_instance = AsyncMock()
    mock_solution_bp_service_instance.process_save_actions.return_value = {"status": "success"}
    mock_solution_bp_service_instance.save_solution_bp.return_value = {"status": "success"}

    # Assign the mocked service instance to the controller
    controller.solution_bp_service = mock_solution_bp_service_instance

    # Call the controller method
    response = await controller.save_solution_bpn(
        mock_user, mock_source_share_name, mock_destination_share_name, mock_nodes
    )

    # Assertions for success scenario
    assert response["status"] == "success"
    assert response["status_code"] == status.HTTP_200_OK
    assert response["message"] == "Blueprint saved successfully."
    assert response["project_id"] == mock_nodes.project_id
    assert response["visual_graph"] == mock_nodes.visual_graph
    assert response["dir_tree"] == {"status": "success"}  # Expected response from save_solution_bp

    # Verify calls to service methods
    mock_solution_bp_service_instance.process_save_actions.assert_called_once_with(
        mock_source_share_name, mock_destination_share_name, mock_nodes
    )
    mock_solution_bp_service_instance.save_solution_bp.assert_called_once_with(
        mock_user, mock_destination_share_name, mock_nodes
    )


@patch("api.controllers.solutionbp.solutionbp_controller.SolutionBlueprintService")
@pytest.mark.asyncio
async def test_unit_controller_on_default_success(mock_solution_bp_service):
    # Setup
    controller = SolutionBlueprintController()

    # Configure mocks
    mock_solution_bp_service_instance = AsyncMock()
    mock_solution_bp_service_instance.get_directory_tree.return_value = {
        "status": "success", "visual_graph": ["graph"], "dir_tree": ["tree"]
    }
    mock_solution_bp_service_instance.save_solution_bp_on_default.return_value = {"status": "success"}
    controller.solution_bp_service = mock_solution_bp_service_instance

    # Call the controller method
    response = await controller.on_default(mock_user, mock_source_share_name, mock_destination_share_name, mock_node)

    # Assertions for success
    assert response["status"] == "success"
    assert response["status_code"] == status.HTTP_200_OK
    assert response["message"] == "Blueprint saved successfully."
    assert response["project_id"] == mock_node.project_id
    assert response["bp_name"] == mock_node.bp_name
    assert response["visual_graph"] == ["graph"]
    assert response["dir_tree"] == ["tree"]


@patch("api.controllers.solutionbp.solutionbp_controller.SolutionBlueprintService")
@pytest.mark.asyncio
async def test_unit_controller_merge_directory_trees_success(mock_solution_bp_service):
    # Setup
    controller = SolutionBlueprintController()

    # Configure mocks
    mock_solution_bp_service_instance = AsyncMock()
    mock_solution_bp_service_instance.generate_import_actions.return_value = {"status": "success", "data": ["actions"]}
    mock_solution_bp_service_instance.traverse_import_list.return_value = ["traversed_list"]
    mock_solution_bp_service_instance.merge_jsons.return_value = {"status": "success", "data": ["merged"]}
    mock_solution_bp_service_instance.update_node_ids.return_value = {"status": "success"}
    controller.solution_bp_service = mock_solution_bp_service_instance

    # Call the controller method
    response = await controller.merge_directory_trees(1, ["current_state"], ["import_list"])

    # Assertions for success
    assert response["status"] == "success"
    assert response["status_code"] == status.HTTP_200_OK
    assert response["message"] == "Import successful."
    assert response["current_state"] == ["merged"]
    assert response["import_action_list"] == ["actions"]
