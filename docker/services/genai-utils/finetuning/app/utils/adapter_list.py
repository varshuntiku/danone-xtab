class Adapter:
    # Dictionary mapping model names to adapter layers
    # To summport a new model add modle name and the adapters here
    adapters_dict = {
        "mistralai/Mistral-7B-v0.1": ["q_proj", "k_proj", "v_proj", "o_proj"],
        "Qwen/Qwen-14B": ["c_attn", "c_proj"],
        "Qwen/Qwen-7B": ["c_attn", "c_proj"],
        "Qwen/Qwen-1_8B": ["c_attn", "c_proj"],
        "bigcode/starcoder2-7b": ["q_proj", "v_proj"],
        "bigcode/starcoder2-3b": ["q_proj", "v_proj"],
        "microsoft/phi-2": ["q_proj", "v_proj"],
        "microsoft/phi-1_5": ["q_proj", "v_proj"],
        "Qwen/Qwen1.5-1.8B": ["q_proj", "v_proj"],
        "Qwen/Qwen1.5-4B": ["q_proj", "v_proj"],
        "Qwen/Qwen1.5-7B": ["q_proj", "v_proj"],
        "openchat/openchat_3.5": ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    }

    @classmethod
    def get_adapter(cls, model_name):
        try:
            return cls.adapters_dict[model_name]
        except KeyError:
            raise ValueError(f"Model {model_name} is not supported yet !!")
