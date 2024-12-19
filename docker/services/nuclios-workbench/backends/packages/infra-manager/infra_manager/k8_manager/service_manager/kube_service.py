from infra_manager.core.k8.kube_connection import KubeConnection


class k8Service:
    def __init__(self, k8_connection: KubeConnection):
        self.v1_api = k8_connection.get_core_v1_api()

    def get_all_k8_services(self, namespace: str = "default"):
        """
        Summary:
        Returns all services in a given namespace

        Description:
        Fetches all the kubernetes services with in the specific namespace

        Args:
            namespace (str): k8rnetes Namespace name
        Returns:
            List<K8service_object>: List of K8 Service object containing details of K8 service
        """
        try:
            k8_services = self.v1_api.list_namespaced_service(namespace=namespace)
            return k8_services.items
        except Exception as e:
            raise Exception(e)

    def get_k8_service_details(self, service_name: str, namespace: str = "default"):
        """
        Summary:
        Returns the details of K8 Service

        Description:
        Fetches the details of the kubernetes service based on the specified service name

        Args:
            service_name (str): Name of the K8 service
            namespace (str): k8rnetes Namespace name

        Returns:
            K8service_object>: K8 Service object containing details of K8 service
        """
        if not service_name:
            raise ValueError("service name is required")
        try:
            k8_service = self.v1_api.read_namespaced_service(name=service_name, namespace=namespace)
            return k8_service
        except Exception as e:
            raise Exception(e)

    def create_k8_service(self, k8_service_spec, namespace: str = "default"):
        """
        Summary:
        Returns the details of K8 Service

        Description:
        Fetches the details of the kubernetes service based on the specified service name

        Args:
            service_name (str): Name of the K8 service
            namespace (str): k8rnetes Namespace name

        Returns:
            K8service_object>: K8 Service object containing details of K8 service
        """
        if k8_service_spec is None:
            raise ValueError("Service spec is needed to create an K8 Service")
        try:
            k8_service = self.v1_api.create_namespaced_service(namespace=namespace, body=k8_service_spec)
            return k8_service
        except Exception as e:
            raise Exception(e)

    def delete_k8_service(self, service_name: str, namespace: str = "default"):
        """
        Summary:
        Delete the K8 Service

        Description:
        Deletes the K8 Service in a specific namespace

        Args:
            service_name (str): Name of the K8 service
            namespace (str): k8rnetes Namespace name

        Returns:
            Delete_Status: K8 Service object containing details of K8 service
        """
        if not service_name:
            raise ValueError("service name is required")
        try:
            delete_status = self.v1_api.delete_namespaced_service(name=service_name, namespace=namespace)
            return delete_status
        except Exception as e:
            raise Exception(e)
