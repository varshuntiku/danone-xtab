from infra_manager.constants.node_constants import NODE_SPEC


def node_spec_generator(node_name: str):
    # node_spec = V1NodeSpec(
    #     external_id=node_name,
    #     pod_cidr=NODE_SPEC.get("POD_CIDR"),
    # )
    node_spec = {
        "kind": "Node",
        "apiVersion": "v1",
        "metadata": {
            "name": "chantrainnode",
        },
        "spec": {"externalID": node_name, "podCIDR": NODE_SPEC.get("pod_cidr")},
    }

    return node_spec
