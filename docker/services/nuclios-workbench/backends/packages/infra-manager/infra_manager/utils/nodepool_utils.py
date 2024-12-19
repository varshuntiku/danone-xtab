from typing import Dict, List, Optional


class NodePoolSpec:
    def __init__(
        self,
        vm_size: str = None,
        count: int = 1,
        os_type: str = "Linux",
        mode: str = "User",
        os_sku: str = "Ubuntu",
        enable_auto_scaling: bool = True,
        min_count: int = 0,
        max_count: int = 1,
        type_properties_type: str = "VirtualMachineScaleSets",
        node_taints: Optional[List[str]] = None,
        node_labels: Optional[Dict[str, str]] = None,
    ):
        self.vm_size = vm_size
        self.count = count
        self.os_type = os_type
        self.mode = mode
        self.os_sku = os_sku
        self.enable_auto_scaling = enable_auto_scaling
        self.min_count = min_count
        self.max_count = max_count
        self.type_properties_type = type_properties_type
        self.node_taints = node_taints or []
        self.node_labels = node_labels or {}

        self._validate()

    def _validate(self):
        if self.count < 0:
            raise ValueError("Count values must be non-negative")
        if self.min_count < 0:
            raise ValueError("min_count must be non-negative")
        if self.max_count < 0:
            raise ValueError("max_count must be non-negative")
        if self.max_count < self.min_count:
            raise ValueError("max_count must be greater than or equal to min_count")
        if not self.enable_auto_scaling:
            self.min_count = None
            self.max_count = None
