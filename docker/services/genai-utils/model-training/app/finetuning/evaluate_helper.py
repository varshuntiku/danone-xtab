import pandas as pd
from genai.evaluation.evaluation import Evaluation


def evaluate(df) -> pd.DataFrame:
    eval_obj = Evaluation(df=df, metric=["Cosine_Similarity", "Bert_Score", "Rougue_Score"])
    final_df = eval_obj.report

    # write code to send this df to db from where data can be fetched
    return final_df
