import asyncio
import logging
import os
import struct
import tempfile
import time

from api.configs.settings import get_app_settings
from api.constants.execution_environment.variables import (
    ExecutionEnvironmentCategory,
    ExecutionEnvironmentComputeType,
)
from api.databases.session import SessionLocal
from api.models.base_models import ExecutionEnvironment
from api.orchestrators.execution_environment.executors.execution_environment_executor import (
    ExecutionEnvironmentExecutor,
)
from infra_manager.core.cloud.azure.fileshare_service import FileShareService
from infra_manager.k8_manager.deployment_manager.deployment import Deployment

settings = get_app_settings()


class ExecutionEnvironmentExecutorHelper(ExecutionEnvironmentExecutor):
    def __init__(self, user, execution_model):
        super().__init__(user, execution_model)
        self.intialize_kube_connection()

    async def create_dedicated_node_pool_helper(self):
        self.create_dedicated_node_pool()

    async def verify_file_share(self):
        file_share_service = FileShareService(settings.AZURE_FILE_SHARE_CONNECTION_STRING, None, None)
        get_available_directories_in_specific_path = file_share_service.get_available_directories_in_specific_path(
            "exec-env-repository", "exec-envs/" + self.env_fileshare_directory
        )
        if get_available_directories_in_specific_path:
            return True
        return False

    async def verify_acr_exists(self):
        try:
            self.get_image_details()
            if (
                self.image_details.get("digest")
                or self.image_details.get("size")
                or self.image_details.get("repository_name")
                or self.image_details.get("tag_name")
            ):
                return True
            return False
        except Exception as e:
            logging.error(f"Error while verifying acr: {e}")
            return False

    async def verify_deployment_exists(self):
        try:
            await self.track_deployment()
            return self.deployment_is_successful
        except Exception as e:
            logging.error(f"Error while tracking deployment: {e}")
            return False

    async def verify_ingress_exists(self):
        try:
            await self.perform_ping_test()
            return self.ingress_service_is_successful
        except Exception as e:
            logging.error(f"Error while tracking ingress: {e}")
            return False


def to_dict(obj):
    if not hasattr(obj, "__dict__"):
        return obj
    result = {}
    for key, val in obj.__dict__.items():
        if key.startswith("_"):
            continue
        element = []
        if isinstance(val, list):
            for item in val:
                element.append(to_dict(item))
        else:
            element = to_dict(val)
        result[key] = element
    return result


async def run_pending_exec_ds_env_tasks():
    # This function is used to run all pending tasks
    # It is an async function
    # It is called in the lifespan context manager
    pass


async def run_pending_exec_env_task(exec_env):
    # This function is used to run all pending exec envs
    # It is an async function
    # It is called in the lifespan context manager
    exec_env_orchestrator = ExecutionEnvironmentExecutorHelper({}, exec_env)

    if exec_env.get("compute_type") == ExecutionEnvironmentComputeType.DEDICATED.value:
        await exec_env_orchestrator.create_dedicated_node_pool_helper()
    try:
        looper = 0
        while True:
            response = await exec_env_orchestrator.verify_file_share()
            looper += 1
            if response:
                break
            else:
                await exec_env_orchestrator.create_job_and_monitor()
            if looper > 3:
                raise Exception("File share not found, exiting")
    except Exception as e:
        logging.error(f"Error while checking the file share status: {e}")
    logging.info("File share verified for " + str(exec_env.get("id")))

    try:
        looper = 0
        while True:
            response = await exec_env_orchestrator.verify_acr_exists()
            looper += 1
            if response:
                break
            else:
                await exec_env_orchestrator.create_job_and_monitor()
            if looper > 3:
                raise Exception("ACR not found, exiting")
    except Exception as e:
        logging.error(f"Error while checking the ACR status: {e}")
    logging.info("ACR verified for " + str(exec_env.get("id")))

    try:
        looper = 0
        exec_env_orchestrator.deployment_manager = Deployment(exec_env_orchestrator.kube_connection)
        while True:
            response = await exec_env_orchestrator.verify_deployment_exists()
            looper += 1
            if response:
                break
            else:
                await exec_env_orchestrator.deploy_execution_environment()
            if looper > 3:
                raise Exception("Deployment not found, exiting")
    except Exception as e:
        logging.error(f"Error while checking the Deployment status: {e}")
    logging.info("Deployment verified for " + str(exec_env.get("id")))

    try:
        looper = 0
        while True:
            response = await exec_env_orchestrator.verify_ingress_exists()
            looper += 1
            if response:
                if exec_env_orchestrator.execution_model.get("status") != "Running":
                    exec_env_orchestrator.handle_status_update("Running", message="Running.")
                break
            else:
                exec_env_orchestrator.setup_ingress(exec_env_orchestrator.fetch_exec_env_short_name_with_id())
                await asyncio.sleep(60)
            if looper > 3:
                raise Exception("Deployment not found, exiting")
    except Exception as e:
        logging.error(f"Error while checking the Ingress status: {e}")
    logging.info("Ingress verified for " + str(exec_env.get("id")))


async def run_pending_env_tasks():
    # This function is used to run all pending tasks
    # It is an async function
    # It is called in the lifespan context manager
    app_settings = get_app_settings()
    if not app_settings.RUN_PENDING_ENVS:
        logging.info("skipping pending ENVs check as it is not enabled")
        return "done"
    db_session = SessionLocal()

    interrupted_execution_environments = (
        db_session.query(ExecutionEnvironment)
        .filter(
            ExecutionEnvironment.deleted_at.is_(None),
            ExecutionEnvironment.is_active.is_(True),
            ExecutionEnvironment.status.notin_(["Running", "Failed", "Stopped"]),
        )
        .all()
    )
    await run_pending_exec_ds_env_tasks()
    exec_envs = [
        to_dict(x)
        for x in interrupted_execution_environments
        if x.env_category == ExecutionEnvironmentCategory.UIAC_EXECUTOR.value
    ]
    for exec_env in exec_envs:
        await run_pending_exec_env_task(exec_env)
    logging.info("done, all pending envs are fixed")


# Function to generate a secure random integer in a given range
def secure_random_integer(minimum, maximum):
    range_size = maximum - minimum + 1
    while True:
        random_bytes = os.urandom(4)
        random_integer = struct.unpack("I", random_bytes)[0]
        if random_integer < (2**32 - (2**32 % range_size)):
            return minimum + (random_integer % range_size)


async def lock_check():
    random_number = secure_random_integer(1, 100)
    logging.info("Running pending tasks after " + str(random_number) + " seconds")
    await asyncio.sleep(random_number)
    # This function is used to check if the lock is enabled
    temp_dir = os.path.join(tempfile.gettempdir(), "dee_lock.txt")
    logging.info(temp_dir)
    if os.path.exists(temp_dir):
        with open(temp_dir, "r") as f:
            lock_time = f.read()
        if time.time() - float(lock_time) < 300:
            return True
        else:
            os.remove(temp_dir)
            with open(temp_dir, "w") as f:
                f.write(str(time.time()))
            return False
    else:
        with open(temp_dir, "w") as f:
            f.write(str(time.time()))
        return False


async def init():
    # This function is used to run all pending tasks
    # It is called when the application starts
    # It is called in the lifespan context manager
    await asyncio.sleep(3)
    if await lock_check():
        logging.info("Lock is enabled, exiting")
        return
    await run_pending_env_tasks()
