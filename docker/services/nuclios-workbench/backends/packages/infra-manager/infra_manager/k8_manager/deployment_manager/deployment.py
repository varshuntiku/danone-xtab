import logging

from infra_manager.constants.deployment_constants import DEPLOYMENT_ACCEPTED
from infra_manager.core.k8.kube_connection import KubeConnection


class Deployment:
    def __init__(self, kube_connection: KubeConnection):
        self.v1_api = kube_connection.get_apps_v1_api()

    def get_deployment_details(self, deployment_name: str, namespace: str = "default"):
        """
        Summary: Fetches deployment details

        Description: Obtains the deployment details based on the specified deployment name
        and namespace

        Args:
            deployment_name (str): Name of the deployment
            namespace (str): Kubernetes Namespace name
        Returns:
            deployment_object: Deployment object containing details of deployment
        """
        logging.info("Fetching Deployments")
        try:
            deployment = self.v1_api.read_namespaced_deployment(namespace=namespace, name=deployment_name)
            return deployment
        except Exception as e:
            raise Exception(e)

    def get_all_deployments(self, namespace: str = "default"):
        """
        Summary:
        Returns all deployments of a given namespace

        Description:
        Gets all the deployments with in the specific namespace based
        on the specified namespace

        Args:
            namespace (str): Kubernetes Namespace name
        Returns:
            List<deployment_object>: List of Deployment object containing details of deployment
        """
        logging.info("Listing all deployments")
        try:
            deployments = self.v1_api.list_namespaced_deployment(namespace=namespace)
            return deployments.items
        except Exception as e:
            raise Exception(e)

    def create_deployment(self, deployment_spec, namespace: str = "default"):
        """
        Summary:
        Creates a new deployment in the specified namespace

        Description:
        Creates a new deployment in the specified namespace

        Args:
            namespace (str): Kubernetes Namespace name

        Returns:
            V1DeploymentObject: Details of the deployment
        """
        try:
            logging.info("Creating Deployment")
            deployment_response = self.v1_api.create_namespaced_deployment(namespace=namespace, body=deployment_spec)
            if deployment_response is not None:
                return {
                    "status": DEPLOYMENT_ACCEPTED.get("status"),
                    "msg": DEPLOYMENT_ACCEPTED.get("msg"),
                    "details": {
                        "name": deployment_response.metadata.name,
                        "uid": deployment_response.metadata.uid,
                        "namespace": deployment_response.metadata.namespace,
                    },
                }
        except ValueError as value_error:
            raise Exception(value_error)
        except Exception as e:
            raise Exception(e)

    def track_deployment_status(self, deployment_name: str, namespace: str = "default"):
        """
        Summary:
        Returns deployment status based for a deployment

        Description:
        Gets the status of the deployment based on the deployment name

        Args:
            namespace (str): Kubernetes Namespace name
            deployment_name (str): Name of the deployment
        Returns:
            deployment_status: status of deployment
        """
        try:
            deployment_status = self.v1_api.read_namespaced_deployment_status(name=deployment_name, namespace=namespace)
            return deployment_status.status
        except Exception as e:
            raise Exception(e)

    def delete_deployment(self, deployment_name: str, namespace: str = "default"):
        """
        Summary:
        Delete deployment based on deployment name

        Description:
        Delete the deployment in foreground based on the deployment name

        Args:
            namespace (str): Kubernetes Namespace name
            deployment_name (str): Name of the deployment
        Returns:
            deployment_status: status of deployment
        """
        if deployment_name is None:
            raise ValueError("Deployment Name is required")
        try:
            self.v1_api.delete_namespaced_deployment(name=deployment_name, namespace=namespace)
            return {"status": "Deleted", "msg": "Deployment Deleted"}
        except Exception as e:
            raise Exception(e)

    def update_deployment(self, deployment_name: str, deployment_spec: dict, namespace: str = "default"):
        """
        Summary:
        Update a Kubernetes deployment in the specified namespace.

        Args:
        - namespace (str): The namespace in which the deployment exists.
        - deployment_name (str): The name of the deployment to update.
        - deployment_spec (dict): The new specification for the deployment.

        Returns:
        - V1Deployment: The updated deployment object.
        """

        if not deployment_name:
            raise ValueError("The parameter 'deployment_name' is required.")
        if not deployment_spec:
            raise ValueError("The parameter 'deployment_spec' is required.")

        try:
            updated_deployment = self.v1_api.replace_namespaced_deployment(
                name=deployment_name, namespace=namespace, body=deployment_spec
            )

            return {
                "status": "Updated",
                "msg": "Deployment has been updated",
                "details": {
                    "name": updated_deployment.metadata.name,
                    "uid": updated_deployment.metadata.uid,
                    "namespace": updated_deployment.metadata.namespace,
                },
            }

            return updated_deployment
        except Exception as e:
            raise Exception(e)
