from ....genai.genai.deployment.models.Chatcompletion.model_loader import Chatcompletion


def baseline_helper(df, baseline_model="meta-llama/Llama-2-7b-hf"):
    base_obj = Chatcompletion(baseline_model)
    model = base_obj.load_model(quantization=True)
    tokenizer = base_obj.load_tokenizer()

    for i in range(len(df)):
        _input = base_obj.tokenize(df["intruction"][i])  # type: ignore
        df["baseline_response"][i] = base_obj.generate_response(model=model, tokenizer=tokenizer, input_token=_input)
    # df['baseline_response'] = df.apply(lambda row: base_obj.generate_response(row['column1'], row['column2']), axis=1)
