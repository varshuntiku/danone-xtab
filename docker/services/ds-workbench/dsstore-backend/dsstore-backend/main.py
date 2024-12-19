import base64
import io
import os

import joblib
import mlflow
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI()


class LogArtifactRequest(BaseModel):
    project_id: str
    artifact_type: str
    artifact_name: str
    artifact_base64: str
    run_name: str = None

    class Config:
        protected_namespaces = ()


class LoadArtifactRequest(BaseModel):
    project_id: str
    artifact_type: str
    artifact_name: str
    run_name: str = None


class ArtifactManagerRequest(BaseModel):
    project_id: str
    run_name: str = None


class ArtifactManagerByTypeRequest(BaseModel):
    project_id: str
    artifact_type: str
    run_name: str = None


tracking_uri = os.getenv("MLFLOW_TRACKING_URI")
if not tracking_uri:
    raise HTTPException(status_code=500, detail="Environment Variable 'MLFLOW_TRACKING_URI' is not set")

mlflow.set_tracking_uri(tracking_uri)
mlflow_client = mlflow.tracking.MlflowClient(tracking_uri)


def get_default_run_name():
    return "run"


def get_experiment_id(project_id):
    experiment = mlflow.get_experiment_by_name(project_id)

    if experiment is None:
        return mlflow.create_experiment(project_id)
    else:
        return experiment.experiment_id


def get_run_id(experiment_id, run_name):
    runs = mlflow_client.search_runs(
        experiment_ids=[experiment_id], filter_string=f"tags.mlflow.runName = '{run_name}'"
    )

    if runs:
        return runs[0].info.run_id
    else:
        raise HTTPException(status_code=404, detail="Run not found")


def get_or_create_run(experiment_id, run_name):
    runs = mlflow_client.search_runs(
        experiment_ids=[experiment_id], filter_string=f"tags.mlflow.runName = '{run_name}'"
    )

    if runs:
        return runs[0].info.run_id
    else:
        with mlflow.start_run(experiment_id=experiment_id, run_name=run_name) as run:
            return run.info.run_id


@app.post("/log_artifact")
async def log_artifact(request: LogArtifactRequest):
    try:
        experiment_id = get_experiment_id(request.project_id)
        run_name = request.run_name or get_default_run_name()
        run_id = get_or_create_run(experiment_id, run_name)
        artifact_data = base64.b64decode(request.artifact_base64)
        artifact_name = request.artifact_name
        temp_artifact_path = f"/tmp/{artifact_name}"

        with mlflow.start_run(run_id=run_id):
            if request.artifact_type == "dataframe":
                temp_artifact_path += ".csv"
                with open(temp_artifact_path, "wb") as f:
                    f.write(artifact_data)
                mlflow.log_artifact(temp_artifact_path)
            elif request.artifact_type == "figure":
                temp_artifact_path += ".png"
                with open(temp_artifact_path, "wb") as f:
                    f.write(artifact_data)
                mlflow.log_artifact(temp_artifact_path)
            elif request.artifact_type == "model":
                with open(temp_artifact_path, "wb") as f:
                    f.write(artifact_data)
                model = joblib.load(temp_artifact_path)
                if "sklearn" in str(type(model)):
                    mlflow.sklearn.log_model(model, artifact_name)
                elif "xgboost" in str(type(model)):
                    mlflow.xgboost.log_model(model, artifact_name)
                else:
                    raise ValueError(f"Unsupported model type: {type(model)}")
            elif request.artifact_type == "function":
                temp_artifact_path += ".py"
                with open(temp_artifact_path, "wb") as f:
                    f.write(artifact_data)
                mlflow.log_artifact(temp_artifact_path)
            else:
                raise ValueError("Unsupported artifact type")

        os.remove(temp_artifact_path)

        return {
            "message": f"{request.artifact_type.capitalize()} artifact logged successfully with run_name '{run_name}'"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/load_artifact")
async def load_artifact(request: LoadArtifactRequest):
    try:
        experiment_id = get_experiment_id(request.project_id)
        run_name = request.run_name or get_default_run_name()
        run_id = get_run_id(experiment_id, run_name)

        client = mlflow.tracking.MlflowClient()

        local_path = client.download_artifacts(run_id, request.artifact_name, dst_path="/tmp")

        if not os.path.exists(local_path):
            raise HTTPException(status_code=404, detail="Artifact not found")

        if request.artifact_type == "model":
            model_meta_path = os.path.join(local_path, "MLmodel")
            if os.path.exists(model_meta_path):
                with open(model_meta_path) as f:
                    model_meta = f.read()
                if "sklearn" in model_meta:
                    model = mlflow.sklearn.load_model(local_path)
                elif "pytorch" in model_meta:
                    model = mlflow.pytorch.load_model(local_path)
                elif "xgboost" in model_meta:
                    model = mlflow.xgboost.load_model(local_path)
                else:
                    raise HTTPException(status_code=400, detail="Unsupported model type")

                buf = io.BytesIO()
                joblib.dump(model, buf)
                buf.seek(0)
                return StreamingResponse(
                    buf,
                    media_type="application/octet-stream",
                    headers={"Content-Disposition": "attachment; filename=model.joblib"},
                )
            else:
                raise HTTPException(status_code=400, detail="MLmodel file not found in the artifact")
        else:
            with open(local_path, "rb") as f:
                artifact_base64 = base64.b64encode(f.read()).decode("utf-8")

            return {"artifact_base64": artifact_base64}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/list_artifacts")
async def list_all_artifacts(request: ArtifactManagerRequest):
    try:
        experiment_id = get_experiment_id(request.project_id)
        run_name = request.run_name or get_default_run_name()
        runs = mlflow_client.search_runs(experiment_ids=[experiment_id])
        data = []

        for run_info in runs:
            if run_name and run_name != run_info.data.tags.get("mlflow.runName"):
                continue
            artifacts_info = mlflow_client.list_artifacts(run_info.info.run_id)
            data.append({"Name": [artifact_info.path for artifact_info in artifacts_info]})

        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/list_artifacts_by_type")
async def list_artifacts_by_type(request: ArtifactManagerByTypeRequest):
    try:
        experiment_id = get_experiment_id(request.project_id)
        runs = mlflow_client.search_runs(experiment_ids=[experiment_id])
        run_name = request.run_name or get_default_run_name()
        data = []
        file_extension = None

        if request.artifact_type == "dataframe":
            file_extension = ".csv"
        elif request.artifact_type == "figure":
            file_extension = ".png"
        elif request.artifact_type == "model":
            file_extension = None
        elif request.artifact_type == "function":
            file_extension = ".py"

        for run_info in runs:
            if run_name == run_info.data.tags.get("mlflow.runName"):
                artifacts_info = mlflow_client.list_artifacts(run_info.info.run_id)
                if file_extension:
                    filtered_artifacts = [
                        artifact_info.path
                        for artifact_info in artifacts_info
                        if artifact_info.path.endswith(file_extension)
                    ]
                else:
                    filtered_artifacts = [
                        artifact_info.path
                        for artifact_info in artifacts_info
                        if len(artifact_info.path.split(".")) == 1
                    ]
                data.append({"Name": filtered_artifacts})

                return data
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
