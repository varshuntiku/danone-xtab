import json
import os
import subprocess
import sys

import mlflow
from helpers import CodexEnvParams
from models import DataSet, User, UserGroup, UserGroupType, db

testdir = os.path.dirname(__file__)
srcdir = "../../../../../docker/services/server/app"
sys.path.insert(0, os.path.abspath(os.path.join(testdir, srcdir)))


class TestFixtures:
    def __init__(self, app_test_client, connection, headers):
        self.app_test_client = app_test_client
        self.headers = headers
        self.connection = connection
        self.env_params = CodexEnvParams()

    def create_datasource(self, params):
        response = self.app_test_client.post("/codex-api/data-sources", data=json.dumps(params), headers=self.headers)

        response_data = json.loads(response.data)
        return response_data["id"]

    def create_ingest(self, params):
        response = self.app_test_client.post("/codex-api/ingest", data=json.dumps(params), headers=self.headers)

        response_data = json.loads(response.data)
        return response_data["id"]

    def create_dataprep(self, params):
        response = self.app_test_client.post(
            "/codex-api/data-prep-steps", data=json.dumps(params), headers=self.headers
        )

        response_data = json.loads(response.data)
        return response_data["id"]

    def create_featurestore(self, params):
        response = self.app_test_client.post("/codex-api/feature-stores", data=json.dumps(params), headers=self.headers)

        response_data = json.loads(response.data)
        return response_data["id"]

    def create_modeltrain(self, params):
        response = self.app_test_client.post(
            "/codex-api/model-train-steps",
            data=json.dumps(params),
            headers=self.headers,
        )

        response_data = json.loads(response.data)
        return response_data["id"]

    def create_modelpredict(self, params):
        response = self.app_test_client.post(
            "/codex-api/model-predict-steps",
            data=json.dumps(params),
            headers=self.headers,
        )

        response_data = json.loads(response.data)
        return response_data["id"]

    def create_task_execution(self, task_id, params):
        response = self.app_test_client.post(
            f"/codex-api/task-executions/{task_id}",
            data=json.dumps(params),
            headers=self.headers,
        )

        response_data = json.loads(response.data)
        return response_data["id"]

    def queue_task_execution(self, task_execution_id):
        self.app_test_client.post(
            f"/codex-api/task-executions/queue/{task_execution_id}",
            data="{}",
            headers=self.headers,
        )

    def create_mlflow_run(self, run_name, artifacts):
        mlflow.set_tracking_uri(self.env_params.getEnvParam("MLFLOW_TRACKING_URI"))
        mlflow.set_experiment("default")
        active_run = mlflow.start_run(experiment_id=0, run_name=run_name, nested=True)

        for artifact in artifacts:
            mlflow.log_artifact(artifact)

        mlflow.end_run()

        return active_run.info.run_uuid

    def get_task_execution_dataset_id(self, task_execution_id):
        dataset = DataSet.query.filter_by(task_execution_id=task_execution_id).first()
        return dataset.id

    def createSQLTestTable(self):
        self.connection.execute(
            """
    CREATE TABLE public.test_table (
      id integer NOT NULL,
      name character varying(80) NOT NULL
    );
    INSERT INTO public.test_table (id, name)
    VALUES  ('1', 'name1'),
            ('2', 'name2'),
            ('3','name3'),
            ('4', 'name4'),
            ('5', 'name5'),
            ('6','name6'),
            ('7', 'name7'),
            ('8', 'name8'),
            ('9','name9'),
            ('10', 'name10'),
            ('11', 'name11'),
            ('12','name12');
    """
        )

    def createGroupAndAccess(self, access_type):
        self.app_test_client.get("/codex-api/user/get-info", headers=self.headers)

        test_user_group = UserGroup(
            name=f"Test Access Group {access_type}",
            user_group_type=UserGroupType.USER_CREATED.value,
            created_by=None,
        )

        db.session.add(test_user_group)
        db.session.commit()

        user_group_obj = UserGroup.query.filter_by(name=f"Test Access Group {access_type}").first()

        setattr(user_group_obj, access_type, True)

        user_obj = User.query.filter_by(email_address="system-app@themathcompany.com").first()
        user_obj.user_groups = [
            UserGroup.query.filter_by(name="default-user").first(),
            UserGroup.query.filter_by(name=f"Test Access Group {access_type}").first(),
        ]

        db.session.commit()

    def removeGroupAccess(self):
        self.app_test_client.get("/codex-api/user/get-info", headers=self.headers)

        user_obj = User.query.filter_by(email_address="system-app@themathcompany.com").first()
        user_obj.user_groups = [UserGroup.query.filter_by(name="default-user").first()]

        db.session.commit()

    def dropSQLTestTable(self):
        self.connection.execute("DROP TABLE test_table;")

    def deleteAllTestData(self):
        self.connection.execute(
            """
    DELETE FROM pipeline_execution;
    DELETE FROM pipeline;
    DELETE FROM feature_store WHERE data_set_id IN (SELECT id FROM data_set WHERE task_execution_id IN (SELECT id FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 5)));
    DELETE FROM data_set WHERE task_execution_id IN (SELECT id FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 5));
    DELETE FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 5);
    DELETE FROM task WHERE task_type_id = 5;
    DELETE FROM feature_store WHERE data_set_id IN (SELECT id FROM data_set WHERE task_execution_id IN (SELECT id FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 4)));
    DELETE FROM data_set WHERE task_execution_id IN (SELECT id FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 4));
    DELETE FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 4);
    DELETE FROM task WHERE task_type_id = 4;
    DELETE FROM feature_store WHERE data_set_id IN (SELECT id FROM data_set WHERE task_execution_id IN (SELECT id FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 3)));
    DELETE FROM data_set WHERE task_execution_id IN (SELECT id FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 3));
    DELETE FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 3);
    DELETE FROM task WHERE task_type_id = 3;
    DELETE FROM feature_store WHERE data_set_id IN (SELECT id FROM data_set WHERE task_execution_id IN (SELECT id FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 2)));
    DELETE FROM data_set WHERE task_execution_id IN (SELECT id FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 2));
    DELETE FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE task_type_id = 2);
    DELETE FROM task WHERE task_type_id = 2;
    DELETE FROM feature_store WHERE data_set_id IN (SELECT id FROM data_set WHERE task_execution_id IN (SELECT id FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE data_set_id IS NOT NULL)));
    DELETE FROM data_set WHERE id NOT IN (SELECT data_set_id FROM task) AND task_execution_id IN (SELECT id FROM task_execution WHERE task_id IN (SELECT id FROM task WHERE data_set_id IS NOT NULL));
    DELETE FROM task_execution WHERE id NOT IN (SELECT task_execution_id FROM data_set) AND task_id IN (SELECT id FROM task WHERE data_set_id IS NOT NULL);
    DELETE FROM task WHERE id NOT IN (SELECT task_id FROM task_execution) AND data_set_id IS NOT NULL;
    DELETE FROM feature_store;
    DELETE FROM data_set;
    DELETE FROM task_execution;
    DELETE FROM task;
    DELETE FROM data_source;
    DELETE FROM user_group_identifier;
    DELETE FROM user_group WHERE id > 2;
    DELETE FROM "user";
    """
        )

    def delete_consumer_folder(self, task_execution_id):
        del_folder_path = self.env_params.getEnvParam("DATA_FOLDER_PATH")
        del_folder_path += "/task_execution_" + str(task_execution_id)
        subprocess.call("rm -rf " + del_folder_path, shell=True)
