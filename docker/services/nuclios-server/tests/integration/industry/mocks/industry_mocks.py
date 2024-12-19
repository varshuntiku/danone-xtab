from faker import Faker

fake = Faker()


def generate_industry_payload(
    industry_name=None,
    parent_industry_id=None,
    logo_name=None,
    description=None,
    order=None,
    horizon=None,
    level=None,
    color=None,
):
    """
    generates an industry payload with the provided values or generates fake data if not provided.

    Parameters:
        industry_name (str, optional): Name of the industry.
        parent_industry_id (str, optional): ID of the parent industry.
        logo_name (str, optional): Name of the logo.
        description (str, optional): Description of the industry.
        order (int, optional): Order value.
        horizon (str, optional): Horizon value, defaults to "horizontal" if not provided.
        level (str, optional): Level of the industry.
        color (str, optional): Color value.

    Returns:
        dict: industry payload with either provided or generated values.
    """

    return {
        "id": "",
        "industry_name": industry_name or fake.company(),
        "parent_industry_id": parent_industry_id or "",
        "logo_name": logo_name or "Technology",
        "description": description or fake.text(max_nb_chars=50),
        "order": order if order is not None else fake.random_int(min=1, max=100),
        "horizon": horizon or "horizontal",
        "level": level or str(fake.random_int(min=1, max=5)),
        "color": color or fake.safe_color_name(),
    }
