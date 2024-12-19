NODE_SPEC = {
    "pod_cidr": "192.168.0.0/16",
    "PROVIDER_ID": "kubernetes",
    "TAINTS": [],
    "RESOURCE_CONFIG": {},
}

NODE_STATUS = {
    "node_active": "Node is up & running",
    "node_pending": "Node Creation is in progress",
}

NODE_ERRORS = {
    "node_not_found": "The specified Node is not found",
    "node_create_error": "Node Creation Failed",
    "node_spec_missing": "Node spec is required for node creation",
}
