import json
import os
import time

import pandas as pd
from evaluate import evaluate_result
from transformers import TrainerCallback, TrainingArguments
from utils import eval_helper, infer_helper

# from app.evaluation.evaluate import *


class GenerateTextCallback(TrainerCallback):
    def __init__(self, n_steps=100):
        self.checkpoint_path = "/train/dataset/checkpoint_untrained_infer.csv"
        self.n_steps = n_steps
        self.checkpoint_num = 0
        self.test_path = "/train/dataset/test_data.csv"

    def on_save(self, args: TrainingArguments, state, control, **kwargs):
        """
        Event called after a checkpoint save.
        """
        # checkpoint_logs = dict(
        #     current_steps=state.global_step,
        #     total_steps=state.max_steps,
        #     loss=state.log_history[-1].get("loss", None),  # type: ignore
        #     eval_loss=state.log_history[-1].get("eval_loss", None),  # type: ignore
        #     predict_loss=state.log_history[-1].get("predict_loss", None),  # type: ignore
        #     reward=state.log_history[-1].get("reward", None),  # type: ignore
        #     learning_rate=state.log_history[-1].get("learning_rate", None),  # type: ignore
        #     epoch=state.log_history[-1].get("epoch", None),  # type: ignore
        # )

        # os.makedirs(args.output_dir, exist_ok=True)
        # with open(
        #     os.path.join(args.output_dir, "checkpoint_log.jsonl"), "a", encoding="utf-8"
        # ) as f:
        #     f.write(json.dumps(checkpoint_logs) + "\n")

        jsonl_file = "/train/trainer_log.jsonl"
        new_jsonl_file = os.path.join(args.output_dir, "checkpoint_log.jsonl")

        # Define the current steps and new eval loss
        current_steps = state.global_step
        new_eval_loss = state.log_history[-1].get("eval_loss", None)

        # Find the entry with current_steps and update eval_loss
        found = False
        with open(jsonl_file, "r") as input_file:
            for line in input_file:
                entry = json.loads(line)
                if entry.get("current_steps") == current_steps:
                    found = True
                    if "eval_loss" in entry:
                        # Update existing eval_loss
                        entry["eval_loss"] = new_eval_loss
                    else:
                        # Add eval_loss key
                        entry["eval_loss"] = new_eval_loss
                    updated_entry = json.dumps(entry) + "\n"
                    break

        # If entry not found, print a message and exit
        if not found:
            print(f"No entry found with current_steps = {current_steps}")
            exit()

        # Append the updated entry to the new JSONL file
        with open(new_jsonl_file, "a") as output_file:
            output_file.write(updated_entry)

        self.checkpoint_num += 1
        model = kwargs["model"]
        tokenizer = kwargs["tokenizer"]
        checkpoint_df = pd.read_csv(self.checkpoint_path)

        for i in range(len(checkpoint_df)):
            prompt_tokens = tokenizer(checkpoint_df["prompt"][i], return_tensors="pt")["input_ids"]
            start_index = prompt_tokens.shape[-1]
            prompt_tokens = prompt_tokens.to("cuda")
            output = model.generate(
                prompt_tokens,
                max_new_tokens=200,
                num_return_sequences=1,
                do_sample=True,
            )

            generation_output = output[0][start_index:]
            generation_text = tokenizer.decode(generation_output, skip_special_tokens=True)

            checkpoint_df.loc[i, "Trained_model_result"] = generation_text

        checkpoint_df.to_csv(f"/train/checkpoint_{self.checkpoint_num}.csv", index=False)

    def on_train_end(self, args: TrainingArguments, state, control, **kwargs):
        """
        Event called at the end of training.
        """
        final_save_path = "/train/evaluate"
        config_file_path = "/train/config.json"
        # test_data_path = "/train/dataset/test_data.csv"
        untrained_test_infer = "/train/dataset/test_model_untrained_infer.csv"
        max_attempts = 100
        interval_seconds = 20
        model = kwargs["model"]
        tokenizer = kwargs["tokenizer"]

        with open(config_file_path, "r") as file:
            config = json.load(file)

        model.save_pretrained(final_save_path)
        tokenizer.save_pretrained(final_save_path)

        test_df = pd.read_csv(self.test_path)
        checkpoint_df = pd.read_csv(self.checkpoint_path)
        print("Starting the Inferencing")

        final_sampled_train_df = infer_helper(model=model, tokenizer=tokenizer, test_df=checkpoint_df)
        test_df = infer_helper(model=model, tokenizer=tokenizer, test_df=test_df)

        test_df.to_csv(f"{final_save_path}/test_infer_trained.csv", index=False)
        final_sampled_train_df.to_csv(f"{final_save_path}/final_model_sampled_train_results.csv", index=False)

        for _ in range(max_attempts):
            try:
                untrained_df = pd.read_csv(untrained_test_infer)
                print("File found and read successfully!")
                break
            except FileNotFoundError:
                print(f"File not found. Waiting for {interval_seconds} seconds...")
                time.sleep(interval_seconds)
        else:
            print("File not found even after waiting.")

        merged_df = pd.merge(untrained_df, test_df, how="inner")  # type:ignore

        metric_df = evaluate_result(eval_metric=config["eval_metric"], test_df=merged_df)

        metric_df.to_csv(f"{final_save_path}/checkpoint_metric_df.csv", index=False)

        eval_helper(metric=config["eval_metric"], final_save_path=final_save_path, metric_df=metric_df, config=config)
