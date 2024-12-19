from enum import Enum


class JobStatus(Enum):
    # JOB has been created
    CREATED = "created"
    # JOB has started
    INPROGRESS = "in-progress"
    # JOB has run successfully
    SUCCESS = "success"
    # JOB has failed
    FAILED = "failed"


class JobType(Enum):
    DEPLOY = "deploy"
    IMPORT = "import"
    FINETUNE = "fine-tune"
