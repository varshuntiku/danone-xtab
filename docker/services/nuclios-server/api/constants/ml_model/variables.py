from enum import Enum


class ModelType(Enum):
    DEPLOYED = "deployed"
    BASE = "base"
    FINETUNED = "finetuned"
    IMPORTED = "imported"
    DEPLOYEDMODELREQUEST = "deployed-model-request"


class JobStatus(Enum):
    # JOB has been created
    CREATED = "created"
    # JOB has started
    INPROGRESS = "in-progress"
    # JOB has run successfully
    SUCCESS = "success"
    # JOB has failed
    FAILED = "failed"
    # Job has closed as it got rejected
    CLOSED = "closed"


class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class ModelStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIEVED = "archieved"
    DELETED = "deleted"


class JobType(Enum):
    DEPLOY = "deploy"
    IMPORT = "import"
    FINETUNE = "fine-tune"


class ModelTaskType(Enum):
    CHATCOMPLETION = "chatcompletion"
    TEXTGENERATION = "textgeneration"
    EMBEDDING = "embedding"
    TEXTTOIMAGE = "texttoimage"
    TEXTTOVIDEO = "texttovideo"
    TEXTTOSQL = "texttosql"
