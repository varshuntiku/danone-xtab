from infra_manager.core.k8.kube_connection import KubeConnection


class StorageClass:
    def __init__(self, kube_conn: KubeConnection):
        self.v1_api = kube_conn.storage_v1

    def get_all_storage_class(self, namespace: str = "default"):
        """
        Summary:
        Lists all storage class

        Description:
        Lists all storage classes within the cluster

        Args:
            namespace (str): Optional

        Returns:
            List<StorageClass>: List of storage classes
        """
        try:
            storage_classes = self.v1_api.list_storage_class()
            return storage_classes
        except Exception as e:
            raise Exception(e)

    def create_storage_class(self, storage_class_spec):
        """
        Summary:
        Creates a new storage class

        Description:
        Creates a new storage class based on the given storage class specs

        Args:
            storageclasspsec (StorageClassSpec): storage class specs

        Returns:
            StorageClass:  Storage classes
        """
        if not storage_class_spec:
            raise ValueError("Storage Class Spec is required")
        try:
            storage_class = self.v1_api.create_storage_class(body=storage_class_spec)
            return storage_class
        except Exception as exception:
            raise Exception(exception)

    def get_storage_class(self, name: str):
        """
        Summary:
        Returns storage class details

        Description:
        Returns the details of the storage class based on the name

        Args:
            name (str): Name of the storage class

        Returns:
            StorageClass:  Storage classes
        """
        if name is None:
            raise ValueError("Storage Class Name is required")
        try:
            storage_class = self.v1_api.read_storage_class(name=name)
            return storage_class
        except Exception as e:
            raise Exception(e)

    def delete_storage_class(self, name: str):
        """
        Summary:
        Deletes the storage class

        Description:
        Deletes the storage class based on the name

        Args:
            name (str): Name of the storage class

        Returns:
            StorageClass:  Storage classes
        """
        if name is None:
            raise ValueError("Storage class name is required")
        try:
            self.v1_api.delete_storage_class(name=name)
            return {"stauts": "Success", "msg": "Storage Class Deleted"}
        except Exception as e:
            raise Exception(e)
