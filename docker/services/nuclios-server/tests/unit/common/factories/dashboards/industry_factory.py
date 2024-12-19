from faker import Faker

faker = Faker()


def generate_industry_data(
    industry_name=None,
    parent_industry_id=None,
    logo_name=None,
    horizon=None,
    order=None,
    level=None,
    color=None,
    description=None,
):
    """
    factory function that generate test industry data.
    """

    return {
        "industry_name": industry_name or "test industry",
        "parent_industry_id": parent_industry_id or "1",
        "logo_name": logo_name or "CPG",
        "horizon": horizon or "vertical",
        "order": order or 2,
        "level": level or "default_level",
        "color": color or "default_color",
        "description": description or "industry description",
    }
