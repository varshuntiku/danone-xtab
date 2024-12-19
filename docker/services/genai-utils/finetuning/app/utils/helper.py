import json
import random

import pandas as pd
from sklearn.model_selection import train_test_split


def split(file_path, test_size):
    with open(file_path, "r") as file:
        data = json.load(file)

    # Split the data into training and testing sets
    train_data, test_data = train_test_split(data, test_size=test_size, random_state=42)
    save_path = (
        "/train/dataset"  # Define the AFS path to save the split dataset here /train is namespace for mounted path
    )

    # If there are more than 15 samples in the training set, randomly select 15 samples for checkpoint.json
    if len(train_data) >= 15:
        selected_data = random.sample(data, 15)
    else:
        selected_data = train_data

    # Save the entire training data,test data, chekpoint data to mounted AFS"
    with open("train_data.json", "w") as train_file:
        json.dump(train_data, train_file, indent=2)

    with open(f"{save_path}/train_data.json", "w") as train_file:
        json.dump(train_data, train_file, indent=2)

    with open(f"{save_path}/test_data.json", "w") as test_file:
        json.dump(test_data, test_file, indent=2)

    with open(f"{save_path}/checkpoint.json", "w") as checkpoint_file:
        json.dump(selected_data, checkpoint_file, indent=2)

    test_df = pd.read_json(f"{save_path}/test_data.json")

    if all(col in test_df.columns for col in ["instruction", "input"]):
        test_df["prompt"] = test_df["instruction"] + test_df["input"]
    else:
        test_df["prompt"] = test_df["instruction"]
    test_df.to_csv(f"{save_path}/test_data.csv", index=False)

    # return selected_data
