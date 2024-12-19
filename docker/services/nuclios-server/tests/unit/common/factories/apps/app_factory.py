from faker import Faker

faker = Faker()


def generate_app_data(
    app_name=None,
    contact_email=None,
    function_id=None,
    industry_id=None,
    is_connected_systems_app=None,
    nac_collaboration=None,
):
    """
    factory function that generate fake app data.
    """

    return {
        "app_name": app_name or faker.company(),
        "contact_email": contact_email or faker.email(),
        "function_id": function_id or faker.random_int(min=1, max=10),
        "industry_id": industry_id or faker.random_int(min=1, max=10),
        "is_connected_systems_app": (
            is_connected_systems_app if is_connected_systems_app is not None else faker.boolean()
        ),
        "nac_collaboration": (nac_collaboration if nac_collaboration is not None else faker.boolean()),
    }
