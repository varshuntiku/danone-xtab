import base64
import json
from io import StringIO

import pandas as pd
import requests
from api.configs.settings import get_app_settings

settings = get_app_settings()


def get_artifact_type(name):
    if name.endswith(".png"):
        return "figure"
    elif name.endswith(".csv"):
        return "dataframe"
    else:
        return "model"


def type_desc_mapper(row):
    if row["type"] == "figure":
        return f'dsstore.load_figure("{row["name"]}")'
    elif row["type"] == "dataframe":
        return f'dsstore.load_dataframe("{row["name"]}")'
    else:
        return f'dsstore.load_model("{row["name"]}")'


def add_artifact_type(row):
    row["type"] = get_artifact_type(row["Name"])
    row["desc"] = type_desc_mapper(row)
    return row


def fetch_from_dsstore(post_fix, payload):
    response = requests.get(f"{settings.DSSTORE_BACKEND_URI}/{post_fix}", json=payload)
    response.raise_for_status()
    return response.json()


def list_artifacts(project_id):
    payload = {"project_id": str(project_id)}
    json_response = fetch_from_dsstore("list_artifacts", payload)
    df = pd.DataFrame(json_response)
    df = df.explode("Name").reset_index(drop=True)
    df["name"] = df["Name"].str.replace(r"\.\w+$", "", regex=True)
    df["Name"] = df["Name"]
    df = df.apply(add_artifact_type, axis=1)
    # df['type'] = df['Name'].apply(get_artifact_type)
    df["key"] = df["name"]
    df = df[["key", "type", "desc"]]
    return df.to_dict(orient="records")


def convert_to_simple_table(df):
    return {
        "table_headers": list(df.columns),
        "table_data": df.values.tolist(),
        "show_searchbar": True,
        "tableOptions": {},
    }


def preview_artifact(project_id, artifact_type, artifact_name):
    if artifact_type == "figure":
        artifact_name = f"{artifact_name}.png"
    elif artifact_type == "dataframe":
        artifact_name = f"{artifact_name}.csv"
    else:
        return "Model preview not supported yet"
    payload = {"project_id": str(project_id), "artifact_type": artifact_type, "artifact_name": artifact_name}
    json_response = fetch_from_dsstore("load_artifact", payload)
    if artifact_type == "dataframe":
        artifact_data = base64.b64decode(json_response["artifact_base64"])
        df = pd.read_csv(StringIO(artifact_data.decode("utf-8")))
        # replace nan with None
        return convert_to_simple_table(df.head(10).fillna(""))
    elif artifact_type == "figure":
        return json.loads(base64.b64decode(json_response["artifact_base64"]))
    else:
        return "Model preview not supported yet"
