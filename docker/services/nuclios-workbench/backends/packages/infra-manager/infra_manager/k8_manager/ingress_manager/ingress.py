from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.utils.ingress_utils import (
    convert_to_agic_ingress_spec,
    delete_http_path,
)
from kubernetes.client.rest import ApiException


class Ingress:
    """
    Ingress manager to handle ingress operations
    """

    def __init__(self, kube_conn: KubeConnection):
        self.v1_api = kube_conn.network_v1

    def get_all_ingress(self, namespace="default"):
        """
        Summary:
        Lists all ingress within the specific namespace of K8 cluster

        Description:
        Returns the all the ingress based on the namespace within the k8 cluster

        Args:
            namespace (str): Kubernetes Namespace name
        Returns:
            Ingress_Object: Ingress object
        """
        try:
            ingress_response_event = self.v1_api.list_namespaced_ingress(namespace=namespace, async_req=True)
            # wait to obtain the results
            ingress_response_event.wait()
            ingresses = ingress_response_event.get()
            return ingresses.items
        except ApiException as api_exception:
            raise ApiException(api_exception)
        except Exception as e:
            raise Exception(e)

    def get_ingress_details(self, ingress_name: str, namespace: str = "default"):
        """
        Summary:
        Returns details of the ingress

        Description:
        Returns the details of the ingress based on the specified

        Args:
            ingress_name (str): name of the ingress
            namespace (str): Kubernetes Namespace name

        Returns:
            Ingress_Object: Ingress object
        """
        if ingress_name is None:
            raise ValueError("Ingress Name is required")

        try:
            ingress_event = self.v1_api.read_namespaced_ingress(name=ingress_name, namespace=namespace, async_req=True)
            # wait to obtain the results
            ingress_event.wait()
            ingress = ingress_event.get()
            return ingress
        except Exception as exp:
            raise Exception(exp)

    def create_ingress(self, ingress_spec, namespace: str = "default"):
        """
        Summary:
        Creates an new ingress and ingress controller

        Description:
        Creates a new ingress controller based on the specified spec

        Args:
            ingress_spec (NetworkingV1Ingress): name of the ingress
            namespace (str): Kubernetes Namespace name

        Returns:
            NetworkingV1Ingress: Ingress object
        """
        if ingress_spec is None:
            raise ValueError("Ingress spec is required to create the ingress")
        try:
            ingress = self.v1_api.create_namespaced_ingress(namespace=namespace, body=ingress_spec)
            return ingress
        except Exception as e:
            raise Exception(e)

    def update_ingress(self, ingress_name: str, ingress_spec, namespace: str = "default"):
        """
        Summary:
        Updates ingress based on the specified spc

        Description:
        Updates ingress controller based on the specified spec

        Args:
            ingress_name (str): name of the ingress to be updated
            ingress_spec (NetworkingV1Ingress): name of the ingress
            namespace (str): Kubernetes Namespace name

        Returns:
            NetworkingV1Ingress: Ingress object
        """
        if ingress_name is None:
            raise ValueError("Ingress name is required")

        if ingress_spec is None:
            raise ValueError("Ingress spec is required to create the ingress")
        try:
            body = ingress_spec
            ingress = self.v1_api.patch_namespaced_ingress(name=ingress_name, namespace=namespace, body=body)
            return ingress
        except Exception as e:
            raise Exception(e)

    def bind_new_service(self, ingress_name: str, path_spec, namespace: str = "default"):
        """
        Summary:
        Adds a new service to ingress based on the specified spec

        Description:
        This method is used when a new service or deployment needs to be exposed to public clients.

        Args:
            ingress_name (str): name of the ingress to be updated
            ingress_spec (NetworkingV1Ingress): name of the ingress
            namespace (str): Kubernetes Namespace name

        Returns:
            NetworkingV1Ingress: Ingress object
        """
        if ingress_name is None:
            raise ValueError("Ingress name is required")

        if path_spec is None:
            raise ValueError("Path Spec is required")

        # Retrieve the current ingress
        try:
            ingress = self.get_ingress_details(ingress_name, namespace=namespace)
            ingress_spec = convert_to_agic_ingress_spec(ingress.to_dict(), ingress_name, namespace)

        except Exception as read_exception:
            raise Exception(f"Failed to Obtain ingress by specified name {read_exception}")

        # append the new path to the rule
        try:
            ingress_spec["spec"]["rules"][0]["http"]["paths"].append(path_spec)
            print("Final Ingress Spec", ingress_spec)
            # update the ingress
            self.update_ingress(ingress_name, ingress_spec, namespace)
            return {"status": "success", "msg": "Ingress Updated"}
        except Exception as e:
            raise Exception(e)

    def remove_ingres_path(self, ingress_name: str, path: str, namespace: str = "default"):
        if ingress_name is None:
            raise ValueError("Ingress name is required")

        if path is None:
            raise ValueError("Ingress HTTP Path is required")

        # Retrieve the current ingress
        try:
            ingress = self.get_ingress_details(ingress_name, namespace=namespace)
            ingress_spec = convert_to_agic_ingress_spec(ingress.to_dict(), ingress_name, namespace)

        except Exception as read_exception:
            raise Exception(f"Failed to Obtain ingress by specified name {read_exception}")

        # remove the requested ingress spec
        filtered_ingress_spec = delete_http_path(ingress_spec, path_name=path, ingress_name="", namspace=namespace)

        # Update Ingress
        try:
            self.update_ingress(ingress_name, filtered_ingress_spec, namespace)
            return {"status": "success", "msg": "Ingress Updated"}
        except Exception as e:
            raise Exception(e)

    def get_network_info(self, ingress_name: str, namespace: str = "default"):
        """
        Summary:
        Returns network information of the specified ingress

        Description:
        Returns the network configuration details such as IP Address, network type etc

        Args:
            ingress_name (str): name of the ingress to be updated
            namespace (str): Kubernetes Namespace name

        Returns:
            NetworkInfo: Ingress object
        """
        if ingress_name is None:
            raise ValueError("Ingress name is required")

        try:
            ingress = self.get_ingress_details(ingress_name=ingress_name, namespace=namespace)
            ingress = ingress.to_dict()

            # validate details
            if "status" not in ingress:
                raise ValueError("Ingress Status is Unkown")

            if "load_balancer" not in ingress["status"]:
                raise ValueError("Ingress or load balancer is not configured")

            ingress_status = ingress["status"]

            if "ingress" not in ingress_status["load_balancer"]:
                raise ValueError("Ingress or load balancer is not configured")

            ingress_load_balancer = ingress_status["load_balancer"]

            if not isinstance(ingress_load_balancer["ingress"], list) or len(ingress_load_balancer["ingress"]) == 0:
                raise ValueError("Host or External IP is not bound to ingress or load balancer")

            return ingress_load_balancer["ingress"][0]

        except Exception as e:
            raise Exception(e)
