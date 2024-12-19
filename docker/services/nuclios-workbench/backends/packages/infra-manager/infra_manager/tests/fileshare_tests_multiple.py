import asyncio
import datetime
import os

from dotenv import load_dotenv
from infra_manager.core.cloud.azure.fileshare_service import FileShareService

load_dotenv()


class EndStream:
    pass


async def detect_trainer_log_changes():
    # for i in range(10):  # Simulate 3 changes
    #     await asyncio.sleep(2)
    #     print(f"Trainer log changed {i} changed at {datetime.datetime.now().time()}")
    #     yield f"trainer_change_{i}"

    file_path = "ashwjit-experiment-288_375_mistral-7b-v0.1/trainer_log_ui.jsonl"
    detector = FileShareService(
        os.environ.get("STORAGE_CONN_STRING"),
        os.environ.get("FILESHARE_NAME"),
        file_path,
    )
    async for change in detector.watch_file_changes():
        if len(change) > 0:
            if change[-1]["current_steps"] == 130:
                yield change
                yield EndStream()
            print(f"Trainer log changed changed at {datetime.datetime.now().time()}")
            yield change
        else:
            print("No Change detected")


async def detect_checkpoint_changes():
    file_path = "train001/checkpoint_log.jsonl"
    detector = FileShareService(
        os.environ.get("STORAGE_CONN_STRING"),
        os.environ.get("FILESHARE_NAME"),
        file_path,
    )
    async for change in detector.watch_file_changes():
        if change["checkpoint"] == 1130:
            yield change
            yield EndStream()
        print(f"Checkpoint log changed changed at {datetime.datetime.now().time()}")
        yield change

    # for i in range(10):  # Simulate 3 changes
    #     await asyncio.sleep(2)
    #     print(f"Checkpoint log changed {i} changed at {datetime.datetime.now().time()}")
    #     yield f"checkpoint_change_{i}"


async def read_trainer_changes():
    print("Trainer Log Changes Started.....")

    async for train_change in detect_trainer_log_changes():
        if isinstance(train_change, EndStream):
            print("Received End of Stream, generator is done")
            break
        else:
            print(f"Processing train log {train_change} at {datetime.datetime.now().time()}")


async def read_checkpoint_changes():
    print("Checkpoint Log Changes Started.....")
    async for checkpoint_change in detect_checkpoint_changes():
        if isinstance(checkpoint_change, EndStream):
            print("Received End of Stream, generator is done")
            break
        else:
            print(f"Processing checkpoint {checkpoint_change} at {datetime.datetime.now().time()}")


async def process_log_changes():
    await asyncio.gather(
        read_trainer_changes(),
        # read_checkpoint_changes(),
    )
    print("Streaming Completed")
    return "completed"


async def main():
    await process_log_changes()
    print("Completed..")


# Run the main function
asyncio.run(main())
