# from kubernetes.client import V1PodSpec, V1Container, V1ContainerPort
from infra_manager.constants.pod_constants import POD_SPEC


def generate_pod_spec(pod_name: str, container_name: str, image_url: str):
    pod_spec = {
        "apiVersion": "v1",
        "kind": "Pod",
        "metadata": {"name": pod_name},
        "spec": {
            "containers": [
                {
                    "name": container_name,
                    "image": image_url,
                    "ports": POD_SPEC.get("container_ports"),
                }
            ]
        },
    }

    # pod_spec = V1PodSpec(
    #     containers=[
    #         V1Container(
    #             name="chantraincontainer",
    #             image="docker.io/nginx:1.23.4",
    #             ports=[V1ContainerPort(container_port=80)],
    #         ),
    #     ]
    # )
    # pod_spec = pod_spec.to_dict()

    # pod_spec["metadata"] = {"name": "chanpodclst"}

    return pod_spec
