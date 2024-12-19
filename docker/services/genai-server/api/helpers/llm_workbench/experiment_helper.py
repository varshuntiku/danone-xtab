import asyncio

from api.daos.llm_workbench.experiment_dao import LLMExperimentDao


async def update_experiment_status(user, llm_experiment_id, status):
    # Sleep 2 Minutes
    await asyncio.sleep(120)
    # Update db
    LLMExperimentDao().update_llm_experiment_status(user, llm_experiment_id, status)
