class LLM:
    def __init__(self, llm_config):
        self.llm_config = llm_config
        self.__generate_llm()
        pass

    def __generate_llm(self):
        return NotImplementedError
