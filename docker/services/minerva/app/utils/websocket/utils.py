from dataclasses import fields, is_dataclass
from enum import Enum
from typing import Any


def to_dict(obj: Any) -> Any:
    if is_dataclass(obj):
        # Convert the dataclass to a dictionary
        result = {}
        for field in fields(obj):
            value = getattr(obj, field.name)
            result[field.name] = to_dict(value)
        return result
    elif isinstance(obj, Enum):
        return obj.value
    elif isinstance(obj, (list, tuple, set)):
        return type(obj)(to_dict(item) for item in obj)
    elif hasattr(obj, "__dict__"):
        return {key: to_dict(value) for key, value in obj.__dict__.items()}
    else:
        return obj
