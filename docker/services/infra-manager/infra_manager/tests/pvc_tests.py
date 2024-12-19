from infra_manager.utils.pvc_utils import generate_volume_mounts_and_volumes

volume_mount_spec = [
    {
        "volume_name": "azure",
        "mount_path": "/data",
        "sub_path": "/data/1",
    }
]

volumes_spec = [
    {
        "volume_name": "azure",
        "pvc_name": "model-deploy-pvc",
    }
]

volume_mounts, volumes = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)
print(f"Volume Mounts: {volume_mounts}")

print(f"Volumes: {volumes}")
