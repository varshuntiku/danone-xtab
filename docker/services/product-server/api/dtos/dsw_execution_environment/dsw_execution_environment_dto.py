class DSWExecutionEnvironmentCreate:
    def __init__(self, name, desc="", config={}):
        self.name = name
        self.desc = desc
        self.config = config


class DSWExecutionEnvironmentUpdate:
    def __init__(self, name=None, desc=None, config=None):
        if name:
            self.name = name
        if desc:
            self.desc = desc
        if config:
            self.config = config

    def to_dict(self):
        return vars(self)


class DSWExecutionEnvironmentMeta:
    def __init__(self, id, name, desc, config) -> None:
        self.id = id
        self.name = name
        self.desc = desc
        self.config = config
