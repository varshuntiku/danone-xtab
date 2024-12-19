from api.daos.code_executor.executor_dao import ExecJobDao

exec_log_dao = ExecJobDao()


def create_exec_log(log_details={}):
    exec_log = exec_log_dao.create_code_execution_log(log_details)
    return exec_log


def create_exec_log_in_background(background_tasks, *args):
    background_tasks.add_task(create_exec_log, *args)
    return {"status": "Ok", "message": "Running"}
