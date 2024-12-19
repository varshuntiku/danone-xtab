import asyncio


def push_to_background(func, **params):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:  # 'RuntimeError: There is no current event loop...'
        loop = None

    if loop and loop.is_running():
        print("Async event loop already running. Adding coroutine to the event loop.")
        tsk = loop.create_task(func(**params))
        # ^-- https://docs.python.org/3/library/asyncio-task.html#task-object
        # Optionally, a callback function can be executed when the coroutine completes
        tsk.add_done_callback(
            lambda t: print(f'Task done with result={t.result()}  << return val of update_experiment_status("status")')
        )
    else:
        print("Starting new event loop")
        asyncio.run(func(**params))


def delete_none_values_from_dict(self, _dict):
    """Delete None values recursively from all of the dictionaries"""
    for key, value in list(_dict.items()):
        if isinstance(value, dict):
            self.delete_none_values_from_dict(value)
        elif value is None:
            del _dict[key]
        elif isinstance(value, list):
            for v_i in value:
                if isinstance(v_i, dict):
                    self.delete_none_values_from_dict(v_i)
    return _dict


def nested_object_to_dict_converter(obj):
    if not hasattr(obj, "__dict__"):
        return obj
    result = {}
    for key, val in obj.__dict__.items():
        if key.startswith("_"):
            continue
        element = []
        if isinstance(val, list):
            for item in val:
                element.append(nested_object_to_dict_converter(item))
        else:
            element = nested_object_to_dict_converter(val)
        result[key] = element
    return result
