def generate_pvc_spec(name, storage_class, access_modes, storage_size):
    """
    Generates PVC Spec based on the passed parameters
    """

    # Validation checks
    if not name:
        raise ValueError("Name is required for PVC spec.")
    if not storage_class:
        raise ValueError("Storage class is required for PVC spec.")
    if not access_modes or not isinstance(access_modes, list):
        raise ValueError("Access modes must be a non-empty list for PVC spec.")
    if not storage_size:
        raise ValueError("Storage size is required for PVC spec.")

    # Building PVC spec
    pvc_spec = {
        "apiVersion": "v1",
        "kind": "PersistentVolumeClaim",
        "metadata": {"name": name},
        "spec": {
            "storageClassName": storage_class,
            "accessModes": access_modes,
            "resources": {"requests": {"storage": storage_size}},
        },
    }
    return pvc_spec


def generate_volume_mounts_and_volumes(volume_mounts: list, volumes: list):
    """
    Generates volumeMounts and volumes objects for Kubernetes deployment.
    """

    if not volume_mounts and not isinstance(volume_mounts, list):
        raise ValueError("Volume mounts is required and must be a list.")

    if len(volume_mounts) == 0:
        raise ValueError("Volume mounts is empty")

    if not volumes and not isinstance(volumes, list):
        raise ValueError("Volumes is required and must be a list.")

    if len(volumes) == 0:
        raise ValueError("Volumes is empty")

    mapped_volume_mounts = []

    for volume_mount in volume_mounts:
        if "volume_name" not in volume_mount or "mount_path" not in volume_mount:
            raise ValueError("volume_name and mount_path is required")

        if "sub_path" in volume_mount:
            mapped_volume_mounts.append(
                {
                    "name": volume_mount["volume_name"],
                    "mountPath": volume_mount["mount_path"],
                    "subPath": volume_mount["sub_path"],
                }
            )
        else:
            mapped_volume_mounts.append(
                {
                    "name": volume_mount["volume_name"],
                    "mountPath": volume_mount["mount_path"],
                }
            )

    mapped_volumes = []

    for volume in volumes:
        if "volume_name" not in volume:
            raise ValueError("volume_name and pvc_name is required")

        if "pvc_name" in volume:
            mapped_volumes.append(
                {
                    "name": volume["volume_name"],
                    "persistentVolumeClaim": {"claimName": volume["pvc_name"]},
                }
            )

        if "secret" in volume:
            if "secret_key_paths" in volume["secret"]:
                mapped_volumes.append(
                    {
                        "name": volume["volume_name"],
                        "secret": {
                            "secretName": volume["secret"]["secret_name"],
                            "items": volume["secret"]["secret_key_paths"],
                        },
                    }
                )
            else:
                mapped_volumes.append(
                    {
                        "name": volume["volume_name"],
                        "secret": {"secretName": volume["secret"]["secret_name"]},
                    }
                )

    return mapped_volume_mounts, mapped_volumes
