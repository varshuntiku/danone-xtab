from infra_manager.core.k8.kube_connection import KubeConnection


class PersistentVolumeClaim:
    def __init__(self, kube_connection: KubeConnection):
        self.v1_api = kube_connection.get_core_v1_api()

    def create_pvc(self, pvc_spec, namespace: str = "default"):
        """
        Summary:
        Creates a Perisent Volume claim

        Description:
        Creates a new persistent volume claim

        Args:
            pvc_spec (V1Spec): Kubernetes PVC specification
        Returns:
            pvc_object: PVC object
        """
        if not pvc_spec:
            raise ValueError("PVC spec is required")
        try:
            pvc = self.v1_api.create_namespaced_persistent_volume_claim(namespace=namespace, body=pvc_spec)
            return pvc
        except Exception as e:
            raise Exception(e)

    def get_pvc_details(self, name: str, namespace: str = "default"):
        """
        Summary:
        Get PVC Details based on the name

        Description:
        Get persistent volume claim details based on name

        Args:
            name (str): Kubernetes PVC name
            namespace (str): Kubernetes namespace
        Returns:
            pvc_object: PVC object
        """
        if not name:
            raise ValueError("PVC name is required")
        try:
            pvc = self.v1_api.read_namespaced_persistent_volume_claim(name=name, namespace=namespace)
            return pvc
        except Exception as e:
            raise Exception(e)
