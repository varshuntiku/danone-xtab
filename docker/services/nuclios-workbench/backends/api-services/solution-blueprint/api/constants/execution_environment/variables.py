from enum import Enum


class ExecutionEnvironmentType(Enum):
    DEFAULT = "default"
    CUSTOM = "custom"

    @classmethod
    def list(cls):
        return list(map(lambda c: c.value, cls))


class SolutionBlueprintShareName(Enum):
    GOLDEN_SHARENAME = "solution-bp-repository"


class SolutionBlueprintType(Enum):
    GOLDEN = "golden-bps"
    DEFAULT = "default-bp"
