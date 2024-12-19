import json
import time

import pandas as pd
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig


def main():
    config_file_path = "/train/config.json"
    test_path = "/train/dataset/test_data.csv"
    max_attempts = 100
    interval_seconds = 20

    with open(config_file_path, "r") as file:
        config = json.load(file)

    for _ in range(max_attempts):
        try:
            test_df = pd.read_csv(test_path)
            print("File found and read successfully!")
            break
        except FileNotFoundError:
            print(f"File not found. Waiting for {interval_seconds} seconds...")
            time.sleep(interval_seconds)
    else:
        print("File not found even after waiting.")

    model_name = config["model_name_or_path"]
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
    )
    model = AutoModelForCausalLM.from_pretrained(model_name, quantization_config=bnb_config, trust_remote_code=True)
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)

    # model = model.cuda()

    for i in range(len(test_df)):
        prompt_tokens = tokenizer(test_df["prompt"][i], return_tensors="pt")["input_ids"]
        start_index = prompt_tokens.shape[-1]  # type: ignore
        prompt_tokens = prompt_tokens.to("cuda")  # type: ignore
        output = model.generate(
            prompt_tokens,
            max_new_tokens=200,
            num_return_sequences=1,
            do_sample=True,
        )

        generation_output = output[0][start_index:]
        generation_text = tokenizer.decode(generation_output, skip_special_tokens=True)
        test_df.loc[i, "Untrained_model_result"] = generation_text

    test_df.to_csv("/train/dataset/test_model_untrained_infer.csv", index=False)


if __name__ == "__main__":
    main()
