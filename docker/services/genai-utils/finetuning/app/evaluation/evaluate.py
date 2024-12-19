from .tests import test

# def load_model_and_infer(df, arguments):
#     model_args, _, _, finetuning_args, _ = get_train_args()
#     model, tokenizer = load_model_and_tokenizer(model_args, finetuning_args)
#     for i in range(len(df)):
#         prompt_tokens = tokenizer(df["prompt"][i], return_tensors="pt")["input_ids"]
#         start_index = prompt_tokens.shape[-1]  # type: ignore
#         prompt_tokens = prompt_tokens.to("cuda")  # type: ignore
#         output = model.generate(
#             prompt_tokens,
#             max_new_tokens=200,
#             num_return_sequences=1,
#             do_sample=True,
#         )

#         generation_output = output[0][start_index:]
#         generation_text = tokenizer.decode(generation_output, skip_special_tokens=True)

#         df.loc[i, "Trained_model_result"] = generation_text
#     return df


def evaluate_result(eval_metric, test_df):
    # eval_metric = config["eval_metric"]

    test_obj = test(test_name=eval_metric)

    eval_dict = {
        "rougue_score": test_obj.calculate_rouge_score,
        "blue_score": test_obj.calculate_bleu_score,
        "cosine_similarity": test_obj.calculate_cosine_similarity,
        "exactness_match": test_obj.calculate_exactness_match,
    }

    test_df[f"{eval_metric}_untrained"] = test_df.apply(
        lambda row: eval_dict[eval_metric](row["output"], row["Untrained_model_result"]),
        axis=1,
    )

    test_df[f"{eval_metric}_trained"] = test_df.apply(
        lambda row: eval_dict[eval_metric](row["output"], row["Trained_model_result"]),
        axis=1,
    )

    return test_df

    # test_df.to_csv(f"{final_save_path}/metric_df.csv", index=False)
