import argparse
import os
import time

import pandas as pd

flag_execute = True


def generate_ui_log(log_file_name, ui_log_file_name):
    global flag_execute

    # Read the JSONL file into a Pandas DataFrame
    df_log_main = pd.read_json(log_file_name, lines=True)
    df_log_ui = pd.read_json(ui_log_file_name, lines=True)

    print(df_log_ui)
    print(df_log_main)

    if df_log_ui.empty and df_log_main.empty:
        flag_execute = True
        print("not executing")
    else:
        print("executing")
        try:
            existing_steps_in_ui_log = 0 if df_log_ui.empty else df_log_ui["current_steps"].max()
            filtered_df_log_main = df_log_main[df_log_main["current_steps"] > existing_steps_in_ui_log]

            print("loss_count", filtered_df_log_main["loss"].count())
            print("eval_loss_count", filtered_df_log_main["eval_loss"].count())
            print("current_unique_steps", filtered_df_log_main["current_steps"].nunique())

            if not filtered_df_log_main.empty:
                filtered_df_log_main = filtered_df_log_main.groupby("current_steps").filter(
                    lambda group: group[["loss", "eval_loss"]].notnull().any().all()
                )

            # if not filtered_df_log_main.empty and filtered_df_log_main["loss"].count() == filtered_df_log_main["current_steps"].nunique() and filtered_df_log_main["eval_loss"].count() == filtered_df_log_main["current_steps"].nunique():
            if not filtered_df_log_main.empty:
                print("updation")
                filtered_df_log_main["loss"].fillna(0, inplace=True)
                filtered_df_log_main["eval_loss"].fillna(0, inplace=True)

                group_filtered_df_log_main = filtered_df_log_main.groupby("current_steps").agg("max")

                # Reset the index to make 'column_name' a regular column
                group_filtered_df_log_main = group_filtered_df_log_main.reset_index()

                df_log_ui = pd.concat([df_log_ui, group_filtered_df_log_main], ignore_index=True)
                df_log_ui.to_json(ui_log_file_name, orient="records", lines=True)
        except Exception:
            print("exception")
            return 0

        if not df_log_ui.empty and df_log_ui["current_steps"].max() == df_log_main["total_steps"].max():
            print("termination")
            flag_execute = False

    return 1


def check_modification_and_execute_generate_ui_log(log_file_name, ui_log_file_name):
    previous_log_modifiction_time = os.path.getmtime(log_file_name)
    print("previous_log_modifiction_time", previous_log_modifiction_time)
    global flag_execute
    flag_execute = True

    while flag_execute:
        log_modifiction_time = os.path.getmtime(log_file_name)
        print("log_modifiction_time", log_modifiction_time)
        if log_modifiction_time != previous_log_modifiction_time:
            print("file modified")
            previous_log_modifiction_time = log_modifiction_time
            generate_ui_log(log_file_name, ui_log_file_name)

        time.sleep(11)

    return 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process the file names")
    parser.add_argument("--flag", type=str, help="Name of input file which needs to be watched")
    # parser.add_argument('--output_file_name', type=str, help='Name of output file where data needs to be transferred')
    args = parser.parse_args()
    flag = args.flag
    if flag == "trainer":
        input_file = "/train/trainer_log.jsonl"
        output_file = "/train/trainer_log_ui.jsonl"
    if flag == "checkpoint":
        input_file = "/train/checkpoint_log.jsonl"
        output_file = "/train/checkpoint_log_ui.jsonl"
    check_modification_and_execute_generate_ui_log(log_file_name=input_file, ui_log_file_name=output_file)
