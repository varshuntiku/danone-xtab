def mock_create_industry_in_dashboard_controller(*args, **kwargs):
    # returns a mock response for industry creation
    return {
        "message": "Industry Created Successfully",
        "industry_data": {
            "id": 1,
            "industry_name": "Test Industry1",
            "parent_industry_id": None,
            "logo_name": "Other Industry",
            "horizon": "horizontal",
            "order": 10,
            "level": None,
            "color": None,
            "description": "",
        },
    }


mock_create_industry_response = {
    "id": 1,
    "industry_name": "Test Industry1",
    "parent_industry_id": None,
    "logo_name": "Other Industry",
    "horizon": "horizontal",
    "order": 10,
    "level": None,
    "color": None,
    "description": "",
}


def mock_get_industry_in_dashboard_controller(*args, **kwargs):
    # returns a mock response for industry creation
    return [
        {
            "id": 1,
            "industry_name": "Test Industry1",
            "parent_industry_id": None,
            "logo_name": "Other Industry",
            "horizon": "horizontal",
            "order": 10,
            "level": None,
            "color": None,
            "description": "",
        },
        {
            "id": 2,
            "industry_name": "Test Industry2",
            "parent_industry_id": None,
            "logo_name": "Other Industry",
            "horizon": "horizontal",
            "order": 11,
            "level": None,
            "color": None,
            "description": "",
        },
    ]


mock_get_industry_response = [
    {
        "id": 1,
        "industry_name": "Test Industry1",
        "parent_industry_id": None,
        "logo_name": "Other Industry",
        "horizon": "horizontal",
        "order": 10,
        "level": None,
        "color": None,
        "description": "",
    },
    {
        "id": 2,
        "industry_name": "Test Industry2",
        "parent_industry_id": None,
        "logo_name": "Other Industry",
        "horizon": "horizontal",
        "order": 11,
        "level": None,
        "color": None,
        "description": "",
    },
]


def mock_update_industry_in_dashboard_controller(*args, **kwargs):
    # returns a mock response for industry creation
    return {
        "message": "Updated successfully",
        "industry_data": {
            "id": 2,
            "industry_name": "Test Industry1",
            "parent_industry_id": None,
            "logo_name": "Other Industry",
            "horizon": "horizontal",
            "order": 10,
            "level": None,
            "color": None,
            "description": "",
        },
    }


mock_update_industry_response = {
    "id": 2,
    "industry_name": "Test Industry1",
    "parent_industry_id": None,
    "logo_name": "Other Industry",
    "horizon": "horizontal",
    "order": 10,
    "level": None,
    "color": None,
    "description": "",
}


def mock_delete_industry_in_dashboard_controller(*args, **kwargs):
    # returns a mock response for industry creation
    return {"message": " deleted successfully"}


mock_delete_industry_response = {"message": " deleted successfully"}
