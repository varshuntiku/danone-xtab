def generate_deployment_spec(
    deployment_name: str,
    container_name: str,
    image_url: str,
    nodepool_name: str,
    container_port: int,
    replicas: int = 1,
    pv_spec=None,
    env=None,
    tolerations: list = None,
):
    deployment_spec = {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {"name": deployment_name, "labels": {"app": deployment_name}},
        "spec": {
            "replicas": replicas,
            "selector": {"matchLabels": {"app": deployment_name}},
            "template": {
                "metadata": {"labels": {"app": deployment_name}},
                "spec": {
                    "containers": [
                        {
                            "name": container_name,
                            "image": image_url,
                            "containerPort": container_port,
                        }
                    ],
                    "nodeSelector": {"agentpool": nodepool_name},
                },
            },
        },
    }

    if pv_spec and "volumes" in pv_spec and "volume_mounts" in pv_spec:
        deployment_spec["spec"]["template"]["spec"]["volumes"] = pv_spec["volumes"]
        deployment_spec["spec"]["template"]["spec"]["containers"][0]["volumeMounts"] = pv_spec["volume_mounts"]

    if env:
        deployment_spec["spec"]["template"]["spec"]["containers"][0]["env"] = env

    if tolerations is not None and isinstance(tolerations, list) and len(tolerations) > 0:
        deployment_spec["spec"]["template"]["spec"]["tolerations"] = tolerations

    return deployment_spec
