class SolutionHelper:
    @staticmethod
    def get_structured_solutions(solutions):
        structured_solutions = []
        if solutions:
            for wid_con_sys_identifier, app, app_screen_widget in solutions:
                already_existed_element = None
                # Loop to check is structured object alredy in list
                for index, element in enumerate(structured_solutions):
                    if element["app_id"] == app.id:
                        already_existed_element = structured_solutions.pop(index)
                        break
                    else:
                        continue

                if already_existed_element:
                    # Pop, Update and Append
                    structured_solutions.append(
                        {
                            "app_id": app.id,
                            "name": app.name,
                            "linkedKPIs": [
                                *already_existed_element["linkedKPIs"],
                                {"id": app_screen_widget.id, "name": app_screen_widget.widget_key},
                            ],
                        }
                    )
                else:
                    # Append New
                    structured_solutions.append(
                        {
                            "app_id": app.id,
                            "name": app.name,
                            "linkedKPIs": [{"id": app_screen_widget.id, "name": app_screen_widget.widget_key}],
                        }
                    )
        return structured_solutions
