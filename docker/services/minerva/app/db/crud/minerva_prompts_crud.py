#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#


from app.db.crud.base import CRUDBase
from app.models.minerva_prompts import MinervaPrompts


class CRUDMinervaPrompts(CRUDBase[MinervaPrompts, MinervaPrompts, MinervaPrompts]):
    pass


minerva_prompts = CRUDMinervaPrompts(MinervaPrompts)
