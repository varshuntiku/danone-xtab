def generate_k8_service_spec(
    service_type: str,
    name: str,
    port: int,
    target_port: int,
    selector: str,
    nodeport=None,
):
    """
    Summary:
    Generates the kubernetes Service spec

    Description:
    Fetches the details of the kubernetes service based on the specified service name

    Args:
        service_type (str): K8 service type

    Returns:
        K8ServiceSpec: K8 Service object containing details of K8 service
    """
    # check service type
    if service_type not in ["NodePort", "ClusterIP"]:
        raise ValueError("Invalid service type. Must be 'NodePort' or 'ClusterIP'.")

    # check port and target_port
    if not isinstance(port, int) or not isinstance(target_port, int):
        raise ValueError("Port and target port must be integers.")

    # Validating nodeport for NodePort service type
    if service_type == "NodePort" and nodeport is not None:
        if not isinstance(nodeport, int):
            raise ValueError("NodePort must be an integer.")

    # Build kube Service spec
    spec = {
        "apiVersion": "v1",
        "kind": "Service",
        "metadata": {"name": name},  # Replace with your service name
        "spec": {
            "selector": {"app": selector},  # Replace with your app selector
            "ports": [{"port": port, "targetPort": target_port, "protocol": "TCP"}],
        },
    }

    if service_type == "NodePort":
        spec["spec"]["type"] = "NodePort"
    if nodeport:
        spec["spec"]["ports"][0]["node_port"] = nodeport
    elif service_type == "ClusterIP":
        spec["spec"]["type"] = "ClusterIP"

    return spec
