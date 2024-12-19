import logging

from api.configs.settings import get_app_settings
from infra_manager import initialize
from infra_manager.core.k8.kube_connection import KubeConnection
from kubernetes import client

app_settings = get_app_settings()


def fetch_deployment_logs(namespace, deployment_name="dynamic-execution-environment"):
    if not namespace:
        namespace = app_settings.DEPLOYMENT_NAMESPACE
    cloud_settings = {
        "AD_CLIENT_ID": app_settings.AD_CLIENT_ID,
        "AD_CLIENT_SECRET": app_settings.AD_CLIENT_SECRET,
        "TENANT_ID": app_settings.TENANT_ID,
        "RESOURCE_GROUP": app_settings.RESOURCE_GROUP,
        "CLUSTER_NAME": app_settings.CLUSTER_NAME,
        "SUBSCRIPTION_ID": app_settings.SUBSCRIPTION_ID,
    }

    initialize(
        is_cloud=True,
        cloud_provider="azure",
        cloud_settings=cloud_settings,
    )
    KubeConnection()
    core_v1 = client.CoreV1Api()
    try:
        pods = core_v1.list_namespaced_pod(namespace=namespace, label_selector=f"app={deployment_name}")
    except Exception as e:
        logging.exception(e)
        raise Exception("Error occurred in fetching logs.")
    all_logs = []
    try:
        for pod in pods.items:
            pod_name = pod.metadata.name
            logs = core_v1.read_namespaced_pod_log(pod_name, namespace, tail_lines=1000)
            all_logs.append(logs)
    except Exception as e:
        logging.exception(e)
        raise Exception("Error occurred in fetching logs.")
    return all_logs
