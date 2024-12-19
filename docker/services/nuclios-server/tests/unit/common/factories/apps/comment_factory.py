from faker import Faker

faker = Faker()


def generate_comment_data(
    app_id=None,
    app_screen_id=None,
    widget_id=None,
    comment_text=None,
    attachments=None,
    tagged_users=None,
    status=None,
    bookmarked=None,
    link=None,
    filters=None,
    screen_name=None,
    widget_name=None,
    mode=None,
    approvals=None,
    scenarios_list=None,
):
    """
    factory funtion that generates fake comment data
    """
    return {
        "app_id": app_id or faker.random_int(min=1, max=10),
        "app_screen_id": app_screen_id or faker.random_int(min=1, max=10),
        "widget_id": widget_id or faker.random_int(min=1, max=10),
        "comment_text": comment_text or faker.text(max_nb_chars=500),
        "attachments": attachments or [faker.image_url() for _ in range(5)],
        "tagged_users": tagged_users or [faker.random_int(min=1, max=10) for _ in range(3)],
        "status": status or faker.random_element(elements=["resolved", "unresolved"]),
        "bookmarked": bookmarked or faker.boolean(),
        "link": link or faker.url(),
        "filters": filters
        or {
            "category": faker.random_element(elements=["Technology", "Finance", "Marketing"]),
            "priority": faker.random_element(elements=["High", "Medium", "Low"]),
        },
        "screen_name": screen_name or faker.name(),
        "widget_name": widget_name or faker.word(),
        "mode": mode or faker.random_element(elements=["comment", "task"]),
        "approvals": approvals
        or [
            {
                "user_id": faker.random_int(min=1, max=10),
                "name": faker.name(),
                "status": faker.random_element(elements=["pending", "approved", "rejected"]),
            }
        ],
        "scenario_list": scenarios_list or [faker.name() for _ in range(3)],
    }
