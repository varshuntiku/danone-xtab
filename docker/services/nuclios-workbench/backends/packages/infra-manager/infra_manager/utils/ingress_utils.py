from copy import deepcopy

from infra_manager.constants.agic_constants import agic_ingress_template


def generate_agic_ingress_spec(
    ingress_name: str,
    service_name: str,
    service_port: int,
    path="/",
    namespace: str = "default",
):
    """
    Generates ingress spec based on the specified service and path
    """
    if not ingress_name:
        raise ValueError("Ingress name is required.")
    if not service_name:
        raise ValueError("Service name is required.")
    if not service_port:
        raise ValueError("Service port is required.")

    # Ingress spec generation
    # ingress_spec = {
    #     "apiVersion": "networking.k8s.io/v1",
    #     "kind": "Ingress",
    #     "metadata": {
    #         "name": ingress_name,
    #         "namespace": namespace,
    #         "annotations": {
    #             "nginx.in   gress.kubernetes.io/ssl-redirect": "false",
    #             "nginx.ingress.kubernetes.io/use-regex": "true",
    #         },
    #     },
    #     "spec": {
    #         "ingressClassName": "azure-application-gateway",
    #         "rules": [
    #             {
    #                 "http": {
    #                     "paths": [
    #                         {
    #                             "path": path,
    #                             "pathType": "Prefix",
    #                             "backend": {
    #                                 "service": {
    #                                     "name": service_name,
    #                                     "port": {"number": service_port},
    #                                 }
    #                             },
    #                         }
    #                     ]
    #                 }
    #             }
    #         ],
    #     },
    # }

    ingress_spec = deepcopy(agic_ingress_template)

    ingress_spec["rules"].append(
        {
            "http": {
                "paths": [
                    {
                        "path": path,
                        "pathType": "Prefix",
                        "backend": {
                            "service": {
                                "name": service_name,
                                "port": {"number": service_port},
                            }
                        },
                    }
                ]
            }
        }
    )

    return ingress_spec


def generate_agic_path_spec(path: str, service_name: str, service_port: int):
    """
    Generates AGIC ingress new path spec based on the specified service and path
    """
    if not path:
        raise ValueError("Path is required.")
    if not service_name:
        raise ValueError("Service name is required.")
    if not isinstance(service_port, int) or service_port <= 0:
        raise ValueError("Service port must be a positive integer.")

    # generate path spec
    new_path_spec = {
        "path": path,
        "pathType": "Prefix",
        "backend": {"service": {"name": service_name, "port": {"number": service_port}}},
    }
    return new_path_spec


def convert_to_agic_ingress_spec(k8_ingress_spec, ingress_name: str, namespace: str = "default"):
    """
    Converts the Networkv1Ingress spec to simplified Ingress Spec
    """
    ingress_spec = deepcopy(agic_ingress_template)
    # print("Deep Copy Ingress Spec", k8_ingress_spec)

    # Get http paths for transformation
    k8_http_paths = k8_ingress_spec["spec"]["rules"][0]["http"]["paths"]
    k8_ingress_host = k8_ingress_spec["spec"]["rules"][0]["host"]
    ingress_http_paths = []

    # re-build http paths
    for http_path in k8_http_paths:
        ingress_http_paths.append(
            {
                "backend": http_path["backend"],
                "path": http_path["path"],
                "pathType": http_path["path_type"],
            }
        )
    # rebuild rules
    ingress_rules = [{"host": k8_ingress_host, "http": {"paths": ingress_http_paths}}]

    # bind rules and metadata
    ingress_spec["spec"]["rules"] = ingress_rules
    ingress_spec["metadata"]["name"] = ingress_name
    ingress_spec["metadata"]["namespace"] = namespace
    return ingress_spec


def validate_ingress_spec(ingress_spec):
    # Check if 'spec' exists
    if "spec" not in ingress_spec:
        raise ValueError("Missing 'spec' in ingress spec.")

    spec = ingress_spec["spec"]

    # Check if 'rules' exists and is an array
    if "rules" not in spec or not isinstance(spec["rules"], list):
        raise ValueError("Missing or invalid 'rules' array in spec.")

    # Check if 'rules' array has at least one element
    if len(spec["rules"]) == 0:
        raise ValueError("'rules' array is empty.")

    # Check if the first element of 'rules' contains 'http'
    if "http" not in spec["rules"][0]:
        raise ValueError("Missing 'http' in the first rule.")

    http = spec["rules"][0]["http"]

    # Check if 'paths' exists and is an array
    if "paths" not in http or not isinstance(http["paths"], list):
        raise ValueError("Missing or invalid 'paths' array in http.")

    # Check if 'paths' array is not empty
    if len(http["paths"]) == 0:
        raise ValueError("'paths' array is empty.")

    return True


def filter_http_paths(http_path, path_name):
    return http_path["path"] != path_name


def delete_http_path(k8_ingress_spec, path_name: str, ingress_name: str, namspace: str = "default"):
    """
    Utility function to delete the HTTP path from ingress rules &
    returns the updated ingress spec
    """

    # Validate ingress spec to see if required props exists
    is_valid_spec = validate_ingress_spec(k8_ingress_spec)

    if not is_valid_spec:
        raise ValueError("Invalid Ingress spec provided")

    # Get the ingress HTTP paths
    ingress_http_paths = k8_ingress_spec["spec"]["rules"][0]["http"]["paths"]

    # Filter http path based on the specified path param
    filtered_http_paths = list(
        filter(
            lambda http_path: filter_http_paths(http_path, path_name),
            ingress_http_paths,
        )
    )

    # update the k8 ingress spec
    k8_ingress_spec["spec"]["rules"][0]["http"]["paths"] = filtered_http_paths

    return k8_ingress_spec
