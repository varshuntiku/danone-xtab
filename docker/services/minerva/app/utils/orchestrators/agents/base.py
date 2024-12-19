from abc import ABC, abstractclassmethod


class Orchestrator(ABC):
    """
    Base class to define the Orchestrators
    """

    @abstractclassmethod
    def execute_query(self, query_info, user_info):
        pass


class OrchestratorRegistry:
    registry = {}

    @classmethod
    def register_orchestrator(cls, name):
        def inner_wrapper(wrapped_class):
            cls.registry[name] = wrapped_class
            return wrapped_class

        return inner_wrapper

    @classmethod
    def get_orchestrator(cls, name, *args, **kwargs):
        Orchestrator = cls.registry.get(name)
        if not Orchestrator:
            raise ValueError(f"Orchestrator '{name}' not found")
        return Orchestrator(*args, **kwargs)
