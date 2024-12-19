import json
import logging
import re

from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.pod_manager.pod import Pod
from kubernetes.client.rest import ApiException

logger = logging.getLogger(__name__)


class Job:
    def __init__(self, kube_connection: KubeConnection):
        self.v1_api = kube_connection.batch_v1
        self.kube_connection = kube_connection

    def create_job(self, job_spec, namespace: str = "default") -> dict:
        """
        Summary:
        Creates a new job in a given namespace

        Description:
        Creates a new Job in a given namespace based on job spec

        Args:
            namespace (str): Kubernetes Namespace name
        Returns:
            V1Job: A kubernetes.client.V1PJob object representing the created Job
        """
        try:
            # logging.info("Creating Job")
            job_response = self.v1_api.create_namespaced_job(namespace=namespace, body=job_spec)
            # print(job_response)
            if job_response is not None:
                return {
                    "status": "CREATED",
                    "msg": "Job has been created",
                    "name": job_response.metadata.name,
                }
        except ValueError as value_error:
            raise Exception(value_error)
        except Exception as e:
            raise Exception(e)

    def get_job_details(self, job_name: str, namespace: str = "default") -> dict:
        """
        Summary:
        Returns Job Details based on job name

        Description:
        Returns the details of the created job based on the job name

        Args:
            namespace (str): Kubernetes Namespace name
            job_name (str): Name of the job
        Returns:
            V1Job: A kubernetes.client.V1PJob object representing the created Job
        """
        try:
            logging.info("Fetching Job Details")
            job_response = self.v1_api.read_namespaced_job(job_name, namespace)
            return job_response
        except Exception as e:
            raise Exception(e)

    def get_job_logs(self, job_name: str, namespace: str = "default") -> list:
        """
        Fetches logs from all pods associated with a given job.

        Args:
            job_name (str): The name of the job to fetch logs for.
            namespace (str): The Kubernetes Namespace where the job is located.

        Returns:
            dict: A dictionary where keys are pod names (IDs) and values are the logs for each pod.
        """

        pod_manager = Pod(self.kube_connection)

        try:
            pods = pod_manager.get_pods(namespace, f"job-name={job_name}")
            job_logs = {}
            for pod in pods.items:
                pod_name = pod.metadata.name
                try:
                    pod_logs = pod_manager.get_pod_logs(pod_name=pod_name, namespace=namespace)
                    print("Pod Logs", pod_logs)
                    job_logs[pod_name] = pod_logs
                except ApiException as e:
                    print("Exception Occured when fetching logs...")
                    job_logs[pod_name] = f"Error fetching logs: {e}"

            return job_logs
        except ApiException as api_exception:
            print("API Exception", api_exception)
            raise Exception(api_exception)
        except Exception as e:
            # error_dict = e.__dict__
            error_string = str(e)
            match = re.search(r"HTTP response body: ({.*})", error_string)
            if match:
                try:
                    error_details = json.loads(match.group(1))
                    detailed_message = error_details.get("message", "No detailed message provided.")
                    status_code = error_details.get("code", "No status code")
                except json.JSONDecodeError:
                    detailed_message = "Failed to parse error details."
                    status_code = "Error parsing status code"
            error_log = {
                "message": "Error Occurred when Fetching Logs: " + detailed_message,
                "status_code": status_code,
            }
            job_logs[pod_name] = error_log
            raise Exception(job_logs)

    def get_job_status(self, job_name, namespace="default"):
        """
        Retrieves the status of a Kubernetes Job.

        :param job_name: The name of the Kubernetes Job.
        :param namespace: The namespace of the Kubernetes Job.
        :return: Status of the job such as 'Running', 'Pending', 'Completed', 'Failed', etc.
        """

        print("Job Name", job_name)
        try:
            job = self.v1_api.read_namespaced_job(name=job_name, namespace=namespace)
            conditions = job.status.conditions
            if conditions:
                for condition in conditions:
                    if condition.type == "Complete" and condition.status == "True":
                        return {"status": "Completed"}
                    elif condition.type == "Failed" and condition.status == "True":
                        return {"status": "Failed"}
            if job.status.active:
                return {"status": "Running"}
            if job.status.succeeded:
                return {"status": "Completed"}
            if job.status.failed:
                return {"status": "Failed"}
            return {"status": "Pending"}
        except ApiException as api_exception:
            if api_exception.status == 404:
                raise ApiException({"message": "Pod Not Found", "status_code": 404})
        except Exception as e:
            raise Exception(e)
