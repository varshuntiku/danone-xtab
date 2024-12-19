#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


class UiacError(Exception):
    def __init__(self, error=[], warning=[]):
        self.error = error
        self.warning = warning
