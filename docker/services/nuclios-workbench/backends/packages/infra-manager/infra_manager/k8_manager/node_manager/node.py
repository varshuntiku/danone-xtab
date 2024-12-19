import asyncio
import logging
import subprocess

from kubernetes import client

logger = logging.getLogger(__name__)

from infra_manager.constants.node_constants import NODE_ERRORS


class Node:
    def __init__(self, conn_manager):
        self.v1 = conn_manager.get_core_v1_api()

    def get_nodes(self):
        try:
            return self.v1.list_node()
        except Exception as e:
            logger.error(f"Failed to list nodes: {e}")
            raise

    def update_node(self, node_name, node_manifest):
        if not node_name or not isinstance(node_manifest, dict):
            logger.error("Invalid parameters for updating a node")
            return None

        try:
            return self.v1.patch_node(node_name, node_manifest)
        except Exception as e:
            logger.error(f"Failed to update node {node_name}: {e}")
            raise

    def create_node(self, node_spec: dict):
        """
        Summary: Creates a new node in the K8 Cluster

        Description:
        Creates a new node within the k8 cluster based on node specifications

        Args:
            node_spec (V1NodeSpec): A kubernetes.client.V1NodeSpec object representing the node to be created

        returns:
            V1Node: A kubernetes.client.V1Node object representing the node
        """
        if node_spec is None:
            raise Exception(NODE_ERRORS.get("node_spec_missing"))
        try:
            logger.log(msg="Creating Node", level=1)
            node = self.v1.create_node(node_spec)
            return node
        except client.ApiException as exception:
            logger.error(exception)
            raise Exception(exception)

    def get_create_node_status(self, node_name: str):
        """
        Summary: Creates a new node in the K8 Cluster

        Description:
        Creates a new node within the k8 cluster based on node specifications

        Args:
            node_spec (V1NodeSpec): A kubernetes.client.V1NodeSpec object representing the node to be created

        returns:
            V1Node: A kubernetes.client.V1Node object representing the created node
        """
        # Get the node object
        try:
            node = self.v1.read_node(node_name)
            print("Creating Node Details", node)
        except client.ApiException as execption:
            if execption.status == 404:
                raise Exception(NODE_ERRORS.get("node_not_found"))
            else:
                raise Exception(execption)

        # Check node status
        # node_status = node.status.conditions[0]
        # if node_status.type == "Ready" and node_status.status:
        #     return {
        #         "is_active": True,
        #         "message": NODE_STATUS.get("node_active"),
        #         "status": node_status.status,
        #     }
        # else:
        #     return {
        #         "is_active": True,
        #         "status": node_status.status,
        #         "message": NODE_STATUS.get("node_pending"),
        #     }
        return "checking..."

    async def stream_node_creation_logs(node_name):
        """Streams the logs of the node creation process for the given node name.

        Args:
          node_name: The name of the node to stream the logs for.

        Returns:
          A stream of log lines.
        """
        # Create an asyncio.Event object to signal when the subprocess has terminated.
        subprocess_terminated_event = asyncio.Event()

        # Create a subprocess to stream the logs.
        subprocess_instance = subprocess.Popen(
            ["kubectl", "logs", "node", node_name, "--follow"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        # Start a task to read the log lines from the subprocess.
        async def read_log_lines():
            while True:
                for line in subprocess_instance.stdout:
                    yield line.decode("utf-8")

                # Check if the subprocess has terminated.
                if subprocess_instance.poll() is not None:
                    break

                # Wait for the subprocess to terminate.
                await subprocess_terminated_event.wait()

        # Start the task to read the log lines.
        log_lines_task = asyncio.create_task(read_log_lines())

        # Wait for the subprocess to terminate.
        await subprocess_terminated_event.wait()

        # Cancel the task to read the log lines.
        log_lines_task.cancel()

        subprocess_instance.terminate()

        return log_lines_task
