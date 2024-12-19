class LLMComputeConfigDTO:
    """
    Data Tranformation Object for the LLMComputeConfigDTO.
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
        self.cloud_provider = llm_compute_config.cloud_provider.name if llm_compute_config.cloud_provider else None
