import pandas as pd
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig


class ModelLoader:
    def __init__(self, config):
        self.model_name = config["model_name_or_path"]
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
        )
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_name, quantization_config=bnb_config, trust_remote_code=True
        )
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, trust_remote_code=True)

    def batch_infer(self, checkpoint_df):
        for i in range(len(checkpoint_df)):
            prompt_tokens = self.tokenizer(checkpoint_df["prompt"][i], return_tensors="pt")["input_ids"]
            start_index = prompt_tokens.shape[-1]  # type: ignore
            prompt_tokens = prompt_tokens.to("cuda")  # type: ignore
            output = self.model.generate(
                prompt_tokens,
                max_new_tokens=200,
                num_return_sequences=1,
                do_sample=True,
            )

            generation_output = output[0][start_index:]
            generation_text = self.tokenizer.decode(generation_output, skip_special_tokens=True)

            checkpoint_df.loc[i, "Unrained_model_result"] = generation_text
        return checkpoint_df


# Define a function for base inference
def base_infer(config):
    save_path = "/train/dataset"
    checkpoint_path = "/train/dataset/checkpoint.json"

    checkpoint_df = pd.read_json(checkpoint_path)

    # If the checkpoint data contains both "instruction" and "input" columns, concatenate them to create the "prompt" column
    if all(col in checkpoint_df.columns for col in ["instruction", "input"]):
        checkpoint_df["prompt"] = checkpoint_df["instruction"] + checkpoint_df["input"]
    else:
        checkpoint_df["prompt"] = checkpoint_df["instruction"]

    base_obj = ModelLoader(config=config)
    checkpoint_infer = base_obj.batch_infer(checkpoint_df=checkpoint_df)

    # Save the inference results to a CSV file in mounted AFS
    checkpoint_infer.to_csv(f"{save_path}/checkpoint_untrained_infer.csv", index=False)
