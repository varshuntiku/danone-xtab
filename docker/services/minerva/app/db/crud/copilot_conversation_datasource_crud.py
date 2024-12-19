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
from app.models.copilot_conversation_datasource import CopilotConversationDatasource


class CRUDCopilotConversationDatasource(
    CRUDBase[CopilotConversationDatasource, CopilotConversationDatasource, CopilotConversationDatasource]
):
    pass


copilot_conversation_datasource = CRUDCopilotConversationDatasource(CopilotConversationDatasource)
