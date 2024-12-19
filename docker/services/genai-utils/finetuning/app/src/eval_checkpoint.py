import json

import pandas as pd
from evaluate import evaluate_result
from llamafactory.train.tuner import get_train_args, load_model_and_tokenizer
from utils import eval_helper, infer_helper


def main():
    test_path = "/train/dataset/test_data.csv"
    untrained_test_infer = "/train/dataset/test_model_untrained_infer.csv"
    config_file_path = "/eval/config.json"
    final_save_path = "/eval"

    with open(config_file_path, "r") as file:
        config = json.load(file)

    model_args, _, _, finetuning_args, _ = get_train_args()

    model, tokenizer = load_model_and_tokenizer(model_args, finetuning_args)

    test_df = pd.read_csv(test_path)

    test_df = infer_helper(model=model, tokenizer=tokenizer, test_df=test_df)

    test_df.to_csv(f"{final_save_path}/checkpoint_infer_trained.csv", index=False)

    untrained_df = pd.read_csv(untrained_test_infer)

    merged_df = pd.merge(untrained_df, test_df, how="inner")  # type:ignore

    metric_df = evaluate_result(eval_metric=config["eval_metric"], test_df=merged_df)

    metric_df.to_csv(f"{final_save_path}/checkpoint_metric_df.csv", index=False)

    eval_helper(metric=config["eval_metric"], final_save_path=final_save_path, metric_df=metric_df, config=config)


if __name__ == "__main__":
    main()
