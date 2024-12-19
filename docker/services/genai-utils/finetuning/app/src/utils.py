import json


def infer_helper(model, tokenizer, test_df):
    model = model.cuda()
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
        test_df.loc[i, "Trained_model_result"] = generation_text

    return test_df


def eval_helper(metric, final_save_path, metric_df, config):
    if metric == "exactness_match":
        untrained_score = (metric_df[f"{config['eval_metric']}_untrained"] == 1).mean()
        trained_score = (metric_df[f"{config['eval_metric']}_trained"] == 1).mean()
    else:
        untrained_score = (metric_df[f"{config['eval_metric']}_untrained"]).mean()
        trained_score = (metric_df[f"{config['eval_metric']}_untrained"]).mean()

    result = {"untrained_score": str(untrained_score), "trained_score": str(trained_score)}

    json_file_path = f"{final_save_path}/result.json"

    # Save the dictionary as JSON in the specified file
    with open(json_file_path, "w") as json_file:
        json.dump(result, json_file)
