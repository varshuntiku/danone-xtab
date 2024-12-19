class ComputeConfigDTO:
    """
    Data Tranformation Object for the ComputeConfigDTO.
    """

    def __init__(self, llm_compute_config) -> None:
        self.id = llm_compute_config.id
        self.name = llm_compute_config.sku
        self.type = llm_compute_config.type
        self.vcpu = llm_compute_config.vcpu
        self.ram = llm_compute_config.ram
        self.storage_size = llm_compute_config.storage_size
        self.data_disks = llm_compute_config.data_disks
        self.iops = llm_compute_config.iops
        self.estimated_cost = llm_compute_config.estimated_cost


class CloudProviderDTO:
    """
    Data Tranformation Object for the CloudProviderDTO.
    """

    def __init__(self, llm_compute_config) -> None:
        self.id = llm_compute_config.id
        self.name = llm_compute_config.name
