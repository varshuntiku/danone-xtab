def generate_job_spec(
    job_name: str,
    container_name: str,
    image_url: str,
    nodepool_name: str,
    container_port: int,
    pv_spec=None,
    command: list = None,
    ttlSecondsAfterFinished: int = 120,
    additional_labels: list = None,
    tolerations: list = None,
):
    """
    Generates a Kubernetes job specification.

    Args:
        job_name (str): The name of the job.
        container_name (str): The name of the container to run.
        image_url (str): The Docker image URL of the container.
        nodepool_name (str): The name of the node pool to run the job in.
        container_port (int): The primary port the container will listen on.
        pv_spec (dict, optional): A specification for persistent volume claims, including volumes and volume mounts.
        command (list, optional): The command to run in the container.

    Returns:
        dict: A dictionary representing the Kubernetes job spec.

    Raises:
        ValueError: If 'image_url', 'container_name' is empty, or if 'container_port' is not in the valid range.
    """
    if not container_name or not isinstance(container_name, str):
        raise ValueError("container_name must be a non-empty string.")

    if not image_url or not isinstance(image_url, str):
        raise ValueError("image_url must be a non-empty string.")

    if not isinstance(container_port, int) or container_port < 1 or container_port > 65535:
        raise ValueError("container_port must be an integer in the range 1-65535.")

    job_spec = {
        "apiVersion": "batch/v1",
        "kind": "Job",
        "metadata": {
            "name": job_name,
            "labels": {"app": job_name},
        },
        "spec": {
            "template": {
                "spec": {
                    "containers": [
                        {
                            "name": container_name,
                            "image": image_url,
                            "containerPort": container_port,
                        }
                    ],
                    "nodeSelector": {"agentpool": nodepool_name},
                    "restartPolicy": "Never",
                },
            },
            "backoffLimit": 0,
            "ttlSecondsAfterFinished": ttlSecondsAfterFinished,
        },
    }

    if additional_labels and len(additional_labels) > 0:
        for label in additional_labels:
            job_spec["metadata"]["labels"][label["name"]] = label["value"]

    if pv_spec and "volumes" in pv_spec and "volume_mounts" in pv_spec:
        job_spec["spec"]["template"]["spec"]["volumes"] = pv_spec["volumes"]
        job_spec["spec"]["template"]["spec"]["containers"][0]["volumeMounts"] = pv_spec["volume_mounts"]

    if command:
        job_spec["spec"]["template"]["spec"]["containers"][0]["command"] = command

    if tolerations is not None and isinstance(tolerations, list) and len(tolerations) > 0:
        job_spec["spec"]["template"]["spec"]["tolerations"] = tolerations

    return job_spec
