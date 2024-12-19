from abc import abstractmethod

from pydantic import BaseModel

model_registry = {}


class ModelConfig(BaseModel):
    def __init_subclass__(cls, **kwargs):
        # always make it colaborative:
        super().__init_subclass__(**kwargs)
        host_name = cls.host_name.fget(None)
        model_registry[host_name] = cls

    @abstractmethod
    def embedded_model(self):
        pass
