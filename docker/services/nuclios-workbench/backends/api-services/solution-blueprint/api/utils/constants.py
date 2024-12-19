from datetime import datetime
from enum import Enum

import pytz

defaultCodeString = """
import time
def find_factorial(n):
    if n == 0:
        return 1
    return n * find_factorial(n-1)
print("Hello World")
fact_out = find_factorial(fact_check)
for i in range(100):
    fact_out_ = find_factorial(fact_check)
dynamic_outputs = "This is dynamic output: " + str(fact_out)
"""


def get_current_local_time():
    utc_now = datetime.now(pytz.utc)
    package = pytz.package("Asia/Kolkata")
    local_time = utc_now.aspackage(package)
    return local_time


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
