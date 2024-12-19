import pytest


def pytest_collection_modifyitems(items):
    for item in items:
        if "model" in item.name:
            item.add_marker(pytest.mark.model)
        if "model_structure" in item.name:
            item.add_marker(pytest.mark.structure_test)
        if "unit" in item.name:
            item.add_marker(pytest.mark.unit)
        if "unit_schema" in item.name:
            item.add_marker(pytest.mark.unit_schema)
        if "unit_route" in item.name:
            item.add_marker(pytest.mark.unit_route)
        if "unit_controller" in item.name:
            item.add_marker(pytest.mark.unit_controller)
        if "unit_service" in item.name:
            item.add_marker(pytest.mark.unit_service)
        if "unit_dao" in item.name:
            item.add_marker(pytest.mark.unit_dao)
        if "integration" in item.name:
            item.add_marker(pytest.mark.integration)
